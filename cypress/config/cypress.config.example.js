const { defineConfig } = require("cypress");
const path = require('path')
const fs = require('fs')

const env = {
  WEB_NEXT_URL: "http://localhost:9000/",
  API_USER_FOLDER: '../daiwa-analytics-platform-api/data/user/',
  USERNAME: 'vioo',
  PASSWORD: 'pa33word',
  SYMBOL_CASE_1: {
    SYMBOL: '0700.hk',
    QUANTITY: '2,000,000',
    SIDE: 'BUY',
    STRATEGY: 'VWAP',
    ORDER_TYPE: 'LIMIT',
    LIMIT_PRICE: '350.23'
  },
  SYMBOL_CASE_2: {
    SYMBOL: 'MockA',
    QUANTITY: '2,000,000',
    SIDE: 'BUY',
    STRATEGY: 'VWAP',
    ORDER_TYPE: 'LIMIT',
    LIMIT_PRICE: '350.23'
  }
}

module.exports = defineConfig({
  env,
  projectId: 'aq1hez',
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents (on, config) {
      on('task', {
        findFileByPrefix (prefix) {
          const downloadsFolder = path.join(__dirname, '..', 'downloads');
          const files = fs.readdirSync(downloadsFolder);
          const matchingFile = files.find(file => file.startsWith(prefix));

          if (matchingFile) {
            return path.join(downloadsFolder, matchingFile);
          }

          return null;
        }
      }),
      on('task', {
        fileIsExist (prefix) {
          const downloadsFolder = path.join(__dirname, '..', 'downloads');
          const files = fs.readdirSync(downloadsFolder);
          const matchingFile = files.find(file => file.startsWith(prefix));

          return matchingFile? true: false
        }
      }),
      on('task', {
        clearUser (userName) {

          const userFolder = path.resolve(__dirname, env.API_USER_FOLDER, userName);

          if(fs.existsSync(userFolder)){

            try{

              fs.rmdirSync(userFolder, { recursive: true });

            } catch(err){

              console.log('DELETE USER FOLDER ERROR: ', err)
            }
          }

          return null
        }
      }),
      on('task', {
        log(message) {
          console.log(message +'\n\n');
          return null;
        },
      })
      // implement node event listeners here
    },
    specPattern: [
      "cypress/e2e/**/*.cy.js"
    ],
    downloadsFolder: 'cypress/downloads',
    fixturesFolder: 'cypress/fixtures',
  },
});
