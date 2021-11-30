document.addEventListener('DOMContentLoaded', () => {

    //board elements
    const grid = document.querySelectorAll('.grid__square');
    const span = document.querySelector('.panel__span');
    const h2 = document.querySelector('.panel__h2');
    const meteorSpace = document.querySelector('.space');
    const btnShip = document.querySelector('.btns__ship');
    const btnInvader = document.querySelector('.btns__invader');

    //CSS menu elements
    const defaultLevel = document.querySelector('.menu__default');
    const chooseLevel = document.querySelector('.menu__title');
    const levelBox = document.querySelector('.menu__levels');
    const levels = document.querySelectorAll('.lvl');
    const firstLevel = document.querySelector('.menu__choose1');
    const secondLevel = document.querySelector('.menu__choose2');
    const thirdLevel = document.querySelector('.menu__choose3');
    const startButton = document.querySelector('.menu__start');
    const resetButton = document.querySelector('.reset');
    const countdownValue = document.querySelector('.countdown__value')
    const showMenu = document.querySelector('.menu');
    
    //sounds
    let shipSound = new Audio('./sounds/shot.mp3');
    let invaderSound = new Audio('./sounds/invader.mp3');
    let changeSound = new Audio('./sounds/change.mp3');
    let startSound = new Audio('./sounds/start-game.wav');
    let shipSoundPlays = true;
    let invaderSoundPlays = true;

    let direction = 1;
    let score = 0;
    let width = 25;
    let shipActualPosition = 612;
    let destroyedSpaceInvaders = [];
    let leftExtreme = null;
    let rightExtreme = null;
    let level = 0;
    let speedOfInvaders = 50;
    let speedOfShot = 800;
    let lengthOfInvadersArray;
    let spamShot;
    let keys = {};
    const spaceInvadersOrginal = [
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

    //copy array
    let spaceInvaders = spaceInvadersOrginal.slice(0);

    //---------------------------MAIN MENU-------------------------------
    let defaultOption = true;
    let levelOption = false;
    let choosenLevel = 1;
    let colorArray = ['inset 0 0 5px rgb(0, 255, 0)', 'inset 0 0 5px rgb(217, 255, 0)', 'inset 0 0 5px rgb(255, 0, 0)'];
    let shadowArray = ['inset 0 0 5px rgb(0, 255, 0), inset 0 0 20px rgb(0, 255, 0)',
                      'inset 0 0 5px rgb(217, 255, 0), inset 0 0 20px rgb(217, 255, 0)',
                      'inset 0 0 5px rgb(255, 0, 0), inset 0 0 20px rgb(255, 0, 0)'];

    //function style default button
    function toggleDefault () {
        if (!defaultOption && levelOption) {
           changeSound.play();
           defaultLevel.style.color = 'rgb(29, 255, 29)';
           defaultLevel.style.boxShadow = 'inset 0 0 5px rgb(29, 255, 29), inset 0 0 10px rgb(29, 255, 29)';
           defaultLevel.style.border = '2px solid rgb(29, 255, 29)';
           chooseLevel.style.color = 'white';
           chooseLevel.style.boxShadow = 'inset 0 0 5px white, inset 0 0 10px white';
           chooseLevel.style.border = '2px solid white';
           levelBox.style.visibility = 'hidden';
           levelBox.style.opacity = '0';
           defaultOption = true;
           levelOption = false;
           level = 0;
       }
   }

    //function style level button
    function toggleLevel () {
        if (!levelOption && defaultOption) {
            changeSound.play();
            chooseLevel.style.color = 'rgb(29, 255, 29)';
            chooseLevel.style.boxShadow = 'inset 0 0 5px rgb(29, 255, 29), inset 0 0 10px rgb(29, 255, 29)';
            chooseLevel.style.border = '2px solid rgb(29, 255, 29)';
            defaultLevel.style.color = 'white';
            defaultLevel.style.boxShadow = 'inset 0 0 5px white, inset 0 0 10px white';
            defaultLevel.style.border = '2px solid white';
            levelBox.style.visibility = 'visible';
            levelBox.style.opacity = '1';
            defaultOption = false;
            levelOption = true;
        }
    }

    defaultLevel.addEventListener('click', toggleDefault);
    chooseLevel.addEventListener('click', toggleLevel);

    //function change level, clean other selected level buttons
    function chooseLevelFunction () {
        changeSound.play();
        level = this.innerHTML - 1;
        for (let i = 0; i < 3; i++) {
            if (level != i) {
                levels[i].style.boxShadow = colorArray[i]
            }
        }
        this.style.boxShadow = shadowArray[level];
    }

    //function countdown 
    function showCountdown() {
        //resetButton.removeEventListener('click', resetFunction);
        showInvaders();
        let x = 3;
        let countdownInterval = setTimeout(function showCountdownInterval() {
            countdownValue.innerHTML = x;
            if (x == 0) {
                clearInterval(countdownInterval);
                countdownValue.innerHTML = '';
                startGame();
            } else {
                countdownInterval = setTimeout(showCountdownInterval, 1000);
            }
            x--; 
        }, 1000)
    }

    //function clears whole game each level
    function resetGame() {
        destroyedSpaceInvaders = [];
        clearInterval(spamShot);
        keys['Space'] = false;
        document.removeEventListener('keydown', shipShot);
        cancelAnimationFrame(rAFMoveInvaders);
        h2.style.color = 'white';
        span.style.color = 'white';
        startMoveInvaders = null;
        direction = 1;
        score = 0;
        span.textContent = score;
        defaultOption = false;
        levelOption = true;
        spaceInvaders = spaceInvadersOrginal.slice(0);
        toggleDefault();
        hideInvaders();
    }
    
    //function of reset button
    function resetFunction() {
        endMeteors = false;
        resetGame();
        resetButton.removeEventListener('click', resetFunction);
        startMeteors();
        showMenu.style.visibility = 'visible';
        level = 0;
    }

    //listeners on each level button
    firstLevel.addEventListener('click', chooseLevelFunction);
    secondLevel.addEventListener('click', chooseLevelFunction);
    thirdLevel.addEventListener('click', chooseLevelFunction);

    //listener to start the game
    startButton.addEventListener('click', () => {
        startSound.play();
        showMenu.style.visibility = 'hidden';
        levelBox.style.visibility = 'hidden';
        clearInterval(meteorsInterval);
        showCountdown();
    });

    //---------------------SOUND SHOT/INVADER------------------------

    function toggleShip(e) {
        changeSound.play();
        if (btnShip.classList.contains('green')){
            this.classList.remove('green');
            this.classList.add('red');
            shipSound = false;
        } else {
            this.classList.remove('red');
            this.classList.add('green');
            shipSound = true;
        }
        e.target.blur();
    }

    function toggleInvader(e) {
        changeSound.play();
        if (btnInvader.classList.contains('green')){
            this.classList.remove('green');
            this.classList.add('red');
            invaderSound = false;
        } else {
            this.classList.remove('red');
            this.classList.add('green');
            invaderSound = true;
        }
        e.target.blur();
    }

    btnShip.addEventListener('click', toggleShip);
    btnInvader.addEventListener('click', toggleInvader);

    //---------------------ANIMATION OF METEORS------------------------
    let randomTime = 5;
    let randomPosition = 50;
    let meteorsInterval;
    let endMeteors = false;

    //function generate random position and duration time of meteor
    function generateRandom() {
        randomTime = Math.floor(Math.random() * 7) + 5;
        randomPosition = Math.floor(Math.random() * 98) + 1;
    }

    function startMeteors() {
        function newMeteor() {
            generateRandom()
            const newElement = document.createElement('div');
            newElement.classList.add('meteor');
            newElement.style.left = randomPosition + "%";
            newElement.style.animationDuration = randomTime + "s";
            newElement.style.opacity = 0.6;
            meteorSpace.appendChild(newElement);
            setTimeout(() => { meteorSpace.removeChild(meteorSpace.childNodes[0]) }, 13000); //remove element from html
            if (endMeteors) {
                clearInterval(meteorsInterval);
            }
        }
        meteorsInterval = setInterval(newMeteor, 400);
    }


    //-------------------------------------------------------------------

    //variables of requestAnimationFrame
    let startMoveInvaders = undefined;
    let rAFMoveInvaders;

    //show ship on board
    grid[shipActualPosition].classList.add('ship');

    //function shows invaders on board 
    function showInvaders() {
        spaceInvaders[level].forEach(element => {
            grid[element].classList.add('invader');
        })
    }

    //function hide invaders on board 
    function hideInvaders() {
        grid.forEach(element => {
            element.classList.remove('invader');
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
    function moveInvaders(timestampMoveInvaders) {
        if (!startMoveInvaders) {
            startMoveInvaders = timestampMoveInvaders;
        }
        var elapsedMoveInvaders = timestampMoveInvaders - startMoveInvaders;

        if (elapsedMoveInvaders > speedOfInvaders) {
            startMoveInvaders = timestampMoveInvaders;
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
                clearInterval(spamShot);
                document.removeEventListener('keydown', shipShot);
                span.textContent = score + "|" + lengthOfInvadersArray + " GAME OVER!"
                grid[shipActualPosition].classList.remove('ship');
                span.style.color = 'red';
                return;
            }
        }
        rAFMoveInvaders = requestAnimationFrame(moveInvaders);
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
        let shotActualPosition = shipActualPosition; //remember actual position of ship

        //function that animate the shot 
        function shot() {
            //move bullet one square

            grid[shotActualPosition].classList.remove('shot');
            shotActualPosition -= width;
            grid[shotActualPosition].classList.add('shot');

            //if bullet is apart form board or invaders got shot 
            if (shotActualPosition < width && !grid[shotActualPosition].classList.contains('invader')) {
                setTimeout(() => grid[shotActualPosition].classList.remove('shot'), 100);
                clearInterval(shotInterval);
            } else if (spaceInvaders[level].includes(shotActualPosition)) {
                grid[shotActualPosition].classList.remove('shot'); //remove shot from board
                grid[shotActualPosition].classList.remove('invader'); //remove invader from board
                spaceInvaders[level] = spaceInvaders[level].filter(element => element != shotActualPosition); //update array
                findExtreme(); //find left and right extreme position of invaders
                score++;
                span.textContent = score + "|" + lengthOfInvadersArray;
                destroyedSpaceInvaders.push(shotActualPosition); //update array of killed invaders
                clearInterval(shotInterval);

                //after killing all invaders clean a board
                if (destroyedSpaceInvaders.length == lengthOfInvadersArray) {
                    //condition to win a game
                    if (level == 2) {
                        span.textContent = '';
                        h2.textContent = 'YOU WON!'
                        h2.style.color = 'rgb(29, 255, 29)';
                        cleanGame();
                    } else {
                        level++;
                        cleanGame();
                    }
                }
            }
        }
        // invoke shot function by clicking spacebar
        if (keys['Space']) {
            // if(shipSound) {
            //     shotSound.play();
            // }
            var shotInterval = setInterval(shot, 50); //animation of shot
        } else if (event.key == ' ') {
            // if(shipSound) {
            //     shotSound.play();
            // }
            var shotInterval = setInterval(shot, 50); //animation of shot
        }
    }

    //function clears whole game each level
    function cleanGame() {
        destroyedSpaceInvaders = [];
        clearInterval(spamShot);
        keys['Space'] = false;
        document.removeEventListener('keydown', shipShot);
        cancelAnimationFrame(rAFMoveInvaders);
        startMoveInvaders = null;
        direction = 1;
        score = 0;
        if (level != 3) {
            showCountdown();
        }
    }

    //move ship horizontally
    document.addEventListener('keydown', shipMove);

    //function starts the game every level
    function startGame() {
        lengthOfInvadersArray = spaceInvaders[level].length;
        //showInvaders();
        setTimeout(() => {
            findExtreme();
            requestAnimationFrame(moveInvaders);
            resetButton.addEventListener('click', resetFunction); //enable reset button
        }, 1000);

        // recursive setTimeout to prevent from spamming spacebar
        // add possibility of shooting every 0.6s
        spamShot = setTimeout(function preventSpamming() {
            document.addEventListener('keydown', shipShot);
            if (keys['Space']) {
                shipShot();
            }
            spamShot = setTimeout(preventSpamming, 700);
        }, 1000);
    }

    startMeteors();
});