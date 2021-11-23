document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelectorAll('.grid__square');
    const span = document.querySelector('.panel__span');
    const h2 = document.querySelector('.panel__h2');

    let direction = 1;
    let score = 0;
    let width = 25;
    let shipActualPosition = 614;
    let destroyedSpaceInvaders = [];
    let leftExtreme = null;
    let rightExtreme = null;
    let level = 2;
    let speed = 400;
    let movement;
    let lengthOfInvadersArray;
    let spamShot;
    let keys = {};
    let spaceInvaders = [
        [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
            56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68],

        [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            30, 31, 32, 33, 36, 37, 38, 41, 42, 43, 44,
            55, 56, 57, 62, 67, 68, 69,
            80, 81, 86, 87, 88, 93, 94,
            105, 112, 119],

        [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            29, 30, 31, 32, 33, 36, 37, 38, 41, 42, 43, 44, 45,
            54, 55, 56, 57, 62, 67, 68, 69, 70,
            79, 80, 81, 85, 86, 87, 88, 89, 93, 94, 95,
            104, 105, 110, 112, 114, 119, 120,
            129, 135, 139, 145,
            160, 164,
            180, 181, 182, 192, 193, 194,
            206, 218]
    ];

    //show ship on board
    grid[shipActualPosition].classList.add('ship');

    //function shows invaders on board 
    function showInvaders() {
        spaceInvaders[level].forEach(element => {
            grid[element].classList.add('invader');
        })
    }

    //function finds extreme values of array
    function findExtreme() {
        //vertical iteration from left side finds first element with class invader
        for (let i = 0; i < width; i++) {
            for (let j = i; j < width * width; j += width) {
                if (grid[j].classList.contains('invader')) {
                    leftExtreme = spaceInvaders[level].findIndex(e => e == j);
                    i = width;
                    break;
                }
            }
        }
        //vertical iteration from right side finds first element with class invader
        for (let i = width - 1; i >= 0; i--) {
            for (let j = i; j < width * width; j += width) {
                if (grid[j].classList.contains('invader')) {
                    rightExtreme = spaceInvaders[level].findIndex(e => e == j);
                    return;
                }
            }
        }
    };

    //function moves invaders every second
    function moveInvaders() {
        const leftCoordinate = spaceInvaders[level][leftExtreme] % width == 0; //left border
        const rightCoordinate = spaceInvaders[level][rightExtreme] % width == (width - 1); //right border 

        //change movement direction of invaders
        if ((leftCoordinate && direction == -1) || (rightCoordinate && direction == 1)) {
            direction = width;
        } else if (leftCoordinate) {
            direction = 1;
        } else if (rightCoordinate) {
            direction = -1;
        }

        //remove actual postions of invaders
        spaceInvaders[level].forEach(element => {
            grid[element].classList.remove('invader');
        })

        //drop position of invaders
        spaceInvaders[level] = spaceInvaders[level].map(element => element += direction);

        //add new position of invaders
        spaceInvaders[level].forEach(element => {
            grid[element].classList.add('invader');
        });

        //stop moving invaders after reaching bottom of board
        if (spaceInvaders[level].find(e => e > 600)) {
            clearInterval(movement);
            span.textContent = score + "|" + lengthOfInvadersArray + " GAME OVER!"
            grid[shipActualPosition].classList.remove('ship');
            span.style.color = 'red';
        }
    }

    //allows moving space and shotting in the same time
    //set object property on true when key is pressed
    document.addEventListener('keydown', e => {
        if (!keys[e.code]) {
            keys[e.code] = true;
        }
    })

    //set object property on false when key is released
    document.addEventListener('keyup', e => {
        keys[e.code] = false;
    })

    //funcion moves ship horizonally
    function shipMove() {
        grid[shipActualPosition].classList.remove('ship');
        if (keys['ArrowRight']) {
            if (shipActualPosition % width < (width - 1)) {
                shipActualPosition += 1;
            }
        } else if (keys['ArrowLeft']) {
            if (!(shipActualPosition % width == 0)) {
                shipActualPosition -= 1;
            }
        }
        grid[shipActualPosition].classList.add('ship');
    }

    //function of shooting
    function shipShot(event) {
        document.removeEventListener('keydown', shipShot); //remove shotting to prevent from spamming
        let shotActualPosition = shipActualPosition; //forget actual position of ship

        //function that animate the shot 
        function shot() {
            grid[shotActualPosition].classList.remove('shot');
            shotActualPosition -= width;
            grid[shotActualPosition].classList.add('shot');

            if (shotActualPosition < width) {
                setTimeout(() => grid[shotActualPosition].classList.remove('shot'), 100);
                clearInterval(shotInterval);
            } else if (spaceInvaders[level].includes(shotActualPosition)) {
                grid[shotActualPosition].classList.remove('shot');
                grid[shotActualPosition].classList.remove('invader');
                spaceInvaders[level] = spaceInvaders[level].filter(element => element != shotActualPosition);
                findExtreme();
                score++;
                span.textContent = score + "|" + lengthOfInvadersArray;
                destroyedSpaceInvaders.push(shotActualPosition);
                clearInterval(shotInterval);

                //after killing all invaders clean a board
                if (destroyedSpaceInvaders.length == lengthOfInvadersArray) {
                    //condition to win a game
                    if (level == 2) {
                        span.textContent = '';
                        h2.textContent = 'YOU WON!'
                        h2.style.color = 'green';
                        cleanGame();
                    } else {
                        cleanGame();
                    }
                }
            }
        }
        // invoke shot function by clicking spacebar
        if (keys['Space']) {
            var shotInterval = setInterval(shot, 50); //animation of shot
        } else if (event.key == ' ') {
            var shotInterval = setInterval(shot, 50); //animation of shot
        }
    }

    //function clears whole game each level
    function cleanGame() {
        destroyedSpaceInvaders = [];
        clearInterval(movement);
        clearInterval(spamShot);
        keys['Space'] = false;
        document.removeEventListener('keydown', shipShot);
        console.log("test")
        direction = 1;
        speed += 100;
        score = 0;
        //3 seconds to be sure that board is empty
        setTimeout(() => {
            level++;
            startGame();
        }, 3000);
    }

    //move ship horizontally
    document.addEventListener('keydown', shipMove);

    //function starts the game every level
    function startGame() {
        lengthOfInvadersArray = spaceInvaders[level].length;
        showInvaders();
        setTimeout(() => {
            findExtreme();
            movement = setInterval(moveInvaders, speed);
        }, 3000);

        //recursive setTimeout to prevent from spamming spacebar
        //add possibility of shooting every 0.6s
        spamShot = setTimeout(function preventSpamming() {
            document.addEventListener('keydown', shipShot);
            if (keys['Space']) {
                shipShot();
            }
            spamShot = setTimeout(preventSpamming, 0);
        }, 3000);
    }

    //function starts whole game
    startGame();
});