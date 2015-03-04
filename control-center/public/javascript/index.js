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
	
	// window.gotoTaskUI = function() {
	// 	$('a[href="#e1"]').tab('show')
	// }

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

	window.parsePlanForm = function() {
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

	// window.taskTableUI = {
	// 	add: function(task) {

	// 		// create the dom and fill it
	// 		var $dom = $('<tr><td><button class="btn btn-default btn-block"></button></td><td></td><td></td><td></td><td></td><td></td></tr>')
	// 		var $children = $dom.children()
	// 		$children.find('button').text(task.id).attr('title', '查看详情')
	// 		$children.eq(1).text(task.storeName).attr('title', task.storeName)
	// 		$children.eq(2).text(task.email).attr('title', task.email)
	// 		$children.eq(3).text(task.password).attr('title', task.password)
	// 		$children.eq(4).text(task.governmentId.value).attr('title', task.governmentId.value)
	// 		$children.eq(5).text(task.status).attr('title', task.status)

	// 		// so we can find it again
	// 		$dom.attr('id', task.id)

	// 		// ok, append it to table
	// 		$('#taskTable').append($dom)
	// 	},
	// 	$domOf: function(task) {
	// 		return $('#' + task.id)
	// 	},
	// 	updateOrAdd: function(task) {
	// 		console.log('updateOrAdd')
	// 		console.log(task)
	// 		var $dom = this.$domOf(task)
	// 		if ($dom.length) {
	// 			var $children = $dom.children()
	// 			$children.eq(1).text(task.storeName).attr('title', task.storeName)
	// 			$children.eq(2).text(task.email).attr('title', task.email)
	// 			$children.eq(3).text(task.password).attr('title', task.password)
	// 			$children.eq(4).text(task.governmentId.value).attr('title', task.governmentId.value)
	// 			$children.eq(5).text(task.status).attr('title', task.status)
	// 		}
	// 		else {
	// 			this.add(task)
	// 		}
	// 	},
	// 	clear: function() {
	// 		$('#taskTable tbody').empty()
	// 	},
	// 	onClickInspect: function(task) {
	// 		// user should replace this function
	// 	}
	// }

	window.planUI = {
		update: function(plan) {
			
		}
	}

	window.taskUI = {
		update: function(task) {

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

// maximize window

;(function() {
	currentWindow.maximize()
})()

// logic

;(function() {

	var currentPlan

	window.start = function() {

		if (!(currentPlan = parsePlanForm())) {
			// input plan incorrect
			// TODO
			return
		}

		gotoRunningUI()
		showStopButton()

		// 向服务端请求启动

		rpc.set(currentPlan, function (err, plan) {

			if (err) {
				alert(err.toString())
				currentPlan = undefined
			}
			else {
				currentPlan = plan
				taskUI.update(currentPlan)
			}
		})
	}

	window.stop = function() {

		if (!currentPlan) return

		showStartButton()

		var req = {
			action: 'update',
			name: 'planStatus',
			planId: currentPlan.id
		}

		rpc(req, function(err, res) {
			if (err) {
				alert(err.toString())
			}
			else {
				currentPlan = undefined
			}
		})
	}

	// auto refresh plan summary

	setInterval(refreshPlanSummary, 1000)

	function refreshPlanSummary() {

	}

})()

// handler user click start or stop button

$(function() {

	$('button#start').click(function(e) {
		e.preventDefault()
		start()
	})

	$('button#stop').click(function(e) {
		e.preventDefault()
		stop()
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
