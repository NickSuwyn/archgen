module.exports = {
  splitByLine: function(fileString) {
    return fileString.split(/\r?\n/);
  },

  buildFileFromArray: function(array) {
    let result = '';
    for(let line of array) {
      result += line + '\n';
    }
    return result;
  },

  splitByDot: function(str) {
    return str.split('.');
  },

  splitByColon: function(str) {
    return str.split(':');
  }

};
