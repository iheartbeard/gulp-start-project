'use strict';

// Генератор файлов блока (позаимстован отсюда: https://github.com/nicothin/NTH-start-project)
// Использование: node createBlock.js [имя блока] [доп. расширения через пробел]

const fs = require('fs');
const projectConfig = require('./projectConfig.json');

const dirs = projectConfig.dirs;
const mkdirp = require('mkdirp');

const blockName = process.argv[2];                                                // получим имя блока
const defaultExtensions = ['scss', 'html'];                                       // расширения по умолчанию
const extensions = uniqueArray(defaultExtensions.concat(process.argv.slice(3)));  // добавим введенные при вызове расширения (если есть)

// Если есть имя блока
if (blockName) {
  const dirPath = `${dirs.srcPath + dirs.blocksDirName}/${blockName}/`;           // полный путь к создаваемой папке блока
  mkdirp(dirPath, (err) => {                                                      // создаем папку
    if (err) {
      console.error(`Отмена операции: ${err}`);                                   // если есть ошибки — выводим в консоль
    }

    else {
      console.log(`Создание папки ${dirPath} (если отсутствует)`);                // нет ошибки, поехали!
      extensions.forEach((extention) => {                                         // Обходим массив расширений и создаем файлы, если они еще не созданы
        const filePath = `${dirPath + blockName}.${extention}`;                   // полный путь к создаваемому файлу
        let fileContent = '';                                                     // будущий контент файла
        let fileCreateMsg = '';                                                   // будущее сообщение в консоли при создании файла

        // Если это SCSS
        if (extention === 'scss') {
          fileContent = `// В этом файле должны быть стили для БЭМ-блока ${blockName}, его элементов, \n// модификаторов, псевдоселекторов, псевдоэлементов, @media-условий...\n`;
          // fileCreateMsg = '';

          // Добавим созданный файл в массив блоков в projectConfig.json
          let hasThisBlock = false;
          for (const block in projectConfig.blocks) {
            if (block === blockName) {
              hasThisBlock = true;
              break;
            }
          }
          if (!hasThisBlock) {
            projectConfig.blocks[blockName] = [];
            const newPackageJson = JSON.stringify(projectConfig, '', 2);
            fs.writeFileSync('./projectConfig.json', newPackageJson);
            fileCreateMsg = 'Подключение блока добавлено в projectConfig.json';
          }
        }

        // Если это HTML
        else if (extention === 'html') {
          fileContent = `<!--DEV\n\nДля использования этого файла как шаблона:\n\n//= _include/${blockName}/${blockName}.html\n\n-->\n\n<div class="${blockName}">content</div>\n`;
          // fileCreateMsg = '';
        }

        // Если это JS
        else if (extention === 'js') {
          fileContent = '// document.addEventListener(\'DOMContentLoaded\', function(){});\n// (function(){\n// код\n// }());\n';
        }

        // Если нужна подпапка для картинок
        else if (extention === 'img') {
          const imgFolder = `${dirPath}img/`;
          if (fileExist(imgFolder) === false) {
            mkdirp(imgFolder, (err) => {
              if (err) console.error(err);
              else console.log(`Создание папки: ${imgFolder} (если отсутствует)`);
            });
          } else {
            console.log(`Папка ${imgFolder} НЕ создана (уже существует) `);
          }
        }

        // Создаем файл, если он еще не существует
        if (fileExist(filePath) === false && extention !== 'img') {
          fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
              return console.log(`Файл НЕ создан: ${err}`);
            }
            console.log(`Файл создан: ${filePath}`);
            if (fileCreateMsg) {
              console.warn(fileCreateMsg);
            }
          });
        } else if (extention !== 'img') {
          console.log(`Файл НЕ создан: ${filePath} (уже существует)`);
        }
      });
    }
  });
} else {
  console.log('Отмена операции: не указан блок');
}

// Оставить в массиве только уникальные значения (убрать повторы)
function uniqueArray(arr) {
  const objectTemp = {};
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];
    objectTemp[str] = true; // запомнить строку в виде свойства объекта
  }
  return Object.keys(objectTemp);
}

// Проверка существования файла
function fileExist(path) {
  const fs = require('fs');
  try {
    fs.statSync(path);
  } catch (err) {
    return !(err && err.code === 'ENOENT');
  }
}