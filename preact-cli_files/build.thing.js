
module.exports = {
  context: '/home/jenni/Documents/Github/mindmatter-fancy/src',
  resolve:
    {
      modules:
        ['node_modules',
          '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/node_modules'],
      extensions:
        ['.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
          '.less',
          '.scss',
          '.sass',
          '.styl',
          '.css'],
      alias:
        {
          style: '/home/jenni/Documents/Github/mindmatter-fancy/src/style',
          'preact-cli-entrypoint': '/home/jenni/Documents/Github/mindmatter-fancy/src/index.js',
          'preact$': '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact/dist/preact.min.js',
          react: 'preact-compat',
          'react-dom': 'preact-compat',
          'create-react-class': 'preact-compat/lib/create-react-class',
          'react-addons-css-transition-group': 'preact-css-transition-group',
          'preact-cli/async-component': '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/components/async'
        }
    },
  resolveLoader:
    {
      modules:
        ['/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/node_modules',
          '/home/jenni/Documents/Github/mindmatter-fancy/node_modules'],
      alias:
        {
          'proxy-loader': '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/lib/webpack/proxy-loader.js',
          async: '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/lib/webpack/async-component-loader'
        }
    },
  module:
    {
      loaders:
        [[Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object],
        [Object]]
    },
  plugins:
    [NoEmitOnErrorsPlugin {},
      DefinePlugin { definitions: [Object] },
      ExtractTextPlugin {
        filename: 'style.[contenthash:5].css',
        id: 1,
        options: [Object]
      },
      CommonsChunkPlugin {
        chunkNames: undefined,
        filenameTemplate: undefined,
        minChunks: 3,
        selectedChunks: undefined,
        children: true,
        deepChildren: undefined,
        async: false,
        minSize: undefined,
        ident: '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/webpack/lib/optimize/CommonsChunkPlugin.js0'
      },
      ProgressPlugin { profile: undefined, handler: [Function] },
      HashedModuleIdsPlugin { options: [Object] },
      LoaderOptionsPlugin { options: [Object] },
      ModuleConcatenationPlugin { options: {} },
      ReplaceText {
        options: [Object],
        values: [Object],
        patterns: [Map],
        isMatch: [Function]
      },
      HtmlWebpackPlugin { options: [Object] },
      HtmlWebpackExcludeAssetsPlugin {},
      ScriptExtHtmlWebpackPlugin { options: [Object] },
      PushManifestPlugin {},
      { apply: [Function: apply] },
      UglifyJsPlugin { options: [Object] },
      SWPrecacheWebpackPlugin { config: {}, options: [Object], overrides: {}, warnings: [] },
      DefinePlugin { definitions: [Object] }],
  devtool: 'source-map',
  node:
    {
      console: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
      setImmediate: false
    },
  entry:
    {
      bundle: '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/lib/entry',
      polyfills: '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/lib/webpack/polyfills'
    },
  output:
    {
      path: '/home/jenni/Documents/Github/mindmatter-fancy/build',
      publicPath: '/',
      filename: '[name].[chunkhash:5].js',
      chunkFilename: '[name].chunk.[chunkhash:5].js'
    },
  performance:
    {
      hints: 'warning',
      maxAssetSize: 200000,
      maxEntrypointSize: 200000
    }
}
{
  context: '/home/jenni/Documents/Github/mindmatter-fancy/src',
    resolve:
  {
    modules:
    ['node_modules',
      '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/node_modules'],
      extensions:
    ['.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.less',
      '.scss',
      '.sass',
      '.styl',
      '.css'],
      alias:
    {
      style: '/home/jenni/Documents/Github/mindmatter-fancy/src/style',
        'preact-cli-entrypoint': '/home/jenni/Documents/Github/mindmatter-fancy/src/index.js',
          'preact$': '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact/dist/preact.min.js',
            react: 'preact-compat',
              'react-dom': 'preact-compat',
                'create-react-class': 'preact-compat/lib/create-react-class',
                  'react-addons-css-transition-group': 'preact-css-transition-group',
                    'preact-cli/async-component': '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/components/async'
    }
  },
  resolveLoader:
  {
    modules:
    ['/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/node_modules',
      '/home/jenni/Documents/Github/mindmatter-fancy/node_modules'],
      alias:
    {
      'proxy-loader': '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/lib/webpack/proxy-loader.js',
        async: '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/preact-cli/lib/lib/webpack/dummy-loader'
    }
  },
  module:
  {
    loaders:
    [[Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object],
    [Object]]
  },
  plugins:
  [NoEmitOnErrorsPlugin {},
    DefinePlugin { definitions: [Object] },
    ExtractTextPlugin {
      filename: 'style.[contenthash:5].css',
      id: 2,
      options: [Object]
    },
    CommonsChunkPlugin {
      chunkNames: undefined,
      filenameTemplate: undefined,
      minChunks: 3,
      selectedChunks: undefined,
      children: true,
      deepChildren: undefined,
      async: false,
      minSize: undefined,
      ident: '/home/jenni/Documents/Github/mindmatter-fancy/node_modules/webpack/lib/optimize/CommonsChunkPlugin.js1'
    },
    ProgressPlugin { profile: undefined, handler: [Function] },
    HashedModuleIdsPlugin { options: [Object] },
    LoaderOptionsPlugin { options: [Object] },
    ModuleConcatenationPlugin { options: {} },
    ReplaceText {
      options: [Object],
      values: [Object],
      patterns: [Map],
      isMatch: [Function]
    }],
    devtool: 'source-map',
      node:
  {
    console: false,
      process: false,
        Buffer: false,
          __filename: false,
            __dirname: false,
              setImmediate: false
  },
  entry:
  { 'ssr-bundle': '/home/jenni/Documents/Github/mindmatter-fancy/src/index.js' },
  output:
  {
    publicPath: '/',
      filename: 'ssr-bundle.js',
        path: '/home/jenni/Documents/Github/mindmatter-fancy/build/ssr-build',
          chunkFilename: '[name].chunk.[chunkhash:5].js',
            libraryTarget: 'commonjs2'
  },
  target: 'node'
}

