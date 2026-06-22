const fs = require("fs");
const pathLib = require("path");

// Root of the content tree (mirrors the old "src/routes").
const ROOT = pathLib.join(__dirname, "..");
const ROOT_LABEL = "site";

// Directories/files whose children should be ignored even if an index exists.
const makeLinksEvenIfIndex = [ROOT_LABEL];

function makeReadableName(name) {
  const overrides = { "obama-s-neighborhood": "Obama's Neighborhood" };
  if (overrides[name]) return overrides[name];
  if (!name) return "";
  return name
    .split("-")
    .map((seg) => (seg ? seg[0].toUpperCase() + seg.substring(1) : seg))
    .join(" ");
}

function removeFileEnding(file) {
  return file.split(".")[0];
}

// Recursively build the link tree, faithfully reproducing the original
// getAllLinks() logic: a directory that contains an index page collapses to a
// single leaf link (children === null); an empty directory yields children ===
// [] (rendered as a disabled label); files and other dirs link normally.
function getAllLinks(relPath) {
  const absPath = pathLib.join(ROOT, relPath);
  const links = [];
  let children;
  try {
    children = fs.readdirSync(absPath, { withFileTypes: true });
  } catch (err) {
    return null;
  }

  const labelPath = relPath === "" ? ROOT_LABEL : `${ROOT_LABEL}/${relPath}`;
  const shouldIgnoreParent =
    !makeLinksEvenIfIndex.includes(labelPath) &&
    children.some((sub) => sub.name.startsWith("index"));
  if (shouldIgnoreParent) return null;

  for (const child of children) {
    const ignore =
      child.name.startsWith("_") || child.name.startsWith(".");
    if (ignore) continue;

    const childFileName = removeFileEnding(child.name);
    const childRel = relPath ? `${relPath}/${childFileName}` : childFileName;

    links.push({
      path: childRel,
      name: makeReadableName(childFileName),
      lastUrlSegment: childFileName,
      children: child.isDirectory() ? getAllLinks(childRel) : null,
    });
  }
  return links;
}

module.exports = function () {
  const links = getAllLinks("") || [];
  const find = (name) => links.find((l) => l.name === name) || null;
  return {
    links,
    aboutUncleJack: find("About Uncle Jack"),
    featured: find("Featured"),
    contents: find("Contents"),
    contact: find("Contact"),
  };
};
