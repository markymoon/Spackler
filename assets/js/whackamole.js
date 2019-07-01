const moles        = document.querySelectorAll('.mole');                // get all moles
const resetButton  = document.querySelector('[data-action="reset"]');
const startButton  = document.querySelector('[data-action="start"]');
const stopButton   = document.querySelector('[data-action="stop"]');
const scoreDefault = 0;
const timerDefault = 60;

let isGameOver     = Boolean;
let isRunning      = Boolean;
let isStopped      = Boolean;
let score          = 0;
let scoreDisplay   = document.querySelector('#score');
let timeRemaining  = timerDefault;
let timerDisplay   = document.querySelector('#timer');

let activeMoles;
let interval;
let launchControl;
let randomMole;
let timeVisible;

// Set initial score and timer values
function initGame(){
    activeMoles            = 0;
    isRunning              = false;
    isGameOver             = true;
    isStopped              = false;
    score                  = scoreDefault;
    scoreDisplay.innerHTML = padNumber(score);   // show default score
    timeRemaining          = timerDefault;   // set time remaining
    timerDisplay.innerHTML = timeRemaining;  // show default time
    removeTimeWarning();
    clearMoles();
}

/*
        Timer Functions
*/

function startTimer() {
    if (isRunning && !isStopped) return;            // Game is already running and not paused - ignore additional start

    if (!isRunning && isGameOver){                  //  START NEW GAME
        initGame();
    }

    isRunning  = true;
    isGameOver = false;
    isStopped  = false;
    interval   = setInterval(decrementTimer, 1000);

    startGame();
}

function stopTimer() {
    if (!isRunning) return;

    clearInterval(interval);
    clearInterval(launchControl);
    clearMoles();
    isStopped = true;
}

function resetGame() {
    clearInterval(interval);
    clearInterval(launchControl);
    initGame();
}

function gameOver() {
    isRunning  = false;
    isGameOver = true;
    clearInterval(interval);
    clearInterval(launchControl);
    clearMoles();
}

function decrementTimer() {
    --timeRemaining;

    // If less than 10 seconds remain, change color to red
    if (timeRemaining < 10) {
        addTimeWarning();
        padNumber(timeRemaining);
    }

    // Check to see whether time has run out
    if (timeRemaining < 0) { 
        timerDisplay.innerHTML = "Game Over";
        gameOver();
        return;
    }
    
    timerDisplay.innerHTML = padNumber(timeRemaining);                  // Update timer display
}

function padNumber(number) {                                            // add leading zero to a number if less than 10
    return (number < 10) ? '0' + number : number;
}

function addTimeWarning() {                                             // adds warning class to timer
    warning = document.getElementById('timer');
    warning.className = " warning";
}

function removeTimeWarning() {                                          // removes warning class from timer
    warning = document.getElementById('timer');
    warning.className -= " warning";
}

/*
        Gameplay functions
*/

function startGame() {
    // add starter mole
    randomMole = chooseRandomMole();
    addMole(randomMole);
    launchControl = setInterval(maybeLaunchMole, 750);
}

function maybeLaunchMole() {
    if (activeMoles < 3) {                                             // Maximum of 3 active moles... if < 3 we might launch a mole
        shouldLaunchMole = Math.floor(Math.random() * (2 - 0));        // Randomizing whether we launch a mole on this interval

        if (shouldLaunchMole == 1) {                                   // Launch a mole!!!
            // choose a random mole to activate
            randomMole = chooseRandomMole();
            
            addMole(randomMole);
        } else {                                                       // No moles launched this time 
            return;
        }
    } else {
        return;
    }
}

function addMole(id) {                                                  // Launch a mole
    timeVisible = Math.floor(Math.random() * 5 + 1 ) * 1000;
    newMole = document.getElementById('mole-' + id);
    newMole.className += ' active';

    ++activeMoles;

    setTimeout(function() {
        recallMole(id)
    }, timeVisible);
}

function recallMole(id) {                                               // Hide a specific mole
    document.getElementById('mole-' + id).className = 'mole';

    return --activeMoles;
}

function clearMoles() {                                                 // removes all moles from game view
    for (i = 0; i < moles.length; i++) {
        // remove active class from all moles
        moles[i].className = 'mole';
    }
}

function whackAMole(id) {                                           // the rodent has been dispatched! - "Au revoir, gopher" ~ Jean Paul Sartre
    document.getElementById(id).className = 'mole';
    incrementScore();
}

function incrementScore() {                                         // increase score and update score display
    score++;
    scoreDisplay.innerHTML = padNumber(score);
}

function chooseRandomMole() {                                       // choose a random mole to activate
    var randomMole = Math.floor(Math.random() * (10 - 0)) + 1;
    
    let checkActive = document.querySelector("#mole-" + randomMole + ".active");    // check to see if this mole is already active
    return randomMole;
}

initGame();

/*   Button Event Listeners   */
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click',  stopTimer);
resetButton.addEventListener('click', resetGame);

/*   Add Event Listeners to all moles   */
for (i = 0; i < moles.length; i++) {
    moles[i].addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = e.target;
        
        if (target.matches) {
            if (target.matches('.active')) {
                whackAMole(target.id);
            }
        } else if (target.msMatchesSelector) {          // matches target for IE11
            if (target.msMatchesSelector('.active')) {
                whackAMole(target.id);
            }
        }
    });
}
