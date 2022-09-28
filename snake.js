document.addEventListener("DOMContentLoaded", function() {
    let main_game = document.querySelector(".main-game");

    // It's minus 225 because the top bar is 75px tall and bottom bar is 150px tall
    main_game.style.height = (window.innerHeight - (100 + (window.innerHeight * .25))).toString() + "px";

    // Function defined at bottom
    // Called at top so that the snake is in place when I populate the snake
    // direction array.
    let rows_cols = [create_initial_snake()];
    rows_cols = rows_cols.toString().split(",")
    

    

    // -------------------------------------------------------------------------
    //#region Event listeners for the game keypad
    let snake_dir   = 2,
    keypad_buts = document.querySelectorAll(".keypad-cls-1");

    for (let i = 0; i < keypad_buts.length; i++) {
        if (keypad_buts[i].classList.contains("left")) {
            keypad_buts[i].addEventListener('click', () => {
                if (snake_dir != 1) {
                    snake_dir = 0;
                }
            })
        } else if (keypad_buts[i].classList.contains("right")) {
            keypad_buts[i].addEventListener('click', () => {
                if (snake_dir != 0) {
                    snake_dir = 1;
                }
            })
        } else if (keypad_buts[i].classList.contains("up")) {
            keypad_buts[i].addEventListener('click', () => {
                if (snake_dir != 3) {
                    snake_dir = 2;
                }
            })
        } else if (keypad_buts[i].classList.contains("down")) {
            keypad_buts[i].addEventListener('click', () => {
                if (snake_dir != 2) {
                    snake_dir = 3;
                }
            })
        }
    }


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
    //#endregion Event listeners for the game keypad
    // -------------------------------------------------------------------------


    function parse_grid_area(grid_area) {
        /* Element's grid area style is a string with forward slashes in it
        this converts it to an integer array */
        return grid_area.split(" / ").map(Number);
    }


    function move_snake(tasty_bit_row, tasty_bit_col) {
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
            let tasty_bit = document.querySelector(".tasty-bit"),
                tasty_bit_grid_area = parse_grid_area(tasty_bit.style.gridArea),
                head_grid_area = parse_grid_area(snake_body[0].style.gridArea);

            if (tasty_bit_grid_area[0] == head_grid_area[0] && tasty_bit_grid_area[1] == head_grid_area[1]) {
                let score = document.querySelector(".score");
                score.textContent = parseInt(document.querySelector(".score").textContent) + 1000

                add_snake_piece(parse_grid_area(old_grid_areas.at(-1))[0], parse_grid_area(old_grid_areas.at(-1))[1]);
                remove_tasty_bit();
                add_tasty_bit();
            }

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
        main_box_shadow_time = Date.now(),
        // audio      = new Audio('drums_trimmed.wav'),
        audio      = new Audio('ToxicAvenger_cut.mp3'),
        play       = false,
        // play       = true,
        start_button_container = document.querySelector(".start_button_container");
    let box_shadow_div = document.querySelector(".fading-box-shadow");


    function repeatOften(time) {
        new_time = Date.now();

        if (play == true) {
            // if (new_time - move_last >= 1500) {
            // if (new_time - move_last >= 260) {
            if (new_time - move_last >= 130) {
                move_snake();

                move_last = Date.now();
            }
            // if (new_time - audio_last >= audio.duration) {
            //     audio.play()
            // }

            if (new_time - main_box_shadow_time >= 270) {
                if (box_shadow_div.style.opacity == 1) {
                    box_shadow_div.style.opacity = 0;
                } else {
                    box_shadow_div.style.opacity = 1;
                }

                main_box_shadow_time = Date.now();
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
        // audio.currentTime = 0;
        start_button_container.style.display = "flex";
    });



    
    // -------------------------------------------------------------------------
    //#region Game initialization
    add_tasty_bit(rows_cols[0], rows_cols[1]);


    // -------------------------------------------------------------------------
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
            
            if (main_game.offsetHeight > main_game.offsetWidth) {
                num_rows = get_num_rows();

                let row_height = Math.floor(main_game.offsetHeight / num_rows),
                    row_height_min_gap = row_height - 5,
                    col_width = (main_game.offsetWidth - 10) / 20,
                    col_width_min_gap = col_width - 5;

                main_game.style.gridTemplateColumns = `repeat(20, ${col_width_min_gap}px)`;
                
                main_game.style.gridTemplateRows = `repeat(${num_rows}, ${row_height_min_gap}px)`;
            }
    
            main_game.appendChild(snake_piece);
        }

        return [num_rows, 20];
    }
    // -------------------------------------------------------------------------


    function get_num_rows() {
        let main_game = document.querySelector(".main-game");
        // console.log("In get_num_rows:");
        // console.log(`num rows: ${Math.floor(((main_game.offsetHeight - 10) / (main_game.offsetWidth - 10) * 20))}`); 
        return Math.floor(((main_game.offsetHeight - 10) / (main_game.offsetWidth - 10) * 20))
    }

    function add_snake_piece(row, col) {
        let snake_piece = document.createElement("div"),
            main_game = document.querySelector(".main-game");

        snake_piece.classList.add("snake-body");
        snake_piece.style.opacity = 1;
        snake_piece.style.gridArea = `${row} / ${col} / ${parseInt(row) + 1} / ${parseInt(col) + 1}`;
        main_game.appendChild(snake_piece)
        // setTimeout(() => {main_game.appendChild(snake_piece)}, 50);
        
        // setTimeout(function() {snake_piece.style.opacity = 1}, 50);
        
    }

    function add_tasty_bit() {
        let num_rows = get_num_rows();
        let num_cols = 20;
        
        let tasty_bit_row = Math.floor(Math.random() * (num_rows - 2) + 2);
        let tasty_bit_col = Math.floor(Math.random() * (num_cols - 2) + 2);
        

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
        // tasty_bit.style.gridArea = `13 / 9 / 14 / 10`;
        main_game.appendChild(tasty_bit);
    }

    function remove_tasty_bit() {
        let tasty_bit = document.querySelector(".tasty-bit");
        tasty_bit.remove();
    }
    //#endregion
    // -------------------------------------------------------------------------
});