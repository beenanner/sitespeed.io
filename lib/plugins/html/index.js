'use strict';

const path = require('path'),
  set = require('lodash.set'),
  HTMLBuilder = require('./htmlBuilder');

module.exports = {
  name() {
    return path.basename(__dirname);
  },

  open(context, options) {
    this.HTMLBuilder = new HTMLBuilder(context.storageManager);
    this.options = options;
  },

  processMessage(message) {
    // Accumulate data from messages, and write files as needed.
    switch (message.type) {
      case 'url':
        {
          return this.HTMLBuilder.addUrl(message.url);
        }

      case 'error':
        {
          return this.HTMLBuilder.addErrorForUrl(message.url, message.data);
        }

      case 'browsertime.run':
      case 'browsertime.page':
      case 'browsertime.har':
      case 'webpagetest.run':
      case 'webpagetest.pageSummary':
      case 'gpsi.data':
      case 'snufkin.pageSummary':
      case 'snufkin.run':
      case 'coach.run':
      {
        return this.HTMLBuilder.addDataForUrl(message.url, message.type, message.data, message.runIndex);
      }

      case 'assets.aggregate':
      {
        let topAssets = message.data
          .sort((a, b) => b.requestCount - a.requestCount)
          .splice(0, 10);
        return this.HTMLBuilder.addDataForSummaryPage('assets', {assets: topAssets});
      }

      case 'domains.summary':
      {
        return this.HTMLBuilder.addDataForSummaryPage('domains', {domainStats: message.data});
      }
      case 'webpagetest.summary':
      case 'coach.summary':
      case 'snufkin.summary':
      {
        const data = {};
        set(data, message.type, message.data);
        return this.HTMLBuilder.addDataForSummaryPage('index', data);
      }
    }
  },
  close() {
    return this.HTMLBuilder.renderHTML(this.options);
  }
};