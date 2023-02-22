const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://account.sainsburys.co.uk/",
    experimentalStudio: true,
    setupNodeEvents(on, config) {},
    specPattern: "cypress/**/*.spec.{js,jsx,ts,tsx}",
  },
  defaultCommandTimeout: 10000,
});
