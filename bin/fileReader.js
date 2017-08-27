#! /usr/bin/env node
const fs = require('file-system');
const parser = require('./parser');
const stringUtil = require('./stringUtil');
const { getDirectory } = require('./directoryUtil');

const fileDirectories = [];
const outFiles = [];
const tagEx = /<_(\w*)_>/;
const propEx = /<_prop\.([\w|:]*)_>/;
const entityEx = /<_entity\.([\w|:]*)_>/;

const DESCRIPTOR_PATH = './descriptor.json';

//check if user entered argument
if (process.argv[2] === 'install' || process.argv[2] === 'default') {
  require('./options')[process.argv[2]]();
  return;
}

if (!fs.existsSync(DESCRIPTOR_PATH)) {
  throw new Error('Cannot find descriptor.json');
}

let descriptor;

try {
  descriptor = JSON.parse(fs.readFileSync(DESCRIPTOR_PATH, 'utf8'));
} catch (e) {
  // TODO: Handle json parse errors
  throw e;
}

const dir = getDirectory(process.argv[1], process.argv[2]);

fs.readdir(dir, (err, files) => {
  files.forEach(file => {
    if (!file.includes('.txt')) return;

    file = dir + file;
    const curFile = fs.readFileSync(file, 'utf8');
    const fileLines = parser.splitByLine(curFile);

    if (fileLines[0] === '<_forEntity_>') {
      for (let entity of descriptor.entities) {
        outFiles.push(
          evaluateFileLines(
            evaluateForEntity(fileLines.slice(1, fileLines.length), entity)
          )
        );
      }
    } else {
      fileDirectories.push(evaluateForPath(fileLines[0]));
      outFiles.push(evaluateFileLines(fileLines.slice(1, fileLines.length)));
    }
  });

  for (let i in outFiles) {
    outFiles[i] = parser.buildFileFromArray(outFiles[i]);
    console.log('Printing File: ' + fileDirectories[i]);
    console.log('---------------------------------------');
    console.log(outFiles[i]);
    fs.writeFileSync(fileDirectories[i], outFiles[i]);
  }
});

function evaluateForPath(path) {
  const directory = [];
  directory.push(path);
  return evaluateFileLines(directory)[0];
}

function evaluateFileLines(fileLines) {
  for (let i in fileLines) {
    processLines(fileLines, i);
  }
  return fileLines;
}

function processLines(fileLines, i) {
  if (fileLines[i] == '<_forEntity_>') {
    let j = parseInt(i) + 1;
    let foundEnd = false;
    while (!foundEnd) {
      if (fileLines[j] == '<_endForEntity_>') {
        foundEnd = true;
      }
      j++;
    }
    const entityBlock = fileLines.splice(i, j - i);
    entityBlock.pop();
    entityBlock.shift();
    for (let entity of descriptor.entities) {
      insertMultipleElementsIntoArray(
        fileLines,
        i,
        evaluateTemplateVariable(shallowCopy(entityBlock), entity, 'entity')
      );
    }
  }
  while ((variable = tagEx.exec(fileLines[i]))) {
    if (variable) {
      text = variable[1];
      index = variable.index;
      fileLines[i] =
        fileLines[i].substr(0, index) +
        descriptor[text] +
        fileLines[i].substr(index + text.length + 4);
    }
  }
}

function evaluateForEntity(fileLines, entity) {
  fileLines = shallowCopy(fileLines);
  for (let i = 0; i < fileLines.length; i++) {
    if (fileLines[i] !== '<_forProp_>') continue;

    let j = parseInt(i) + 1;
    let foundEnd = false;
    while (!foundEnd) {
      if (fileLines[j] === '<_endForProp_>') {
        foundEnd = true;
      }
      j++;
    }
    const propBlock = fileLines.splice(i, j - i);
    propBlock.pop();
    propBlock.shift();
    for (let prop of entity.props) {
      insertMultipleElementsIntoArray(
        fileLines,
        i,
        evaluateTemplateVariable(shallowCopy(propBlock), prop, 'prop')
      );
    }
  }
  filesLines = evaluateTemplateVariable(fileLines, entity, 'entity');
  fileDirectories.push(evaluateForPath(fileLines[0]));
  fileLines.shift();
  return fileLines;
}

function insertMultipleElementsIntoArray(array, index, arrayToInsert) {
  for (let element of arrayToInsert) {
    array.splice(index++, 0, element);
  }
}

function shallowCopy(array) {
  return array.slice();
}

function evaluateTemplateVariable(fileLines, section, sectionType) {
  const sectionRegEx = getSectionRegEx(sectionType);
  for (let i in fileLines) {
    while ((variable = sectionRegEx.exec(fileLines[i]))) {
      let text = variable[1];
      const textLength = text.length;
      let split;
      let modText = text;
      if (text.includes(':')) {
        split = parser.splitByColon(text);
        text = split[0];
        modText = stringUtil[split[1]](section[split[0]]);
      } else {
        modText = section[text];
      }

      const index = variable.index;
      const offset = getSectionOffset(sectionType);

      fileLines[i] =
        fileLines[i].substr(0, index) +
        modText +
        fileLines[i].substr(index + textLength + offset);
    }
  }
  return fileLines;
}

function getSectionRegEx(sectionType) {
  switch (sectionType) {
    case 'entity':
      return entityEx;
    case 'prop':
      return propEx;
    case 'tag':
    default:
      return tagEx;
  }
}

function getSectionOffset(sectionType) {
  switch (sectionType) {
    case 'entity':
      return 11;
    case 'prop':
    default:
      return 9;
  }
}
