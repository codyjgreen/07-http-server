'use strict';

const http = require('http');
const url = require('url');
const queryString = require('querystring');
const cowsay = require('cowsay');

const PORT = process.env.PORT || 3000;

// callback should be (err, body) => undefined
const bodyParse = (req, callback) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        let body = ''
        req.on('data', (buf) => {
            body += buf.toString();
        });
        req.on('end', () => callback(null, body));
        req.on('error', (err) => callback(err))
    } else {
        callback(null, '{}')
    }
}

const server = http.createServer((req, res) => {
    let cowVoice;
    req.url = url.parse(req.url);
    req.url.query = queryString.parse(req.url.query);

    if (req.method === 'GET') {
        if (req.url.pathname === '/') {
            req.on('error', err => {
                console.log(err);
            });

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(`
            <head>
                <title>Cowsay What?</title>
            </head>
            <body>
                <header>
                    <nav>
                        <ul>
                            <li><a href="/cowsay">Cowsay</a></li>
                        </ul>
                    </nav>
                </header>
                <main>
                    <section>
                        <h1>Say HEY COW!</h1>
                        <p>Ever tried to make a cow talk, well you\'re in for a treat. This project does just that using a REST state API with a fun NPM library package called cowsay.</p>
                    </section>
                </main>
            </body>
            </html>
            `);
            res.end();
        }
    }
});


server.listen(PORT, () => {
    console.log('listening on PORT: ', PORT)
})