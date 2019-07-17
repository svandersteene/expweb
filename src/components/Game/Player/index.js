// @flow

import React from "react";
import { Entity } from "aframe-react";

/**
 * Player
 */
const Player = () => (
    <Entity primitive="a-camera" position={{ x: 0, y: 1.6, z: 0 }}>
        <Entity primitive="a-cursor" />
    </Entity>
);

export default Player;
