export default class Blob {

  constructor(scene, camera, level, accuracy, range) {
    this.scene = scene;
    this.camera = camera;
    this.level = level;
    this.accuracy = accuracy;
    this.range = range;
    this.createBlob();
  }

  get randomPosition() {
    return Math.floor((Math.random() - 0.5) * (10 + 10 * this.level));
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

  /**
   * Makes the blob move towards the player
   * The blob slows down as it gets closer to the player
   * The blob slows down less as the player gets in a higher level
   */
  initBlob() {
    this.blob.getAttribute('position').z += (1 + (- 500 - this.blob.getAttribute('position').z) / (550 + 50 * this.level));
  }

  /**
   * Checks if the player is close to this blob and if he's using the right button
   */
  detectHit(hitButton) {
    this.blobPos = {x: this.blob.getAttribute('position').x, y: this.blob.getAttribute('position').y, z: this.blob.getAttribute('position').z};
    this.lowPos = {x: this.camera.getAttribute('position').x - this.accuracy, y: this.camera.getAttribute('position').y - this.accuracy};
    this.highPos = {x: this.camera.getAttribute('position').x + this.accuracy, y: this.camera.getAttribute('position').y + this.accuracy};

    if (this.blobPos.z > this.range && this.blobPos.x > this.lowPos.x && this.blobPos.x < this.highPos.x && this.blobPos.y > this.lowPos.y && this.blobPos.y < this.highPos.y && hitButton.pressed) {
      this.destroy();
      return true;
    }
    return false;
  }

  /**
   * Checks if the blob is still visible for the player, otherwise destroy it and subtract points
   */
  detectBoundaries() {
    if (this.blob.getAttribute('position').z > 1) {
      this.destroy();
      return true;
    }
    return false;
  }

  /**
   * Destroys this blob object
   */
  destroy() {
    this.scene.remove(this.blob);
    this.scene.removeChild(this.blob);
  }
}
