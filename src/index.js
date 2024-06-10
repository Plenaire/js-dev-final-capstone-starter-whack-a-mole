// Query Selectors

const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('#start');
const score=  document.querySelector('score');
const timerDisplay = document.querySelector('timer');
const difficultyButtons = document.querySelectorAll('.difficulty');

// Music and Sound
const basePath = 'https://jpaktoon.github.io/whack-a-ghost';
const audioHit = new Audio(`${basePath}/assets/hitEffect.mp3`);
const song = new Audio(`${basePath}/assets/moguri.mp3`);
const endsong = new Audio(`${basePath}/assets/gameOver.mp3`);

let time = 0;
let timer;
let lastHole = 0;
let points = 0;
let difficulty = "normal";

/**
 * Generates a random integer within a range.
 *
 * The function takes two values as parameters that limits the range 
 * of the number to be generated. For example, calling randomInteger(0,10)
 * will return a random integer between 0 and 10. Calling randomInteger(10,200)
 * will return a random integer between 10 and 200.
 *
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sets the time delay given a difficulty parameter.
 *
 * The function takes a `difficulty` parameter that can have three values: `easy`
 * `normal` or `hard`. If difficulty is "easy" then the function returns a time delay
 * of 1500 milliseconds (or 1.5 seconds). If the difficulty is set to "normal" it should
 * return 1000. If difficulty is set to "hard" it should return a randomInteger between
 * 600 and 1200.
 *
 * Example: 
 * setDelay("easy") //> returns 1500
 * setDelay("normal") //> returns 1000
 * setDelay("hard") //> returns 856 (returns a random number between 600 and 1200).
 *
 */
function setDelay(difficulty) {
  if (difficulty === "easy") {
      return 1500;
  } else if (difficulty === "normal") {
      return 1000;
  } else if (difficulty === "hard") {
      return randomInteger(600, 1200);
  }
}

/**
 * Chooses a random hole from a list of holes.
 *
 * This function should select a random Hole from the list of holes.
 * 1. generate a random integer from 0 to 8 and assign it to an index variable
 * 2. get a random hole with the random index (e.g. const hole = holes[index])
 * 3. if hole === lastHole then call chooseHole(holes) again.
 * 4. if hole is not the same as the lastHole then keep track of 
 * it (lastHole = hole) and return the hole
 *
 * Example: 
 * const holes = document.querySelectorAll('.hole');
 * chooseHole(holes) //> returns one of the 9 holes that you defined
 */
function chooseHole(holes) {
    let index = randomInteger(0, 8); // Generates a random integer from 0 to 8 and assign it to an index variable.
    let hole = holes[index]; // Gets a random hole with the random index (e.g., const hole = holes[index])
    if (hole === lastHole) {
        chooseHole(holes); // If hole === lastHole, then call chooseHole(holes) again because you don't want to return the same hole
    } else {
        lastHole = hole; // If hole is not the same as the lastHole, then keep track of it (lastHole = hole) and return the hole
        return hole;
    }

}

/**
 * The following Disables the buttons so the game can be played without misclicking
 */
function disableButtons() {
    // Disable the start button
    startButton.disabled = true;


    difficultyButtons.forEach(button => {
        // Disable all difficulty buttons
        button.disabled = true;
    });
}

/**
 *
 * This function is called after the game stops
 * Afterward, the user can replay the game.
 *
 */
function enableButtons() {
    // Enable the start button
    startButton.disabled = false;

    // Disable all difficulty buttons
    difficultyButtons.forEach(button => {
        button.disabled = false;
    });
}

/**
*
* Calls the showUp function if time > 0 and stops the game if time = 0.
*
* The purpose of this function is simply to determine if the game should
* continue or stop. The game continues if there is still time `if(time > 0)`.
* If there is still time then `showUp()` needs to be called again so that
* it sets a different delay and a different hole. If there is no more time
* then it should call the `stopGame()` function. The function also needs to
* return the timeoutId if the game continues or the string "game stopped"
* if the game is over.
*
*  // if time > 0:
*  //   timeoutId = showUp()
*  //   return timeoutId
*  // else
*  //   gameStopped = stopGame()
*  //   return gameStopped
*
*/
function gameOver() {
    if (time > 0) {
        const timeoutId = showUp();
        return timeoutId;
    } else {
        const gameStopped = stopGame();
        return gameStopped;
    }
}

/**
*
* Calls the showAndHide() function with a specific delay and a hole.
*
* This function simply calls the `showAndHide` function with a specific
* delay and hole. The function needs to call `setDelay()` and `chooseHole()`
* to call `showAndHide(hole, delay)`.
*
*/

/**
 * This sets the default difficulty button to active
 */
function setDefaultDifficulty() {
    // Find the default button
    const defaultButton = Array.from(difficultyButtons).find(
        (btn) => btn.dataset.difficulty === difficulty
    );

    // Add the 'active' class to the "Normal" button
    defaultButton.classList.add("active");
}

/**
 * This sets the click event listener to all the difficulty buttons
 */
