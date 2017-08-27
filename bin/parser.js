module.exports = {
  splitByLine: function(fileString) {
    return fileString.split(/\r?\n/);
  },

  buildFileFromArray: function(array) {
    return array.join('\n')
  },

  splitByDot: function(str) {
    return str.split('.');
  },

  splitByColon: function(str) {
    return str.split(':');
  }

};
