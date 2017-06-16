#! /usr/bin/env node

let fs = require('file-system');
let parser = require('./parser');
let stringUtil = require('./stringUtil');

let fileDirectories = [];
let descriptor;
let outFiles = [];
let tagEx = /<_(\w*)_>/;
let propEx = /<_prop\.([\w|:]*)_>/;
let entityEx = /<_entity\.([\w|:]*)_>/;
let dir = process.argv[1].substr(0, process.argv[1].length - 13) + '\\\\archetypes\\\\' + process.argv[2] + '\\\\';

fs.readdir('./', (err, files) => {
  files.forEach(file => {
    if(file == 'descriptor.json') {
      descriptor = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  });
});

fs.readdir(dir, (err, files) => {
  files.forEach(file => {
    if(file.includes('.txt')) {
      file = dir + file;
      let curFile = fs.readFileSync(file, 'utf8');
      let fileLines = parser.splitByLine(curFile);

      if(fileLines[0] == '<_forEntity_>') {
        for(let entity of descriptor.entities) {
          outFiles.push(evaluateFileLines(evaluateForEntity(fileLines.slice(1, fileLines.length), entity)));
        }
      } else {
        fileDirectories.push(fileLines[0]);
        outFiles.push(evaluateFileLines(fileLines.slice(1, fileLines.length)));
      }
    }

  });
  for(let i in outFiles) {
    outFiles[i] = parser.buildFileFromArray(outFiles[i]);
    console.log('Printing File: ' + fileDirectories[i]);
    console.log('---------------------------------------');
    console.log(outFiles[i]);
    fs.writeFileSync(fileDirectories[i], outFiles[i]);
  }
});


function evaluateFileLines(fileLines) {
  let result = '';
  for(let i in fileLines) {
    let text;
    let index;
    processLines(fileLines, i);
  }
  return fileLines;
}

function processLines(fileLines, i) {
  if(fileLines[i] == '<_forEntity_>') {
    let j = parseInt(i) + 1;
    let foundEnd = false;
    while(!foundEnd) {
      if(fileLines[j] == '<_endForEntity_>') {
        foundEnd = true;
      }
      j++;
    }
    let entityBlock = fileLines.splice(i, j - i);
    entityBlock.pop();
    entityBlock.shift();
    for(let entity of descriptor.entities) {
      insertMultipleElementsIntoArray(fileLines, i, evaluateForEntityLoop(shallowCopy(entityBlock), entity));
    }
  }
  while(variable = tagEx.exec(fileLines[i])) {
    if(variable) {
      text = variable[1];
      index = variable.index;
      fileLines[i] = fileLines[i].substr(0, index) + descriptor[text] + fileLines[i].substr(index + text.length + 4);
    }
  }
}

function evaluateForEntity(fileLines, entity) {
  fileLines = shallowCopy(fileLines);
  for(let i = 0; i < fileLines.length; i++) {

    if(fileLines[i] == '<_forProp_>') {
      let j = parseInt(i) + 1;
      let foundEnd = false;
      while(!foundEnd) {
        if(fileLines[j] == '<_endForProp_>') {
          foundEnd = true;
        }
        j++;
      }
      let propBlock = fileLines.splice(i, j - i);
      propBlock.pop();
      propBlock.shift();
      for(let prop of entity.props) {
        insertMultipleElementsIntoArray(fileLines, i, evaluateForProps(shallowCopy(propBlock), prop));
      }
    }
    while(variable = entityEx.exec(fileLines[i])) {

      if(variable) {
        let text = variable[1];
        let textLength = text.length;
        let split;
        let modText = text;
        if(text.includes(':')) {
          split = parser.splitByColon(text);
          text = split[0];
          modText = stringUtil[split[1]](entity[split[0]]);
        } else {
          modText = entity[text];
        }
        index = variable.index;
        fileLines[i] = fileLines[i].substr(0, index) + modText + fileLines[i].substr(index + textLength + 11);
      }

    }

  }
  fileDirectories.push(fileLines[0]);
  fileLines.shift();
  return fileLines;
}

function insertMultipleElementsIntoArray(array, index, arrayToInsert) {
  for(let element of arrayToInsert) {
    array.splice(index++, 0, element);
  }
}

function shallowCopy(array) {
  let result = [];
  for(let i in array) {
    result[i] = array[i];
  }
  return result;
}

function evaluateForEntityLoop(fileLines, entity) {
  for(let i in fileLines) {
    while(variable = entityEx.exec(fileLines[i])) {

      if(variable) {
        let text = variable[1];
        let textLength = text.length;
        let split;
        let modText = text;
        if(text.includes(':')) {
          split = parser.splitByColon(text);
          text = split[0];
          modText = stringUtil[split[1]](entity[split[0]]);
        } else {
          modText = entity[text];
        }
        index = variable.index;
        fileLines[i] = fileLines[i].substr(0, index) + modText + fileLines[i].substr(index + textLength + 11);
      }
    }
  }
  return fileLines;
}

function evaluateForProps(fileLines, prop) {
  for(let i in fileLines) {
    while(variable = propEx.exec(fileLines[i])) {

      if(variable) {
        let text = variable[1];
        let textLength = text.length;
        let split;
        let modText = text;
        if(text.includes(':')) {
          split = parser.splitByColon(text);
          text = split[0];
          modText = stringUtil[split[1]](prop[split[0]]);
        } else {
          modText = prop[text];
        }
        index = variable.index;
        fileLines[i] = fileLines[i].substr(0, index) + modText + fileLines[i].substr(index + textLength + 9);
      }
    }
  }
  return fileLines;
}
