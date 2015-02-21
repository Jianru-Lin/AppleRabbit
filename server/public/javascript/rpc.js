// # cb(err, res)
function rpc(req, cb) {

	cb = cb || function() {}
	var headers = {
		'Content-Type': 'application/json; charset=utf-8'
	}
	ajax('POST', rpc.url, headers, JSON.stringify(req), cbProxy)

	function cbProxy(status, headers, body) {
		if (status === 200) {
			try {
				var res = JSON.parse(body)
			}
			catch (err) {
				cb(err, undefined)
				return
			}
			cb(undefined, res)
		}
		else {
			console.error('status === ', status)
			console.error(headers)
			cb(new Error('status !== 200'), undefined)
		}

	}

	// # cb(status, headers, body)
	function ajax(method, url, headers, body, cb) {
	    cb = cb || function() {}
	    var req = new XMLHttpRequest()
	    req.onreadystatechange = onChange
	    req.open(method, url)
	    // 设置各个头部字段
	    if (headers) {
	        for (var k in headers) {
	            req.setRequestHeader(k, headers[k])
	        }
	    }
	    if (body) {
	        req.send(body)
	    }
	    else {
	        req.send()
	    }
	    return req
	    
	    function onChange() {
	        if (req.readyState !== 4) {
	            return
	        }
	        var status = {
	            code: req.status,
	            text: req.statusText
	        }
	        var headers = req.getAllResponseHeaders()
	        cb(status, headers, req.responseText)
	    }
	}

}