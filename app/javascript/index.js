var gui = require('nw.gui')
var currentWindow = gui.Window.get()

currentWindow.maximize()

$(function() {
	$('form').submit(function(e) {
		e.preventDefault()
		var data
		if (!(data = parseForm(taskForm))) {
			// input data incorrect
			// TODO
			return
		}

		createRunWindow(data.storeList[0], data.accountList[0].email, data.accountList[0].password)
	})

	function parseForm(taskForm) {
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
})

// create window
function createRunWindow(store, email, password) {
	var win = gui.Window.get(window.open('run.html'))
	setTimeout(function() {
		debugger
		var mainForm = win.window.document.mainForm
		mainForm.store.value = store
		mainForm.email.value = email
		mainForm.password.value = password
	}, 1000)
	// $(win.window.document).ready(function() {
	// 	debugger
	// 	var mainForm = win.window.document.mainForm
	// 	mainForm.store.value = store
	// 	mainForm.email.value = email
	// 	mainForm.password.value = password
	// })
}

// auto test
$(function() {
	taskForm.storeList.value = 
		'上海环贸 iapm' + '\n' +
		'南京东路' + '\n' +
		'浦东'

	taskForm.accountList.value = 
		'kwindly@aliyun.com Kwindly10180521' + '\n' +
		'test@test.com Password9876'

	// taskForm.idList.value = 
	// 	'535618198007175551' + '\n' +
	// 	'535618198007175552' + '\n' +
	// 	'535618198007175553' + '\n'

})