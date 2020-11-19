module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	configureWebpack: config => {
		return {
			node: {
				fs: "empty"
			}
		}
	}
	// node: {
	// 	fs: "empty"
	// }
}
