const request = require('request');

let apiKey = 'ea31099a39c0d27a9e12db63ec106e40';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

request(url, function (err, response, body) {
    if(err){
        console.log('error:', err);
    }
    else {
        let weather = JSON.parse(body);
        let message = `It's ${weather.main.temp} degrees in ${weather.name}`;
        console.log(message);
    }
});