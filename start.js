const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./config/webpack.common');

const PORT = 3000;

config.mode = 'development';
config.devtool = 'cheap-module-source-map';

const options = {
    contentBase: config.output.path,
    hot: true,
    host: 'localhost',
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: 'minimal'
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

server.listen(PORT, 'localhost', () => {
    /* eslint-disable no-console */
    console.log('Webpack dev server listening on', PORT);
});
