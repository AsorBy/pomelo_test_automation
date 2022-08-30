const { defineConfig } = require("cypress");

module.exports = defineConfig({
  requestTimeout: 12000,
  defaultCommandTimeout: 8000,
  e2e: {
    baseUrl: "https://preprod-go.pomelopatient.com/#/",
    supportFile: "./cypress/support/commands.js",
    setupNodeEvents(on, config) {
      const path = require("path");
      const gmail = require("../pomelo_test_automation/node_modules/gmail-tester-extended");
      const POLL_INTERVAL = 5;
      const MAX_POLL_INTERVAL = 20;
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
      on('task', {
        'gmail:get-messages': async args => {
          return await gmail.get_messages(
              await getCredentials(),
              await getToken(),
              args.options
          );
        }
      });

      on("task", {
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
        }
      });
    },
  },
});
