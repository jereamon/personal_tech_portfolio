document.addEventListener("DOMContentLoaded", function() {
    let main_game = document.querySelector(".main-game");

    // It's minus 225 because the top bar is 75px tall and bottom bar is 150px tall
    main_game.style.height = (window.innerHeight - (100 + (window.innerHeight * .25))).toString() + "px"; 

    

    // -------------------------------------------------------------------------
    //#region Event listeners for the game keypad
    let snake_dir   = 2,
        move_time   = 255,
        input_time  = 25,
        initial_snake_length = 6;
    keypad_buts = document.querySelectorAll(".keypad-cls-1");


    // Function defined at bottom
    // Called at top so that the snake is in place when I populate the snake
    // direction array.
    let rows_cols = [create_initial_snake()];
    rows_cols = rows_cols.toString().split(",")



    for (let i = 0; i < keypad_buts.length; i++) {
        if (keypad_buts[i].classList.contains("left")) {
            keypad_buts[i].addEventListener('click', () => {
                set_snake_dir(0);
            })
        } else if (keypad_buts[i].classList.contains("right")) {
            keypad_buts[i].addEventListener('click', () => {
                set_snake_dir(1);
            })
        } else if (keypad_buts[i].classList.contains("up")) {
            keypad_buts[i].addEventListener('click', () => {
                set_snake_dir(2);
            })
        } else if (keypad_buts[i].classList.contains("down")) {
            keypad_buts[i].addEventListener('click', () => {
                set_snake_dir(3);
            })
        }
    }


    document.onkeydown = function(e) {
        switch (e.key) {
            case 'ArrowLeft':
                set_snake_dir(0);
                break;
            case 'ArrowRight':
                set_snake_dir(1);
                break;
            case 'ArrowUp':
                set_snake_dir(2);
                break;
            case 'ArrowDown':
                set_snake_dir(3);
                break;
        }
    }


    let dir_change_old_time = Date.now(),
        dir_change_new_time = Date.now();

    function set_snake_dir(new_snake_dir) {
        // This is called when either a keyboard arrow is pressed or
        let dir_changed = false;

        dir_change_new_time = Date.now();

        if (dir_change_new_time - dir_change_old_time >= input_time) {
        switch (new_snake_dir) {
            case 0:
                if (snake_dir != 1 && snake_dir != 0) {
                    snake_dir = 0;
                    dir_changed = true;
                }
                break;
            case 1:
                if (snake_dir != 0 && snake_dir != 1) {
                    snake_dir = 1;
                    dir_changed = true;
                }
                break;
            case 2:
                if (snake_dir != 3 && snake_dir != 2) {
                    snake_dir = 2;
                    dir_changed = true;
                }
                break;
            case 3:
                if (snake_dir != 2 && snake_dir != 3) {
                    snake_dir = 3;
                    dir_changed = true;
                }
                break;
        }
        if (dir_changed) {
            determine_move_time(true);
        }

             dir_change_old_time = Date.now();
        }
    }
    //#endregion Event listeners for the game keypad
    // -------------------------------------------------------------------------


    function parse_grid_area(grid_area) {
        /* Element's grid area style is a string with forward slashes in it
        this converts it to an integer array */
        return grid_area.split(" / ").map(Number);
    }


    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    function move_snake() {
        let snake_body = document.querySelectorAll(".snake-body");

        // Ok we get the grid area value for the snake piece in 
        // snake_body at index i. We parse it to get an array of integers.
        let head_grid_area = parse_grid_area(snake_body[0].style.gridArea),
            old_grid_areas = []
            head_moved = false;
        let num_rows = get_num_rows();

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
                if (head_grid_area[1] + 1 <= rows_cols[1]) {
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
                if (head_grid_area[0] + 1 <= rows_cols[0]) {
                    snake_body[0].style.gridArea = `${head_grid_area[0] + 1} / ${head_grid_area[1]} / ${head_grid_area[2] + 1} / ${head_grid_area[3]}`;
                    head_moved = true;
                }
                break;
        }
        

        // If the head moved then we update each body segment with the coordinates
        // of the previous body segment.
        if (head_moved) {
                if (check_got_tasty_bit(head_grid_area)) {

                add_snake_piece(parse_grid_area(old_grid_areas.at(-1))[0], parse_grid_area(old_grid_areas.at(-1))[1]);
                remove_tasty_bit();
                add_tasty_bit();

                fade_box_shadow('blue');
                
            }

            for (let i = 1; i < snake_body.length; i++) {
                snake_body[i].style.gridArea = old_grid_areas[i - 1];
            }

            check_game_over();
        }        
    }
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------



    function check_got_tasty_bit(head_grid_area) {
        let tasty_bit = document.querySelector(".tasty-bit"),
        tasty_bit_grid_area = parse_grid_area(tasty_bit.style.gridArea);

        if (tasty_bit_grid_area[0] == head_grid_area[0] && tasty_bit_grid_area[1] == head_grid_area[1]) {
            let score = document.querySelector(".score"),
                cur_score = parseInt(score.innerHTML);

            if (move_time >= 80 && (cur_score / 1000) % 4 == 0) {
                move_time -= 10;
            }
            score.textContent = parseInt(document.querySelector(".score").textContent) + 1000
            return true;
        }
        return false;
    }


    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    function check_game_over() {
        // Checks if the snakes head is in the same position as one of it's body
        // pieces.
        let snake_body = document.querySelectorAll(".snake-body");
        let head_grid_area = parse_grid_area(snake_body[0].style.gridArea);

        for (let i = 1; i < snake_body.length; i++) {
            let cur_snake_grid = parse_grid_area(snake_body[i].style.gridArea);

            if ((head_grid_area[0] == cur_snake_grid[0]) && (head_grid_area[1] == cur_snake_grid[1])) {
                let game_over_container = document.querySelector(".game-over-container");
                let score = document.querySelector(".score");
                let game_over_score = document.querySelector(".game-over-score");

                play = false;
                audio.pause();
                start_button_container.style.display = "none";
                game_over_score.innerHTML = score.innerHTML;
                
                game_over_container.style.display = "flex";
                setTimeout(function() {
                    game_over_container.style.opacity = 1;
                }, 50);
            }
        }
    }
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------


    


    // -------------------------------------------------------------------------
    //#region Animation Frame variables and callbacks
    let move_last  = Date.now(),
        new_time   = Date.now(),
        main_box_shadow_time = Date.now(),
        audio      = new Audio('ToxicAvenger_cut.mp3'),
        play       = false,
        audio_play = true,
        start_button_container = document.querySelector(".start-button-container");


    function fade_box_shadow(color) {
        let box_shadow_div = document.querySelector(`.fading-box-shadow.${color}`);
        box_shadow_div.style.opacity = 1;
        setTimeout(() => {
            box_shadow_div.style.opacity = 0;
        }, 555);
    }


    let timer = false;
    function determine_move_time(instant=false) {
        new_time = Date.now();

        if (play == true) {
            if (instant) {
                move_snake();
                move_last = Date.now();
            } else {
                // if (new_time - move_last >= 1500) {
                // if (new_time - move_last >= 260) {
                if (new_time - move_last >= move_time) {
                    move_snake();
                    move_last = Date.now();
                }
            }
            // if (new_time - audio_last >= audio.duration) {
            //     audio.play()
            // }


            // if (new_time - audio_last >= 17989 && new_time - audio_last <= 35582 && play) {
            if (audio.currentTime >= 16.398 && play && audio.currentTime <= 28) {
                if (!timer) {
                    timer = setInterval(() => {fade_box_shadow('orange')}, 1111);
                }
            } else if (timer) {
                clearInterval(timer);
                timer = false;
            }
        }
    }


    function repeatOften(time) {
        determine_move_time();

        requestAnimationFrame(repeatOften);
    }

    requestAnimationFrame(repeatOften);


    document.querySelector(".volume").addEventListener('click', () => {
        if (audio_play) {
            audio.pause();
            audio_play = false;
        } else {
            audio.play();
            audio_play = true;
        }
    })    

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState != 'visible') {
            play = false;    
            audio.pause();
            start_button_container.style.display = "flex";
        }
    })
    //#endregion Animation Frame variables and callbacks
    // -------------------------------------------------------------------------


    // -------------------------------------------------------------------------
    //#region Play, pause, restart
    function restart_game() {
        let game_over_container    = document.querySelector(".game-over-container"),
            start_button_container = document.querySelector(".start-button-container"),
            score = document.querySelector(".score");

        score.innerHTML = 0;
        game_over_container.style.opacity = 0;
        start_button_container.style.opacity = 0;

        clear_snake();

        setTimeout(() => {
            game_over_container.style.display = 'none';
            start_button_container.style.display = 'flex';

            setTimeout(() => {
                start_button_container.style.opacity = 1;
            }, 25);

            create_initial_snake();
            audio.currentTime = 0;
        }, 200)
    }


    function clear_snake() {
        let snake_body = document.querySelectorAll(".snake-body"),
            tasty_bit  = document.querySelector(".tasty-bit");

        for (let i = 0; i < snake_body.length; i++) {
            snake_body[i].remove();
        }
        tasty_bit.remove();
    }

    document.querySelector(".restart-button").addEventListener('click', () => {restart_game()});

    document.querySelector(".start-button").addEventListener('click', () => {
        play = true;
        if (audio_play) {
            audio.play();
        }
        start_button_container.style.display = "none";
    });

    document.querySelector(".pause").addEventListener('click', () => {
        play = false;
        audio.pause();
        // audio.currentTime = 0;
        start_button_container.style.display = "flex";
    });
    //#endregion
    // -------------------------------------------------------------------------


    
    // -------------------------------------------------------------------------
    //#region Game initialization
    // -------------------------------------------------------------------------
    function create_initial_snake() {
        let rows_cols = set_game_dimensions();
        let num_rows = rows_cols[0],
            num_cols = rows_cols[1]

        snake_dir = 2;

        for (let i = 0; i < initial_snake_length; i++) {
            let snake_piece = document.createElement("div");
    
            if (i == 0) {
                snake_piece.classList.add("snake-head");
            }

            snake_piece.classList.add("snake-body");
            snake_piece.classList.add(i);

            snake_piece.style.gridArea = `${15 + i} / 9 / ${16 + i} / 10`;

            let main_game = document.querySelector(".main-game");            
    
            main_game.appendChild(snake_piece);
        }

        add_tasty_bit(num_rows, num_cols);

        return [num_rows, num_cols];
    }


    function set_game_dimensions() {
        let main_game = document.querySelector(".main-game");
        let num_rows = 0,
            num_cols = 0;

        if (main_game.offsetHeight > main_game.offsetWidth) {
            console.log("phone screen")

            num_rows = get_num_rows();
            num_cols = 20;

            let row_height             = Math.floor(main_game.offsetHeight / num_rows),
                row_height_minus_gap   = row_height - 5,
                col_width              = (main_game.offsetWidth - 10) / 20,
                col_width_minus_gap    = col_width - 5;

            main_game.style.gridTemplateColumns = `repeat(${num_cols}, ${col_width_minus_gap}px)`;
            
            main_game.style.gridTemplateRows = `repeat(${num_rows}, ${row_height_minus_gap}px)`;
        } else {
            console.log("desktop screen");
            main_game.style.width = main_game.offsetHeight + "px";

            num_cols = get_num_cols();
            num_rows = 20;

            let col_width            = Math.floor(main_game.offsetWidth / num_cols),
                col_width_minus_gap  = col_width - 5,
                row_height           = Math.floor((main_game.offsetHeight - 10) / 2),
                row_height_minus_gap = row_height - 5;

            main_game.style.gridTemplateColumns = `repeat(${num_cols}, ${col_width_minus_gap})`;
            main_game.style.gridTemplateRows    = `repeat(${num_rows}, ${row_height_minus_gap})`;
        }

        return [num_rows, num_cols];
    }


    function get_num_rows() {
        let main_game = document.querySelector(".main-game");
        // console.log("In get_num_rows:");
        // console.log(`num rows: ${Math.floor(((main_game.offsetHeight - 10) / (main_game.offsetWidth - 10) * 20))}`); 
        return Math.floor(((main_game.offsetHeight - 10) / (main_game.offsetWidth - 10) * 20))
    }

    function get_num_cols() {
        let main_game = document.querySelector(".main-game");
        return Math.floor(((main_game.offsetWidth - 10) / (main_game.offsetHeight - 10) * 20))
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
        let snake_body = document.querySelectorAll(".snake-body");
        let num_rows = get_num_rows();
        let num_cols = 20;
        
        let tasty_bit_row = Math.floor(Math.random() * (num_rows - 2) + 2);
        let tasty_bit_col = Math.floor(Math.random() * (num_cols - 2) + 2);
        
        let under_snake = false;

        while (true) {
            for (let i = 0; i < snake_body.length; i++) {
                let snake_piece_grid = parse_grid_area(snake_body[i].style.gridArea);
                if (snake_piece_grid[0] == tasty_bit_row && snake_piece_grid[1] == tasty_bit_col) {
                    under_snake = true;
                }
            }

            if (under_snake) {
                tasty_bit_row = Math.floor(Math.random() * (num_rows - 2) + 2);
                tasty_bit_col = Math.floor(Math.random() * (num_cols - 2) + 2);
                under_snake = false;
            } else {
                break;
            }
        }
        // switch (tasty_bit_row) {
        //     case 15:
        //     case 16:
        //     case 17:
        //     case 18:
        //         switch (tasty_bit_col) {
        //             case 9:
        //                 tasty_bit_col += 1;
        //                 break;
        //         }
        //     break;
        // }

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



    set_game_dimensions();
    //#endregion
    // -------------------------------------------------------------------------
});