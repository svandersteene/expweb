export default class Blob {

  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.hitAccuracy = 2;
    this.createBlob();
  }

  // TODO: increase 40 over time for higher difficulty
  get randomPosition() {
    return Math.floor((Math.random() - 0.5) * 40);
  }

  /**
   * Create a blob
   */
  createBlob() {
    this.blob = document.createElement('a-entity');
    this.blob.setAttribute('geometry', 'primitive: octahedron');
    this.blob.setAttribute('material', 'color: grey; radius: 1');
    this.blob.setAttribute('position', {x: this.randomPosition, y: this.randomPosition, z: - 500});
    this.blob.setAttribute('rotation', '0 0 0');
    this.blob.setAttribute('animation', 'property: rotation; to: 360 360 360; loop: true; dur: 3000; easing: linear');
    this.scene.appendChild(this.blob);
  }

  /** TODO:
   * blobs should slow down as they come closer to the player
   * as the game progresses, the blobs should slow down LESS
   * check accuracy of hit-detection
   */

  /**
   * Makes the blob move towards the player
   */
  initBlob(hitButton) {
    this.blob.getAttribute('position').z += 1;
    this.detectHit(hitButton);
    this.detectBoundaries();
  }

  /**
   * Checks if the player is close to this blob and if he's using the right button
   */
  detectHit(hitButton) {
    this.blobPos = {x: this.blob.getAttribute('position').x, y: this.blob.getAttribute('position').y};
    this.lowPos = {x: this.camera.getAttribute('position').x - this.hitAccuracy, y: this.camera.getAttribute('position').y - this.hitAccuracy};
    this.highPos = {x: this.camera.getAttribute('position').x + this.hitAccuracy, y: this.camera.getAttribute('position').y + this.hitAccuracy};

    if (this.blobPos.x > this.lowPos.x && this.blobPos.x < this.highPos.x && this.blobPos.y > this.lowPos.y && this.blobPos.y < this.highPos.y && hitButton.pressed) {
      this.destroy();
    }
  }

  /**
   * Checks if the blob is still visible for the player, otherwise destroy it and subtract points
   */
  detectBoundaries() {
    if (this.blob.getAttribute('position').z > 1.5) {
      this.destroy();
    }
  }

  /**
   * Destroys this blob object
   */
  // TODO: fix destroy-function so it properly destroys the object
  destroy() {
    this.scene.remove(this.blob);
  }
}
