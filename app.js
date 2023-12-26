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
  
  function preload() {
    // Load your assets here (images, spritesheets, etc.)
    this.load.image('sprite', 'images/bakery.png');
  }
  
  function create() {
    // Get the dimensions of the game canvas
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Define a fixed size for the sprite (adjust as needed)
    const fixedWidth = 200;
    const fixedHeight = 200;

    // Calculate the center of the game's dimensions
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Create a rectangle filled with the specified color
    const graphics = this.add.graphics();
    graphics.fillStyle(0x8CDE76); // Set the fill color using hexadecimal value
    graphics.fillRect(0, 0, width, height); // Fill the entire canvas with the color

    // Create a sprite at the calculated center, set it interactive for clicking, and set its display size
    const sprite = this.add.sprite(centerX, centerY, 'sprite').setInteractive();

    // Set a fixed size for the sprite relative to the game's dimensions
    const scaleX = fixedWidth / sprite.width;
    const scaleY = fixedHeight / sprite.height;
    sprite.setScale(scaleX, scaleY);

    // Define what happens when the sprite is clicked
    sprite.on('pointerdown', function() {
        // Handle the click event (e.g., add functionality)
        console.log('Sprite clicked!');
    });
}

  