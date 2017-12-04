function changeClass(){
    if(forcast !== null){
        let element = document.getElementById("weather_animation");
        element.setAttribute("class", forcast.toLowerCase());
    }
}

$(document).ready(function () {
    changeClass();
});