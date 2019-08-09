// @flow

import React from "react";
import { Entity } from "aframe-react";

const randomPosition = () => {
    return Math.floor((Math.random() - 0.5) * 20);
};

/**
 * Blob
 */
const Blob = () => (
    <Entity
        primitive="a-octahedron"
        material={{ color: "grey", radius: 1 }}
        position={{ x: randomPosition(), y: randomPosition(), z: -100 }}
        animation={{
            property: "rotation",
            to: "360 360 360",
            loop: true,
            dur: 3000,
            easing: "linear",
        }}
    />
);

export default Blob;
