// @flow

import React from "react";
import { Entity } from "aframe-react";

type Props = {
    color: string,
    radius: number,
    position: *,
};

/**
 * Blob
 */
const Blob = ({ color, radius, position: { x, y, z } }: Props) => (
    <Entity
        primitive="a-octahedron"
        material={{ color, radius }}
        position={{ x, y, z }}
    />
);

export default Blob;
