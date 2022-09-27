document.addEventListener("DOMContentLoaded", function() {
    let main_game = document.querySelector(".main-game");

    main_game.style.height = (window.innerHeight - 225).toString() + "px";
    

    // let snake_speed = 1,
    let snake_x_dir = 1,
        snake_y_dir = 0,
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


    function parse_grid_area(grid_area) {
        return grid_area.split(" / ").map(Number);
    }


    function move_snake() {
        let snake_body = document.querySelectorAll(".snake-body");

        // This gets a little weird.
        // First we check if the snake is traveling to the left or right
        if (snake_x_dir == 1 || snake_x_dir == -1) {
            for (let i = 0; i < snake_body.length; i++) {

                // Ok we get the grid area value for the snake piece in 
                // snake_body at index i. We parse it to get an array of integers.
                let cur_grid_area = parse_grid_area(snake_body[i].style.gridArea);

                // Checks if it's the snake head and whether it can move left or right without 
                // going beyond a wall.
                if (i == 0 && (cur_grid_area[1] + (snake_x_dir) < 20 || cur_grid_area[1] + (snake_x_dir) > 0)) {
                    // If it can the snake head is moved left or right by one column
                    snake_body[0].style.gridArea = `${cur_grid_area[0]} / ${cur_grid_area[1] + (snake_x_dir)} / ${cur_grid_area[2]} / ${cur_grid_area[3] + (snake_x_dir)}`;
                } else {
                    // We end up here if it's not the snake head.
                    // First we get the grid area for the previous element.
                    // The previous element will be closer to the head.
                    let old_grid_area = parse_grid_area(snake_body[i - 1].style.gridArea);

                    row_difference = old_grid_area[0] - cur_grid_area[0];

                    // First we check if the current element is further than 1 column
                    // from the previous element.
                    if (Math.abs(row_difference) > 0) {
                        // If it  one column away we move it in the
                        // direction of the previus element.
                        // This ensures the snake tail moves above the head when
                        // going from left or right to up or down.
                        let move_dir = 1
                        if (row_difference < 0) {
                            move_dir = -1
                        }
                        snake_body[i].style.gridArea = `${cur_grid_area[0] + move_dir} / ${cur_grid_area[1]} / ${cur_grid_area[2] + move_dir} / ${cur_grid_area[3]}`


                    // If it's within 1 column we check to see if it's within 1
                    // row of the previous element.
                    } else if (Math.abs(old_grid_area[1] - cur_grid_area[1]) > 1) {
                        // If it's not then we move it one row toward the current
                        // snake_x_dir
                        snake_body[i].style.gridArea = `${cur_grid_area[0]} / ${cur_grid_area[1] + (snake_x_dir)} / ${cur_grid_area[2]} / ${cur_grid_area[3] + (snake_x_dir)}`
                    }
                }
            }
        } else {
            for (let i = 0; i < snake_body.length; i++) {
                console.log(`i: ${i}`)
                let cur_grid_area = parse_grid_area(snake_body[i].style.gridArea);

                if (i == 0 && cur_grid_area[0] + (snake_y_dir) < 20 && cur_grid_area[0] + (snake_y_dir) > 0) {
                    console.log(cur_grid_area)
                    snake_body[0].style.gridArea = `${cur_grid_area[0] + snake_y_dir} / ${cur_grid_area[1]} / ${cur_grid_area[2] + snake_y_dir} / ${cur_grid_area[3]}`
                } else {
                    
                    console.log(parse_grid_area(snake_body[i - 1].style.gridArea))
                    console.log(cur_grid_area)
                    let old_grid_area = parse_grid_area(snake_body[i - 1].style.gridArea);
                    // console.log(`old_grid_area[1]: ${old_grid_area[1]}, cur_grid_area[1]: ${cur_grid_area[1]}`)
                    let col_difference = old_grid_area[1] - cur_grid_area[1];
                        

                    // This means the snake is now moving vertically and the previous
                    // snake piece (the once closer to the head) is 1 column
                    // left or right of the current column.
                    if (Math.abs(col_difference) > 0) {
                        // console.log(`${cur_grid_area[0]} / ${cur_grid_area[1] + (old_grid_area[1] - cur_grid_area[1])} / ${cur_grid_area[2]} / ${cur_grid_area[3] + (old_grid_area[1] - cur_grid_area[1])}`)
                        console.log(col_difference)
                        let move_dir = 1;
                        if (col_difference < 0) {
                            move_dir = -1
                        }
                        snake_body[i].style.gridArea = `${cur_grid_area[0]} / ${cur_grid_area[1] + move_dir} / ${cur_grid_area[2]} / ${cur_grid_area[3] + move_dir}`
                    
                    } else if (Math.abs(old_grid_area[0] - cur_grid_area[0]) > 1) {
                        snake_body[i].style.gridArea = `${cur_grid_area[0] + (snake_y_dir)} / ${cur_grid_area[1]} / ${cur_grid_area[2] + (snake_y_dir)} / ${cur_grid_area[3]}`
                    }
                }
            }
            console.log("\n")
        }

                // if the snake is traveling left or right and isn't too close
                // to the edge to move again.
        //         if (pos_after_move >= 0 || pos_after_move <= window.innerWidth) {
        //             // we move the snake head in the direction of snake_x_dir
        //             snake_body[0].style.left = (snake_body[0].offsetLeft + ((17) * snake_x_dir)).toString() + "px";

        //             // Then we loop over each body piece
        //             for (let i = 1; i < snake_body.length; i++) {
        //                 // if the piece is above the snake's head we move it down
        //                 if (snake_body[i].style.top < snake_body[i - 1].style.top) {
        //                     snake_body[i].style.top = (snake_body[i].offsetTop + ((17))).toString() + "px";
                        
        //                 // if the piece is below the snake's head we move it up
        //                 } else if (snake_body[i].style.top > snake_body[i - 1].style.top) {
        //                     snake_body[i].style.top = (snake_body[i].offsetTop + ((-17))).toString() + "px";

        //                 // otherwise we move it left or right in the direction of snake_x_dir
        //                 } else {
        //                     snake_body[i].style.left = (snake_body[i].offsetLeft + ((17) * snake_x_dir)).toString() + "px";
        //                 }
        //             }
        //         }
        // } else {
        //     let pos_after_move = (snake_body[0].offsetTop + ((17)) * snake_y_dir);

        //     if (pos_after_move >= 75 && pos_after_move <= (window.innerHeight - 150)) {
        //         snake_body[0].style.top  = (snake_body[0].offsetTop + (17 * snake_y_dir)).toString() + "px";

        //         for (let i = 1; i < snake_body.length; i++) {
        //             if (snake_body[i].style.left < snake_body[i - 1].style.left) {
        //                 snake_body[i].style.left = (snake_body[i].offsetLeft + ((17))).toString() + "px";
        //             } else if (snake_body[i].style.left > snake_body[i - 1].style.left) {
        //                 snake_body[i].style.left = (snake_body[i].offsetLeft + ((-17))).toString() + "px";
        //             } else {
        //                 snake_body[i].style.top = ((snake_body[i].offsetTop + (17 * snake_y_dir)) ).toString() + "px";
        //             }
        //         }
        //     }
    }

    // function move_snake() {
    //     let snake_body = document.querySelectorAll(".snake-body");


    //     // This gets a little weird.
    //     // First we check if the snake is traveling to the left or right
    //     if (snake_x_dir == 1 || snake_x_dir == -1) {
    //             let pos_after_move = snake_body[0].offsetTop + ((17) * snake_x_dir);

    //             // if the snake is traveling left or right and isn't too close
    //             // to the edge to move again.
    //             if (pos_after_move >= 0 || pos_after_move <= window.innerWidth) {
    //                 // we move the snake head in the direction of snake_x_dir
    //                 snake_body[0].style.left = (snake_body[0].offsetLeft + ((17) * snake_x_dir)).toString() + "px";

    //                 // Then we loop over each body piece
    //                 for (let i = 1; i < snake_body.length; i++) {
    //                     // if the piece is above the snake's head we move it down
    //                     if (snake_body[i].style.top < snake_body[i - 1].style.top) {
    //                         snake_body[i].style.top = (snake_body[i].offsetTop + ((17))).toString() + "px";
                        
    //                     // if the piece is below the snake's head we move it up
    //                     } else if (snake_body[i].style.top > snake_body[i - 1].style.top) {
    //                         snake_body[i].style.top = (snake_body[i].offsetTop + ((-17))).toString() + "px";

    //                     // otherwise we move it left or right in the direction of snake_x_dir
    //                     } else {
    //                         snake_body[i].style.left = (snake_body[i].offsetLeft + ((17) * snake_x_dir)).toString() + "px";
    //                     }
    //                 }
    //             }
    //     } else {
    //         let pos_after_move = (snake_body[0].offsetTop + ((17)) * snake_y_dir);

    //         if (pos_after_move >= 75 && pos_after_move <= (window.innerHeight - 150)) {
    //             snake_body[0].style.top  = (snake_body[0].offsetTop + (17 * snake_y_dir)).toString() + "px";

    //             for (let i = 1; i < snake_body.length; i++) {
    //                 if (snake_body[i].style.left < snake_body[i - 1].style.left) {
    //                     snake_body[i].style.left = (snake_body[i].offsetLeft + ((17))).toString() + "px";
    //                 } else if (snake_body[i].style.left > snake_body[i - 1].style.left) {
    //                     snake_body[i].style.left = (snake_body[i].offsetLeft + ((-17))).toString() + "px";
    //                 } else {
    //                     snake_body[i].style.top = ((snake_body[i].offsetTop + (17 * snake_y_dir)) ).toString() + "px";
    //                 }
    //             }
    //         }
    //     }
    // }

    

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
            if (new_time - move_last >= 565) {
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



    function create_initial_snake() {
        for (let i = 0; i < 4; i++) {
            let snake_piece = document.createElement("div");
    
            if (i == 0) {
                snake_piece.classList.add("snake-head");
            }

            snake_piece.classList.add("snake-body");
            snake_piece.classList.add(i);

            snake_piece.style.gridArea = `3 / ${4 - i} / 4 / ${5- i}`;

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


    create_initial_snake();
});