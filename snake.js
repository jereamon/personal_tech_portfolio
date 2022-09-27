document.addEventListener("DOMContentLoaded", function() {
    let main_game = document.querySelector(".main-game");

    main_game.style.height = (window.innerHeight - 225).toString() + "px";
    

    let snake_speed = 1,
        snake_x_dir = 0,
        snake_y_dir = -1,
        key_left    = document.querySelector(".keypad-cls-2.left"),
        key_right   = document.querySelector(".keypad-cls-2.right"),
        key_up      = document.querySelector(".keypad-cls-2.up"),
        key_down    = document.querySelector(".keypad-cls-2.down")

    let snake_head = document.querySelector(".snake-head");

    //#region Event listeners for the game keypad
    key_left.addEventListener("click", () => {
        console.log("left");
        if (snake_x_dir != 1) {
            snake_x_dir = -1;
            snake_y_dir = 0;
        }
    })

    key_right.addEventListener("click", () => {
        console.log("right");
        if (snake_x_dir != -1) {
            snake_x_dir = 1;
            snake_y_dir = 0;
        }
    })

    key_up.addEventListener("click", () => {
        console.log("up");
        if (snake_y_dir != 1) {
            snake_y_dir = -1;
            snake_x_dir = 0;
        }
    })

    key_down.addEventListener("click", () => {
        console.log("down");
        if (snake_y_dir != -1) {
            snake_y_dir = 1;
            snake_x_dir = 0;
        }
    })
    //#endregion Event listeners for the game keypad


    function move_snake() {
        let snake_body = document.querySelectorAll(".snake-body");


        // This gets a little weird.
        // First we check if the snake is traveling to the left or right
        if (snake_x_dir == 1 || snake_x_dir == -1) {
                let pos_after_move = snake_body[0].offsetTop + ((17 * snake_speed) * snake_x_dir);

                // if the snake is traveling left or right and isn't too close
                // to the edge to move again.
                if (pos_after_move >= 0 || pos_after_move <= window.innerWidth) {
                    // we move the snake head in the direction of snake_x_dir
                    snake_body[0].style.left = (snake_body[0].offsetLeft + ((17 * snake_speed) * snake_x_dir)).toString() + "px";

                    // Then we loop over each body piece
                    for (let i = 1; i < snake_body.length; i++) {
                        // if the piece is above the snake's head we move it down
                        if (snake_body[i].style.top < snake_body[i - 1].style.top) {
                            snake_body[i].style.top = (snake_body[i].offsetTop + ((17 * snake_speed))).toString() + "px";
                        
                        // if the piece is below the snake's head we move it up
                        } else if (snake_body[i].style.top > snake_body[i - 1].style.top) {
                            snake_body[i].style.top = (snake_body[i].offsetTop + ((-17 * snake_speed))).toString() + "px";

                        // otherwise we move it left or right in the direction of snake_x_dir
                        } else {
                            snake_body[i].style.left = (snake_body[i].offsetLeft + ((17 * snake_speed) * snake_x_dir)).toString() + "px";
                        }
                    }
                }
        } else {
            let pos_after_move = (snake_body[0].offsetTop + ((17 * snake_speed)) * snake_y_dir);

            if (pos_after_move >= 75 && pos_after_move <= (window.innerHeight - 150)) {
                snake_body[0].style.top  = (snake_body[0].offsetTop + (17 * snake_speed * snake_y_dir)).toString() + "px";

                for (let i = 1; i < snake_body.length; i++) {
                    if (snake_body[i].style.left < snake_body[i - 1].style.left) {
                        snake_body[i].style.left = (snake_body[i].offsetLeft + ((17 * snake_speed))).toString() + "px";
                    } else if (snake_body[i].style.left > snake_body[i - 1].style.left) {
                        snake_body[i].style.left = (snake_body[i].offsetLeft + ((-17 * snake_speed))).toString() + "px";
                    } else {
                        snake_body[i].style.top = ((snake_body[i].offsetTop + (17 * snake_speed * snake_y_dir)) ).toString() + "px";
                    }
                }
            }
        }
    }

    

    let move_last  = Date.now(),
        new_time   = Date.now(),
        audio_last = Date.now(),
        audio      = new Audio('drums_trimmed.wav'),
        play       = false,
        start_button_container = document.querySelector(".start_button_container");

    function repeatOften(time) {
        new_time = Date.now();
        // console.log(newTime - lastTime);
        if (play == true) {
            if (new_time - move_last >= 565) {
                move_snake();

                move_last = Date.now();
            }
            if (new_time - audio_last >= 18266 ) {
                audio.play()
            }
        }

        requestAnimationFrame(repeatOften);
    }

    requestAnimationFrame(repeatOften);

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState != 'visible') {
            play = false;    
            audio.pause();
            start_button_container.style.display = "flex";
        }
    })

    document.querySelector(".start_button").addEventListener('click', () => {
        play = true;
        audio.play();
        start_button_container.style.display = "none";
    });

    document.querySelector(".pause").addEventListener('click', () => {
        play = false;
        audio.pause();
        audio.currentTime = 0;
        start_button_container.style.display = "flex";
    });


    let snake_top  = 250,
    snake_left = (window.innerWidth / 4);

    let tasty_bit = document.createElement("div");
    tasty_bit.classList.add("tasty-bit");
    tasty_bit.style.top  = (window.innerHeight / 2).toString() + "px";
    tasty_bit.style.left = (window.innerWidth / 2).toString() + "px";
    main_game.appendChild(tasty_bit);

    function create_initial_snake(snake_top, snake_left) {
        for (let i = 0; i < 4; i++) {
            let snake_piece = document.createElement("div");
    
            if (i == 0) {
                snake_piece.classList.add("snake-head");
                snake_piece.classList.add("snake-body");
                snake_piece.style.top  = snake_top.toString() + "px";
                snake_piece.style.left = snake_left.toString() + "px";
            } else {
                snake_piece.classList.add("snake-body");
                snake_piece.style.top  = (snake_top + (17 * i)).toString() + "px";
                snake_piece.style.left = snake_left.toString() + "px";
            }
    
            main_game.appendChild(snake_piece);
        }
    }


    create_initial_snake(snake_top, snake_left);
});