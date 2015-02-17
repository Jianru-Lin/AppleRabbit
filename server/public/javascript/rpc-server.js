function rpc_server(on) {
	on = on || {}
	on.listening = on.listening || function() {}
	on.error = on.error || function() {}
	on.request = on.request || function() {}

	var server = require('http').createServer()
	server.on('error', onError)
	server.on('listening', onListening)
	server.on('request', onRequest)
	server.listen()

	function onError(err) {
		console.error(err)
		on.error(err)
	}

	function onListening() {
		console.log(server.address())
		on.listening(server.address())
	}

	function onRequest(req, res) {
		if (!/^post$/i.test(req.method) || req.url !== '/rpc') {
			res.end()
			return
		}

		var chunks = []
		var totalLength = 0

		req.on('data', function(chunk) {
			chunks.push(chunk)
			totalLength += chunk.length
		})

		req.on('end', function() {
			var buff = Buffer.concat(chunks, totalLength)
			try {
				var reqObj = JSON.parse(buff.toString())
				console.log(reqObj)
				var resObj = on.request(reqObj)
				console.log(resObj)
				res.status = 200
				res.setHeader('Content-Type', 'application/json;charset=utf-8')
				res.end(JSON.stringify(resObj))
			}
			catch (err) {
				console.error(err)
				res.end()
			}
		})
	}
}

rpc_server({
	request: function(req) {
		return req
	}
})