// @flow

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

import { provider as gamepadProvider } from "./src/components/Gamepad";
import { wrapper as layoutWrapper } from "./src/components/Layout";

export const wrapRootElement = gamepadProvider;
export const wrapPageElement = layoutWrapper;
