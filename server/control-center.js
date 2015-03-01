var rpc_server = require('./rpc-server')

// create an rpc server for communication

var idMap = {}
var nextId = 0

rpc_server.port = 50000
rpc_server.host = '0.0.0.0'

rpc_server({
	request: function(req) {

		if (req.action === 'get') {
			var target = idMap[req.id]
			if (!target) {
				var res = {
					error: 'target not found'
				}
			}
			else {
				var res = {
					target: target
				}
				// get hook
				get_hook(target)
			}
		}
		else if(req.action === 'set') {
			var target = req.target
			if (target.id === undefined || target.id === null) {
				target.id = nextId++
			}
			idMap[target.id] = target
			var res = {
				target: target
			}
			// set hook
			set_hook(target)
		}
		else {
			var res = {
				error: 'unknown action'
			}
		}
		return res

	}
})

function get_hook(target) {
}

function set_hook(target) {

	// if (target.type === 'Task') {
	// 	taskTableUI.updateOrAdd(target)
	// }

	// test only
	if (target.type === 'SmsChallenge') {
		target.status = 'progressing'
		// target.status = 'success'
		// target.resCode = 'rescode'
		// target.phoneNo = '18877776666'
	}
}
