const fs = require("fs");
const path = require("path");

// Wrap every U+02BB (ʻokina) in <span class="okina"> so the CSS can give it the
// correct font and layout, avoiding the overlap caused by Gelasio's near-zero
// advance width for this character. Operates on rendered HTML text only (never
// inside tags or <style>/<script> blocks), mirroring the original rehype plugin.
const OKINA = "ʻ";
function wrapOkina(html) {
  if (!html || !html.includes(OKINA)) return html;
  const span = `<span class="okina">${OKINA}</span>`;
  const re = /<[^>]+>/g;
  let result = "";
  let lastIndex = 0;
  let skip = 0;
  let m;
  const replace = (text) => (skip ? text : text.split(OKINA).join(span));
  while ((m = re.exec(html)) !== null) {
    result += replace(html.slice(lastIndex, m.index));
    const tag = m[0];
    result += tag;
    const lower = tag.toLowerCase();
    if (/^<(style|script)[\s>]/.test(lower)) skip++;
    else if (/^<\/(style|script)>/.test(lower)) skip = Math.max(0, skip - 1);
    lastIndex = re.lastIndex;
  }
  result += replace(html.slice(lastIndex));
  return result;
}

// The Clean Air Team antipollution "ad" frame: a flexible SVG with a
// foreignObject holding the slogan text. The big SVG path lives in a partial.
const antiPollutionPath = fs
  .readFileSync(path.join(__dirname, "site/_includes/partials/_anti-pollution-path.svg"), "utf8")
  .trim();

module.exports = function (eleventyConfig) {
  // Static assets (global.css, logos, images, manifest) live at the site root.
  eleventyConfig.addPassthroughCopy({ static: "/" });

  eleventyConfig.setLibrary("md", require("markdown-it")({ html: true }));

  // Last non-empty path segment of a URL (used for nav aria-current matching).
  eleventyConfig.addFilter("lastSegment", function (url) {
    const parts = (url || "").split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  });

  eleventyConfig.addTransform("okina", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      return wrapOkina(content);
    }
    return content;
  });

  // Paired shortcode reproducing the AntiPollutionContainer Svelte component.
  eleventyConfig.addPairedShortcode("quoteWrapper", function (content, justify) {
    // Emit with no blank/whitespace-only lines so markdown-it treats the whole
    // SVG as a single raw HTML block (foreignObject is not a block tag and would
    // otherwise get wrapped in <p>). Use a <div> (not <body>) inside the
    // foreignObject: the HTML parser drops a nested <body> element and reparents
    // its children, which would strip the font/flex styling.
    const html = `<div class="anti-pollution-container-wrap" style="--justify:${justify}">
<svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 433 105" class="anti-pollution-container">
${antiPollutionPath}
<foreignObject overflow="visible" class="node" x="101" y="10" width="75%" height="88">
<div class="ad-body" xmlns="http://www.w3.org/1999/xhtml">
${content}
</div>
</foreignObject>
</svg>
</div>`;
    return html
      .split("\n")
      .filter((l) => l.trim() !== "")
      .join("\n");
  });

  // Lists sibling pages of a poem-collection index (mirrors the old LinksList /
  // getLinks helper): every file in the index page's directory except the index.
  eleventyConfig.addShortcode("poemList", function () {
    const inputPath = this.page.inputPath; // e.g. ./site/featured/.../triptych/index.md
    const dir = path.dirname(inputPath);
    const baseUrl = this.page.url.replace(/\/$/, ""); // collection url, no trailing slash
    const entries = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("index"))
      .map((f) => f.replace(/\.md$/, ""))
      .sort();
    const items = entries
      .map((slug) => {
        const name = slug
          .split("-")
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ");
        return `    <li><a rel="prefetch" href="${baseUrl}/${slug}">${name}</a></li>`;
      })
      .join("\n");
    return `<div class="links-list">\n  <ul>\n${items}\n  </ul>\n</div>`;
  });

  return {
    dir: {
      input: "site",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
