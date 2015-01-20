var baseUrl = undefined;

(function() {
	var e = new Error();
	baseUrl = /(http:.+\/)loader\.js/.exec(e.stack.toString());
	if (baseUrl && baseUrl[1]) {
		baseUrl = baseUrl[1];
	}

	// 跳转到主页面
	window.location.href = baseUrl + '/index.html';

})();