var gui = require('nw.gui')
var currentWindow = gui.Window.get()

// init ui api

;(function() {
	
	window.gotoTaskUI = function() {
		$('a[href="#e1"]').tab('show')
	}

	window.gotoRunningUI = function() {
		$('a[href="#e2"]').tab('show')
	}

	window.parseTaskForm = function() {
		var data = {}
		if (parseStoreList() && parseAccountList()) {
			return data
		}
		else {
			return false
		}

		function parseStoreList() {
			var storeList = toLines(taskForm.storeList.value)
			if (!storeList || !storeList.length) {
				taskForm.storeList.focus()
				return false
			}

			data.storeList = storeList
			return true
		}

		function parseAccountList() {
			var lines = toLines(taskForm.accountList.value)
			if (!lines || !lines.length) {
				taskForm.accountList.focus()
				return false
			}

			var account
			var accountList = []
			for (var i = 0, len = lines.length; i < len; ++i) {
				var pattern = /^(\S+)\s+(\S+)$/g
				var match
				match = pattern.exec(lines[i])
				if (!match) {
					taskForm.accountList.focus()
					return false
				}
				account = {
					email: match[1],
					password: match[2]
				}
				accountList.push(account)
			}

			data.accountList = accountList
			return true
		}

		function toLines(text) {
			if (!text) return []
			return text
					.split('\n')
					.map(function(line) {
						return line.trim()
					})
					.filter(function(line) {
						return line && true
					})
		}

		function patternParse(pattern, handler) {
			return handler(pattern.exec())
		}
	}

})()

// taskManager

;(function() {

	// create an rpc server for communication

	var taskMap = {}
	var nextTaskId = 0

	rpc_server({
		listening: function(addr) {
			console.log(addr)
		},
		request: function(req) {
			if (req.action === 'get_task') {
				var task = taskMap[req.id]
				var res = task ? {task: task} : {error: 'not found'}
				return res
			}
			else {
				return {error: 'unknown action'}
			}
		}
	})

	// define taskManager

	window.taskManager = {
		children: [],
		start: function(storeList, email, password) {
			var self = this
			var task = {
				id: dateTime() + '_' + (nextTaskId++),
				storeList: storeList,
				email: email,
				password: password
			}
			taskMap[task.id] = task

			var rpcServer = 'http://' + rpc_server.address.address + ':' + rpc_server.address.port + '/rpc'
			var execFile = require('child_process').execFile
			var child = execFile('nw.exe', ['--url=http://localhost/run.html?taskId=' + encodeURIComponent(task.id) + '&rpcServer=' + encodeURIComponent(rpcServer)])
			self.children.push(child)

			function dateTime() {
				var d = new Date()
				var year = d.getFullYear()
				var month = d.getMonth() + 1
				var date = d.getDate()
				var hours = d.getHours()
				var minutes = d.getMinutes()
				var seconds = d.getSeconds()
				return year + '-' + month + '-' + date + '_' + hours + '-' + minutes + '-' + seconds
			}
		},
		stopAll: function() {
			var self = this
			var child
			while(child = self.children.pop()) {
				child.kill()
			}
		}
	}

})()

// maximize window

;(function() {
	currentWindow.maximize()
})()

// handler user click start or stop button

$(function() {
	$('form[name="taskForm"]').submit(function(e) {
		e.preventDefault()
		var data
		if (!(data = parseTaskForm())) {
			// input data incorrect
			// TODO
			return
		}

		gotoRunningUI()

		for (var i = 0, len = data.accountList.length; i < len; ++i) {
			taskManager.start(data.storeList, data.accountList[i].email, data.accountList[i].password)
		}
	})

	$('form[name="runningForm"]').submit(function(e) {
		e.preventDefault()
		taskManager.stopAll()
	})
})

// auto test

$(function() {
	taskForm.storeList.value = 
		'王府井' + '\n' +
		'上海环贸 iapm' + '\n' +
		'南京东路' + '\n' +
		'浦东'

	taskForm.accountList.value = 
		//'kwindly@aliyun.com Kwindly10180521' + '\n' +
		'zetsin@icloud.com 7311327Zetsin'

	// taskForm.idList.value = 
	// 	'535618198007175551' + '\n' +
	// 	'535618198007175552' + '\n' +
	// 	'535618198007175553' + '\n'

})
