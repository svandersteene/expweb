// @flow

import React, { Fragment } from "react";
import { Link } from "gatsby";
import { Game } from "../components";

const GameplayPage = () => (
    <Fragment>
        <Link to="/">Home</Link>
        <Game />
    </Fragment>
);

export default GameplayPage;
