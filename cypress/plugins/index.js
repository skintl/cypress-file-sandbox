// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', { waitForNewFile });
};

const nameAndCreationDateOfTheLatestFileIn = (dir) => {
  const files = fs.readdirSync(dir)
    .map((file) => ({file, mtime: fs.lstatSync(`${dir}/${file}`).mtime}))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
  return files.length ? `${files[0].file}__${files[0].mtime.getTime()}` : undefined
}

const readFile = (dir, fileName, encoding = 'utf8') => fs.readFileSync(`${dir}/${fileName}`, encoding);

const getFileNameOnly = (separated, delimiter = '__') => separated.split(delimiter)[0]

const waitForNewFile = (dir = 'cypress/downloads') => new Promise((resolve) => {
  const reference = nameAndCreationDateOfTheLatestFileIn(dir)
  let interval
  const lookup = () => {
    const current = nameAndCreationDateOfTheLatestFileIn(dir)
    if (reference !== current) {
      clearInterval(interval)
      const file = readFile(dir, getFileNameOnly(current));
      resolve(file)
    }
  }
  interval = setInterval(lookup, 500)
})
