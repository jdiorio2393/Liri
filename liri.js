// require("dotenv").config();
// var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);
//---------------------------------------------------------------------------------------------
var axios = require("axios");
var fs = require("fs");
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var search = process.argv[2];
var term = process.argv.slice(3).join(" ");


//findMovie takes in the name of a movie and searches the omdb API
var findMovie = function () {
  var URL = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy"

  axios.get(URL).then(function (response) {
    // Place the response.data into a variable, jsonData.
    var jsonData = response.data;

    // showData will print the follwing data to the console
    var showData = [
      "Title: " + jsonData.Title,
      "year: " + jsonData.Year,
      "Rating: " + jsonData.Rated,
      "IMDB Rating: " + jsonData.imdbRating,
      "Country: " + jsonData.Country,
      "Language: " + jsonData.Language,
      "Plot: " + jsonData.Plot,
      "Actors: " + jsonData.Actors

    ]
    console.log(showData);

  });
};

if (!term) {
  term = "mr nobody";
}


if (search === "movie-this") {
  console.log("Searching for Movie");
  findMovie();
}


// code for searching bands using the Town Artists Events API

var findBand = function () {
  var bandURL = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp"

  axios.get(bandURL).then(function (response) {

    var jsonData = response.data;

    for (var i = 0; i < jsonData.length; i++) {
      console.log("------------")
      console.log("Venue: " + jsonData[i].venue.name)
      console.log("Location: " + jsonData[i].venue.city)
      console.log("Date: " + jsonData[i].datetime)

    }
  });
};

if (search === "concert-this") {
  console.log("Searching for band");
  findBand();
}





// Getting track using spotify api
var getArtistNames = function (artist) {
  return artist.name;
};


var getMeSpotify = function (songName) {
  if (songName === undefined) {
    songName = "What's my age again";
  }

  spotify.search(
    {
      type: "track",
      query: songName
    },
    function (err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }

      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};
if (search === "spotify-this-song") {
  songName = term;
  console.log("Searching for track");
  getMeSpotify(songName);
}



//Code for "do what it says"
var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    console.log(data);

    if (data.indexOf(",") !== -1) {
      var dataArr = data.split(",");
      command = dataArr[0];
      query = dataArr[1];
    } else {
      command = data;
    }

    if (command === "concert-this") {
      findBand(query);
    } else if (command === "spotify-this-song") {
      getMeSpotify(query);
    } else if (command === "movie-this") {
      findMovie(query);
    } else { // Use case where the command is not recognized
      console.log("Command is not a valid command! Please try again.")
    }

  });
};

if (search === "do-what-it-says") {
  doWhatItSays();
} 