function setDifficultyEventListeners() {
    // Add event listener to each button
    difficultyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove the 'active' class from all buttons
            difficultyButtons.forEach((btn) => btn.classList.remove("active"));

            // Add the 'active' class to the clicked button
            button.classList.add("active");

            // Get the data-difficulty value of the clicked button
            // and set the global difficulty
            difficulty = button.dataset.difficulty;
        });
    });
}

function showUp() {
  let delay = setDelay(difficulty); // Updates so that it uses setDelay()
  const hole = chooseHole(holes);  // Updates so that it uses chooseHole()
  return showAndHide(hole, delay);
}

/**
*
* The purpose of this function is to show and hide the mole given
* a delay time and the hole where the mole is hidden. The function calls
* `toggleVisibility` to show or hide the mole. The function should return
* the timeoutID
*
*/
function showAndHide(hole, delay){
    // Calls upon the toggleVisibility to add the 'show' class
    toggleVisibility(hole);
  
  const timeoutID = setTimeout(() => {
      // Calls upon the toggleVisibility to remove the 'show' class when the timer runs out
      toggleVisibility(hole);
      gameOver();
  }, delay);
  return timeoutID;
}

/**
*
* Adds or removes the 'show' class that is defined in styles.css to 
* a given hole. It returns the hole.
*
*/
function toggleVisibility(hole){
    hole.classList.toggle("show");
    return hole;
}

/**
*
* This function increments the points global variable and updates the scoreboard.
* Use the `points` global variable that is already defined and increment it by 1.
* After the `points` variable is incremented proceed by updating the scoreboard
* that you defined in the `index.html` file. To update the scoreboard you can use 
* `score.textContent = points;`. Use the comments in the function as a guide 
* for your implementation:
*
*/
function updateScore() {
    points++; // Increment the points global variable by 1 point
    score.textContent = points; // Update score.textContent with points.
    return points;
}

/**
*
* This function clears the score by setting `points = 0`. It also updates
* the board using `score.textContent = points`. The function should return
* the points.
*
*/
function clearScore() {
    points = 0; // Sets the variable to 0
    score.textContent = points; // Update score.textContent with reset points.
    return points;
}

/**
*
* Updates the control board with the timer if time > 0
*
*/
function updateTimer() {
    if (time > 0) {
        time -= 1;
        timerDisplay.textContent = time;
    }

    // Apply styles based on the remaining time
    if (time < 4) {
        alertTimer();
    } else {
        normalTimer();
    }

    return time;
}

function normalTimer() {
    // White with no animation
    timerDisplay.style.color = 'white';
    timerDisplay.style.animation = 'none';
}

function alertTimer() {
    // Makes the timer blink
    timerDisplay.style.color = 'red';
    timerDisplay.style.animation = 'blink 1s infinite';
}

/**
*
* Starts the timer using setInterval. For each 1000ms (1 second)
* the updateTimer function get called. This function is already implemented
*
*/
function startTimer() {
    timer = setInterval(updateTimer, 1000);
    return timer;
}

/**
*
* This is the event handler that gets called when a player
* clicks on a mole. The setEventListeners should use this event
* handler (e.g. mole.addEventListener('click', whack)) for each of
* the moles.
*
*/
function whack(event) {
    playAudio(audioHit);
    updateScore();
    return points;
}

/**
*
* Adds the 'click' event listeners to the moles. See the instructions
* for an example on how to set event listeners using a for loop.
*/
function setEventListeners() {
    // forEach mole, add the whack event handler when the player clicks on the mole.
    moles.forEach((mole) => mole.addEventListener("click", whack));

    return moles;
}

/**
*
* This function sets the duration of the game. The time limit, in seconds,
* that a player has to click on the sprites.
*
*/
function setDuration(duration) {
  time = duration;
  return time;
}

/**
*
* This function is called when the game is stopped. It clears the
* timer using clearInterval. Returns "game stopped".
*
*/
function stopGame(){
    stopAudio(song);  // Stops the normal game music song
    playAudio(endsong); // Plays the gameover song
    clearInterval(timer); // clears the timer interval
    enableButtons(); // Enables the start button
    return "game stopped";
}

/**
*
* This is the function that starts the game when the `startButton`
* is clicked.
*
*/
function startGame(){
    clearScore(); // Clears previous/current score
    setEventListeners(); // Sets the event listeners for the moles
    startTimer(); // Starts the timer
    setDuration(10); // Sets the duration
    playLoopedAudio(song); // Starts the audio loop
    disableButtons(); // Disable start button
    showUp(); // Game starts

  return "game started";
}

setDefaultDifficulty();
setDifficultyEventListeners();

startButton.addEventListener("click", startGame);


// Please do not modify the code below.
// Used for testing purposes.
window.randomInteger = randomInteger;
window.chooseHole = chooseHole;
window.setDelay = setDelay;
window.startGame = startGame;
window.gameOver = gameOver;
window.showUp = showUp;
window.holes = holes;
window.moles = moles;
window.showAndHide = showAndHide;
window.points = points;
window.updateScore = updateScore;
window.clearScore = clearScore;
window.whack = whack;
window.time = time;
window.setDuration = setDuration;
window.toggleVisibility = toggleVisibility;
window.setEventListeners = setEventListeners;
