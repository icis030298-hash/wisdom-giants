const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/user/.gemini/antigravity/brain/2e6983d9-c70d-4846-8f02-c965d644d043';
const destDir = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/public/images/giants';

const files = fs.readdirSync(srcDir);
const pngFiles = files.filter(f => f.endsWith('.png'));

const map = {
    'picasso_mbti': 'pablo-picasso.png',
    'shakespeare_mbti': 'william-shakespeare.png',
    'tesla_mbti': 'nikola-tesla.png',
    'washington_mbti': 'george-washington.png',
    'yisunshin_mbti': 'yi-sun-shin.png',
    'elizabeth_mbti': 'elizabeth-i.png',
    'gwanggaeto_mbti': 'gwanggaeto-the-great.png',
    'churchill_mbti': 'winston-churchill.png',
    'qinshihuang_mbti': 'qin-shi-huang.png',
    'augustus_mbti': 'augustus.png',
    'bismarck_mbti': 'otto-von-bismarck.png',
    'peter_mbti': 'peter-the-great.png',
    'catherine_mbti': 'catherine-the-great.png',
    'bolivar_mbti': 'simon-bolivar.png',
    'thatcher_mbti': 'margaret-thatcher.png',
    'rockefeller_mbti': 'john-d-rockefeller.png',
    'ataturk_mbti': 'ataturk.png'
};

pngFiles.forEach(f => {
    // f looks like 'picasso_mbti_1778799062062.png'
    const key = Object.keys(map).find(k => f.startsWith(k));
    if (key) {
        const destName = map[key];
        const srcPath = path.join(srcDir, f);
        const destPath = path.join(destDir, destName);
        fs.renameSync(srcPath, destPath);
        console.log(`Moved and renamed ${f} -> ${destName}`);
    }
});
