// @flow

import React, { PureComponent } from "react";

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
        return <p>loaded</p>;
    }
}
