// # cb(err, res)
function rpc(req, cb) {

	cb = cb || function() {}
	var headers = {
		'Content-Type': 'application/json; charset=utf-8'
	}
	ajax('POST', rpc.url, headers, JSON.stringify(req), cbProxy)

	function cbProxy(status, headers, body) {
		if (status.code === 200) {
			try {
				var res = JSON.parse(body)
			}
			catch (err) {
				cb(err, undefined)
				return
			}
			// 如果 res.error 存在，则也算作是错误
			if (res.error) {
				cb(new Error(res.error), undefined)
			}
			else {
				cb(undefined, res)
			}
		}
		else {
			console.error('status.code is ', status.code)
			console.error(headers)
			cb(new Error('status.code !== 200'), undefined)
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