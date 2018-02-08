# gmaps-oop-gulp
An object oriented map-based interface that uses Google Maps Places API and Gulp for task running.

## Installation
`npm install`

## Run tasks

The following command will concatenate the js files and put them in dist/all.js, transpile and concatenate and minify the .scss files and put them in dist/main.min.css. 

`npm run gulp`

So the generated directories and files will be:

- dist
    - css
        - main.min.css
    - js
        - all.js


Note: This doesn't include live reload (or functionality to run on a server), but the Live Server extension in VSCode is pretty good for that.