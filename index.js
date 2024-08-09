require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyparser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+\.[a-z\.]{2,6}[\/\w \.-\?:=&]*\/?)$/;
const localhostRegex = /^https?:\/\/?localhost:?[0-9]*\/?[\w\?=]*/
const urls = ["https://nodejs.org/api/dns.html"];

app.use(cors());
app.use(bodyparser.urlencoded({extended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let originalUrl = req.body.url.toLowerCase();
  let matchesUrl = urlRegex.test(originalUrl);
  let matchesLocalhost = localhostRegex.test(originalUrl);

  if(!matchesUrl && !matchesLocalhost) {
    res.json({'error': 'invalid url'})
    return;
  }
    
  let urlIndex = urls.findIndex(str => str == originalUrl);

  if(urlIndex == -1) {
    urlIndex = urls.length;
    urls.push(originalUrl);
  }

  res.json({ original_url : originalUrl, short_url : urlIndex})
})

app.get('/api/shorturl/:shorturl', (req, res) => {
  let index = req.params.shorturl;

  if(index >= urls.length) {
    res.json({ error: 'invalid url' })
    return
  }

  res.redirect(urls[index])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
