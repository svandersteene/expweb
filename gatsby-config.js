/* eslint-env node */

module.exports = {
    siteMetadata: {
        title: process.env.TITLE || "TO DO",
    },
    plugins: [
        "gatsby-plugin-react-helmet",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: `${__dirname}/src/pages`,
            },
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: "gatsby-plugin-web-font-loader",
            options: {
                custom: {
                    families: ["Montserrat:n4,n7", "Sansation:n4,n7"],
                    urls: ["fonts/webfonts.css"],
                },
            },
        },
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        // Favicons and web manifest
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "TO DO",
                short_name: "TO DO",
                start_url: "/",
                background_color: "#ff5742",
                theme_color: "#3b3b39",
                display: "minimal-ui",
                icon: "src/images/favicon.jpg", // This path is relative to the root of the site.
            },
        },
        // Definitly do
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        "gatsby-plugin-offline",

        // TO CONSIDER: gatsby-plugin-layout
        // Major gain: animated page transitions

        // Sass support
        {
            resolve: "gatsby-plugin-sass",
            options: {
                includePaths: [`${__dirname}/node_modules`],
            },
        },
        // Eslinting
        "gatsby-plugin-eslint",
        // Style linting
        {
            resolve: "gatsby-plugin-stylelint",
            options: { files: ["src/**/*.{js,css,scss}"] },
        },
    ],
};
