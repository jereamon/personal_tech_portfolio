document.addEventListener("DOMContentLoaded", function() {
    let main_game = document.querySelector(".main-game");

    main_game.style.height = (window.innerHeight - 225).toString() + "px";

    // Function defined at bottom
    // Called at top so that the snake is in place when I populate the snake
    // direction array.
    create_initial_snake();
    

    // let snake_speed = 1,
    let snake_dir   = 3,
        key_left    = document.querySelector(".keypad-cls-2.left"),
        key_right   = document.querySelector(".keypad-cls-2.right"),
        key_up      = document.querySelector(".keypad-cls-2.up"),
        key_down    = document.querySelector(".keypad-cls-2.down");


    // -------------------------------------------------------------------------
    //#region Event listeners for the game keypad
    key_left.addEventListener("click", () => {
        console.log("left");
        // If snake isn't going right we can set it to left
        if (snake_dir != 1) {
            snake_dir = 0;
        }
    })

    key_right.addEventListener("click", () => {
        console.log("right");
        // If snake isn't going left we can set it to right
        if (snake_dir != 0) {
            snake_dir = 1;
        }
    })

    key_up.addEventListener("click", () => {
        console.log("up");
        // If snake isn't going down we can set it to up
        if (snake_dir != 3) {
            snake_dir = 2;
        }
    })

    key_down.addEventListener("click", () => {
        // If snake isn't going up we can set it to down
        console.log("down");
        if (snake_dir != 2) {
            snake_dir = 3;
        }
    })
    //#endregion Event listeners for the game keypad
    // -------------------------------------------------------------------------


    function parse_grid_area(grid_area) {
        /* Element's grid area style is a string with forward slashes in it
        this converts it to an integer array */
        return grid_area.split(" / ").map(Number);
    }


    function move_snake() {
        let snake_body = document.querySelectorAll(".snake-body");

        // Ok we get the grid area value for the snake piece in 
        // snake_body at index i. We parse it to get an array of integers.
        let head_grid_area = parse_grid_area(snake_body[0].style.gridArea),
            old_grid_areas = []
            head_moved = false;

        // We populate this array here so that we have the old positions of each
        // snake segment before any are moved.
        for (let i = 0; i < snake_body.length; i++) {
            old_grid_areas.push(snake_body[i].style.gridArea);
        }


        switch(snake_dir) {
            case 0:
                // move snake head left if possible
                if (head_grid_area[1] - 1 > 0) {
                    snake_body[0].style.gridArea = `${head_grid_area[0]} / ${head_grid_area[1] - 1} / ${head_grid_area[2]} / ${head_grid_area[3] - 1}`;
                    head_moved = true;
                }
                break;
            case 1:
                // move snake head right if possible
                if (head_grid_area[1] + 1 < 20) {
                    snake_body[0].style.gridArea = `${head_grid_area[0]} / ${head_grid_area[1] + 1} / ${head_grid_area[2]} / ${head_grid_area[3] + 1}`;
                    head_moved = true;
                }
                break;
            case 2:
                // move snake head right if possible
                if (head_grid_area[0] - 1 > 0) {
                    snake_body[0].style.gridArea = `${head_grid_area[0] - 1} / ${head_grid_area[1]} / ${head_grid_area[2] - 1} / ${head_grid_area[3]}`;
                    head_moved = true;
                }
                break;
            case 3:
                if (head_grid_area[0] + 1 < 20) {
                    snake_body[0].style.gridArea = `${head_grid_area[0] + 1} / ${head_grid_area[1]} / ${head_grid_area[2] + 1} / ${head_grid_area[3]}`;
                    head_moved = true;
                }
                break;
        }
        

        // If the head moved then we update each body segment with the coordinates
        // of the previous body segment.
        if (head_moved) {
            for (let i = 1; i < snake_body.length; i++) {
                snake_body[i].style.gridArea = old_grid_areas[i - 1];
            }
        }        
    }


    

    let move_last  = Date.now(),
        new_time   = Date.now(),
        audio_last = Date.now(),
        audio      = new Audio('drums_trimmed.wav'),
        play       = false,
        // play       = true,
        start_button_container = document.querySelector(".start_button_container");

    function repeatOften(time) {
        new_time = Date.now();

        if (play == true) {
            if (new_time - move_last >= 500) {
                move_snake();

                move_last = Date.now();
            }
            // if (new_time - audio_last >= audio.duration) {
            //     audio.play()
            // }
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
        // audio.play();
        start_button_container.style.display = "none";
    });

    document.querySelector(".pause").addEventListener('click', () => {
        play = false;
        audio.pause();
        audio.currentTime = 0;
        start_button_container.style.display = "flex";
    });



    let tasty_bit = document.createElement("div");
    tasty_bit.classList.add("tasty-bit");
    tasty_bit.style.top  = (window.innerHeight / 2).toString() + "px";
    tasty_bit.style.left = (window.innerWidth / 2).toString() + "px";
    main_game.appendChild(tasty_bit);



    function create_initial_snake() {
        for (let i = 0; i < 8; i++) {
            let snake_piece = document.createElement("div");
    
            if (i == 0) {
                snake_piece.classList.add("snake-head");
            }

            snake_piece.classList.add("snake-body");
            snake_piece.classList.add(i);

            snake_piece.style.gridArea = `${9 - i} / 1 / ${10- i} / 2`;

            let small_gap = 5;
            if (main_game.offsetHeight > main_game.offsetWidth) {
                main_game.style.columnGap = small_gap.toString() + "px";

                let tall_grid_square = (main_game.offsetHeight / 20) - (small_gap * 2),
                    short_grid_square = (main_game.offsetWidth / 20);

                if (tall_grid_square - short_grid_square > 1) {
                    main_game.style.rowGap = (Math.floor((tall_grid_square - short_grid_square) / 2)).toString() + "px";
                } else {
                    main_game.style.rowGap = small_gap.toString() + "px";
                }
            }
    
            main_game.appendChild(snake_piece);
        }
    }
});