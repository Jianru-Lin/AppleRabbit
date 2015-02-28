
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

// auto get task and run it

;$(function() {

	var taskIdList = JSON.parse(getParameter('taskIdList'))
	var rpcServer = getParameter('rpcServer')
	console.log(taskIdList)

	taskIdList.forEach(function(taskId, i) {
		var src = 'run.html?taskId={0}&rpcServer={1}'.replace('{0}', encodeURIComponent(taskId))
													 .replace('{1}', encodeURIComponent(rpcServer))
		var e = iframe(src)
		document.body.appendChild(e)
	})

	function iframe(src) {
		var e = document.createElement('iframe')
		e.setAttribute('src', src)
		return e
	}
});