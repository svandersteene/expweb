export default class AObject {
  constructor(scene, camera, level, accuracy, range) {
    this.scene = scene;
    this.camera = camera;
    this.level = level;
    this.accuracy = accuracy;
    this.range = range;
  }

  get randomPosition() {
    return Math.floor((Math.random() - 0.5) * (10 + 10 * this.level));
  }

  /**
   * Create an AFrame object
   */
  createObject(color) {
    this.object = document.createElement('a-entity');
    this.object.setAttribute('geometry', 'primitive: octahedron; radius: 1');
    this.object.setAttribute('material', `color: ${color}`);
    this.object.setAttribute('position', {x: this.randomPosition, y: this.randomPosition, z: - 500});
    this.object.setAttribute('rotation', '0 0 0');
    this.object.setAttribute('animation', 'property: rotation; to: 360 360 360; loop: true; dur: 3000; easing: linear');
    this.scene.appendChild(this.object);
    return this.object;
  }

  /**
   * Makes the object move towards the player
   * The object slows down as it gets closer to the player
   * The object slows down less as the player gets in a higher level
   */
  initObject(speed) {
    this.object.getAttribute('position').z += (1 + (- 500 - this.object.getAttribute('position').z) / (speed + 50 * this.level));
  }

  /**
   * Checks if the player is close to this object and if he's using the right button
   */
  detectHit(hitButton) {
    this.objectPos = {x: this.object.getAttribute('position').x, y: this.object.getAttribute('position').y, z: this.object.getAttribute('position').z};
    this.lowPos = {x: this.camera.getAttribute('position').x - this.accuracy, y: this.camera.getAttribute('position').y - this.accuracy};
    this.highPos = {x: this.camera.getAttribute('position').x + this.accuracy, y: this.camera.getAttribute('position').y + this.accuracy};

    if (this.objectPos.z > this.range && this.objectPos.x > this.lowPos.x && this.objectPos.x < this.highPos.x && this.objectPos.y > this.lowPos.y && this.objectPos.y < this.highPos.y && hitButton.pressed) {
      this.destroy();
      return true;
    }
    return false;
  }

  /**
   * Checks if the object is still visible for the player, otherwise destroy it
   */
  detectBoundaries() {
    if (this.object.getAttribute('position').z > 1) {
      this.destroy();
      return true;
    }
    return false;
  }

  /**
   * Destroys this object
   */
  destroy() {
    this.scene.remove(this.object);
    this.scene.removeChild(this.object);
  }
}
