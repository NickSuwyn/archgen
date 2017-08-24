module.exports = {

  install: function() {
    console.log('Installing: ' + process.argv[3]);
  },

  default: function() {
    console.log('Building default descriptor for ' + process.argv[3]);
  }
}
