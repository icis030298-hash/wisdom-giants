import fs from "fs";
import path from "path";

async function main() {
  const progressPath = path.resolve(process.cwd(), "src/data/blog-posts-progress-ex.json");
  const tsPath = path.resolve(process.cwd(), "src/data/blog-posts.ts");

  if (!fs.existsSync(progressPath)) {
    console.error("Progress file src/data/blog-posts-progress-ex.json not found!");
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

  // To merge safety, we parse the existing blogPosts array
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
  
  let existingBlogs: any[] = [];
  try {
    existingBlogs = JSON.parse(arrayString);
  } catch (e) {
    console.warn("JSON.parse failed on existing array. Attempting safe eval parse...");
    try {
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
    // Ensure relatedGiants is populated
    if (!b.relatedGiants) {
      b.relatedGiants = b.giantSlugs || (b.giantSlug ? [b.giantSlug] : []);
    }
    
    if (mergedMap.has(b.slug)) {
      mergedMap.set(b.slug, {
        ...mergedMap.get(b.slug),
        ...b
      });
      updatedCount++;
    } else {
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
