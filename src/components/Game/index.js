// @flow

import "aframe";
import React, { PureComponent, type Node } from "react";
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
    blobs: Node[] = [];

    componentDidMount() {
        this.setState({ hasState: true });
        this.initGame();
    }

    componentWillUnMount() {
        this.setState({ hasState: false });
    }

    /**
     * INIT GAME
     * add initial blobs to the scene
     */
    initGame() {
        for (let i = 0; i < 5; i++) {
            this.blobs && this.blobs.push(<Blob key={i} />);
        }
    }

    render() {
        const { hasState } = this.state;
        if (!hasState) {
            return <p>loading...</p>;
        }
        return (
            <World id="world">
                <Player />
                {this.blobs}
            </World>
        );
    }
}
