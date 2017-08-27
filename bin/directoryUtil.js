const fs = require('fs');

const LOCATION_LOCAL = '/usr/local/lib/node_modules/archgen/bin/archetypes/';
const LOCATION_LIB = '/usr/lib/node_modules/archgen/bin/archetypes/';

module.exports = {
  getDirectory(scriptPath, archetype) {
    const possibleDirectories = [
      LOCATION_LIB + archetype + '/',
      LOCATION_LOCAL + archetype + '/',
      scriptPath.substr(0, scriptPath.length - 13) +
        '\\\\archetypes\\\\' +
        archetype +
        '\\\\'
    ];

    return getDirectoryIfExists(possibleDirectories);
  }
};

function getDirectoryIfExists(possibleDirectories) {
  const directoryPath = possibleDirectories[0];

  // Should this be thrown here or let it be handled at the highest level?
  if (!directoryPath) {
    throw new Error('Unable to locate given archetype');
  }

  if (fs.existsSync(directoryPath)) {
    return directoryPath;
  }

  return getDirectoryIfExists(possibleDirectories.slice(1));
}
