#! /usr/bin/env node 
const fs = require('file-system');
const parser = require('./parser');
const stringUtil = require('./stringUtil');

const fileDirectories = [];
let descriptor;
const outFiles = [];
const tagEx = /<_(\w*)_>/;
const propEx = /<_prop\.([\w|:]*)_>/;
const entityEx = /<_entity\.([\w|:]*)_>/;
let dir;

if (fs.existsSync(process.argv[1].substr(0, process.argv[1].length - 13) + '\\\\archetypes\\\\' + process.argv[2] + '\\\\')) {
  dir = process.argv[1].substr(0, process.argv[1].length - 13) + '\\\\archetypes\\\\' + process.argv[2] + '\\\\';
}
else if (fs.existsSync('/usr/lib/node_modules/archgen/bin/archetypes/' + process.argv[2] + '/')) {
  dir = '/usr/lib/node_modules/archgen/bin/archetypes/' + process.argv[2] + '/';
}
else if (fs.existsSync('/usr/local/lib/node_modules/archgen/bin/archetypes/' + process.argv[2] + '/')) {
  dir = '/usr/local/lib/node_modules/archgen/bin/archetypes/' + process.argv[2] + '/';
}



//check if user entered argument
if(process.argv[2] === 'install' || process.argv[2] === 'default') {
  require('./options')[process.argv[2]]();
} else {
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
        const curFile = fs.readFileSync(file, 'utf8');
        const fileLines = parser.splitByLine(curFile);

        if(fileLines[0] === '<_forEntity_>') {
          for(let entity of descriptor.entities) {
            outFiles.push(evaluateFileLines(evaluateForEntity(fileLines.slice(1, fileLines.length), entity)));
          }
        } else {

          fileDirectories.push(evaluateForPath(fileLines[0]));
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

  function evaluateForPath(path) {
    const directory = [];
    directory.push(path);
    return evaluateFileLines(directory)[0];
  }

  function evaluateFileLines(fileLines) {
    for(let i in fileLines) {
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
      const entityBlock = fileLines.splice(i, j - i);
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
        const propBlock = fileLines.splice(i, j - i);
        propBlock.pop();
        propBlock.shift();
        for(let prop of entity.props) {
          insertMultipleElementsIntoArray(fileLines, i, evaluateForProps(shallowCopy(propBlock), prop));
        }
      }
      while(variable = entityEx.exec(fileLines[i])) {

        if(variable) {
          let text = variable[1];
          const textLength = text.length;
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
    fileDirectories.push(evaluateForPath(fileLines[0]));
    fileLines.shift();
    return fileLines;
  }

  function insertMultipleElementsIntoArray(array, index, arrayToInsert) {
    for(let element of arrayToInsert) {
      array.splice(index++, 0, element);
    }
  }

  function shallowCopy(array) {
    return array.slice();
  }

  function evaluateForEntityLoop(fileLines, entity) {
    for(let i in fileLines) {
      while(variable = entityEx.exec(fileLines[i])) {

        if(variable) {
          let text = variable[1];
          const textLength = text.length;
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
          const textLength = text.length;
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

}
