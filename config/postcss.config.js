const plugins = [
    "autoprefixer",
    "postcss-at-rules-variables",
    "postcss-custom-media",
    "postcss-import",
    "postcss-media-minmax",
    "postcss-mixins",
    "postcss-nested",
    "postcss-responsive-properties",
    "postcss-simple-extend",
    "postcss-simple-vars"
];

module.exports = {
    plugins: plugins.map(plugin => require(plugin))
};
