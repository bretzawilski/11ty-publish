const path = require("path");
const moment = require("moment");
moment.locale("en");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./style.css");
  eleventyConfig.addPassthroughCopy("./script.js");
  eleventyConfig.addPassthroughCopy("./reveal")
  

  eleventyConfig.addFilter("dateIso", (date) => {
    return moment(date).toISOString();
  });

  eleventyConfig.addFilter("dateReadable", (date) => {
    return moment(date).utc().format("LL"); // E.g. May 31, 2019
  });

  const markdownIt = require("markdown-it");
  const markdownItOptions = {
    html: true,
    linkify: true,
  };

  // Markdown elements
  const md = markdownIt(markdownItOptions)
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-attrs"))
    .use(function (md) {
      // Recognize Mediawiki links ([[text]])
      md.linkify.add("[[", {
        validate: /^([\w\s/-]+)(.\w+)?\s?(\|\s?([\w\s/]+))?\]\]/,
        normalize: (match) => {
          const parts = match.raw.slice(2, -2).split("|");
          parts[0] = parts[0].replace(/.(md|markdown)\s?$/i, "");
          match.text = (parts[1] || parts[0]).trim();
          match.url = `/notes/${parts[0].trim()}/`;
        },
      });
    });

  eleventyConfig.addFilter("markdownify", (string) => {
    return md.render(string);
  });

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addCollection("notes", function (collection) {
    return collection.getFilteredByGlob(["notes/**/*.md", "index.md"]);
  });

    eleventyConfig.addPassthroughCopy('assets');
    eleventyConfig.setUseGitIgnore(false);
    // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: "./",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    },
    passthroughFileCopy: true
  };
};