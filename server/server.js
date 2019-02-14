const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

const emailUtils = require("./emailUtils");

console.log('Starting server ...');

// app.use(express.static(path.join(__dirname, 'build')));
// app.use(bodyParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

/**
 * Fix CORS error
 */
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.listen(process.env.PORT || 3001);

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.post('/sendEmail', function (req, res) {
  console.log(req.body);
  emailUtils.sendEmail(req.body.oldBooking, req.body.newBooking, req.body.bookingChanges, req.body.customer);
  res.send({});
});
