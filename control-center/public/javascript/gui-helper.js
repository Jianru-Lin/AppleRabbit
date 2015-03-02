function autoClose(parent, child) {
	parent.once('closed', function() {
		child.close()
	})
}
	