const molehills = document.querySelectorAll('.molehill');
console.log({molehills});

let score = 0;
// let scoreDisplay   = document.querySelector("#score");



function clearMoles() {
    console.log("clearMoles()");
    var moles = document.getElementsByClassName('active');
    console.log({moles});

    for (i=0; i < moles; i++) {
        console.log("removing active moles!");
        moles[i].className = 'molehill';
    }
}

function initGame() {
    console.log("initGame();");
    resetScore();
    clearMoles();
}

function resetScore() {
    // score = scoreDefault;
    console.log({score});
}

function testAddAMole(num) {
    console.log({num});
}

initGame();
// testAddAMole(3);

document.getElementById("score").innerHTML = score;

// Add Event Listeners to all molehills
for (i = 0; i < molehills.length; i++) {
    molehills[i].addEventListener('click', function (e) {
        e.preventDefault();
        console.log("molehill["+ molehills.id + "] was clicked!");
    })
}