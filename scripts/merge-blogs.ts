import fs from "fs";
import path from "path";

async function main() {
  const progressPath = path.resolve(process.cwd(), "src/data/blog-posts-progress.json");
  const tsPath = path.resolve(process.cwd(), "src/data/blog-posts.ts");

  if (!fs.existsSync(progressPath)) {
    console.error("Progress file src/data/blog-posts-progress.json not found!");
    process.exit(1);
  }

  if (!fs.existsSync(tsPath)) {
    console.error("Target file src/data/blog-posts.ts not found!");
    process.exit(1);
  }

  // 1. Read generated blog posts
  const generatedBlogs = JSON.parse(fs.readFileSync(progressPath, "utf8"));
  const generatedList = Object.values(generatedBlogs);

  console.log(`Loaded ${generatedList.length} generated blog posts from progress file.`);

  // 2. Read existing ts file content
  let tsContent = fs.readFileSync(tsPath, "utf8");

  // Update BlogPost interface to support new fields and categories
  const targetInterface = `export interface BlogPost {
  slug: string;
  category: 'leadership' | 'philosophy' | 'creativity' | 'wisdom';
  giantSlug: string;
  publishedAt: string;
  translations: {
    [locale: string]: {
      title: string;
      description: string;
      content: string;
    };
  };
}`;

  const updatedInterface = `export interface BlogPost {
  slug: string;
  category: 'leadership' | 'philosophy' | 'creativity' | 'wisdom' | 'science' | 'arts' | 'society' | 'business';
  giantSlug?: string;
  giantSlugs?: string[];
  publishedAt: string;
  translations: {
    [locale: string]: {
      title: string;
      description: string;
      content: string;
    };
  };
}`;

  if (tsContent.includes(targetInterface)) {
    tsContent = tsContent.replace(targetInterface, updatedInterface);
    console.log("✓ Updated BlogPost interface successfully in blog-posts.ts");
  } else {
    // If it was already updated, do nothing or log
    console.log("BlogPost interface might already be updated or has a different format.");
  }

  // To merge safety, we can parse the existing blogPosts array if possible,
  // but since it's a 1.2MB TS file, parsing the JS directly might be clean using eval or regex.
  // Instead of risky eval or complex regex parsing, we can find where the list starts: 'export const blogPosts: BlogPost[] = ['
  // And extract the array content, parse it, merge with new ones, and write it back nicely.
  
  // Let's parse the array by extracting it.
  const arrayStartMatch = tsContent.match(/export const blogPosts: BlogPost\[\] = \s*\[/);
  if (!arrayStartMatch) {
    console.error("Could not find start of blogPosts array!");
    process.exit(1);
  }

  const arrayStartIndex = tsContent.indexOf(arrayStartMatch[0]) + arrayStartMatch[0].length - 1;
  const arrayEndIndex = tsContent.lastIndexOf("];");

  if (arrayStartIndex === -1 || arrayEndIndex === -1 || arrayEndIndex < arrayStartIndex) {
    console.error("Could not find bounds of blogPosts array!");
    process.exit(1);
  }

  const arrayString = tsContent.slice(arrayStartIndex, arrayEndIndex + 1);
  
  // Safely parse existing blogs using JSON.parse. Since it's a TS file containing raw JSON-like structure,
  // we might need to clean trailing commas or single quotes if any.
  // Let's try parsing it.
  let existingBlogs: any[] = [];
  try {
    existingBlogs = JSON.parse(arrayString);
  } catch (e) {
    // If JSON.parse fails (e.g. because of non-JSON syntax, though the snippet showed clean double quotes),
    // we will fallback to evaluating the expression in a secure sandbox or parsing with JSON5-like parser.
    console.warn("JSON.parse failed on existing array. Attempting safe eval parse...");
    try {
      // Create a function that returns the array
      const fn = new Function(`return ${arrayString};`);
      existingBlogs = fn();
    } catch (evalErr) {
      console.error("Failed to parse existing blog posts array!", evalErr);
      process.exit(1);
    }
  }

  console.log(`Parsed ${existingBlogs.length} existing blog posts.`);

  // 3. Merge lists by slug
  const mergedMap = new Map<string, any>();
  existingBlogs.forEach(b => mergedMap.set(b.slug, b));

  let addedCount = 0;
  let updatedCount = 0;

  generatedList.forEach((b: any) => {
    if (mergedMap.has(b.slug)) {
      // Update existing
      mergedMap.set(b.slug, {
        ...mergedMap.get(b.slug),
        ...b
      });
      updatedCount++;
    } else {
      // Add new
      mergedMap.set(b.slug, b);
      addedCount++;
    }
  });

  const mergedList = Array.from(mergedMap.values());
  console.log(`Merged results: ${addedCount} added, ${updatedCount} updated. Total: ${mergedList.length} blog posts.`);

  // 4. Format the final file content
  const header = tsContent.slice(0, tsContent.indexOf(arrayStartMatch[0]));
  const arrayDeclaration = `export const blogPosts: BlogPost[] = ${JSON.stringify(mergedList, null, 2)};`;
  const finalContent = header + arrayDeclaration + "\n";

  fs.writeFileSync(tsPath, finalContent, "utf8");
  console.log("✓ Successfully wrote merged blog posts to src/data/blog-posts.ts");
}

main().catch(console.error);
