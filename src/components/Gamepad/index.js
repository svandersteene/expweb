// @flow

import React, { type Node, PureComponent, Fragment } from "react";

type Props = {
    children: Node,
};

type State = {
    gamepad: boolean,
};

/**
 * Gamepad
 */
export default class Gamepad extends PureComponent<Props, State> {
    // Initial state
    state = { gamepad: false };

    componentDidMount() {
        window.addEventListener("gamepadconnected", ({ gamepad }) => {
            this.setState({ gamepad: true });
            console.log(`${gamepad.id} is connected, ready to play!`);
        });
        window.addEventListener("gamepaddisconnected", () => {
            this.setState({ gamepad: false });
            console.log("The connection was lost");
        });
    }

    componentWillUnmount() {
        this.setState({ gamepad: false });
    }

    /**
     * Render
     */
    render() {
        const { gamepad } = this.state;
        const { children } = this.props;

        if (!gamepad) {
            return <p>Let&apos;s connect a Playstation 4 controller</p>;
        }

        return <Fragment>{children}</Fragment>;
    }
}

export const provider = ({ element }: *) => <Gamepad>{element}</Gamepad>;
