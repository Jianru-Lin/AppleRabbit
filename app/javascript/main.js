var gui = require('nw.gui')

var currentWindow = gui.Window.get()
var windowList = []

function start() {

	var storeList = {
		上海环贸: 401,
		南京东路: 359,
		浦东: 389,
		香港广场: 390,
		三里屯: 320,
		华贸购物中心: 479,
		王府井: 448,
		西单大悦城: 388,
		成都万象城: 502,
		无锡恒隆广场: 574,
		深圳益田假日广场: 484,
		郑州万象城: 572,
		重庆北城天街: 476
	}

	var appleUrl = 'http://concierge.apple.com/reservation/cn/zh/R###/techsupport'

	var task = {
		//storeName: '上海环贸',
		storeName: '华贸购物中心',
		appleId: 'kwindly@aliyun.com',
		password: 'Kwindly10180521',
		governmentId: {
			firstName: undefined,
			lastName: undefined,
			type: 'CN.PRCID',
			value: '123123'			
		},
		productType: 'iPhone'

		//appleId: 'zetsin@icloud.com',
		//password: '7311327Zetsin'
	}

	var taskUrl = appleUrl.replace('###', storeList[task.storeName])
	
	currentWindow.maximize()
	currentWindow.show()

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
		/*
		if (exists('#storelist')) {
			find_target_store($doc, task.storeName)
		}
		else if (exists('body.retail.store-page')) {
			select_genius_bar_service($doc)
		}
		else */
		if (exists('body.MakeAReservation.caid_contact')) {
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
			smschallenge($doc)
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

	// find_target_store(appleUrl.storeList, task.storeName, function(win) {
	// 	select_genius_bar_service(win, function() {
	// 		select_reservation_type(win, function() {
	// 			select_make_a_genius_bar_reservation(win, function() {
	// 				signin(win, task.appleId, task.password, function() {

	// 				})
	// 			})
	// 		})
	// 	})
	// })

	// # cb(win)
/*
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
*/
	function select_reservation_type($doc) {
		logTitle('Select Reservation Type')
		var a = $doc.find('#fwdButtonC')
		if (a.length < 1) {
			log('failed, selector not match any element')
			return
		}
		a[0].click()
		log('click next')
		log('step over.')
	}

	function select_make_a_genius_bar_reservation($doc) {
		logTitle('Select "Make a Genius Bar reservation"')
		var a = $doc.find('a.more')
		if (a.length < 1) {
			log('failed, selector not match any element')
			return
		}
		a[0].click()
		log('click next')
		log('step over.')
	}

	function signin($doc, appleId, password, cb) {
		logTitle('SignIn')
		var appleIdInput = $doc.find('input[name="appleId"]')
		if (appleIdInput.length < 1) {
			log('failed, apple id input selector not match any element')
			return
		}
		var passwordInput = $doc.find('input[name="accountPassword"]')
		if (passwordInput.length < 1) {
			log('failed, password input selector not match any element')
			return
		}
		var submitButton = $doc.find('#signInHyperLink')
		if (submitButton.length < 1) {
			log('failed, submit button selector not match any element')
			return
		}
		appleIdInput.val(appleId)
		passwordInput.val(password)
		submitButton[0].click()
		log('click next')
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

		if ((firstNameInput = find($doc, 'first name input', 'input#FirstName')) &&
			(lastNameInput = find($doc, 'last name input', 'input#LastName')) &&
			(idTypeSelect = find($doc, 'id type select', 'select#idType')) &&
			(idInput = find($doc, 'id input', 'input#GovernmentID')) &&
			(nextButton = find($doc, 'next button', 'a#fwdButtonC'))) {

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
			log('click next')
			log('step over')
		}
		else {
			return
		}
	}

	function select_product_type($doc, productType) {
		logTitle('Select Product Type')
		$doc.find('a#serviceType_iPhone')[0].click()
		$doc.find('a#fwdButtonC')[0].click()
		log('click next')
		log('step over')
	}

	function smschallenge($doc) {
		logTitle('SMS Challenge')

		var image = $doc.find('img#imageCaptcha')[0]
		jsdati.upload(image, function(data) {
			$doc.find('input#captchaAnswer').val(data)
		})
	}

	function find($doc, name, selector) {
		var target = $doc.find(selector)
		if (!target.length) {
			log('failed, ' + name + ' selector not match any element')
			return false
		}
		else {
			return target
		}
	}
}

function clear() {
	windowList.forEach(function(w) {
		w.close()
	})
	windowList = []
}

function newWindow(url) {
	var win = gui.Window.get(window.open(url, {"user-agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"}))
	windowList.push(win)
	return win
}

function gotoUrl(win, url) {
	// win.window.location.href = url
	console.log(win.window.location.href)
	return win
}

function logTitle(mdText) {
	var e = MarkdownE('h3', mdText)
	$('#log').append(e)
}

function log(mdText, plain) {
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

var jsdati = {
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
		log('upload')
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
		log('upload image')
		var _upload = function () {
			var canvas = document.createElement('canvas')
			canvas.width = image.width
			canvas.height = image.height
			var ctx = canvas.getContext('2d')
			ctx.drawImage(image, 0, 0)
			document.body.appendChild(canvas)
			if (canvas.toBlob) {
				log('toBlob')
				canvas.toBlob( function (blob) {
					log('on toBlob')
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

					/*
					$.ajax({  
						type: 'POST',  
						url: jsdati.upload_url,  
						data: formData,
						contentType: false,
						processData: false  
					}).done(function(data){
						log(data)
						scb(data)
					})
					*/
				},
				'image/png'
				)
			}
		}
		
	}
}

onload = start

unload = clear
currentWindow.once('closed', clear)