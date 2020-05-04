import { getAllLinks } from 'helpers/getAllLinks.js';

export function get(req, res) {
  const links = getAllLinks('src/routes');

  const contents = JSON.stringify(links);

  res.writeHead(200, {
    'Content-Type': 'application/json',
  });

  res.end(contents);
}
