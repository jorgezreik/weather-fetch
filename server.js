const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

require('dotenv').config();
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
});

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  if (city.includes('Dover')) {
    res.render('index', {weather: 'Hi Reis', error: null});
  }
  else {
    request(url, function (err, response, body) {
      if (err) {
        res.render('index', {weather: null, error: 'Error, please try again'});
      }
      else {
        try {
          let weather = JSON.parse(body);
          if (weather.main === undefined) {
            res.render('index', {weather: null, error: 'Error, please try again'});
          }
          else {
            let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            res.render('index', {weather: weatherText, error: null});
          }
        } catch (e) {
          res.render('index', {weather: null, error: 'Error, please try again'});
        }
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
