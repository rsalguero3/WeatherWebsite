const express = require('express');
require('dotenv').config({path: 'env/vars.env'})
const bodyParser = require('body-parser');
const app = express()
const request = require('request');
const apiKey = process.env.WEATHER_API;
const googlePlacesApiKey = process.env.GOOGLE_API;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null, photoSrc: null});
});

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    let googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&key=${googlePlacesApiKey}`;

    request(url, function (err, response, body) {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again'});
        }
        else {
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('index', {weather: null, error: 'Error, please try again'});
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                let googlePhotoUrl = '';
                request(googleUrl, function (err, response, body) {
                    if (err){
                        console.log(err);
                    }
                    else {
                        let place = JSON.parse(body);
                        let photoReference = place.results[0].photos[0].photo_reference;
                        googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference=${photoReference}&key=${googlePlacesApiKey}`;
                        res.render('index', {weather: weatherText, error: null, photoSrc: googlePhotoUrl});
                    }
                });
            }
        }
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});