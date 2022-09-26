document.addEventListener("DOMContentLoaded", function() {
    let main_game = document.querySelector(".main-game");

    main_game.style.height = (window.innerHeight - 225).toString() + "px";

    let snake_top  = 250,
        snake_left = (window.innerWidth / 4);
    for (let i = 0; i < 4; i++) {
        let snake_piece = document.createElement("div");

        if (i == 0) {
            snake_piece.classList.add("snake-head");
            snake_piece.style.top  = snake_top.toString() + "px";
            snake_piece.style.left = snake_left.toString() + "px";
        } else {
            snake_piece.classList.add("snake-body");
            snake_piece.style.top  = (snake_top + (17 * i)).toString() + "px";
            snake_piece.style.left = snake_left.toString() + "px";
        }

        main_game.appendChild(snake_piece);
    }

    let tasty_bit = document.createElement("div");
    tasty_bit.classList.add("tasty-bit");
    tasty_bit.style.top  = (window.innerHeight / 2).toString() + "px";
    tasty_bit.style.left = (window.innerWidth / 2).toString() + "px";
    main_game.appendChild(tasty_bit);

    

    let snake_x_speed = 0,
        snake_y_speed = -1;

    let snake_head = document.querySelector(".snake-head");        
    function move_snake() {
        
        if (snake_x_speed == 1 || snake_x_speed == -1) {
            snake_head.style.left += (17 * snake_x_speed).toString() + "px";
        } else {
            snake_head.style.top  += (17 * snake_y_speed).toString() + "px";
        }
    }

    
    let lastTime = Date.now(),
        newTime  = Date.now();

    function repeatOften(time) {
        newTime = Date.now();
        
        if (newTime - lastTime >= 570) {
            if (snake_head.offsetTop + (17 * snake_y_speed) >= 75) {
                console.log("GO")
                snake_head.style.top = (snake_head.offsetTop + (17 * snake_y_speed)).toString() + "px";
            }
            lastTime = Date.now();
        }
        requestAnimationFrame(repeatOften);
    }

    requestAnimationFrame(repeatOften);
});