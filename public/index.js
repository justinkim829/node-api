/**
 * Name: Jinseok Kim
 * This file represents a simple game where a character jumps over obstacles.
 * It includes functions such as handling character jumps, moving obstacles, starting a timer,
 * checking for collisions, a
 * nd interacting with a backend server to fetch data and update records.
 */

"use strict";

(function() {

  window.addEventListener('load', init);

  let isEnterPressed = false;

  /**
   * Initializes the game by setting up event listeners and adding initial images.
   */
  function init() {
    let isFirstCall = true;
    addImages();
    document.addEventListener('keydown', (evt) => {
      if (evt.code === "Space") {
        jump();
      }
      if (evt.code === "Enter" && !isEnterPressed) {
        if (!isFirstCall) {
          addImages();
        }
        isFirstCall = false;
        isEnterPressed = true;
        resetGame();
        moveleft();
        startTimer();
      }
    });
  }

  /**
   * Resets the timer and position of the obstacle.
   * No return value.
   */
  function resetGame() {
    /**
     * I changed the style directly because I need to set the position value
     * to a random speed value I get from the server later in the game (not constant).
     * If I try adding or removing classes, i would not be able to set the position
     * to a float value.
     */
    qs("#obstacle").style.transform = "translateX(0px)";
    id("current-record").textContent = "Time: 00:00";
  }

  /**
   * Adds character and obstacle images to the game.
   * No return value.
   */
  async function addImages() {
    let imageData = await getData("http://localhost:8000/getImages", false);
    let charImg = gen("img");
    charImg.src = imageData.characterPath;
    id("character").innerHTML = "";
    id("character").appendChild(charImg);

    let obsImg = gen("img");
    obsImg.src = imageData.obstaclePath;
    id("obstacle").innerHTML = "";
    id("obstacle").appendChild(obsImg);
  }

  /**
   * Makes the character jump.
   * No return value.
   */
  function jump() {
    let character = qs("#character");
    character.classList.add("jumping");
    character.addEventListener('animationend', () => {
      character.classList.remove("jumping");
    }, {once: true});
  }

  /**
   * Moves the obstacle to the left and handles collision detection.
   * No return value.
   */
  async function moveleft() {
    let obstacle = qs("#obstacle");
    let leftPosition = obstacle.offsetLeft;
    const hrTag = qs("#game-container hr");
    const hrTagLeft = hrTag.getBoundingClientRect().left;
    let speed = await getData("http://localhost:8000/speed", true);
    requestAnimationFrame(animate);

    /**
     * Animates the obstacle movement.
     * Positioned back to start when obstacle passes character without colliding
     * Stops movement of obstacle when collision occurs.
     * No return value.
     */
    async function animate() {
      let obstacleLeft = obstacle.getBoundingClientRect().left;
      if (!checkCollision()) {
        if (obstacleLeft > hrTagLeft) {
          leftPosition -= parseInt(speed);
        } else {
          leftPosition = 0;
          speed = await getData("http://localhost:8000/speed", true);
        }

        // I changed the direct style because the position value is not constant.
        obstacle.style.transform = `translateX(${leftPosition}px)`;
        requestAnimationFrame(animate);
      } else {
        isEnterPressed = false;
        cancelAnimationFrame(animate);
      }
    }
  }

  let timerID;

  /**
   * Starts the game timer.
   * No return value.
   */
  function startTimer() {
    if (timerID) {
      clearInterval(timerID);
    }

    let countUp = 0;
    timerID = setInterval(() => {
      if (!checkCollision()) {
        countUp += 1;
        id("current-record").textContent = "Time: " + sectoMinSec(countUp);
      } else {
        clearInterval(timerID);
        calculateRecord(countUp);
        countUp = 0;
      }
    }, 1000);
  }

  /**
   * Converts seconds to minutes and seconds format.
   * @param {number} countUp - The time survived for the most recent game.
   * @returns {string} - The formatted time format.
   */
  function sectoMinSec(countUp) {
    const minutes = Math.floor(countUp / 60);
    const seconds = countUp % 60;
    return `${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)}`;
  }

  /**
   * Calculates and displays the best record.
   * @param {number} countUp - The time survived for the most recent game
   * No return value.
   */
  async function calculateRecord(countUp) {
    let data = await getData("http://localhost:8000/record/" + countUp.toString(), true);
    qs("#best-record").textContent = "Best Record: " + sectoMinSec(parseInt(data));
  }

  /**
   * Fetches data from the given endpoint.
   * @param {string} endPoint - The API endpoint.
   * @param {boolean} isReturnText - Whether the received data is text or JSON.
   * @returns {Promise<Object|string>} The fetched data after error handling.
   */
  async function getData(endPoint, isReturnText) {
    try {
      let data = await fetch(endPoint);
      await statusCheck(data);
      if (isReturnText) {
        data = await data.text();
      } else {
        data = await data.json();
      }
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Checks the status of the response.
   * @param {Response} res - The response object.
   * @throws an error if the response is not ok.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
  }

  /**
   * Checks for collisions between the character and the obstacle.
   * @returns {boolean} True if a collision is detected, false otherwise.
   */
  function checkCollision() {
    let character = qs("#character");
    let obstacle = qs("#obstacle");

    let characterRect = character.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    if (
      characterRect.right > obstacleRect.left &&
      characterRect.left < obstacleRect.right &&
      characterRect.bottom > obstacleRect.top &&
      characterRect.top < obstacleRect.bottom
    ) {
      return true;
    }
    return false;
  }

  /**
   * Generates a new HTML element of the specified type.
   * @param {string} element - The tag name of the element to be created.
   * @returns {Element} The new element.
   */
  function gen(element) {
    return document.createElement(element);
  }

  /**
   * Retrieves an element by its ID.
   * @param {string} id - The ID of the element to retrieve.
   * @returns {Element} The element with the specified ID.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Retrieves the first element that matches the specified CSS selector.
   * @param {string} element - The CSS selector to match.
   * @returns {Element} The first matching element.
   */
  function qs(element) {
    return document.querySelector(element);
  }

})();