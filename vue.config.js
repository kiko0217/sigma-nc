module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	devServer: {
		host: '0',
		port: 8080,
		
		proxy: {
			'^/api': {
				target: 'http://localhost:3000',
				ws: false,
				changeOrigin: true,
				bypass: function(req, res, proxyOptions) {
					//console.log(req.headers.accept.indexOf('html'))
					if (req.headers.accept.indexOf('html') !== -1) {
					  console.log('Skipping proxy for browser request.');
					  return '/';
					}
				}
			}
		}
	}
	// devServer: {
	// 	proxy: 'http://localhost:3000'
	// }
}
