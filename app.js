// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1200,
    scene: {
      preload: preload,
      create: create
    }
  };
  
  const game = new Phaser.Game(config);

  let treatTokensText;
  let treatTokens = 0;
  let craftedCookiesText;
  let craftedCookies = 0;
  let counterValue = 1;
  let testText;

  let menu;

  let sparkle;
  let walkingSprite;
  let walkingSprites = [];

  let speedMultiplier = 1.0;


  /////UPGRADES STATUS 
  let domainUP = 1;
  let cookieMakerUP = 1;
  let deliveryUP = 1;
  let sandTRUP = 1;
  let tallGrassTRUP = 1;
  let waterTRUP = 1;
  let snowTRUP = 1;

  //////UPGRADES COST
  const domainUP2 = 2000; 
  const domainUP3 = 4000;
  const domainUP4 = 8000;
  const domainUP5 = 10000;   

  const cookieMakerUP2 = 200;
  const cookieMakerUP3 = 800;
  const cookieMakerUP4 = 1000;
  const cookieMakerUP5 = 1500;

  const deliveryUP2 = 200;
  const deliveryUP3 = 800;
  const deliveryUP4 = 1000;
  const deliveryUP5 = 1500;

  const sandTRUP2 = 800;
  const sandTRUP3 = 2000;
  const sandTRUP4 = 5000;

  const tallGrassTRUP2 = 1000;
  const tallGrassTRUP3 = 2000;
  const tallGrassTRUP4 = 5000;

  const waterTRUP2 = 1500;
  const waterTRUP3 = 3000;
  const waterTRUP4 = 8000;

  const snowTRUP2 = 1500;
  const snowTRUP3 = 3000;
  const snowTRUPP4 = 8000;

  
  
  function preload() {
    // Load your assets here (images, spritesheets, etc.)
    this.load.image('grass', 'images/Tileset/64x64Rumput.png');

    this.load.image('bakery', 'images/bakery.png');
    this.load.image('courier', 'images/courier.png');
    this.load.image('house', 'images/House_01.png');

    /////MENU
    this.load.spritesheet('menu', 'images/menu.png', {
        frameWidth: 800,
        frameHeight: 800,
    });

    // Load the sprite sheet containing the walking animation frames
    this.load.spritesheet('walkingCharacter', 'images/cat-anim.png', {
        frameWidth: 320,
        frameHeight: 320,
    });
    this.load.spritesheet('sparkle', 'images/sparkle.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
    this.load.spritesheet('bakeryAnim', 'images/bakery-anim.png', {
        frameWidth: 320,
        frameHeight: 320,
    });
    this.load.spritesheet('courierAnim', 'images/courier-anim.png', {
        frameWidth: 320,
        frameHeight: 320,
    });
    this.load.spritesheet('heartAnim', 'images/heart-anim.png', {
        frameWidth: 64,
        frameHeight: 64,
    });
  }
  
  function create() {///////SET DIMENSIONS
    // Get the dimensions of the game canvas
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Define a fixed size for the sprite (adjust as needed)
    const fixedWidth = 200;
    const fixedHeight = 200;

    // Calculate the center of the game's dimensions
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    let zoomLevel = 1.0;
    const maxZoomLevel = 2.0;
    let currentZoomIndex = 0;
    const zoomLevels = [1.0, 1.5, 1.8, 2.5];

    const boundsWidth = 800;
    const boundsHeight = 600;
    const boundsX = centerX - boundsWidth / 2;
    const boundsY = centerY - boundsHeight / 2;

    const houses = [
        // Houses for zoom level 1.0 (Keeping original)
        { x: 600, y: 500 },
        { x: 1000, y: 600 },
        { x: 700, y: 800 },
        { x: 550, y: 300 }, // Additional house for 1.0 zoom level
        { x: 120, y: 290 }, 
        { x: 250, y: 370 }, 
        { x: 435, y: 450 }, 
        { x: 135, y: 530 }, 
        { x: 330, y: 580 }, 
        { x: 220, y: 930 }, 
        { x: 600, y: 970 }, 
        { x: 1480, y: 300 }, 
        { x: 1450, y: 700 }, 

        // Houses for zoom level 1.3 (Replacing 1.5)
        { x: 800, y: 300 },
        { x: 400, y: 900 },
        { x: 500, y: 200 },
        { x: 100, y: 1100 }, // Additional house for 1.3 zoom level
        { x: 520, y: 690 }, 
        { x: 1200, y: 530 }, 
        { x: 1220, y: 750 }, 
        { x: 1170, y: 950 }, 
        { x: 1370, y: 880 }, 
        { x: 820, y: 1040 }, 
        { x: 1300, y: 630 }, 
        { x: 1050, y: 1090 }, 
        { x: 1340, y: 1030 }, 
        { x: 1465, y: 1080 }, 

        // Houses for zoom level 1.8 (Keeping original)
        { x: 200, y: 700 },
        { x: 1400, y: 500 },
        { x: 300, y: 1100 },
        { x: 1200, y: 200 }, // Additional house for 1.8 zoom level
        { x: 1000, y: 420 }, 
        { x: 980, y: 930 }, 
        { x: 770, y: 925 }, 
        { x: 1100, y: 830 }, 

        // Houses for zoom level 2.5 (Keeping original)
        { x: 1200, y: 300 },
        { x: 200, y: 1100 },
        { x: 600, y: 200 },
        { x: 300, y: 800 } // Additional house for 2.5 zoom level
    ];



    //////DRAGGABLE SCENE
    // Enable Phaser's built-in drag feature for the game camera
    this.cameras.main.setBounds(0,0,width,height);
    // this.cameras.main.setBounds(boundsX, boundsY, boundsWidth, boundsHeight); // Set bounds of the map
    this.cameras.main.setZoom(zoomLevel); // Set initial zoom level

     // Center the camera on load
    this.cameras.main.centerToBounds();

    // Enable drag functionality for the camera (allowing the screen to be dragged)
    this.input.addPointer(2); // Enable multi-touch

   
    // Enable drag functionality for the camera (allowing the screen to be dragged)
    var isDragging = false;
    var lastPointer;

    this.input.on('pointerdown', function (pointer) {
        isDragging = true;
        lastPointer = pointer.position.clone();
    }, this);

    this.input.on('pointermove', function (pointer) {
        if (isDragging) {
            var movementX = pointer.position.x - lastPointer.x;
            var movementY = pointer.position.y - lastPointer.y;

            this.cameras.main.scrollX -= movementX / this.cameras.main.zoom;
            this.cameras.main.scrollY -= movementY / this.cameras.main.zoom;

            lastPointer = pointer.position.clone();
        }
    }, this);

    this.input.on('pointerup', function () {
        isDragging = false;
    }, this);

    // Limit maximum zoom level
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        currentZoomIndex -= Phaser.Math.Clamp(deltaY, -1, 1);
        currentZoomIndex = Phaser.Math.Clamp(currentZoomIndex, 0, zoomLevels.length - 1);
    
        const newZoomLevel = zoomLevels[currentZoomIndex];
        const currentZoomLevel = this.cameras.main.zoom;
    
        if (newZoomLevel !== currentZoomLevel) {
          this.cameras.main.zoomTo(newZoomLevel, 300); // Adjust the duration (300 milliseconds) as needed
        }
      });


    ///////ADD BACKGROUND
    // Create a rectangle filled with the specified color
    const graphics = this.add.graphics();
    graphics.fillStyle(0x8CDE76); // Set the fill color using hexadecimal value
    graphics.fillRect(0, 0, width, height); // Fill the entire canvas with the color

     // Create a tiling sprite using the loaded tile image
     const tileSprite = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'grass');
     // Set the origin of the tiling sprite to the top-left corner
     tileSprite.setOrigin(0, 0);
     // Set the scale mode to repeat
     tileSprite.setTileScale(1, 1); // Adjust the scale as needed

     const blockCells = (x, y) => {
        const gridX = Math.floor(x / gridSize);
        const gridY = Math.floor(y / gridSize);
        grid[gridX][gridY] = 1; // Mark the cell as blocked (1 represents blocked)
    };


    ///////ADD BAKERY
    // Create a sprite at the calculated center, set it interactive for clicking, and set its display size
    const bakery = this.add.sprite(centerX - 55, centerY, 'bakery').setInteractive({ pixelPerfect: true });

    // Set a fixed size for the sprite relative to the game's dimensions
    const bScaleX = fixedWidth / bakery.width;
    const bScaleY = fixedHeight / bakery.height;
    bakery.setScale(bScaleX, bScaleY);

    ///////ADD COURIER
     const courier = this.add.sprite(centerX + 55, centerY+25, 'courier').setInteractive({ pixelPerfect: true });

     // Set a fixed size for the sprite relative to the game's dimensions
     const cScaleX = fixedWidth / courier.width;
     const cScaleY = fixedHeight / courier.height;
     courier.setScale(cScaleX/1.5, cScaleY/1.5);


    ///////ADD HOUSE
      // Create houses at specific positions
      houses.forEach(element => {
        createHouse(this, element.x, element.y);
      });


    ////////BLOCK
    const gridSize = 10; // Define the size of each grid cell
    const gridWidth = game.config.width / gridSize;
    const gridHeight = game.config.height / gridSize;

    const grid = [];
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = [];
        for (let j = 0; j < gridHeight; j++) {
            grid[i][j] = 0; // Initialize each cell as unblocked (0 represents unblocked)
        }
    }

    // Example usage for the bakery, courier, and houses
    blockCells(bakery.x, bakery.y);
    blockCells(courier.x, courier.y);
    blockCells(200, 100); // For the houses at specific positions
    blockCells(600, 300);
    blockCells(300, 500);


    //////MENU
   ////MENU BASE
    let currentFrame = 0; // Track the current frame displayed

     // Create menu sprite and position it at the center of the screen
     const menuSprite1 = this.add.sprite(this.cameras.main.width / 6, this.cameras.main.height / 6, 'menu', currentFrame);
     const menuSpriteX = this.add.sprite(this.cameras.main.width / 6, this.cameras.main.height / 6, 'menu', 2);
     const menuSpriteArrow = this.add.sprite(this.cameras.main.width / 6, this.cameras.main.height / 6, 'menu', 3);
     const menuSpriteInventory = this.add.sprite(this.cameras.main.width / 6, 0, 'menu', 6);

     menuSprite1.setScale(0.5,0.5);
     menuSprite1.setDepth(98);

     menuSpriteX.setVisible(false);
     menuSpriteX.setScale(0.5,0.5);
     menuSpriteX.setDepth(99);

     menuSpriteArrow.setVisible(false);
     menuSpriteArrow.setScale(0.5,0.5);
     menuSpriteArrow.setDepth(99);
     
     menuSpriteInventory.setScale(0.68,0.68);
     menuSpriteInventory.setDepth(97)
     menuSpriteInventory.setVisible(false);

     // Set interactive to enable pointer events
     menuSprite1.setInteractive({ pixelPerfect: true });
     menuSpriteX.setInteractive({ pixelPerfect: true });
     menuSpriteArrow.setInteractive({ pixelPerfect: true });

     menuSprite1.on('pointerdown', function () {
        if(currentFrame == 0){
            currentFrame = 1;
            menuSpriteX.setVisible(true);
            menuSpriteArrow.setVisible(true);
    
            menuSprite1.setTexture('menu', currentFrame);
            menuSpriteX.setTexture('menu', 2)
            menuSpriteArrow.setTexture('menu', 3)

            menuSprite1.setScale(0.5,0.5);
            menuSpriteX.setScale(0.5,0.5);
        }
     });

     menuSpriteX.on('pointerdown', function () {
        currentFrame = 0;
        menuSpriteX.setVisible(false);
        menuSpriteArrow.setVisible(false);

        menuSprite1.setTexture('menu', currentFrame);

        menuSprite1.setScale(0.5,0.5);
        menuSpriteX.setScale(0.5,0.5);
    });

    menuSpriteArrow.on('pointerdown', function () {
        if(currentFrame == 1){
            currentFrame = 4;
            menuSpriteX.setVisible(true);
            menuSpriteArrow.setVisible(false);
    
            menuSprite1.setTexture('menu', currentFrame);
            menuSpriteX.setTexture('menu', 5);

            menuSprite1.setScale(0.5,0.5);
            menuSpriteX.setScale(0.5,0.5);
        }
    });

    //  // Create menu sprite and position it at the center of the screen
    //  const menuSprite = this.add.sprite(this.cameras.main.width/6, this.cameras.main.height/6, 'menu', currentFrame);
    //  menuSprite.setScale(0.5, 0.5);

    //  // Set interactive to enable pointer events
    //  menuSprite.setInteractive();

    //  menuSprite.on('pointerdown', function () {
    //      if (currentFrame === 0) {
    //          currentFrame = 1;
    //      } else if (currentFrame === 1) {
    //          currentFrame = 0;
    //      }

    //      menuSprite.setTexture('menu', currentFrame);
    //  });



    menuSprite1.setOrigin(0, 0); // Set text origin to center
    menuSprite1.setScrollFactor(0); // Keep the text fixed on the screen
    menuSpriteX.setOrigin(0, 0); // Set text origin to center
    menuSpriteX.setScrollFactor(0); // Keep the text fixed on the screen
    menuSpriteArrow.setOrigin(0, 0); // Set text origin to center
    menuSpriteArrow.setScrollFactor(0); // Keep the text fixed on the screen
    menuSpriteInventory.setOrigin(0, 0); // Set text origin to center
    menuSpriteInventory.setScrollFactor(0); // Keep the text fixed on the screen


    ////MENU - TREAT TOKENS
      // Create overlay text at the center of the screen
      treatTokensText = this.add.text(
        game.config.width - (game.config.width /5),
        game.config.height /5,
        'Treat Tokens: 0',
        {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'right'
        }
    );
    treatTokensText.setOrigin(1, 0); // Set text origin to center

    treatTokensText.setScrollFactor(0); // Keep the text fixed on the screen

    ////MENU - CRAFTED COOKIES
       // Create overlay text at the center of the screen
       craftedCookiesText = this.add.text(
        game.config.width - (game.config.width /5),
        game.config.height /4,
        'Crafted Cookies: 0',
        {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'right'
        }
    );
    craftedCookiesText.setOrigin(1, 0); // Set text origin to center

    craftedCookiesText.setScrollFactor(0); // Keep the text fixed on the screen
    


    //////TEST
    // Create overlay text at the center of the screen
    testText = this.add.text(
        game.config.width - (game.config.width /5),
        game.config.height /3,
        'testing',
        {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'right'
        }
    );
    testText.setOrigin(1, 0); // Set text origin to center

    testText.setScrollFactor(0); // Keep the text fixed on the screen

    this.input.on('pointermove', (pointer) => {
        testText.setText(`Mouse X: ${pointer.x}, Mouse Y: ${pointer.y}`);
      });

    


    /////ANIMATIONS
    // Create the walking animation
    this.anims.create({
    key: 'walkDown',
    frames: this.anims.generateFrameNumbers('walkingCharacter', {
        /* Define the frame range for the walking animation */
        /* For example: start: 0, end: 7 (assuming 8 frames) */
        start:0, 
        end: 3
    }),
    frameRate: 8,
    repeat: -1 // Set to -1 for infinite looping
    });

    this.anims.create({
        key: 'walkLeft',
        frames: this.anims.generateFrameNumbers('walkingCharacter', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:4, 
            end: 7
        }),
        frameRate: 8,
        repeat: -1 // Set to -1 for infinite looping
    });

    this.anims.create({
        key: 'walkRight',
        frames: this.anims.generateFrameNumbers('walkingCharacter', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:8, 
            end: 11
        }),
        frameRate: 8,
        repeat: -1 // Set to -1 for infinite looping
    });

    ///tokens
    this.anims.create({
        key: 'walkDownToken',
        frames: this.anims.generateFrameNumbers('walkingCharacter', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:12, 
            end: 15
        }),
        frameRate: 8,
        repeat: -1 // Set to -1 for infinite looping
        });
    
        this.anims.create({
            key: 'walkLeftToken',
            frames: this.anims.generateFrameNumbers('walkingCharacter', {
                /* Define the frame range for the walking animation */
                /* For example: start: 0, end: 7 (assuming 8 frames) */
                start:16, 
                end: 19
            }),
            frameRate: 8,
            repeat: -1 // Set to -1 for infinite looping
        });
    
        this.anims.create({
            key: 'walkRightToken',
            frames: this.anims.generateFrameNumbers('walkingCharacter', {
                /* Define the frame range for the walking animation */
                /* For example: start: 0, end: 7 (assuming 8 frames) */
                start:20, 
                end: 23
            }),
            frameRate: 8,
            repeat: -1 // Set to -1 for infinite looping
        });

    this.anims.create({
        key: 'sparkleAnim',
        frames: this.anims.generateFrameNumbers('sparkle', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:0, 
            end: 5
        }),
        frameRate: 15,
        repeat: 0 // Set to -1 for infinite looping
    });

    this.anims.create({
        key: 'bakeryAnim',
        frames: this.anims.generateFrameNumbers('bakeryAnim', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:0, 
            end: 7
        }),
        frameRate: 24,
        repeat: 0 // Set to -1 for infinite looping
    });

    this.anims.create({
        key: 'courierAnim',
        frames: this.anims.generateFrameNumbers('courierAnim', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:0, 
            end: 3
        }),
        frameRate: 9,
        repeat: 0 // Set to -1 for infinite looping
    });

    this.anims.create({
        key: 'heartAnim',
        frames: this.anims.generateFrameNumbers('heartAnim', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:0, 
            end: 5
        }),
        frameRate: 10,
        repeat: 0 // Set to -1 for infinite looping
    });


    //////BAKERY ON CLICK
    bakery.on('pointerdown', function() {
        craftedCookies += counterValue;
        craftedCookiesText.setText('Crafted Cookies: ' + craftedCookies);


        /////BOUNCE
        if (bakery.anims.isPlaying) {
            bakery.anims.stop('bakeryAnim'); // Stop the animation if it's already playing
            bakery.setFrame(0); // Reset the bakery sprite to the first frame
        } else {
            bakery.play('bakeryAnim'); // Play the bakery animation if it's not playing
        }

      ///////SPARKLE
      if (!sparkle || !sparkle.anims.isPlaying) {
        sparkle = this.add.sprite(bakery.x, bakery.y - 50, 'sparkle');
        sparkle.setScale(2.5);
        sparkle.anims.play('sparkleAnim');

        sparkle.on('animationcomplete', function () {
            sparkle.setVisible(false);
        }, this);
    }

    }, this);

    //////COURIER ON CLICK
    courier.on('pointerdown', function() {
        if (craftedCookies > 0) {
            craftedCookies -= counterValue;
            craftedCookiesText.setText('Crafted Cookies: ' + craftedCookies);
    
            const randomHouse = Phaser.Math.RND.pick(houses);
            const houseX = randomHouse.x;
            const houseY = randomHouse.y + 20;
          

            //SPARKLE
            if (!sparkle || !sparkle.anims.isPlaying) {
                sparkle = this.add.sprite(courier.x, courier.y - 50, 'sparkle');
                sparkle.setScale(2.5);
                sparkle.anims.play('sparkleAnim');
        
                sparkle.on('animationcomplete', function () {
                    sparkle.setVisible(false);
                }, this);
            }

               /////BOUNCE
                if (courier.anims.isPlaying) {
                    courier.anims.stop('courierAnim'); // Stop the animation if it's already playing
                    courier.setFrame(0); // Reset the bakery sprite to the first frame
                } else {
                    courier.play('courierAnim'); // Play the bakery animation if it's not playing
                }
            
            
           
            let isAboveCourier = true;
            if(houseY > courier.y + 70){
                isAboveCourier = false;
            }
            

            /////WALKING SPRITE
            let newWalkingSprite = this.add.sprite(courier.x, courier.y +30, 'walkingCharacter');

            ////WALKING SPRITE SCALE
            newWalkingSprite.setScale(0.2, 0.2)

            ////WALKING SPRITE DEPTH
            newWalkingSprite.setDepth(4); // Set walkingSprite's depth
            courier.setDepth(4); // Set courier's depth
            bakery.setDepth(2);

            newWalkingSprite.depth = isAboveCourier ? courier.depth - 3 : courier.depth + 3;

            ////WALKING SPRITE DIRECTION
            let direction;
            const horizontalThreshold = 10; // Set the vertical distance threshold

            if (houseY > courier.y && Math.abs(houseX - courier.x) < horizontalThreshold) {
                direction = 'walkDown'; // Use 'walkDown' if the vertical distance exceeds the threshold
            } else if (houseX < courier.x) {
                direction = 'walkLeft';
            } else if (houseX > courier.x) {
                direction = 'walkRight';
            } else {
                direction = 'walkRight'; // Default direction if both X and Y are equal
            }
            
            // Play the respective animation based on direction
            newWalkingSprite.anims.play(direction);
            walkingSprites.push(newWalkingSprite);


            ////WALKING SPEED
            // Calculate speed multiplier based on the distance relative to the reference distance
            walkingDuration = calculateDeliveryDuration(newWalkingSprite.x, newWalkingSprite.y, houseX, houseY);
            


            ////WALKING TO DELIVER
            this.tweens.add({
                targets: newWalkingSprite,
                x: houseX,
                y: houseY,
                duration: walkingDuration, // Duration for the sprite to reach the house
                onComplete: () => {
                    newWalkingSprite.setVisible(false);

                    // Create a sprite for the heart animation
                    let heartSprite = this.add.sprite(houseX, houseY - 60, 'heartAnim');
                    heartSprite.setScale(2,2)
                    // Play the 'heartAnim' animation
                    heartSprite.anims.play('heartAnim');
                    // You might want to set a callback to hide the heart sprite after the animation completes
                    heartSprite.on('animationcomplete', function () {
                        heartSprite.setVisible(false);
                    }, this);

    
                    setTimeout(() => {
                        newWalkingSprite.setVisible(true);
                        newWalkingSprite.setPosition(houseX, houseY);

                         ////WALKING SPRITE DIRECTION
                        let directionBack;
                        const horizontalThreshold = 10; // Set the vertical distance threshold

                        if (houseY < courier.y && Math.abs(houseX - courier.x) < horizontalThreshold) {
                            directionBack = 'walkDownToken'; // Use 'walkDown' if the vertical distance exceeds the threshold
                        } else if (houseX > courier.x) {
                            directionBack = 'walkLeftToken';
                        } else if (houseX < courier.x) {
                            directionBack = 'walkRightToken';
                        } else {
                            directionBack = 'walkRightToken'; // Default direction if both X and Y are equal
                        }
                        
                        // Play the respective animation based on direction
                        newWalkingSprite.anims.play(directionBack);
                        walkingSprites.push(newWalkingSprite);

                        ////WALKING SPEED
                        // Calculate speed multiplier based on the distance relative to the reference distance
                        walkingDuration = calculateDeliveryDuration(newWalkingSprite.x, newWalkingSprite.y, courier.x, courier.y + 70);

    
                        ////WALKING BACK
                        this.tweens.add({
                            targets: newWalkingSprite,
                            x: courier.x,
                            y: courier.y + 30,
                            duration: walkingDuration, // Duration for the sprite to return to the courier
                            onComplete: () => {
                                newWalkingSprite.setVisible(false);
                                walkingSprites = walkingSprites.filter(sprite => sprite !== newWalkingSprite);
                                newWalkingSprite.destroy();

                                treatTokens += counterValue;
                                treatTokensText.setText('Treat Tokens: ' + treatTokens);
                            },
                            onCompleteScope: this
                        });
                    }, 500); // Delay before returning to the courier in milliseconds
                },
                onCompleteScope: this
            });
        }
    }, this);
    


}


function createHouse(scene, x, y) {
    const house = scene.add.image(x, y, 'house');
    house.setScale(0.7, 0.7)
    // Add other house settings or functionality here if desired
}

function calculateDeliveryDuration(fromX, fromY, toX, toY){

    ///////WALKING SPEED
    const distance = Phaser.Math.Distance.Between(fromX, fromY, toX, toY);

    const referenceDistance = 100; // You can adjust this based on your preferences
    const referenceDuration = 1000; // The reference duration in milliseconds

    const speedMultiplier = distance / referenceDistance;
    // Calculate speed multiplier based on the distance relative to the reference distance
    return walkingDuration = referenceDuration * speedMultiplier;
}


function upgradeDomain(){

}

function upgradeCookieMaker(){

}

function upgradeDelivery(){

}

function upgradeSandTR(){

}

function upgradeTallGrassTR(){

}

function upgradeWaterTR(){

}

function upgradeSnow(){
    
}