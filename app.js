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

  let counterText;
  let totalCounter = 0;
  let counterValue = 1;
  let walkingSprite;

  
  function preload() {
    // Load your assets here (images, spritesheets, etc.)
    this.load.image('bakery', 'images/bakery.png');
    this.load.image('house', 'images/House_01.png');
      // Load the sprite sheet containing the walking animation frames
      this.load.spritesheet('walkingCharacter', 'images/slimebuddy.png', {
        frameWidth: 192,
        frameHeight: 352,
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
    const bakery = this.add.sprite(centerX, centerY, 'bakery').setInteractive();

    // Set a fixed size for the sprite relative to the game's dimensions
    const scaleX = fixedWidth / bakery.width;
    const scaleY = fixedHeight / bakery.height;
    bakery.setScale(scaleX, scaleY);


    ///////ADD HOUSE
      // Create houses at specific positions
      createHouse(this, 200, 100);
      createHouse(this, 600, 300);
      createHouse(this, 300, 500);




    //////MENU
      // Create overlay text at the center of the screen
      counterText = this.add.text(
        game.config.width - (game.config.width /5),
        game.config.height /5,
        'Clicks: 0',
        {
            fontSize: '16px',
            fill: '#ffffff',
            align: 'right'
        }
    );
    counterText.setOrigin(1, 0); // Set text origin to center

    counterText.setScrollFactor(0); // Keep the text fixed on the screen


    /////WALKING ANIMATION
      // Create the walking animation
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('walkingCharacter', {
            /* Define the frame range for the walking animation */
            /* For example: start: 0, end: 7 (assuming 8 frames) */
        }),
        frameRate: 5,
        repeat: -1 // Set to -1 for infinite looping
    });


    //////BAKERY ON CLICK
    bakery.on('pointerdown', function() {
        if (!walkingSprite) {
            const randomHouse = Phaser.Math.RND.pick(houses);
            walkingSprite = this.add.sprite(bakery.x, bakery.y, 'walkingCharacter');
            walkingSprite.play('walk');

            const houseX = randomHouse.x;
            const houseY = randomHouse.y;
    
            this.tweens.add({
                targets: walkingSprite,
                x: houseX,
                y: houseY,
                duration: 1000, // Duration for the sprite to reach the house
                onComplete: () => {
                    walkingSprite.setVisible(false);
                    totalCounter += counterValue;
                    counterText.setText('Clicks: ' + totalCounter);
    
                    // Using setTimeout with arrow function to maintain 'this' context
                    setTimeout(() => {
                        walkingSprite.setVisible(true);
                        walkingSprite.setPosition(houseX, houseY);
    
                        this.tweens.add({
                            targets: walkingSprite,
                            x: bakery.x,
                            y: bakery.y,
                            duration: 1000, // Duration for the sprite to return to the bakery
                            onComplete: () => {
                                walkingSprite.setVisible(false);
                                walkingSprite = null;
                            },
                            onCompleteScope: this
                        });
                    }, 500); // Delay before returning to the bakery in milliseconds
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
