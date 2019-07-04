// @flow

import { resolve } from "path";
import camelcase from "camelcase";

const TARGET = resolve(`${__dirname}/../../../src/components`);
const TEMPLATES = __dirname;

// Component types
const FUNCTION = "function";
const STATELESS = "stateless";
const FULL = "full";

const getTemplate = type => {
    if ([STATELESS, FULL].includes(type)) {
        return `${TEMPLATES}/index.js.class.hbs`;
    }

    return `${TEMPLATES}/index.js.function.hbs`;
};

export default (plop: *) =>
    plop.setGenerator("component", {
        description: "Create a function component",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "The name of your component",
                transformer: name => camelcase(name, { pascalCase: true }),
            },
            {
                type: "list",
                name: "type",
                message: "Which type of component do you want to make?",
                choices: [
                    {
                        name: "Function component",
                        value: FUNCTION,
                    },
                    {
                        name: "A stateless component",
                        value: STATELESS,
                    },
                    {
                        name: "A component with state",
                        value: FULL,
                    },
                ],
            },
            {
                type: "confirm",
                name: "pure",
                message: "Do you want your component to be a pure component?",
                default: true,
                when: ({ type }) => [STATELESS, FULL].includes(type),
            },
            {
                type: "confirm",
                name: "addToIndex",
                message: "Add an export to src/components/index.js",
                default: true,
            },
            {
                type: "checkbox",
                name: "options",
                message: "Your component should include:",
                default: ["style"],
                choices: [
                    {
                        name: "A style module",
                        value: "style",
                    },
                    {
                        name: "A jest test stub",
                        value: "test",
                    },
                    {
                        name: "A styleguidist Readme.md stub",
                        value: "readme",
                    },
                ],
            },
        ],
        actions: ({ name, type, options, addToIndex, pure }: *) => {
            const actions = [];
            const target = `${TARGET}/${name}`;

            // Add function
            actions.push({
                type: "add",
                path: `${target}/index.js`,
                templateFile: getTemplate(type),
                data: {
                    style: options.includes("style"),
                    superClass: (pure && "PureComponent") || "Component",
                    hasState: type === FULL,
                },
            });

            // Append to index
            if (addToIndex) {
                actions.push({
                    type: "append",
                    path: `${TARGET}/index.js`,
                    template: `export { default as {{ name }} } from "./{{ name }}";`,
                });
            }

            // Add style file
            if (options.includes("style")) {
                actions.push({
                    type: "add",
                    path: `${target}/style.module.scss`,
                    templateFile: `${TEMPLATES}/style.module.scss.hbs`,
                });
            }

            // Add a readme file
            if (options.includes("readme")) {
                actions.push({
                    type: "add",
                    path: `${target}/Readme.md`,
                    templateFile: `${TEMPLATES}/Readme.md.hbs`,
                });
            }

            // Add a test stub
            if (options.includes("test")) {
                actions.push({
                    type: "add",
                    path: `${target}/test.js`,
                    templateFile: `${TEMPLATES}/test.js.hbs`,
                });
            }

            return actions;
        },
    });
