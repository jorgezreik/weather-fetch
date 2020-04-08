const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const port = process.env.PORT || 3000;
const app = express();

require('dotenv').config();
const apiKey = process.env.API_KEY;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
});

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  if (city.includes('Dover')) {
    res.render('index', {weather: 'Hi Reis', error: null});
  }
  else {
    request(url, function (err, response, body) {
      if (err) {
        res.render('index', {weather: null, error: 'Error, please try again'});
      }
      else {
        let weather = JSON.parse(body);
        if (weather.main == undefined) {
          res.render('index', {weather: null, error: 'Error, please try again'});
          console.log(url);
        }
        else {
          let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
          res.render('index', {weather: weatherText, error: null});
        }
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
