// task

(function() {
	var gui = require('nw.gui')
	var currentWindow = gui.Window.get()

	window.task = {
		start:	function(store, email, password, id) {
			var storeList = {
				'上海环贸 iapm': 401,
				'南京东路': 359,
				'浦东': 389,
				'香港广场': 390,
				'三里屯': 320,
				'华贸购物中心': 479,
				'王府井': 448,
				'西单大悦城': 388,
				'成都万象城': 502,
				'无锡恒隆广场': 574,
				'深圳益田假日广场': 484,
				'郑州万象城': 572,
				'重庆北城天街': 476,
				'西湖': 471,
				'解放碑': 480
			}

			var appleUrl = 'http://concierge.apple.com/reservation/cn/zh/R###/techsupport'

			var task = {
				storeName: store,
				//storeName: '华贸购物中心',
				appleId: email,
				password: password,
				governmentId: {
					firstName: undefined,
					lastName: undefined,
					type: 'CN.PRCID',
					value: id
				},
				//productType: 'iPhone'
				productType: 'Mac'
				//appleId: 'zetsin@icloud.com',
				//password: '7311327Zetsin'
			}

			var taskUrl = appleUrl.replace('###', storeList[task.storeName])
			
			var win = newWindow(taskUrl)

			//win.on('loaded', function() {
			setInterval(function() {
				try {
					var readyState = win.window.document.readyState
					if (!(readyState === 'interactive' || readyState === 'complete')) {
						return
					}	
				}
				catch (err) {
					console.log(err.toString())
					return
				}

				var $doc = $(win.window.document)
				if (win.window._robot_in_) {
					return
				}

				win.window._robot_in_ = true
				
				if (exists('body#ErrorPage') || exists('body#overview')) {
					$doc[0].location.href = taskUrl
				}
				else if (exists('#storelist')) {
					find_target_store($doc, task.storeName)
				}
				else if (exists('body.retail.store-page')) {
					select_genius_bar_service($doc)
				}
				else if (exists('body.MakeAReservation.caid_contact')) {
					select_reservation_type($doc)
				}
				else if (exists('body#conciergeSplit')) {
					select_make_a_genius_bar_reservation($doc)
				}
				else if (exists('body.caid_signin')) {
					signin($doc, task.appleId, task.password)
				}
				else if (exists('body#GovernmentIDPage')) {
					provide_government_id($doc, task.governmentId.firstName, task.governmentId.lastName, 
						task.governmentId.type, task.governmentId.value)
				}
				else if (exists('body#TopicPicker')) {
					select_product_type($doc, task.productType)
				}
				else if (exists('body#concierge')) {
					sms_challenge($doc)
				}
				else if (exists('body#TimePicker')) {
					pick_time($doc)
				}
				else if (exists('body#ReservationConfirmation')) {
					success_confirmation($doc, win.window)
				}
				else {
					win.window._robot_in_ = false
				}

				function exists(selector) {
					return $doc.find(selector).length > 0
				}

				function href(pattern) {
					return pattern.test(win.window.location.href)
				}
			}, 100)

			// # cb(win)
			
			function find_target_store($doc, storeName, cb) {
				logTitle('Find Target Store')

				log('retrive store list from page...')
				var storeList = $doc.find('#cnstores a')
				if (storeList.length < 1) {
					log('failed, selector not match any element')
					return
				}
				var targetStore
				storeList.each(function(i, e) {
					var name = $(e).text().trim()
					log('- ' + name, true)
					if (name === storeName) {
						targetStore = $(e)
					}
				})
				if (!targetStore) {
					log('failed, target store **' + storeName + '** not found')
					return
				}
				var targetUrl = $(targetStore).attr('href')
				log('success, target store **' + storeName + '** found, **' + targetUrl + '**')
				targetStore[0].click()
				log('click target store')
				log('step over.')
			}

			function select_genius_bar_service($doc) {
				logTitle('Select Genius Bar Service')
				var a = $doc.find('[alt="Genius Bar"]').parent()
				if (a.length < 1) {
					log('failed, selector not match any element')
					return
				}
				a[0].click()
				log('click Genius Bar')
				log('step over.')
			}
			
			function select_reservation_type($doc) {
				logTitle('Select Reservation Type')
				var nextButton
				if( !(nextButton = find($doc, '#fwdButtonC')) ) {
					return
				}
				nextButton[0].click()
				log('step over.')
			}

			function select_make_a_genius_bar_reservation($doc) {
				logTitle('Select "Make a Genius Bar reservation"')
				var nextButton
				if( !(nextButton = find($doc, 'a.more')) ) {
					return
				}
				nextButton[0].click()
				log('step over.')
			}

			function signin($doc, appleId, password, cb) {
				logTitle('SignIn')
				var appleIdInput,
					passwordInput,
					submitButton
				if( !(appleIdInput = find($doc, 'input[name="appleId"]')) ||
					!(passwordInput = find($doc, 'input[name="accountPassword"]')) ||
					!(submitButton = find($doc, '#signInHyperLink')) ) {
					return
				}
				appleIdInput.val(appleId)
				passwordInput.val(password)
				submitButton[0].click()
				log('step over')
			}

			function provide_government_id($doc, firstName, lastName, idType, idValue) {
				logTitle('Provide Government ID')
				idType = idType || ''
				idValue = idValue || ''
				var firstNameInput,
					lastNameInput,
					idTypeSelect,
					idInput,
					nextButton

				if( !(firstNameInput = find($doc, 'input#FirstName')) ||
					!(lastNameInput = find($doc, 'input#LastName')) ||
					!(idTypeSelect = find($doc, 'select#idType')) ||
					!(idInput = find($doc, 'input#GovernmentID')) ||
					!(nextButton = find($doc, 'a#fwdButtonC')) ) {
					return
				}

				if (firstName) {
					firstNameInput.val(firstName)
				}

				if (lastName) {
					lastNameInput.val(lastName)
				}

				var targetIdTypeOption

				idTypeSelect.children().each(function(i, item) {
					if ($(item).text().trim().toLowerCase().indexOf(idType.toLowerCase().trim()) >= 0 ||
						$(item).val() === idType) {
						targetIdTypeOption = $(item)
						return false
					}
				})

				if (!targetIdTypeOption) {
					log('falied, id type not found')
					return
				}

				//idTypeSelect[0].selectedIndex = targetIdTypeOption[0].index
				targetIdTypeOption.attr('selected', 'true')
				idInput.val(idValue)

				nextButton.removeClass('dark').addClass('blue')
				nextButton[0].click()
				log('step over')
			}

			function select_product_type($doc, productType) {
				logTitle('Select Product Type')
				var serviceType,
					nextButton
				if( !(serviceType = find($doc, 'a#serviceType_' + productType)) ||
					!(nextButton = find($doc, 'a#fwdButtonC')) ) {
					return
				}

				serviceType[0].click()
				nextButton[0].click()
				log('step over')
			}

			function sms_challenge($doc) {
				logTitle('SMS Challenge')

				// DEBUG
				//$doc[0].location.href = 'https://concierge.apple.com/history/R448'

				var smsText,
					imageCaptcha,
					inputCaptcha

				if( !(smsText = find($doc, '.steps>li:first-child>.step')) ||
					!(imageCaptcha = find($doc, 'img#imageCaptcha')) ||
					!(inputCaptcha = find($doc, 'input#captchaAnswer')) ) {
					return
				}

				smsText = smsText.text()
				smsText = smsText.substring(smsText.indexOf('“') + 1, smsText.indexOf('”'))
				if(smsText.length <= 0) {
					return
				}
				console.log(smsText)

				jsdati.upload(imageCaptcha[0], function(data) {
					inputCaptcha.val(data)
				}, function() {
					alert('jsdati failed')
				})
			}

			function pick_time($doc) {
				logTitle('Pick Time')

				if (!$doc.find('.slot_inner.conditional').length) {
					// try output error message
					if ($doc.find('#errorMessageC').length) {
						log($doc.find('#errorMessageC').text().trim())
					}
					else {
						log('no available time, and error message not found :(')
					}
					$doc[0].location.href = taskUrl	
				}
				else {
					log('available')
					var groups = $doc.find('.slot_inner.conditional')
					groups.eq(0).click()
					debugger
					//document.querySelectorAll('span#groupSelectedC40')[0].querySelectorAll('a#timeslotC')
					setTimeout(function() {
						$doc.find('a#timeslotC')[0].click()
					}, 0)

					setTimeout(function() {
						$doc.find('#fwdButtonC')[0].click()
					}, 0)
				}
				// }
				// else {
				// 	log('success')
				// }
			}

			function success_confirmation($doc, win) {
				logTitle('Success Confirmation')
				win.alert('预约成功啦')
			}

			function find($doc, selector) {
				var target = $doc.find(selector)
				if (!target.length) {
					log('failed, ' + selector + ' selector not match any element')
					return false
				}
				else {
					return target
				}
			}
		}
	}

	function newWindow(url) {
		var win = gui.Window.get(window.open(url))
		autoClose(currentWindow, win)
		return win
	}

	function gotoUrl(win, url) {
		// win.window.location.href = url
		console.log(win.window.location.href)
		return win
	}
})()

