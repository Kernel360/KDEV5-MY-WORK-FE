// scripts/generate-feature.js

const fs = require("fs");
const path = require("path");

const featureName = process.argv[2];

if (!featureName) {
  console.error("도메인 이름 : ");
  process.exit(1);
}

const baseDir = path.join(__dirname, "..", "src", "features", featureName);
const folders = ["pages", "components"];
const files = {
  "api.js": `// ${featureName} API module`,
  [`${featureName}Slice.js`]: `// ${featureName} Redux slice`,
};

if (fs.existsSync(baseDir)) {
  console.error("이미 존재하는 features라 이름 바꾸세요!!!@#!@#!@#");
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });
folders.forEach((folder) => fs.mkdirSync(path.join(baseDir, folder)));

Object.entries(files).forEach(([fileName, content]) => {
  fs.writeFileSync(path.join(baseDir, fileName), content);
});

console.log(`${featureName} 생성 완료!`);
