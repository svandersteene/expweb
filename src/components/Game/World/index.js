// @flow

import React, { type Node } from "react";
import { Scene, Entity } from "aframe-react";

type Props = {
    children: Node,
};

/**
 * World
 */
const World = ({ children }: Props) => (
    <Scene
        stats
        vr-mode-ui={{ enabled: false }}
        inspector="http://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js"
    >
        <Entity primitive="a-sky" color="#292D3E" />
        {children}
    </Scene>
);

export default World;
