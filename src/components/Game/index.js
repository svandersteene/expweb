// @flow

import "aframe";
import React, { PureComponent } from "react";
import World from "./World";
import Player from "./Player";
import Blob from "./Blob";

type Props = {};

type State = {
    hasState: boolean,
};

/**
 * Game
 */
export default class Game extends PureComponent<Props, State> {
    state = { hasState: false };

    componentDidMount() {
        this.setState({ hasState: true });
    }

    componentWillUnMount() {
        this.setState({ hasState: false });
    }

    render() {
        const { hasState } = this.state;
        if (!hasState) {
            return <p>loading...</p>;
        }
        return (
            <World>
                <Player />
                <Blob
                    color={"grey"}
                    radius={2}
                    position={{ x: -5, y: -5, z: -25 }}
                />
                <Blob
                    color={"blue"}
                    radius={1}
                    position={{ x: 5, y: 5, z: -35 }}
                />
            </World>
        );
    }
}