// log & logTitle

;(function() {

	window.logTitle = function(mdText) {
		var e = MarkdownE('h3', mdText)
		$('#log').append(e)
	}

	window.log = function(mdText, plain) {
		if (plain) {
			var e = document.createElement('p')
			e.textContent = mdText
		}
		else {
			var e = MarkdownE('p', mdText)
		}
		$('#log').append(e)
	}

	function MarkdownE(name, mdText) {
		var e = document.createElement(name)
		e.innerHTML = markdown.toHTML(mdText)
		return e
	}

})();

// jsdati

;(function() {
	window.jsdati = {
		upload_url: 'http://bbb4.hyslt.com/api.php?mod=php&act=upload',
		upload_params: {
			user_name: 'zetsin',
			user_pw: '7311327zetsin',
			yzm_minlen: 4,
			yzm_maxlen: 5,
			yzmtype_mark: 25,
			zztool_token: '26aeea5eb6a83e8d28a2a8e03b199bc0'
		},
		upload: function (image, scb, fcb) {
			scb = typeof scb === 'function' ? scb : function (data) {}
			fcb = typeof fcb === 'function' ? fcb : function (err) {}

			if(image === undefined) {
				fcb()
				return
			}
			if (image.complete) {
				_upload()
			} else {
				image.onload = function () {
					_upload()
					image.onload = null
				}
			}
			var _upload = function () {
				var canvas = document.createElement('canvas')
				canvas.width = image.width
				canvas.height = image.height
				var ctx = canvas.getContext('2d')
				ctx.drawImage(image, 0, 0)
				document.body.appendChild(canvas)
				if (canvas.toBlob) {
					canvas.toBlob( function (blob) {
						var formData = new FormData()
						for(var k in jsdati.upload_params) {
							formData.append(k, jsdati.upload_params[k])
						}
						formData.append('upload', blob, Math.random () + '.png')
						
						var xmlhttp = new XMLHttpRequest();
						xmlhttp.onreadystatechange = function () {
							if (xmlhttp.readyState == 4)
							{
								if (xmlhttp.status == 200)
								{
									var responseJson = JSON.parse(xmlhttp.responseText)
									if(responseJson.result === true && responseJson.data !== undefined) {
										scb(responseJson.data.val)
									}
								}
								else
								{
									fcb()
								}
							}
						}
						xmlhttp.open("POST", jsdati.upload_url, true);
						xmlhttp.send(formData);
					},
					'image/png'
					)
				}
			}
			
		}
	}
})();

