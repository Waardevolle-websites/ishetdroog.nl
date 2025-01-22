const body = document.querySelector("body");
const answer = document.querySelector(".answer");
const text = document.querySelector(".text");
const button = document.querySelector(".start");

function start() {
    button.remove();
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
            report(result.state);
            getLocationPrompt();
        } else if (result.state === "prompt") {
            report(result.state);
            getLocationPrompt();
        } else if (result.state === "denied") {
            report(result.state);
            answer.textContent = "Geen toestemming";
            text.textContent = "We hebben je locatie nodig om te bepalen of het droog is.";
            body.classList.toggle("error");
        }
        result.addEventListener("change", () => {
            report(result.state);
        });
    });
}

function report(state) {
    console.log(`Permission ${state}`);
}

function getLocationPrompt() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Browser doesn't support the Geolocation API");
    }
}

function success(position) {
    getData(position.coords.latitude, position.coords.longitude);
}

function error() {
    answer.textContent = "Geen toestemming";
    text.textContent = "We hebben je locatie nodig om te bepalen of het droog is.";
    body.classList.toggle("error");
}

async function getData(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?models=knmi_seamless&latitude=${latitude}&longitude=${longitude}&current=rain`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        console.log("Rain: " + json.current.rain)
        if (json.current.rain != 0) {
            answer.textContent = "Nee";
            text.textContent = "Het is momenteel niet droog.";
            body.classList.toggle("wet");
        } else {
            answer.textContent = "Ja";
            text.textContent = "Het is momenteel droog.";
            body.classList.toggle("dry");
        }
    } catch (error) {
        console.error(error.message);
    }
}

button.addEventListener("click", start);