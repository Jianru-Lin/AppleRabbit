;(function() {
	// notice: this function depend on jquery
	window.template = function(selector, content) {
		var text = Handlebars.compile($(selector).html())(content)
		return $(text)[0]
	}
})();