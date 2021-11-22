document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelectorAll('.grid__square');
    const span = document.querySelector('span');

    let direction = 1;
    let score = 0;
    let width = 25;
    let shipActualPosition = 614;
    let destroyedSpaceInvaders = [];
    let leftExtreme = null;
    let rightExtreme = null;
    let level = 0;
    let speed = 400;
    let movement;
    let spaceInvaders = [
        [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
         31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
         56, 57, 58, 59, 60, 61, 62, 63, 63, 64, 65, 66, 67, 68],

        [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        30, 31, 32, 33,       36, 37, 38,       41, 42, 43, 44,
        55, 56, 57,               62,               67, 68, 69,
        80, 81,               86, 87, 88,               93, 94,
        105,                     112,                      119],

        [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        29, 30, 31, 32, 33,       36, 37, 38,       41, 42, 43, 44, 45,
        54, 55, 56, 57,               62,               67, 68, 69, 70,
        79, 80, 81,           85 ,86, 87, 88, 89,              93, 94, 95,
        104, 105,            110,    112,     114,               119, 120,
        129,                 135,             139,                     145,
                             160,             164,  
             180, 181, 182,                            192, 193, 194,  
                  206,                                      218]
    ];
    let lengthOfInvadersArray;
    let spamShot;

    //show ship on board
    grid[shipActualPosition].classList.add('ship');

    function showInvaders() {
        //show invaders on board 
        spaceInvaders[level].forEach(element => {
            grid[element].classList.add('invader');
        })
    }

    //find extreme values of array
    function findExtreme() {
        //vertical iteration from left side finds first grid element with class invader
        for (let i = 0; i < width; i++) {
            for (let j = i; j < width * width; j += width) {
                if (grid[j].classList.contains('invader')) {
                    leftExtreme = spaceInvaders[level].findIndex(e => e == j);
                    i = width;
                    break;
                }
            }
        }
        //vertical iteration from right side finds first grid element with class invader
        for (let i = width - 1; i >= 0; i--) {
            for (let j = i; j < width * width; j += width) {
                if (grid[j].classList.contains('invader')) {
                    rightExtreme = spaceInvaders[level].findIndex(e => e == j);
                    return;
                }
            }
        }
    };

    //move invaders every second
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
            span.textContent = score + "|30  GAME OVER!"
            grid[shipActualPosition].classList.remove('ship');
            span.style.color = 'red';
        }
    }

    //ship move
    function shipMove(event) {
        grid[shipActualPosition].classList.remove('ship');
        switch (event.key) {
            case 'ArrowRight':
                if (shipActualPosition % width < (width - 1)) {
                    shipActualPosition += 1;
                }
                break;
            case 'ArrowLeft':
                if (!(shipActualPosition % width == 0)) {
                    shipActualPosition -= 1;
                }
                break;
        }
        grid[shipActualPosition].classList.add('ship');
    }

    //ship shot
    function shipShot(event) {
        let shotActualPosition = shipActualPosition;
        
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
                span.textContent = score + "|27";
                destroyedSpaceInvaders.push(shotActualPosition);
                clearInterval(shotInterval);

                if (destroyedSpaceInvaders.length == lengthOfInvadersArray) {
                    if (level == 3) {
                        span.textContent = "YOU WON!"
                        span.style.color = 'green';
                        clearGame();
                    }
                    level++;
                    clearGame();
                }
            }
        }
        //invoke shot function by clicking spacebar
        if (event.key == ' ') {
            document.removeEventListener('keydown', shipShot);
            //update position of shot 
            var shotInterval = setInterval(shot, 50);
        }
    }

    //clear whole game each level
    function clearGame() {
        destroyedSpaceInvaders = [];
        clearInterval(movement);
        clearInterval(spamShot);
        grid.forEach(element => element.classList.remove('invader'));
        direction = 1;
        speed += 100;
        document.removeEventListener('keydown', shipShot);
        startGame();
    }

    document.addEventListener('keydown', shipMove);

    //function starts the game every level
    function startGame() {
        lengthOfInvadersArray = spaceInvaders[length].length;
        showInvaders();
        setTimeout(() => {
            findExtreme();
            movement = setInterval(moveInvaders, speed);
        }, 3000);

        //recursive setTimeout to prevent from spamming spacebar
        spamShot = setTimeout(function preventSpamming() {
            document.addEventListener('keydown', shipShot);
            setTimeout(preventSpamming, 600);
        }, 3000);
    }

    startGame();
});