import { getLinks } from './getLinks.js';

export function get(req, res) {
  console.log("listing page's req.url:", req.url);
  const links = getLinks(req.url);

  const contents = JSON.stringify(links);

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  res.end(contents);
}
