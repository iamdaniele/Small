var progress = new ProgressBar({
	id: 'resizingProgress',
	localInnerHTML: 'default.gettingImages',
	label: 'Ottengo le immagini&#0133;',
	posX: 175,
	posY: 45
});

var resizeDoneBtn = new Button({
	id: 'resizeDoneBtn',
	label: 'Fatto',
	localInnerHTML: 'default.done',
	posX: 220,
	posY: 206,
	callback: function() {
		resizeDoneBtn.setDisplay('none');
		document.getElementById('resizing').style.display = 'none';
		document.getElementById('welcome').style.display = 'block';
	}
});