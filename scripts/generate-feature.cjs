// scripts/generate-feature.js

const fs = require("fs");
const path = require("path");

const featureName = process.argv[2];

if (!featureName) {
  console.error("⛔ 도메인 이름을 입력해주세요.");
  process.exit(1);
}

const featureDir = path.join(__dirname, "..", "src", "features", featureName);
const apiDir = path.join(__dirname, "..", "src", "api");
const folders = ["pages", "components"];
const sliceFile = `${featureName}Slice.js`;

// 1. features/도메인 디렉토리 생성
if (fs.existsSync(featureDir)) {
  console.error("⛔ 이미 존재하는 도메인입니다. 이름을 바꿔주세요.");
  process.exit(1);
}

fs.mkdirSync(featureDir, { recursive: true });
folders.forEach((folder) => fs.mkdirSync(path.join(featureDir, folder)));

// 2. Slice 파일 생성
fs.writeFileSync(
  path.join(featureDir, sliceFile),
  `// ${featureName} Redux slice`
);

// 3. API 디렉토리에 api/도메인.js 생성
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir);
}
fs.writeFileSync(
  path.join(apiDir, `${featureName}.js`),
  `// ${featureName} API module`
);

console.log(`✅ ${featureName} 도메인 생성 완료!`);
