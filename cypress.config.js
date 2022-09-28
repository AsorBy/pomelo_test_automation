const { defineConfig } = require("cypress");
const sqlServer = require("cypress-sql-server");

module.exports = defineConfig({
  requestTimeout: 12000,
  defaultCommandTimeout: 8000,
  e2e: {
    baseUrl: "https://preprod-go.pomelopatient.com/#/",
    supportFile: "./cypress/support/commands.js",
    setupNodeEvents(on, config) {
      const path = require("path");
      const gmail = require("../pomelo_test_automation/node_modules/gmail-tester-extended");
      const pg = require("pg");
      const POLL_INTERVAL = 5;
      const MAX_POLL_INTERVAL = 20;
      const sqlServer = require('cypress-sql-server');

      // function getLogin(email) {
      //   let array = email.split('g');
      //   return array;
      // }
      async function getCredentials(){
        return path.resolve('./cypress/plugins/credentials-pomelo4test.json')
      }

      async function  getToken() {
        return path.resolve('./cypress/plugins/token_cypress.json')
      }
      tasks = sqlServer.loadDBPlugin(config.db);

      on('task', {
        'gmail:get-messages': async args => {
          return await gmail.get_messages(
              await getCredentials(),
              await getToken(),
              args.options
          );
        },
      // });
      //
      // on("task", {
        "gmail:getMessagesWithBody": async args => {
          const {from, to, subject, bodyText} = args;
          return await gmail.getMessageWithTextInBody(
              await getCredentials(),
              await getToken(),
              subject,
              from,
              to,
              bodyText,
              POLL_INTERVAL,
              MAX_POLL_INTERVAL
          );
        },
      // });
      //
      // on("task", {
        DATABASE ({ sql, values }) {
          const pool = new sqlServer.loadDBPlugin({
            user: 'itechart',
            host: 'jdbc:redshift://eventswarehouse.ca-a.events.pomelo.health/events_canada',
            database: 'redshift',
            password: 'Pomelo123',
            port: 5439
          });
          return pool.query(sql, values);
        }
      })
    },
  },
});
