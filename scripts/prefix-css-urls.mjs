// 정적 배포용 CSS의 절대 경로(url(/icons/...))에 저장소 하위 경로를 붙인다. CSS의 url()은 Next가 바꿔 주지 않는다.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const [dir, basePath] = process.argv.slice(2);
let changed = 0;
const walk = (folder) => {
  for (const name of readdirSync(folder)) {
    const file = path.join(folder, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (file.endsWith(".css")) {
      const before = readFileSync(file, "utf8");
      const after = before.replace(/url\((["']?)\/(?!\/|_next\/)/g, `url($1${basePath}/`);
      if (after !== before) {
        writeFileSync(file, after);
        changed += 1;
      }
    }
  }
};
walk(dir);
console.log(`CSS ${changed}개의 경로를 고쳤습니다.`);
