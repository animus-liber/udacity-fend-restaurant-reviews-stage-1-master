
# Udacity FEND - Project: Restaurants Reviews Stage: 1
Udacity Front-End Web Developer Nanodegree - Project: "Restaurant Reviews App"
is an online app back on it's feet.
The Restaurant Reviews App has been updated to shine in todays high standard's
of responsiveness, accessibility, speed, and going offline-first using the new
Service Worker Functionality!

Check out the App and enjoy clean user experience while finding your next
place to dine.

## Installation
### Leaflet.js and Mapbox:

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). You will need a token from [Mapbox](https://www.mapbox.com/). Mapbox is free to use, and does not require any payment information.

### Get set up
First, Clone the GitHub repository
```
$ git clone
"https://github.com/animus-liber/udacity-fend-restaurant-reviews-stage-1-master.git"
$ cd "udacity-fend-restaurant-reviews-stage-1-master"
```
Next you'll need to add your newly create mapbox token
```
$ cat <<EOF > js/api_keys.js
> class APIKeys {
>   static get mapboxAPIKey() {
>   return 'YOUR API TOKEN GOES HERE';
>   }
> }
> EOF
```

## Run the App
Next, well have to get our Server running.
In your terminal, check your version of Python with: `python -V`.

If you have Python 2.x, start your server in your root

`$ python -m SimpleHTTPServer 8000`

For Python 3.x, you can use `python3 -m http.server 8000`.

On windows the command should be: `py -m http.server 8000`.

If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

### Use the App
Open your favorite browser and visit localhost:8000. :-)

## Notes
### Note about ES6
Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code.

### Sources and Suporting Materials used for this project
 - https://udacity.com
 - https://w3schools.com
 - https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
 - https://www.youtube.com/watch?v=ag_jBDFAL0U&feature=youtu.be
 - https://www.youtube.com/watch?v=92dtrNU1GQc
 - https://alexandroperez.github.io/mws-walkthrough/?1.28.handling-offline-maps-with-custom-content
 - https://matthewcranford.com/
 - https://eloquentjavascript.net
