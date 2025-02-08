const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
    mode: "production",
    entry: {
        content: "./content.js",
        popup: "./popup.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        library: { type: "module" },
    },
    experiments: {
        outputModule: true,
    },
    plugins: [
        new Dotenv()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: { presets: ["@babel/preset-env"] },
                },
            },
        ],
    },
    target: "web",
};
