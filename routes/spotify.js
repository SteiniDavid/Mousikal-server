import express from "express";
import axios from "axios";

export const router = express.Router();
export const prefix = '/spotify';

const OAuthToken = 'BQBB0_9Uz168ipCkyPaYn3TFOpGuPMR8jzlt3ggOJNfXD3XdkK3GQ8z53Ax5WMRIXDnGr-Y5om7EOsOOUxUVAowXc4Rug9jA4BI5WajI9aVY6A8QogFv-zGzrbsSS1KH4hY-L3QcnzN-Y5DJe68J73BXzCzz7Yg';

router.get('/artist', function (req, res) {  

    //  Search term should be artist's name
    var searchTerm = req.query.searchTerm;

    var querySpotify = async () => {
        var result = await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/search?q=' + searchTerm + '&type=artist&limit=50',
          headers: {
            'Authorization': 'Bearer ' + OAuthToken,
            'Content-Type': 'application/json',
          }
        });
        return result;
      }

      querySpotify().then(function(result) {
        res.send(searchArtistsToJSON(result));
      })
});

router.get('/artistAlbums', function (req, res) {

    // search term should be the artist's spotifyID
    var searchTerm = req.query.searchTerm;

    // 38EmEgXkgK51MT2tPY0EoC = bobby

    var querySpotify = async () => {
        var result = await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/artists/' + searchTerm + '/albums?limit=50',
          headers: {
            'Authorization': 'Bearer ' + OAuthToken,
            'Content-Type': 'application/json',
          }
        });
        return result;
      }
    
      querySpotify().then(function(result) {
        res.send(albumsToJSON(result));
      }) 

});

router.get('/albumTracks', function (req, res) {

  //  Search term should be album's ID
  var searchTerm = req.query.searchTerm;

  var querySpotify = async () => {
    var result = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/albums/' + searchTerm + '/tracks?limit=25',
      headers: {
        'Authorization': 'Bearer ' + OAuthToken,
        'Content-Type': 'application/json',
      }
    });
    return result;
  }

  querySpotify().then(function(result) {
    res.send(tracksToJSON(result));
  })


});


// Create JSON file for Artists returned from a search
export function searchArtistsToJSON(searchResult) {
  var artists = new Array();
  var data = searchResult.data.artists.items;
  
  for (var i = 0; i < data.length; i++) {
    var artist = data[i];
    var IMGURL = (artist.images.length > 0) ? artist.images[0].url : null;
    artists.push({
      name: artist.name,
      artistID: artist.id,
      artistURL: artist.external_urls.spotify,
      genres: artist.genres,
      spotify_followers: artist.followers.total,
      imageURL: IMGURL,
    })
  }

  return artists;
}

// Create JSON file for Albums returned from a search
export function albumsToJSON(searchResult) {
  var albums = new Array();
  var data = searchResult.data.items;
  
  for (var i = 0; i < data.length; i++) {
    var album = data[i];
    var IMGURL = (album.images.length > 0) ? album.images[0].url : null;
    albums.push({
      artist: album.artists[0].name,
      artistID: album.artists[0].id,
      album: album.name,
      imageURL: IMGURL,
      albumID: album.uri.substring(14)
    })
  }
  
  return albums;
}

export function tracksToJSON(searchResult) {
  var tracks = new Array();
  var data = searchResult.data.items;
  console.log(data);

  for (var i = 0; i < data.length; i++) {
    var track = data[i];
    tracks.push({
      name: track.name,
      duration: track.duration_ms,
      number: track.track_number,
      sampleURL: track.preview_url,
    })
  }

  return tracks;

}