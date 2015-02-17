var express = require('express')
var router = express.Router()

router.post('/', function(req, res) {
	console.log(req.body)
	res.end('done')
})

module.exports = router