// getParameter

;(function() {
	window.getParameter = function(name) {
		if (!location.search) {
			return null
		}

		var searchText = location.search.substring(1)
		var lines = searchText.split('&').filter(function(line) {
			return line && true
		})
		name = name.toLowerCase()
		for (var i = 0, len = lines.length; i < len; ++i) {
			var pair = lines[i].split('=')
			if (pair[0].toLowerCase() === name) {
				return decodeURIComponent(pair[1])
			}
		}
		return null
	}
})();

// handle user submiting form

$(function() {
	$(mainForm).on('submit', function() {
		$('.preparing').addClass('hidden')
		$('.working').removeClass('hidden')
		var store = mainForm.store.value
		var email = mainForm.email.value
		var password = mainForm.password.value
		task.start(store, email, password, random.id())
	})

	var taskId = getParameter('taskId')
	var rpcServer = getParameter('rpcServer')
	console.log(taskId)
	console.log(rpcServer)
	rpc.url = rpcServer

	getTask(taskId, function(err, res) {
		if (err) {
			console.error(err)
		}
		else if (res.error) {
			console.error(res)
		}
		else {
			var task = res.task
			mainForm.store.value = task.storeList[0]
			mainForm.email.value = task.email
			mainForm.password.value = task.password
			mainForm.submit.click()
		}
	})

	// # cb(err, task)
	function getTask(taskId, cb) {
		var req = {
			action: 'get_task',
			id: taskId
		}
		rpc(req, cb)
	}
})
