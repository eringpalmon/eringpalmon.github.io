// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

  let sparkle;
  let walkingSprite;
  let walkingSprites = [];

  let speedMultiplier = 1.0;

  
  function preload() {
    // Load your assets here (images, spritesheets, etc.)
    this.load.image('bakery', 'images/bakery.png');
    this.load.image('courier', 'images/courier.png');
    this.load.image('house', 'images/House_01.png');
      // Load the sprite sheet containing the walking animation frames
      this.load.spritesheet('walkingCharacter', 'images/slimebuddy.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
    this.load.spritesheet('sparkle', 'images/sparkle.png', {
        frameWidth: 32,
        frameHeight: 32,
    });
  }
  
  function create() {
    ///////SET DIMENSIONS
    // Get the dimensions of the game canvas
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Define a fixed size for the sprite (adjust as needed)
    const fixedWidth = 200;
    const fixedHeight = 200;

    // Calculate the center of the game's dimensions
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const zoomLevel = 1.5;

    const houses = [
        { x: 200, y: 100 },
        { x: 600, y: 300 },
        { x: 300, y: 500 }
    ];



    //////DRAGGABLE SCENE
    // Enable Phaser's built-in drag feature for the game camera
    this.cameras.main.setBounds(0, 0, width, height); // Set bounds of the map
    this.cameras.main.setZoom(zoomLevel); // Set initial zoom level

    // Enable drag functionality for the camera (allowing the screen to be dragged)
    this.input.on('pointerdown', function (pointer) {
        if (pointer.isDown) {
            this.input.mouse.requestPointerLock(); // Lock the mouse pointer for dragging
        }
    }, this);

    this.input.on('pointermove', function (pointer) {
        if (pointer.isDown) {
            if (this.input.mouse.locked) {
                this.cameras.main.scrollX -= pointer.movementX / this.cameras.main.zoom;
                this.cameras.main.scrollY -= pointer.movementY / this.cameras.main.zoom;
            }
        }
    }, this);

    this.input.on('pointerup', function (pointer) {
        this.input.mouse.releasePointerLock(); // Release the mouse pointer lock
    }, this);


    ///////ADD BACKGROUND
    // Create a rectangle filled with the specified color
    const graphics = this.add.graphics();
    graphics.fillStyle(0x8CDE76); // Set the fill color using hexadecimal value
    graphics.fillRect(0, 0, width, height); // Fill the entire canvas with the color


    ///////ADD BAKERY
    // Create a sprite at the calculated center, set it interactive for clicking, and set its display size
    const bakery = this.add.sprite(centerX - 53, centerY, 'bakery').setInteractive();

    // Set a fixed size for the sprite relative to the game's dimensions
    const bScaleX = fixedWidth / bakery.width;
    const bScaleY = fixedHeight / bakery.height;
    bakery.setScale(bScaleX, bScaleY);

    ///////ADD COURIER
     const courier = this.add.sprite(centerX + 53, centerY, 'courier').setInteractive();

     // Set a fixed size for the sprite relative to the game's dimensions
     const cScaleX = fixedWidth / courier.width;
     const cScaleY = fixedHeight / courier.height;
     courier.setScale(cScaleX, cScaleY);


    ///////ADD HOUSE
      // Create houses at specific positions
      createHouse(this, 200, 100);
      createHouse(this, 600, 300);
      createHouse(this, 300, 500);




    //////MENU
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


    /////ANIMATIONS
      // Create the walking animation
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('walkingCharacter', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
            start:21, 
            end: 25
        }),
        frameRate: 10,
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
        frameRate: 5,
        repeat: 0 // Set to -1 for infinite looping
    });


    //////BAKERY ON CLICK
    bakery.on('pointerdown', function() {
        craftedCookies += counterValue;
        craftedCookiesText.setText('Crafted Cookies: ' + craftedCookies);

        sparkle = this.add.sprite(bakery.x, bakery.y - 50, 'sparkle');
        sparkle.setScale(bakery.scaleX, bakery.scaleY);
        sparkle.anims.play('sparkleAnim');

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
            sparkle = this.add.sprite(courier.x, courier.y - 50, 'sparkle');
            sparkle.setScale(courier.scaleX, courier.scaleY);
            sparkle.anims.play('sparkleAnim');
            
           
            let isAboveCourier = true;
            if(houseY > courier.y){
                isAboveCourier = false;
            }
            

            /////WALKING SPRITE
            let newWalkingSprite = this.add.sprite(courier.x, courier.y + 70, 'walkingCharacter');
            
            newWalkingSprite.setDepth(3); // Set walkingSprite's depth
            courier.setDepth(3); // Set courier's depth
            bakery.setDepth(1);

            newWalkingSprite.depth = isAboveCourier ? courier.depth - 1 : courier.depth + 1;

            newWalkingSprite.anims.play('walk');
            walkingSprites.push(newWalkingSprite);



            ///////WALKING SPEED
            const distance = Phaser.Math.Distance.Between(newWalkingSprite.x, newWalkingSprite.y, houseX, houseY);

            const referenceDistance = 1000; // You can adjust this based on your preferences
            const referenceDuration = 1000; // The reference duration in milliseconds

            // Calculate speed multiplier based on the distance relative to the reference distance
            walkingDuration = Phaser.Math.Interpolation.Linear([referenceDistance, referenceDuration], distance);
            // speedMultiplier = walkingDuration / referenceDuration;

            console.log(walkingDuration, distance);

            ////WALKING BACK
            this.tweens.add({
                targets: newWalkingSprite,
                x: houseX,
                y: houseY,
                duration: walkingDuration, // Duration for the sprite to reach the house
                onComplete: () => {
                    newWalkingSprite.setVisible(false);
    
                    treatTokens += counterValue;
                    treatTokensText.setText('Treat Tokens: ' + treatTokens);
    
                    setTimeout(() => {
                        newWalkingSprite.setVisible(true);
                        newWalkingSprite.setPosition(houseX, houseY);
    
                        this.tweens.add({
                            targets: newWalkingSprite,
                            x: courier.x,
                            y: courier.y + 70,
                            duration: walkingDuration, // Duration for the sprite to return to the courier
                            onComplete: () => {
                                newWalkingSprite.setVisible(false);
                                walkingSprites = walkingSprites.filter(sprite => sprite !== newWalkingSprite);
                                newWalkingSprite.destroy();
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
    // Add other house settings or functionality here if desired
}
