const { defineConfig } = require("cypress");

module.exports = defineConfig({
  requestTimeout: 10000,
  defaultCommandTimeout: 6000,
  e2e: {
    baseUrl: "https://preprod-go.pomelopatient.com/#/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
