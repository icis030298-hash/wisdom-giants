const fs = require('fs');

let content = fs.readFileSync('src/components/consult-client.tsx', 'utf8');

// 1. Remove setIsLoading(true) from handleProblemSelect and handleCustomProblemSubmit
content = content.replace(/setIsLoading\(true\);/g, '// setIsLoading(true); // Removed to prevent Skeleton UI from overriding AnimatePresence');

// 2. Add loading state inside AnimatePresence
const animatePresenceTarget = `<AnimatePresence mode="wait" initial={false}>
          {!selectedProblemId ? (
            /* STAGE 1: Problem Selection */`;
            
const animatePresenceReplacement = `<AnimatePresence mode="wait" initial={false}>
          {isMatching ? (
            <m.div
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center justify-center py-32"
            >
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                  <div className="animate-spin w-16 h-16 border-4 border-stone-800 border-t-amber-500 rounded-full relative z-10" />
                </div>
                <p className="text-stone-300 font-medium text-lg animate-pulse tracking-wide">
                  {labels.analyzing || "당신의 고민과 닮은 거인을 찾고 있어요..."}
                </p>
              </div>
            </m.div>
          ) : !selectedProblemId ? (
            /* STAGE 1: Problem Selection */`;

content = content.replace(animatePresenceTarget, animatePresenceReplacement);

// 3. Fix TypeError with optional chaining and missing properties in matchedGiants
content = content.replace(
  `{matchedGiants.map((giant) => (
                    <m.div
                      key={giant.slug}`,
  `{matchedGiants?.map((giant) => (
                    <m.div
                      key={giant?.slug || Math.random().toString()}`
);

content = content.replace(
  `<GiantAvatar slug={giant.slug} name={tg(\`\${giant.slug}.name\`).includes(\`\${giant.slug}.\`) ? giant.name : tg(\`\${giant.slug}.name\`)} />`,
  `<GiantAvatar slug={giant?.slug} name={tg(\`\${giant?.slug}.name\`).includes(\`\${giant?.slug}.\`) ? (giant?.name || 'Unknown') : tg(\`\${giant?.slug}.name\`)} />`
);

content = content.replace(
  `{tg(\`\${giant.slug}.name\`).includes(\`\${giant.slug}.\`) ? giant.name : tg(\`\${giant.slug}.name\`)}`,
  `{tg(\`\${giant?.slug}.name\`).includes(\`\${giant?.slug}.\`) ? (giant?.name || 'Unknown') : tg(\`\${giant?.slug}.name\`)}`
);

content = content.replace(
  `{tg(\`\${giant.slug}.era\`).includes(\`\${giant.slug}.\`) ? giant.era : tg(\`\${giant.slug}.era\`)}`,
  `{tg(\`\${giant?.slug}.era\`).includes(\`\${giant?.slug}.\`) ? (giant?.era || '') : tg(\`\${giant?.slug}.era\`)}`
);

content = content.replace(
  `&ldquo;{isCustomProblemMode ? giant.reason : (giant.historicalPain[activeLocale] || giant.historicalPain['en'])}&rdquo;`,
  `&ldquo;{giant?.reason || giant?.historicalPain?.[activeLocale] || giant?.historicalPain?.['en'] || ''}&rdquo;`
);

content = content.replace(
  `onClick={() => handleStartConsult(giant.slug)}`,
  `onClick={() => handleStartConsult(giant?.slug)}`
);

content = content.replace(
  `{getChatButtonText(giant.name, activeLocale)}`,
  `{getChatButtonText(giant?.name || '', activeLocale)}`
);

content = content.replace(
  `onClick={() => handleGoToEpic(giant.slug)}`,
  `onClick={() => handleGoToEpic(giant?.slug)}`
);

fs.writeFileSync('src/components/consult-client.tsx', content);
console.log("Successfully applied all fixes to consult-client.tsx");
