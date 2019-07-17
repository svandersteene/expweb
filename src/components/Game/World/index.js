// @flow

import React, { type Node } from "react";
import { Scene } from "aframe-react";

type Props = {
    children: Node,
};

/**
 * World
 */
const World = ({ children }: Props) => (
    <Scene
        vr-mode-ui={{ enabled: false }}
        inspector="http://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
    >
        {children}
    </Scene>
);

export default World;
