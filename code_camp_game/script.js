window.addEventListener('load', function() {
    // canvas setup
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext('2d'); // you can pass in 2d or webgl. webgl would be for 3d.
    canvas.width = 1000;
    canvas.height = 500;


    class InputHandler {
        constructor(game) {
            this.game = game;

            // This is a little weird. But the arrow function makes it so that
            // the 'this' keyword always points to the object in which the arrow
            // function is defined.
            // If you don't use the arrow function js won't know what 'this' points
            // to and will tell you that 'this.game' is undefined.
            window.addEventListener("keydown", e => {
                if (((e.key == 'ArrowUp') ||
                     (e.key == 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                } else if (e.key === ' ') {
                    this.game.player.shootTop();
                } else if (e.key === 'd') {
                    this.game.debug = !this.game.debug;
                }

            });

            window.addEventListener('keyup', e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    // Splice takes 2 arguments.
                    // The starting index and the number of elements to remove.
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            })
        }
    }


    class Projectile {
        constructor(game, x, y) {
            this.game   = game;
            this.x      = x;
            this.y      = y;
            this.width  = 10;
            this.height = 3;
            this.speed  = 3;
            this.markedForDeletion = false;
            this.image  = document.getElementById('projectile');
        }

        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) {
                this.markedForDeletion = true;
            }
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    }


    class Particle {
        constructor(game, x, y) {
            this.game   = game;
            this.x      = x;
            this.y      = y;
            this.image  = document.getElementById('gears');
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
            this.size   = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -15;
            this.gravity = 0.5;
            this.markedForDeletion = false;
            this.angle  = 0;
            this.va = Math.random() * 0.2 - 0.1;
            this.bounced = Math.floor(Math.random() * 3);
            this.bottomBounceBoundary = Math.random() * 80 + 60;
        }

        update() {
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;

            if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true;

            // makes particle bounce before disappearing
            if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced > 0) {
                this.bounced = true;
                this.speedY *= -0.9;
                this.bounced--;
            }
        }

        draw(context) {
            context.save();
            // We move the center point from the top left corner to the sprites
            // x and y coordinates. This way they'll rotate around their center point.
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size);
            context.restore();
        }
    }


    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.maxSpeed = 10
            this.projectiles = [];

            this.powerUp = false;
            this.powerUpTimer = 0;
            this.powerUpLimit = 10000;

            // frameX and frameY will specify where we are on the sprite sheet.
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
            this.image = document.getElementById("player");
        }

        update(deltaTime) {
            if (this.game.keys.includes('ArrowUp')) {
                this.speedY = -this.maxSpeed;    
            } else if (this.game.keys.includes('ArrowDown')) {
                this.speedY = this.maxSpeed;
            } else {
                this.speedY = 0;
            }

            this.y += this.speedY;

            // vertical boundaries
            if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5
            else if  (this.y < -this.height * 0.5) this.y = -this.height * 0.5;

            // handle projectiles
            this.projectiles.forEach(projectile => {
                projectile.update();
            });

            // The filter function creates a new array containing the elements that pass the check.
            // In this case, the new array will contain all projectiles which aren't marked for deletion.
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);


            // sprite animation
            if (this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0;


            // powerup timer check
            if (this.powerUp) {
                if (this.powerUpTimer > this.powerUpLimit) {
                    this.powerUpTimer = 0;
                    this.powerUp = false;
                    this.frameY = 0;
                } else {
                    this.powerUpTimer += deltaTime;
                    this.frameY = 1;

                    if (this.game.ammo < this.game.maxAmmo)
                    this.game.ammo += 0.1;
                }
            }
        }

        draw(context) {
            if (game.debug) context.strokeRect(this.x, this.y, this.width, this.height);

            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            });

            // We need 9 arguments here. They are:
            // the image, source x, source y, source width, source height,
            // x, y, width, height
            // The source arguments determine which part of the image we crop out.
            // The not source arguments determine where the cropped image is placed on the screen.
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }

        shootTop() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
                this.game.ammo -= 1;
            }

            if (this.powerUp) this.shootBottom();
        }

        shootBottom() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
            }
        }

        enterPowerUp() {
            this.powerUpTimer = 0;
            this.powerUp = true;
            this.game.ammo = this.game.maxAmmo;
        }
    }


    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1 - .7;
            this.markedForDeletion = false;
            this.lives = 5;
            this.score = this.lives;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }

        update() {
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) {
                this.markedForDeletion = true;
            }

            if (this.frameX < this.maxFrame) this.frameX ++
            else this.frameX = 0;
        }

        draw(context) {
            if (this.game.debug) {
                // shows enemy hitbox
                context.strokeRect(this.x, this.y, this.width, this.height);

                // shows how many lives each enemy has
                context.fillText(this.lives, this.x, this.y);
                context.font = '20px Helvetica';
            }

            // See the other drawImage call for an explanation of this function.
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }
    class Angler1 extends Enemy {
        constructor(game) {
            // If we don't include this then the parent's constructor method
            // wouldn't be run.
            // If you don't include a constructor method in a child class then
            // only the parent's constructor will be run.
            super(game);

            this.lives = 5;
            this.width = 228; // the width and height of the angler sprite image
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
        }
    }
    class Angler2 extends Enemy {
        constructor(game) {
            // If we don't include this then the parent's constructor method
            // wouldn't be run.
            // If you don't include a constructor method in a child class then
            // only the parent's constructor will be run.
            super(game);

            this.lives = 6;
            this.width = 213; // the width and height of the angler sprite image
            this.height = 165;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
        }
    }
    class LuckyFish extends Enemy {
        constructor(game) {
            super(game);
            this.width  = 99;
            this.height = 95;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById("lucky");
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 5;
            this.score = 15;
            this.type  = 'lucky';
        }
    }
    class HiveWhale extends Enemy {
        constructor(game) {
            super(game);
            this.width  = 400;
            this.height = 227;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById("hive-whale");
            this.frameY = 0;
            this.lives = 20;
            this.score = 15;
            this.type  = 'hive';
            this.speedX = Math.random() * -1.2 - 0.2;
        }
    }
    class Drone extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width  = 115;
            this.height = 95;
            this.x = x;
            this.y = y;
            this.image = document.getElementById("drone");
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = 3;
            this.type  = 'drone';
            this.speedX = Math.random() * -4.2 - 0.5;
        }
    }


    class Layer {
        constructor(game, image, speedModifier) {
            this.game  = game;
            this.image = image;
            this.speedModifer = speedModifier;
            this.width  = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }

        update() {
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifer;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }


    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2');
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');

            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.4);
            this.layer3 = new Layer(this.game, this.image3, 1);
            this.layer4 = new Layer(this.game, this.image4, 1.5);

            // Layer 4 is left out here so that we can draw and update it separately
            // so the foreground objects it contains show up in front of all the
            // other elements.
            this.layers = [this.layer1, this.layer2, this.layer3];
        }

        update() {
            this.layers.forEach(layer => {
                layer.update();
            })
        }

        draw(context) {
            this.layers.forEach(layer => {
                layer.draw(context);
            })
        }
    }


    class Explosion {
        constructor(game, x, y) {
            this.game = game;
            this.frameX   = 0;
            this.maxFrame = 8;
            this.spriteHeight = 200;
            this.spriteWidth  = 200;
            this.width  = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = x - this.width * 0.5;
            this.y = y - this.height * 0.5;

            this.timer    = 0;
            this.fps      = 30;
            this.interval = 1000 / this.fps;
            this.markedForDeletion = false;
        }

        update(deltaTime) {
            this.x -= this.game.speed;

            if (this.timer > this.interval) {
                this.frameX++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
            if (this.frameX > this.maxFrame) this.markedForDeletion = true;
        }

        draw(context) {
            context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }
    class SmokeExplosion extends Explosion {
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById("smoke-explosion");
        }
    }
    class FireExplosion extends Explosion {
        constructor(game, x, y) {
            super(game, x, y);
            this.image = document.getElementById("fire-explosion");
        }
    }


    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Bangers';
            this.color = 'white';
        }

        draw(context) {
            // we save and restore so that the shadows won't apply
            // to any other of the elements. They only work if you use both.
            context.save();

            // display score
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.fillStyle = this.color;
            context.font = this.fontSize + 'px ' + this.fontFamily;
            context.fillText('Score: ' + this.game.score, 20, 40);

            // Shows time elapsed in game.
            // formattedTime shows time in seconds with one number after the decimal.
            // To fixed formats the number for one decimal place.
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Timer: ' + formattedTime, 20, 100)


            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;

                if (this.game.score > this.game.winningScore) {
                    message1 = 'Most Wondrous!';
                    message2 = 'Well done explorer!';
                } else {
                    message1 = 'Blazes!';
                    message2 = 'Get my repair kit and try again!';
                }

                context.font = '75px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '45px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }


            // ammo indicator
            if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 10 * i, 50, 3, 20); // x, y, width, height
            }


            context.restore();
        }
    }


    class Game {
        constructor(width, height) {
            this.width  = width;
            this.height = height;
            this.player = new Player(this);
            this.input  = new InputHandler(this);
            this.ui     = new UI(this);
            this.background = new Background(this);
            this.keys   = []; // contains pressed keyboard keys


            this.ammo         = 20;
            this.ammoTimer    = 0;
            this.ammoInterval = 350; // 500 milliseconds
            this.maxAmmo      = 50;


            this.enemies       = [];
            this.enemyTimer    = 0;
            this.enemyInterval = 2000;

            this.particles  = [];

            this.explosions = [];


            this.gameOver  = false;
            this.score     = 0;
            this.winningScore = 80;
            this.gameTime  = 30000;
            this.timeLimit = 0;
            this.speed     = 1;
            this.debug     = false;
        }

        update(deltaTime) {
            if (!this.gameOver) this.gameTime -= deltaTime;
            if (this.gameTime < this.timeLimit) this.gameOver = true;


            this.background.update();
            this.background.layer4.update();
            

            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) {
                    this.ammo += 1;    
                }

                this.ammoTimer = 0
            } else {
                this.ammoTimer += deltaTime;
            }

            this.particles.forEach(particle => particle.update());
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);

            this.explosions.forEach(explosion => explosion.update(deltaTime));
            this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);


            this.enemies.forEach(enemy => {
                enemy.update();

                // checks if enemies have collided with the player
                if (this.checkCollisions(this.player, enemy)) {
                    enemy.markedForDeletion = true;

                    if (enemy.type === 'lucky') this.player.enterPowerUp();
                    else if (enemy.type === 'hive') this.score -= 10
                    else if (!this.gameOver) this.score -= enemy.score;

                    // creates 10 particles coming from center of enemy
                    for (let i = 0; i < enemy.score; i++) {
                        this.particles.push(new Particle(this, enemy.x + (enemy.width - 25) * 0.5, enemy.y + enemy.height * 0.5));
                    }


                    this.addExplosion(enemy);
                }

                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollisions(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markedForDeletion = true;

                        // creates one particle if an enemy is hit.
                        this.particles.push(new Particle(this, enemy.x + (enemy.width - 25) * 0.5, enemy.y + enemy.height * 0.5));

                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;

                            // check if hive whale
                            if (enemy.type == 'hive') {
                                for (let i = 0; i < 5; i++) {
                                    // drones x position will be somewhere within where
                                    // the whale was when it was destroyed.
                                    let x_pos = enemy.x + Math.random() * enemy.width;
                                    let y_pos = enemy.y + Math.random() * enemy.height * 0.5;
                                    this.enemies.push(new Drone(this, x_pos, y_pos));
                                }
                            }

                            this.addExplosion(enemy);

                            // creates 10 particles coming from center of enemy
                            for (let i = 0; i < enemy.score; i++) {
                                this.particles.push(new Particle(this, enemy.x + (enemy.width - 25) * 0.5, enemy.y + enemy.height * 0.5));
                            }

                            if (!this.gameOver) this.score += enemy.score;

                            // if (this.score > this.winningScore) {
                            //     this.gameOver = true;
                            // }
                        }
                    }
                });
            })

            // creates a new array of enemies containing only those which aren't
            // marked for deletion
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }

        draw(context) {
            // The order each of these are called in will determine whether
            // they're on top or below eachother.
            this.background.draw(context);
            this.player.draw(context);

            this.ui.draw(context);
            
            this.particles.forEach(particle => particle.draw(context));

            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            this.explosions.forEach(explosion => explosion.draw(context));

            // This goes last so that the foreground objects show up in front
            // of everything else.
            this.background.layer4.draw(context);
        }

        addEnemy() {
            const randomize = Math.random();
            if (randomize < 0.3) this.enemies.push(new Angler1(this))
            else if (randomize < 0.6) this.enemies.push(new Angler2(this))
            else if (randomize < 0.7) this.enemies.push(new HiveWhale(this))
            else this.enemies.push(new LuckyFish(this));
        }

        addExplosion(enemy) {
            const randomize = Math.random();
            if (randomize < 0.5) {
                this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.height * 0.5, enemy.y + enemy.width * 0.5));
            } else {
                this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
            }
        }

        checkCollisions(rect1, rect2) {
            return (rect1.x < rect2.x + rect2.width  &&
                    rect1.x + rect1.width > rect2.x  &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.height + rect1.y > rect2.y)            
        }
    }



    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    // animation loop
    function animate(timeStamp) {
        // this clears the canvas between each repaint.
        // If this isn't here we would see what was on the canvas previously too.
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // requestAnimationFrame automatically passes a timstamp argument
        // We've called that argument timeStamp
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate);
    }

    // we pass zero in here so that the first timestamp is zero.
    animate(0);
});