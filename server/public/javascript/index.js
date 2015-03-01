var gui = require('nw.gui')
var currentWindow = gui.Window.get()

// new window

;(function() {
	var gui = require('nw.gui')
	var currentWindow = gui.Window.get()

	window.newWindow = function (url, hide) {
		var win = gui.Window.get(window.open(url))
		if (hide) {
			win.hide()
		}
		autoClose(currentWindow, win)
		return win
	}
})()

// init ui api

;(function() {
	
	window.gotoTaskUI = function() {
		$('a[href="#e1"]').tab('show')
	}

	window.gotoRunningUI = function() {
		$('a[href="#e2"]').tab('show')
	}

	window.showStartButton = function() {
		$('button#start').removeClass('hide')
		$('button#stop').addClass('hide')
	}

	window.showStopButton = function() {
		$('button#stop').removeClass('hide')
		$('button#start').addClass('hide')
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

	window.taskTableUI = {
		add: function(task) {

			// create the dom and fill it
			var $dom = $('<tr><td><button class="btn btn-default btn-block"></button></td><td></td><td></td><td></td><td></td><td></td></tr>')
			var $children = $dom.children()
			$children.find('button').text(task.id).attr('title', '查看详情')
			$children.eq(1).text(task.storeName).attr('title', task.storeName)
			$children.eq(2).text(task.email).attr('title', task.email)
			$children.eq(3).text(task.password).attr('title', task.password)
			$children.eq(4).text(task.governmentId.value).attr('title', task.governmentId.value)
			$children.eq(5).text(task.status).attr('title', task.status)

			// so we can find it again
			$dom.attr('id', task.id)

			// ok, append it to table
			$('#taskTable').append($dom)
		},
		$domOf: function(task) {
			return $('#' + task.id)
		},
		updateOrAdd: function(task) {
			console.log('updateOrAdd')
			console.log(task)
			var $dom = this.$domOf(task)
			if ($dom.length) {
				var $children = $dom.children()
				$children.eq(1).text(task.storeName).attr('title', task.storeName)
				$children.eq(2).text(task.email).attr('title', task.email)
				$children.eq(3).text(task.password).attr('title', task.password)
				$children.eq(4).text(task.governmentId.value).attr('title', task.governmentId.value)
				$children.eq(5).text(task.status).attr('title', task.status)
			}
			else {
				this.add(task)
			}
		},
		clear: function() {
			$('#taskTable tbody').empty()
		},
		onClickInspect: function(task) {
			// user should replace this function
		}
	}

	window.catpoolUI = {
		win: undefined,
		smsChallengeQueue: [],
		nextId: 0,
		show: function() {
			var self = this
			if (self.win) {
				self.win.show()
			}
			else {
				self.win = newWindow('catpool.html')
				self.win.on('closed', function() {
					self.win = undefined
				})
			}
		},
		hide: function() {
			if (this.win) {
				this.win.hide()
			}
		},
		add: function(smsChallenge) {
			var item = {
				id: this.nextId++,
				smsChallenge: smsChallenge
			}
			this.smsChallengeQueue.push(item)
		}
	}
})()

// taskManager

;(function() {

	// create an rpc server for communication

	var idMap = {}
	var nextId = 0

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

		if (target.type === 'Task') {
			taskTableUI.updateOrAdd(target)
		}

		// test only
		else if (target.type === 'SmsChallenge') {
			target.status = 'progressing'
			// target.status = 'success'
			// target.resCode = 'rescode'
			// target.phoneNo = '18877776666'
		}
	}

	// define taskManager

	window.taskManager = {
		children: [],
		start: function(storeList, email, password) {
			var self = this
			var task = {
				type: 'Task',
				//id: dateTime() + '_' + (nextId++),
				id: nextId++,
				storeList: storeList,
				email: email,
				password: password
			}
			idMap[task.id] = task

			var rpcServer = 'http://' + rpc_server.address.address + ':' + rpc_server.address.port + '/rpc'
			var execFile = require('child_process').execFile
			var child = execFile('nw.exe', ['--url=http://localhost/worker.html?taskId=' + encodeURIComponent(task.id) + '&rpcServer=' + encodeURIComponent(rpcServer)])
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
	$('button#start').click(function(e) {
		e.preventDefault()
		var data
		if (!(data = parseTaskForm())) {
			// input data incorrect
			// TODO
			return
		}

		taskTableUI.clear()
		gotoRunningUI()
		showStopButton()

		for (var i = 0, len = data.accountList.length; i < len; ++i) {
			taskManager.start(data.storeList, data.accountList[i].email, data.accountList[i].password)
		}
	})

	$('button#stop').click(function(e) {
		e.preventDefault()
		showStartButton()
		taskManager.stopAll()
	})
})

// when user click catpool button

$(function() {
	$('#catpool').click(function() {
		catpoolUI.show()
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
