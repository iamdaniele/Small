var updater = new Updater();

var preferences = new Preferences({
	savePath: air.File.desktopDirectory.resolvePath('Small').nativePath,
	windowPosition: { x: window.nativeWindow.x, y: window.nativeWindow.y }
});


var exitHandler = function(event) {
	preferences.commit();
	event.target.exit();

	return false;
};

var updateBtn = new Button({
	id: 'updateBtn',
	label: 'Aggiorna',
	localInnerHTML: 'default.update',
	posX: 220,
	posY: 120,
	callback: function() {
		document.getElementById('updateAvailable').style.display = 'none';
		document.getElementById('updating').style.display = 'block';
		updater.update();
	}
});

var updatingProgress = new ProgressBar({
	id: 'updatingProgress',
	label: 'Scarico&#0133;',
	localInnerHTML: 'default.downloading',
	posX: 175,
	posY: 45
});

function doLoad()
{
	var savePath = air.File.desktopDirectory.resolvePath(preferences.get('savePath'));
	if(!(savePath.exists && savePath.isDirectory))
		savePath.createDirectory();

	air.Localizer.localizer.update();
	document.getElementById('updateAvailable').appendChild(updateBtn.getElement());
	document.getElementById('updating').appendChild(updatingProgress.getElement());
	updater.loader.addEventListener(air.Event.COMPLETE, function() {
		if(updater.getLatestVersion() > updater.getCurrentVersion()) {
			document.getElementById('splash').style.display = 'none';	
			document.getElementById('updateAvailable').style.display = 'block';
		}
		else {
			document.getElementById('splash').style.display = 'none';
			document.getElementById('welcome').style.display = 'block';
		}
	});
	
	updater.urlStream.addEventListener('progress', function(event) {
		air.trace('progress');
		air.trace(event.bytesLoaded + " out of " + event.bytesTotal);

	});

	document.getElementById('resizing').appendChild(progress.getElement());
	document.getElementById('resizing').appendChild(resizeDoneBtn.getElement());
	air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, exitHandler);

	window.nativeWindow.activate();

	// Configure placement and maximum size of native window
	var windowPosition = preferences.get('windowPosition');
	window.nativeWindow.x = windowPosition.x;
	window.nativeWindow.y = windowPosition.y;

	window.nativeWindow.maxSize = new air.Point( 288, 416 );
	
	var savePath = preferences.get('savePath');

	var target = document.body; 
	
	target.addEventListener("dragenter", dragEnterOverHandler); 
	target.addEventListener("dragover", dragEnterOverHandler); 
	target.addEventListener("drop", dropHandler);
	

	target.addEventListener('mousedown', function(e) {
		if(e.target.id == '')
			window.nativeWindow.startMove();
	});
	
	target.addEventListener('mouseup', function(e) {
		if(e.target.id == '')
			preferences.set('windowPosition', { x: window.nativeWindow.x, y: window.nativeWindow.y });
	});

	document.getElementById('closeBtn').addEventListener('mousedown', function() {
		preferences.commit();
		air.NativeApplication.nativeApplication.exit();
	});

	var preferencesButton = new Button({
		id: 'preferencesButton',
		label: 'Preferenze&#0133;',
		localInnerHTML: 'default.preferences',
		posX: 365, 
		posY: 176, 
		callback: function(){

			target.removeEventListener("dragenter", dragEnterOverHandler); 
			target.removeEventListener("dragover", dragEnterOverHandler); 
			target.removeEventListener("drop", dropHandler);
	
			document.getElementById('welcome').style.display = 'none';
			document.getElementById('preferences').style.display = 'block';

		}
	});
	document.getElementById('welcome').appendChild(preferencesButton.getElement());

	var preferencesOK = new Button({
		id: 'preferencesOK', 
		label: 'OK', 
		localInnerHTML: 'default.ok',
		posX: 250, 
		posY: 227, 
		callback: function(){
			document.getElementById('preferences').style.display = 'none';
			document.getElementById('welcome').style.display = 'block';
	
			target.addEventListener("dragenter", dragEnterOverHandler); 
			target.addEventListener("dragover", dragEnterOverHandler); 
			target.addEventListener("drop", dropHandler);
		}
	});

	var preferencesChangePath = new Button({
		id: 'changePathBtn', 
		label: 'Cambia&#0133;',
		localInnerHTML: 'default.change',
		posX: 120,
		posY: 198, 
		callback: function() {
			var saveTo = preferences.get('savePath');
			if(saveTo == null) saveTo = '';
			path = air.File.desktopDirectory.resolvePath(saveTo);
			path.browseForDirectory(air.Localizer.localizer.getString('default', 'selectFolder'));
			path.addEventListener(air.Event.SELECT, function(event) {
				air.trace(event.target.nativePath);
				preferences.set('savePath', event.target.nativePath);
				document.getElementById('savePath').value = event.target.nativePath;
			});
		}
	});
	document.getElementById('preferences').appendChild(preferencesChangePath.getElement());
	
	document.getElementById('savePath').value = preferences.get('savePath');
	document.getElementById('preferences').appendChild(preferencesOK.getElement());
	
}