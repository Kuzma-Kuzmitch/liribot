require("dotenv").config();

var keys = require("./keys.js")

var request = require("request")
var fs = require("fs")

var moment = require("moment")

var Spotify = require("node-spotify-api")
var spotify = new Spotify(keys.spotify)

var command = process.argv[2]
var search = process.argv.slice(3).join(" ")

if (command === "movie-this") {
  liriMovie(search)
}
if (command === "spotify-this-song") {
  liriSpotify(search)
}
if (command === "concert-this") {
  liriConcerts(search)
}
if (command === "do-what-it-says") {
  liriDoIt()
}

function liriMovie(movie) {
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title)
      console.log("Release Year: " + JSON.parse(body).Year)
      console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value)
      console.log("RT Rating: " + JSON.parse(body).Ratings[1].Value)
      console.log("Country: " + JSON.parse(body).Country)
      console.log("Language: " + JSON.parse(body).Language)
      console.log("Plot: " + JSON.parse(body).Plot)
      console.log("Cast: " + JSON.parse(body).Actors)
    }
  });
}

function liriSpotify(song) {
  spotify.search({ type: 'track', query: song }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  var songInfo = data.tracks.items
  console.log(songInfo[0].artists[0].name)
  console.log(song)
  console.log(songInfo[0].album.name)
  console.log(songInfo[0].preview_url)
});
};

function liriConcerts(band) {
  var queryURL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
  request(queryURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var eventInfo = JSON.parse(body)
      for (var i = 0; i < eventInfo.length; i++) {
        console.log("-----------------------")
        console.log(eventInfo[i].venue.name)
        console.log(eventInfo[i].venue.city + ", " + eventInfo[i].venue.region)
        console.log(moment(eventInfo[i].datetime).format("dddd, MMMM Do YYYY"))
        console.log("-----------------------")
      }
    }
  })
}


function liriDoIt() {
    fs.readFile('random.txt', "utf8", function(error, data){
        if (error) {
            return console.log(error);
          }
        var dataArr = data.split(",");
        if (dataArr[0] === "spotify-this-song") {
            var song = dataArr[1].slice(1, -1);
            liriSpotify(song);
        }  else if(dataArr[0] === "movie-this") {
            var movie = dataArr[1].slice(1, -1);
            liriMovie(movie);
        }
      });

};
