"use strict";

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let bestSurvivalTime = 0;
/*
elon musk img:
https://hips.hearstapps.com/hmg-prod/images/gettyimages-1229892983-square.jpg
tesla img:
https://static.dezeen.com/uploads/2017/07/tesla-model-3-design_dezeen_sq-1-300x300.jpg
pacman img:
https://wiki.manjaro.org/images/9/90/Pacman.jpg
pacman ghost img:
https://e7.pngegg.com/pngimages/829/428/
png-clipart-ms-pac-man-pac-man-adventures-in-time-pac-man-party-space-invaders-ghost-pacman-purple-super-smash-bros-for-nintendo-3ds-and-wii-u-thumbnail.png
*/

const CHAR_PATHS = ["elon-musk.png", "pacman.png"]
const OBSTACLE_PATHS = ["tesla.png", "ghost.png"]

app.get('/record/:seconds', function(req, res) {
  let record = parseInt(req.params.seconds);
  if (record > bestSurvivalTime) {
    bestSurvivalTime = record;
  }
  res.type("text");
  res.status(200).send(bestSurvivalTime.toString());
});

app.get('/speed', function(req, res) {
  let speed = Math.random() * (33 - 12) + 12;
  res.status(200).send(speed.toString());
})

app.get('/getImages', function(req, res) {
  let imageIndex = Math.floor(Math.random() * CHAR_PATHS.length);
  let returnJSON = {
    characterPath: CHAR_PATHS[imageIndex],
    obstaclePath: OBSTACLE_PATHS[imageIndex]
  }
  res.json(returnJSON);
})


app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);