const fs = require('fs');

// Helper to fix and verify a file
function fixFile(filePath, fixes) {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping missing file:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  fixes.forEach(({ search, replace }) => {
    content = content.replace(search, replace);
  });
  // Also clean up any unescaped \'
  // Note: Replacing \' with ' in JSON files is safe because single quotes don't need to be escaped in double-quoted strings
  content = content.replace(/\\'/g, "'");

  try {
    JSON.parse(content);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully fixed and parsed:', filePath);
  } catch (err) {
    console.log('Failed to parse after fix:', filePath);
    console.log(err.message);
  }
}

// 1. pt/trans_chunk_023.json - only needs \' replaced with ', which is done by default in fixFile
fixFile('scratch/optimization/translations/pt/trans_chunk_023.json', []);

// 2. ru/trans_chunk_027.json - default \' -> '
fixFile('scratch/optimization/translations/ru/trans_chunk_027.json', []);

// 3. ru/trans_chunk_028.json - default \' -> '
fixFile('scratch/optimization/translations/ru/trans_chunk_028.json', []);

// 4. pt/trans_chunk_042.json
fixFile('scratch/optimization/translations/pt/trans_chunk_042.json', [
  {
    search: `"Dies in Tongchuan, Shaanxi.": "Falece em Outubro de 664, Shaanxi.", (Wait, the original says "Dies in Tongchuan, Shaanxi." -> "Falece em Tongchuan, Shaanxi.")`,
    replace: `"Dies in Tongchuan, Shaanxi.": "Falece em Tongchuan, Shaanxi.",`
  },
  {
    search: `"Stages his play Vatan Yahut Silistre (Fatherland or Silistra), leading to his exile in Famagusta, Cyprus.": "Encena sua peça 'Vatan Yahut Silistre' (Pátria ou Silistra), levando ao seu exílio em Famagusta, Trabalho ou Silistra.", (Wait, "Vatan Yahut Silistre (Fatherland or Silistra)" -> "Vatan Yahut Silistre (Pátria ou Silistra)")`,
    replace: `"Stages his play Vatan Yahut Silistre (Fatherland or Silistra), leading to his exile in Famagusta, Cyprus.": "Encena sua peça 'Vatan Yahut Silistre' (Pátria ou Silistra), levando ao seu exílio em Famagusta, Pátria ou Silistra.",`
  }
]);

// 5. ru/trans_chunk_033.json
fixFile('scratch/optimization/translations/ru/trans_chunk_033.json', [
  {
    search: `"노벨 제도에 대한 법학적 견해": "Правовые взгляды на рабство", (Wait, Korean: "노예 제도에 대한 법학적 견해", which means "Legal views on slavery". In the JSON it says "노벨 제도에 대한 법학적 견해", which seems to have a typo "노벨 제도" instead of "노예 제도" in the Korean, but in English/Russian it translates to "Правовые взгляды на рабство". Let's check line 208 of the input chunk: \`208: "노예 제도에 대한 법학적 견해"\` - ah, wait! Line 208 is \`노예 제도에 대한 법학적 견해\`. Line 208 is "노예 제도에 대한 법학적 견해". Yes, "Правовые взгляды на рабство" is perfect. Let's make sure it matches!)`,
    replace: `"노벨 제도에 대한 법학적 견해": "Правовые взгляды на рабство",`
  }
]);

// 6. ru/trans_chunk_035.json
fixFile('scratch/optimization/translations/ru/trans_chunk_035.json', [
  {
    search: `"옛 궁궐에 유폐된 채 엔토토에서 사망함.": "Скончался в Энтото, находясь под стражей в старом дворце.", (Wait, "사망함" for Empress Taytu. "Скончалась в Энтото, находясь под стражей в старом дворце.") -> "Скончалась в Энтото, находясь под стражей в старом дворце.",`,
    replace: `"옛 궁궐에 유폐된 채 엔토토에서 사망함.": "Скончалась в Энтото, находясь под стражей в старом дворце.",`
  }
]);

// 7. ru/trans_chunk_036.json
fixFile('scratch/optimization/translations/ru/trans_chunk_036.json', [
  {
    search: `"이것은 두 땅의 통일자": "Объявитель Двух Земель", (Wait, "Объединитель Двух Земель") -> "Объединитель Двух Земель",`,
    replace: `"이것은 두 땅의 통일자": "Объединитель Двух Земель",`
  }
]);

// 8. zh/trans_chunk_037.json
fixFile('scratch/optimization/translations/zh/trans_chunk_037.json', [
  {
    search: `"Why did he write the dictionary in Arabic?": "He wrote it for the Arabic-speaking elite of the Abbasid Caliphate in Baghdad, aiming to teach them the Turkic language and demonstrate its cultural richness and importance, especially as the Seljuk Turks had become the new military and political power.": "他为巴格达阿拔斯哈里发国的阿拉伯语精英撰写了这部词典，旨在向他们教授突厥语，并展示其文化丰富性和重要性，特别是在塞尔柱突厥人已成为新的军事和政治力量의背景下。",`,
    replace: `"Why did he write the dictionary in Arabic?": "他为巴格达阿拔斯哈里发国的阿拉伯语精英撰写了这部词典，旨在向他们教授突厥语，并展示其文化丰富性和重要性，特别是在塞尔柱突厥人已成为新的军事和政治力量的背景下。",`
  },
  {
    search: `"Why did he write the dictionary in Arabic?": "He wrote it for the Arabic-speaking elite of the Abbasid Caliphate in Baghdad, aiming to teach them the Turkic language and demonstrate its cultural richness and importance, especially as the Seljuk Turks had become the new military and political power.": "他为巴格达阿拔斯哈里发国的阿拉伯语精英撰写了这部词典，旨在向他们教授突厥语，并展示其文化丰富性和重要性，特别是在塞尔柱突厥人已成为新的军事和政治力量的背景下。",`,
    replace: `"Why did he write the dictionary in Arabic?": "他为巴格达阿拔斯哈里发国的阿拉伯语精英撰写了这部词典，旨在向他们教授突厥语，并展示其文化丰富性和重要性，特别是在塞尔柱突厥人已成为新的军事和政治力量的背景下。",`
  }
]);

// 9. zh/trans_chunk_046.json
fixFile('scratch/optimization/translations/zh/trans_chunk_046.json', [
  {
    search: `"What does 'Reis' mean?": "“Reis”是什么意思？",\n  "It means a captain, master, or admiral. Piri Reis's given name was Ahmed Muhiddin Piri. (Wait, target string: ''Reis' is a Turkish title, equivalent to a captain, master, or admiral. Piri Reis's given name was Ahmed Muhiddin Piri.' -> “Reis”是一个土耳其语头衔，相当于船长、船长 or 海军将领。皮里·雷斯的本名是艾哈迈德·穆希丁·皮里。)"`,
    replace: `"What does 'Reis' mean?": "“Reis”是什么意思？",\n  "It means a captain, master, or admiral. Piri Reis's given name was Ahmed Muhiddin Piri.": "“Reis”是一个土耳其语头衔，相当于船长、船长或海军将领。皮里·雷斯的本名是艾哈迈德·穆希丁·皮里。"`
  },
  {
    search: `"It means a captain, master, or admiral. Piri Reis's given name was Ahmed Muhiddin Piri. (Wait, target string: ''Reis' is a Turkish title, equivalent to a captain, master, or admiral. Piri Reis's given name was Ahmed Muhiddin Piri.' -> “Reis”是一个土耳其语头衔，相当于船长、船长或海军将领。皮里·雷斯的本名是艾哈迈德·穆希丁·皮里。)",`,
    replace: `"It means a captain, master, or admiral. Piri Reis's given name was Ahmed Muhiddin Piri.": "“Reis”是一个土耳其语头衔，相当于船长、船长或海军将领。皮里·雷斯的本名是艾哈迈德·穆希丁·皮里。",`
  }
]);

// 10. zh/trans_chunk_047.json
fixFile('scratch/optimization/translations/zh/trans_chunk_047.json', [
  {
    search: `"Roxelana' was a European nickname meaning 'the Ruthenian one,' referring to her origins. 'Hurrem' was the name given to her by Suleiman, from the Persian 'Khurram,' which means 'the cheerful one.': "“罗克塞拉娜”是欧洲人的绰号，意为“鲁塞尼亚女孩”，指的是她的出身。“许蕾姆”是苏莱曼赐予她的名字，源自波斯语“Khurram”，意为“快乐的人”。 (Wait, target string: ''Roxelana' was a European nickname meaning 'the Ruthenian one,' referring to her origins. 'Hurrem' was the name given to her by Suleiman, from the Persian 'Khurram,' which means 'the cheerful one.'' -> “罗克塞拉娜”是欧洲人的绰号，意为“鲁塞尼亚女孩”，指的是她的出身。“许蕾姆”是苏莱曼赐予她的名字，源自波斯语“Khurram”，意为“快乐的人”。)",`,
    replace: `"Roxelana' was a European nickname meaning 'the Ruthenian one,' referring to her origins. 'Hurrem' was the name given to her by Suleiman, from the Persian 'Khurram,' which means 'the cheerful one.'": "“罗克塞拉娜”是欧洲人的绰号，意为“鲁塞尼亚女孩”，指的是她的出身。“许蕾姆”是苏莱曼赐予她的名字，源自波斯语“Khurram”，意为“快乐的人”。",`
  },
  {
    search: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她向（是）一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”의程度仍存争议，但她的行动是在王位继承政治的残酷背景下进行的，在那个背景下，失败的代价往往是死亡。 (Wait, correction: 她是一位精明的政治操盘手)",`,
    replace: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她是一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”的程度仍存争议，但她的行动是在王位继承政治的残酷背景下进行的，在那个背景下，失败의代价往往是死亡。",`
  },
  {
    search: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她向（是）一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”의程度仍存争议，但她的行动是在王位继承政治의残酷背景下进行的，在那个背景下，失败의代价往往是死亡。 (Wait, correction: 그녀는 영민한 정치가이자 책략가였습니다.)",`,
    replace: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她是一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”的程度仍存争议，但她的行动是在王位继承政治的残酷背景下进行的，在那个背景下，失败的代价往往是死亡。",`
  },
  {
    search: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她向（是）一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”의程度仍存争议，但她的行动是在王位继承政治의残酷背景下进行的，在那个背景下，失败의代价往往是死亡。 (Wait, correction: 她是一位精明的政治操盘手)",`,
    replace: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她是一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”的程度仍存争议，但她的行动是在王位继承政治的残酷背景下进行的，在那个背景下，失败的代价往往是死亡。",`
  },
  {
    search: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她向（是）一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”的程度仍存争议，但她的行动是在王位继承政治的残酷背景下进行的，在那个背景下，失败的代价往往是死亡。 (Wait, correction: 她是一位精明的政治操盘手)",`,
    replace: `"She was a shrewd political operator who removed rivals to protect her and her children's future. While the extent of her 'ruthlessness' is debated, her actions were taken within the brutal context of succession politics where the price of failure was often death.": "她是一位精明的政治操盘手，铲除对手以保护自己和孩子的未来。虽然关于她“冷酷无情”的程度仍存争议，但她的行动是在王位继承政治的残酷背景下进行的，在那个背景下，失败的代价往往是死亡。",`
  }
]);
