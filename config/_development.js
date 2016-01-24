// We use an explicit public path when the assets are served by webpack
// to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
export default (config) => ({
  compiler_public_path: `http://${config.server_host}:${config.server_port}/`,
  globals: {
    ...config.globals,
    __API_URL__: JSON.stringify('http://ec2-54-164-76-225.compute-1.amazonaws.com:5000/api')
  }
})
