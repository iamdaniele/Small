var Updater = function() {
	this.address = 'http://backend.syncrosoft.it/small/';
	this.versionCheckURL = 'versioncheck.php';
	this.repository = 'http://backend.syncrosoft.it/small/repository/'
	this.filenamePrefix = 'small-';
	
	this.currentVersion = null;
	this.latestVersion = null;
	this.urlStream = new air.URLStream();
	this.loader = new air.URLLoader();
	this.getCurrentVersion();
	this.getRemoteVersion();
};

Updater.prototype = {

	getCurrentVersion: function() {
		if(this.currentVersion != null) return this.currentVersion;

		var xmlString = air.NativeApplication.nativeApplication.applicationDescriptor; 
		var appXml = new DOMParser(); 
		var xmlobject = appXml.parseFromString(xmlString, "text/xml"); 
		var root = xmlobject.getElementsByTagName('application')[0]; 
		this.currentVersion = root.getElementsByTagName("version")[0].firstChild.data; 
		return this.currentVersion;
	},

	getLatestVersion: function() { return this.latestVersion; },
	
	getRemoteVersion: function() {
		var __self = this;
		this.loader = new air.URLLoader();
		this.loader.addEventListener(air.Event.COMPLETE, function(event) {
			var loaded = event.target;
			__self.latestVersion = loaded.data;
		});
		
		this.loader.addEventListener(air.IOErrorEvent.IO_ERROR, function() { return false });
		var request = new air.URLRequest(this.address + this.versionCheckURL);
		this.loader.load(request);
	},

	update: function() {
		var __self = this;
		var basename = this.filenamePrefix + this.latestVersion + '.air';
	
		var urlString = this.repository + basename; 
		var urlReq = new air.URLRequest(urlString); 
		this.urlStream = new air.URLStream(); 
		var fileData = new air.ByteArray(); 

		this.urlStream.addEventListener('progress', function(event) {
			var percent = 100 * (event.bytesLoaded / event.bytesTotal);
			updatingProgress.setProgress(Math.floor(percent));
		});
		
		this.urlStream.addEventListener(air.Event.COMPLETE, function() {
			__self.urlStream.readBytes(fileData, 0, __self.urlStream.bytesAvailable); 

			var file = air.File.applicationStorageDirectory.resolvePath(basename); 
			var fileStream = new air.FileStream(); 

			fileStream.open(file, air.FileMode.WRITE); 
			fileStream.writeBytes(fileData, 0, fileData.length); 
			fileStream.close();

			var updater = new air.Updater(); 
			var airFile = air.File.applicationStorageDirectory.resolvePath(basename); 
			updater.update(airFile, __self.latestVersion);
		});
		this.urlStream.load(urlReq);
	}

};