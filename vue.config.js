module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	devServer: {
		// host: '0',
		port: 8080,
		
		proxy: {
			'^/api': {
				target: 'http://34.66.31.229:3000',
				ws: false,
				changeOrigin: true,
				bypass: function(req, res, proxyOptions) {
					if (req.headers.accept.indexOf('html') !== -1) {
					  console.log('Skipping proxy for browser request.');
					  return '/';
					}
				  }
			},
			'http://localhost:8080/*': {
				target: 'http://34.66.31.229:8080',
				changeOrigin: true,
			}

		}
	}
	// devServer: {
	// 	proxy: 'http://localhost:3000'
	// }
}
