'use strict';

const fs = require('fs');

module.exports = {
  getURLs(urls) {
    const allUrls = [];
    urls = urls.map((url) => url.trim());

    for (var url of urls) {
      if (url.startsWith('http')) {
        allUrls.push(url);
      } else {
        const filePath = url;
        var lines = fs.readFileSync(filePath).toString().split('\n');
        for (let line of lines) {
          if (line.trim().length > 0) {
            let url, alias = null;
            let lineArray = line.split(" ", 2);
            if (lineArray[0]) {
              url = lineArray[0].trim();
            }
            if (lineArray[1]) {
              alias = lineArray[1].trim();
            }
            let urlObject = {
              url,
              alias
            };
            allUrls.push(urlObject);
          }
        }
      }
    }
    return allUrls;
  }
};
