document.addEventListener("DOMContentLoaded", function() {
    let main_game = document.querySelector(".main-game");

    // It's minus 225 because the top bar is 75px tall and bottom bar is 150px tall
    main_game.style.height = (window.innerHeight - 225).toString() + "px";

    // Function defined at bottom
    // Called at top so that the snake is in place when I populate the snake
    // direction array.
    let rows_cols = [create_initial_snake()];
    rows_cols = rows_cols.toString().split(",")
    

    // let snake_speed = 1,
    let snake_dir   = 2,
        key_left    = document.querySelector(".keypad-cls-2.left"),
        key_right   = document.querySelector(".keypad-cls-2.right"),
        key_up      = document.querySelector(".keypad-cls-2.up"),
        key_down    = document.querySelector(".keypad-cls-2.down");


    // -------------------------------------------------------------------------
    //#region Event listeners for the game keypad
    document.onkeydown = function(e) {
        switch (e.key) {
            case 'ArrowLeft':
                if (snake_dir != 1) {
                    snake_dir = 0;
                }
                break;
            case 'ArrowRight':
                if (snake_dir != 0) {
                    snake_dir = 1;
                }
                break;
            case 'ArrowUp':
                if (snake_dir != 3) {
                    snake_dir = 2;
                }
                break;
            case 'ArrowDown':
                if (snake_dir != 2) {
                    snake_dir = 3;
                }
                break;
        }
    }


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


    
    // -------------------------------------------------------------------------
    //#region Animation Frame variables and callbacks
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
            if (new_time - audio_last >= audio.duration) {
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
    //#endregion Animation Frame variables and callbacks
    // -------------------------------------------------------------------------


    
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



    
    // -------------------------------------------------------------------------
    //#region Game initialization
    add_tasty_bit(rows_cols[0], rows_cols[1]);


    function create_initial_snake() {
        let num_rows = 0;

        for (let i = 0; i < 4; i++) {
            let snake_piece = document.createElement("div");
    
            if (i == 0) {
                snake_piece.classList.add("snake-head");
            }

            snake_piece.classList.add("snake-body");
            snake_piece.classList.add(i);

            snake_piece.style.gridArea = `${15 + i} / 9 / ${16 + i} / 10`;

            let main_game = document.querySelector(".main-game");
            // let small_gap = 5;
            if (main_game.offsetHeight > main_game.offsetWidth) {
                num_rows = Math.floor(((main_game.offsetHeight - 10) / (main_game.offsetWidth - 10) * 20));

                let row_height = Math.floor(main_game.offsetHeight / num_rows),
                    row_height_min_gap = row_height - 5,
                    col_width = (main_game.offsetWidth - 10) / 20,
                    col_width_min_gap = col_width - 5;

                main_game.style.gridTemplateColumns = `repeat(20, ${col_width_min_gap}px)`;
                console.log(`main_game height: ${main_game.offsetHeight}, num_rows: ${num_rows}, row_height: ${row_height}, new height = ${num_rows * row_height}`);
                main_game.style.gridTemplateRows = `repeat(${num_rows}, ${row_height_min_gap}px)`;
            }
    
            main_game.appendChild(snake_piece);
        }

        return [num_rows, 20];
    }


    function add_tasty_bit(num_rows, num_cols) {
        let tasty_bit_row = Math.floor(Math.random() * (num_rows - 2) + 2);
        let tasty_bit_col = Math.floor(Math.random() * (num_cols - 2) + 2);
        console.log(`tasty bit row col: ${tasty_bit_row} ${tasty_bit_col}`);

        switch (tasty_bit_row) {
            case 15:
            case 16:
            case 17:
            case 18:
                switch (tasty_bit_col) {
                    case 9:
                        tasty_bit_col += 1;
                        break;
                }
            break;
        }

        let tasty_bit = document.createElement("div");
        tasty_bit.classList.add("tasty-bit");
        tasty_bit.style.gridArea = `${tasty_bit_row} / ${tasty_bit_col} / ${tasty_bit_row + 1} / ${tasty_bit_col + 1}`;
        main_game.appendChild(tasty_bit);
    }

    function remove_tasty_bit() {
        let tasty_bit = document.querySelector(".tasty-bit");
        tasty_bit.remove();
    }
    //#endregion
    // -------------------------------------------------------------------------
});