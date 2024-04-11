const triviaQuestion = document.getElementById('trivia-question')
const triviaAnswer = document.getElementById('trivia-answer')
const jokeIntro = document.getElementById('joke')
const punchLine = document.getElementById('punchline')
const quoteContent = document.getElementById('quotes')
const quoteAuthor = document.getElementById('quote-author')
const answerBox = document.querySelector('.trivia-answer-box')
const photographerName = document.getElementById('photo-author')
const weatherModule = document.getElementById('weather')
const weatherNoGeo = document.getElementById('weather-no-geo')
const weatherWrapper = document.getElementById('weather-align')
const photoOnlyBtn = document.getElementById("photoOnlyBtn")
const triviaWrapper = document.querySelector(".trivia-wrapper")
const jokeWrapper = document.querySelector(".joke-wrapper")
const errorMessage = "Error: Refresh to retry API connection"
const unsplashAccessKey = 'FnE1bejlGf_lhBh670DdpW6bqQo6nH6aHu659iRJCUg' 
const unsplashURL = `https://api.unsplash.com/photos/random?client_id=${unsplashAccessKey}`
const triviaCategoryKey = [
    {category: "geography", id: 22},
    {category: "history",id: 23},
    {category: "science",id: 24}
]

//quotes 
fetch("https://api.quotable.io/quotes/random")
    .then(res => res.json())
    .then (data => {
        quoteContent.textContent = data[0].content
        quoteAuthor.textContent = `- ${data[0].author} -`
    })
    .catch (err => {
        console.error(err)
        quoteContent.textContent = errorMessage  
    })
//trivia
fetch("https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => {
        let questionContent = data.results[0].question
        let questionAnswer = data.results[0].correct_answer
        triviaQuestion.innerHTML = questionContent
        triviaAnswer.innerHTML = questionAnswer
        })
    .catch (err => {
        console.error(err)
        triviaQuestion.innerHTML = errorMessage  
    }) 
//jokes
fetch("https://official-joke-api.appspot.com/jokes/general/random")
        .then(res => res.json())
        .then(data => {
            jokeIntro.innerText = `Q: ${data[0].setup}`
            punchLine.innerText = `A: ${data[0].punchline}`
        })
        .catch (err => {
            console.error(err)
            jokeIntro.innerText = errorMessage
    })
// background image
fetch(unsplashURL)
    .then(response => response.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
		photographerName.innerHTML = 
        `
            <a href="${data.user.links.html}" target="_blank" title="View more photos from ${data.user.name}" alt="${data.alt_description}">📷 <span class="custom-underline">${data.user.name}</span></a>
        `
    })
    .catch(err => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDQyODg5NTB8&ixlib=rb-4.0.3&q=80&w=1080)`
		photographerName.textContent = `By: Sebastian Unrau`
        console.error(err)
})
// time display
function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}
setInterval(getCurrentTime, 1000)
//get user location for weather
function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                let MyLatitude = position.coords.latitude
                let MyLongitude = position.coords.longitude
                getWeatherData(MyLatitude, MyLongitude)
                    if(weatherNoGeo.style.display = "flex"){
                        weatherNoGeo.style.display = "none"
                        weatherModule.style.display = "flex"
                        weatherWrapper.style.display = "block"
                    }
            },
            function(error) {
                weatherNoGeo.style.display = "flex"
                weatherModule.style.display = "none"
                weatherWrapper.style.display = "none"
                console.error("Error getting user's location:", error.message);
            }
        )
    }
}
getUserLocation()
//display localised weather to user 
function getWeatherData(latitude, longitude) {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`)
        .then(res => res.json())
            .then(data => {
                const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                const correctedTemperature = data.main.temp.toFixed(1)
    
                const imgElement = document.createElement("img")
                imgElement.src = iconUrl;
                imgElement.setAttribute("title", `${data.name} is currently experiencing ${data.weather[0].description} and a temperature of ${correctedTemperature}° celsius`);
    
                const parentElement = document.getElementById("weather")
                parentElement.insertBefore(imgElement, parentElement.firstChild)
                document.querySelector(".weather-temp").innerText = `${correctedTemperature}°`
                document.querySelector(".weather-city").innerText = `${data.name}`
            })
            .catch(err => {
                console.error(err)
                document.querySelector(".weather-temp").innerText = errorMessage
            })
}
//weather user retry
document.getElementById('geo-retry').addEventListener('click', () =>{
    getUserLocation()
})
// photo background fade animation | note: workaround using last element in DOM 
document.getElementById('photoOnlyBtn').addEventListener('click', function() {
    const elementsToFade = document.querySelectorAll('body *:not(root):not(.photo-button):not(#photoOnlyBtn):not(main):not(.bottom-row)')
    let isFadedOut = punchLine.classList.contains('fadeOut')

    elementsToFade.forEach(function(element) {
        if (!isFadedOut) {
            setTimeout(() => { element.classList.add('fadeOut', 'fadeOutTrans') }, 300)
        } else {
            element.classList.remove('fadeOut');
            setTimeout(() => { element.classList.remove('fadeOutTrans') }, 2000)
        }
    });
    if (!isFadedOut) {
        setTimeout(() => {document.body.style.backgroundColor = 'rgba(247, 245, 245, 0)'},300)
    } else {
        setTimeout(() => {document.body.style.backgroundColor = 'rgba(51, 45, 45, 0.95)'},300)
    }
})
//photo only button animation
let isPhotoMode = false
photoOnlyBtn.addEventListener('click', function() {
    if (!isPhotoMode) {
        this.style.opacity = "0.7"
        this.innerHTML = "X"
        this.style.width = "37px"
        isPhotoMode = true
    } else {
        this.style.opacity = "1"
        this.style.width = "165px"
        setTimeout(() => {
            this.innerHTML = "Photo only mode"
        }, 360)
        isPhotoMode = false
    }
})
//trivia animation 
triviaWrapper.addEventListener("mouseenter", function() {
    triviaWrapper.style.opacity = "1"
})
triviaWrapper.addEventListener("mouseleave", function() {
    triviaWrapper.style.opacity = "0.2"
})
//trivia answer flip animation
document.querySelector('.flip-container').addEventListener('click', function() {
    this.classList.toggle('flip')
})
//joke animation 
jokeWrapper.addEventListener("mouseenter", function() {
    jokeWrapper.style.opacity = "1"
    jokeWrapper.style.transform = 'translateY(0%)'
})
jokeWrapper.addEventListener("mouseleave", function() {
    jokeWrapper.style.opacity = "0.4"
    jokeWrapper.style.transform = 'translateY(calc(100% - 110px))'
})