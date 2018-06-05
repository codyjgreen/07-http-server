'use strict';

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const bodyParser = require('./bodyParser.js');
const cowsay = require('cowsay');

const server = http.createServer((req, res) => {
  req.url = url.parse(req.url);
  req.url.query = querystring.parse(req.url.query);
  console.log('url', req.url);
  console.log('url query', req.url.query.text);

  let message = {
    text: req.url.query.text || 'I need something good to say!',
    f: req.url.query.f || '',
    e: req.url.query.e || '',
    T: req.url.query.T || ''
  };

  let home = `
  <!DOCTYPE html>
    <html>
      <head>
        <title> cowsay </title>
      </head>
      <body>
      <header>
        <nav>
          <ul>
            <li><a href="/cowsay">cowsay</a></li>
          </ul>
        </nav>
      <header>
      <main>
        <p>This is a website that replicates a CLI program called cowsay. You can tell the cow what to say.</p><p> To use, click the "cowsay" link above and on the next page type the following at the end of the URL ?text=somthing to say.</p>
      </main>
      </body>
    </html>`;

  let cowsayText = message => {
    return `<!DOCTYPE html>
      <html>
        <head>
          <title> cowsay </title>
        </head>
        <body>
         <h1> cowsay </h1>
         <pre>
            ${message}
         </pre>
      </body>
      </html>`;
  };

  if (req.method === 'GET' && req.url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(home);
    res.end();
  }

  if (
    req.method === 'GET' &&
    req.url.pathname === '/cowsay' &&
    !req.url.query.text
  ) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(cowsayText(cowsay.say(message)));
    res.end();
  }

  if (req.method === 'GET' && req.url.pathname === '/cowsay' && req.url.query) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(cowsayText(cowsay.say(message)));
    res.end();
  }

  if (req.method === 'GET' && req.url.pathname === '/api/cowsay') {
    if (!req.url.query.text) {
      res.writeHead(400, { 'Content-Type': 'text/json' });
      res.write('{"error": "invalid request: text query required"}');
      res.end();
      return;
    }

    //let say = req.url.query.text;
    let data = JSON.stringify(message);
    res.writeHead(200, { 'Content-Type': 'text/json' });
    res.write(data);
    res.end();
  }

  if (req.method === 'POST' && req.url.pathname === '/api/cowsay') {
    bodyParser(req, (err, body) => {
      if (body.length === 0) {
        res.writeHead(400, { 'Content-Type': 'text/json' });
        res.write('{"error": "invalid request: body required"}');
        res.end();
        return;
      }

      let bodyParsed = JSON.parse(body);

      if (!bodyParsed['text']) {
        res.writeHead(400, { 'Content-Type': 'text/json' });
        res.write('{"error": "invalid request: text query required"}');
        res.end();
        return;
      }
      let text = bodyParsed.text;
      message = {
        content: bodyParsed.text,
        f: bodyParsed.f || '',
        e: bodyParsed.e || '',
        T: bodyParsed.T || ''
      };
      let data = JSON.stringify(message);

      res.writeHead(200, { 'Content-Type': 'text/json' });
      res.write(data);
      res.end();
    });
  }
});

server.start = PORT => {
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
};

server.stop = () => {
  server.close();
};

module.exports.server = server;
