/**
 * Name: Jinseok Kim
 * Section: CSE 154 AC
 * Node.js web service for a game application.
 * Provides endpoints for fetching game images, recording best survival time, and getting random speed values.
 */

"use strict";

const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

let bestSurvivalTime = 0;

/**
 * elon musk img:
 * https://hips.hearstapps.com/hmg-prod/images/gettyimages-1229892983-square.jpg
 * tesla img:
 * https://static.dezeen.com/uploads/2017/07/tesla-model-3-design_dezeen_sq-1-300x300.jpg
 * pacman img:
 * https://wiki.manjaro.org/images/9/90/Pacman.jpg
 * pacman ghost img:
 * https://e7.pngegg.com/pngimages/829/428/
 * png-clipart-ms-pac-man-pac-man-adventures-in-time-pac-man-party-space-
 * invaders-ghost-pacman-purple-super-smash-bros-for-nintendo-3ds-and-wii-u-thumbnail.png
 */

const CHAR_PATHS = ["elon-musk.png", "pacman.png"];
const OBSTACLE_PATHS = ["tesla.png", "ghost.png"];

/**
 * Handles requests to record the best survival time.
 * Updates the best survival time if the new record is higher.
 * @param {string} req.params.seconds - The survival time in seconds of the most recent game
 * @return {string} - The best survival time recorded.
 */
app.get('/record/:seconds', function(req, res) {
  let record = req.params.seconds;
  if (isInteger(record)) {
    record = parseInt(record);
    if (record > bestSurvivalTime) {
      bestSurvivalTime = record;
    }
    res.type("text");
    res.status(200).send(bestSurvivalTime.toString());
  } else {
    res.status(400).send("Inputted parameter is not an integer.");
  }
});

/**
 * Handles requests to get a random speed value for the obstacle.
 * @return {string} - A random speed value between 15 and 37.
 */
app.get('/speed', function(req, res) {
  let speed = Math.random() * (37 - 15) + 15;
  res.type("text");
  res.status(200).send(speed.toString());
});

/**
 * Handles requests to get images of the character and obstacle.
 * @return {Object} - An object containing paths to a character image and an obstacle image.
 */
app.get('/getImages', function(req, res) {
  let imageIndex = Math.floor(Math.random() * CHAR_PATHS.length);
  let returnJSON = {
    characterPath: CHAR_PATHS[imageIndex],
    obstaclePath: OBSTACLE_PATHS[imageIndex]
  };
  res.json(returnJSON);
});

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);

/**
 * Checks if a given string is an integer.
 * @param {string} str - The string to check.
 * @return {boolean} - True if the string is an integer, false otherwise.
 */
function isInteger(str) {
  const num = parseInt(str);
  return !isNaN(num) && num.toString() === str;
}