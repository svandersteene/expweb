// @flow

import "../../styles/global.scss";
// import style from "./style.module.scss";

import React, { type Node } from "react";
import Div100vh from "react-div-100vh";

type Props = {
    children: Node,
};

/**
 * Layout
 */
const Layout = ({ children }: Props) => <Div100vh>{children}</Div100vh>;

export default Layout;
export const wrapper = ({ element }: *) => <Layout>{element}</Layout>;
