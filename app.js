document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelectorAll('.grid__square');
    const span = document.querySelector('span');

    let direction = 1;
    let score = 0;
    let width = 15;
    let shipActualPosition = 217;
    let destroyedSpaceInvaders = [];
    let spaceInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];

    //show invaders on board 
    spaceInvaders.forEach(element => {
        grid[element].classList.add('invader');
    })

    //show ship on board
    grid[shipActualPosition].classList.add('ship');

    //move invaders every second
    function moveInvaders() {
        const leftCoordinate = spaceInvaders[0] % width == 0; //left boarder
        console.log(leftCoordinate)
        const rightCoordinate = spaceInvaders[spaceInvaders.length - 1] % width == (width - 1); //right border 
        //change movement direction of invaders
        if ((leftCoordinate && direction == -1) || (rightCoordinate && direction == 1)) {
            direction = width;
        } else if (leftCoordinate) {
            direction = 1;
        } else if (rightCoordinate){
            direction = -1;
        }
        //remove actual postions of invaders
        spaceInvaders.forEach(element => {
            grid[element].classList.remove('invader');
        })
        //drop position of invaders
        spaceInvaders = spaceInvaders.map(element => element += direction);
        //add new position of invaders
        spaceInvaders.forEach(element => {
            grid[element].classList.add('invader');
        });
    }

    //ship move
    function shipMove(event){
        grid[shipActualPosition].classList.remove('ship');
        switch(event.key){
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
    function shipShot(event){
        document.removeEventListener('keydown', shipShot);
        setTimeout(() => document.addEventListener('keydown', shipShot), 100);
        
        let shotActualPosition = shipActualPosition;
        function shot (eve){
            grid[shotActualPosition].classList.remove('shot');
            shotActualPosition -= width;
            grid[shotActualPosition].classList.add('shot');

            if (shotActualPosition < 15) {
                
                setTimeout(() => grid[shotActualPosition].classList.remove('shot'), 100);
                clearInterval(shotInterval);
            } else if (spaceInvaders.includes(shotActualPosition)){
                grid[shotActualPosition].classList.remove('shot');
                grid[shotActualPosition].classList.remove('invader');
                destroyedSpaceInvaders.push(shotActualPosition);
                spaceInvaders = spaceInvaders.filter(element => element != shotActualPosition);
                spaceInvaders.
                score++;
                span.textContent = score + "|30";
                clearInterval(shotInterval);
                if (destroyedSpaceInvaders.length == spaceInvaders.length){
                    span.textContent = "YOU WON!"
                    clearInterval(movement);
                }
            }
        }
        //invoke shot function by clicking spacebar
        if (event.key == ' '){
            //update position of shot 
            var shotInterval = setInterval(shot, 100); 
        }

    }

    document.addEventListener('keydown', shipMove);
    document.addEventListener('keydown', shipShot);
    let movement = setInterval(moveInvaders, 1000);

});