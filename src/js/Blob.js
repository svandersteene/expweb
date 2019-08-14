export default class Blob {

  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.createBlob();
  }

  get randomPosition() {
    return Math.floor((Math.random() - 0.5) * 40);
  }

  get startPosition() {
    return - Math.floor((Math.random() * 50) + 50);
  }

  /**
   * Create one blob and add it to the scene
   */
  createBlob() {
    this.blob = document.createElement('a-entity');
    this.blob.setAttribute('geometry', 'primitive: octahedron');
    this.blob.setAttribute('material', 'color: grey; radius: 1');
    this.blob.setAttribute('position', {x: this.randomPosition, y: this.randomPosition, z: this.startPosition});
    this.blob.setAttribute('rotation', '0 0 0');
    this.blob.setAttribute('animation', 'property: rotation; to: 360 360 360; loop: true; dur: 3000; easing: linear');
    this.scene.appendChild(this.blob);
  }

  /**
   * Called when the gameloop starts
   * Makes the blob move towards the player
   */
  moveBlob() {
    this.blob.getAttribute('position').z += 0.05;
  }

  /**
   * Called when the gameloop starts
   * Checks if the player is close to this blob and if he's using the right button
   */
  detectHit(hitButton) {
    this.blobPos = {x: this.blob.getAttribute('position').x, y: this.blob.getAttribute('position').y};
    this.lowPos = {x: this.camera.getAttribute('position').x - 2, y: this.camera.getAttribute('position').y - 2};
    this.highPos = {x: this.camera.getAttribute('position').x + 2, y: this.camera.getAttribute('position').y + 2};

    if (this.blobPos.x > this.lowPos.x && this.blobPos.x < this.highPos.x && this.blobPos.y > this.lowPos.y && this.blobPos.y < this.highPos.y && hitButton.pressed) {
      this.destroy();
    }
  }

  /**
   * Destroys this blob object
   */
  destroy() {
    this.scene.remove(this.blob);
  }
}
