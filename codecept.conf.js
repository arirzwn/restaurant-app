const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: 'e2e/**/*.test.js',
  output: 'e2e/output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'http://localhost:8080', // Update this to match your development server URL
      show: true,
    },
  },
  include: {
    I: './steps_file.js',
  },
  name: 'submission-katalog-restoran-pwa-testing-optimized',
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
  },
};
