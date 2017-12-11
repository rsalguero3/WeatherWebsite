const express = require('express');
require('dotenv').config({path: 'env/vars.env'});
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const request = require('request');
const apiKey = process.env.WEATHER_API;
const googlePlacesApiKey = process.env.GOOGLE_API;


app.use(express.static(path.join(__dirname, 'public')));
app.use("/js", express.static(__dirname + '/js'));
app.set('views,', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null, photoSrc: null, weatherCondition: null});
});

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    let url2 = `http://api.openweathermap.org/data/2.5/find?q=${city}&type=like&mode=json&appid=${apiKey}`;
    let googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}&key=${googlePlacesApiKey}`;

    request(url, function (err, response, body) {
        if(err){
            res.render('index', {weather: null, error: 'Error, please try again', weatherCondition: null, photoSrc: null});
        }
        else {
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('index', {weather: null, error: 'Error, please try again', weatherCondition: null, photoSrc: null});
                console.log(weather);
            } else {
                let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                let weatherConditionText = weather.weather[0].main;
                let googlePhotoUrl = '';
                console.log(weather.weather[0].main);
                request(googleUrl, function (err, response, body) {
                    if (err){
                        console.log(err);
                    }
                    else {
                        let place = JSON.parse(body);
                        let photoReference = place.results[0].photos[0].photo_reference;
                        googlePhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photoreference=${photoReference}&key=${googlePlacesApiKey}`;
                        res.render('index', {weather: weatherText, error: null, photoSrc: googlePhotoUrl, weatherCondition: weatherConditionText});
                    }
                });
            }
        }
    });
});

var port_number = server.listen(process.env.PORT || 3000);

app.listen(port_number, function () {
    console.log('Example app listening on port 3000!')
});