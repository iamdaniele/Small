var Resizer = function() {
	this.queue = [];
	this.path = null;
	this.timer = null;
}

Resizer.prototype = {

	MAX_SIZE: 640,
	QUALITY: 100,
	TIMEOUT: 250,

	setPath: function(path) { this.path = path },	

	basename: function(path, suffix) {
		// http://kevin.vanzonneveld.net
		// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   improved by: Ash Searle (http://hexmen.com/blog/)
		// +   improved by: Lincoln Ramsay
		// +   improved by: djmix
		// *     example 1: basename('/www/site/home.htm', '.htm');
		// *     returns 1: 'home'
		
		var b = path.replace(/^.*[\/\\]/g, '');
		if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
			b = b.substr(0, b.length-suffix.length);
		}
		return b;
	},
	
	resize: function(source) {
		var r = this;
		this.queue = source;
		
		this.timer = new air.Timer(this.TIMEOUT, this.queue.length);
		
		this.timer.addEventListener(air.TimerEvent.TIMER, function() {
			var index = r.timer.currentCount - 1;
			r.progress.setLabel(r.basename(r.queue[index]));
			r.progress.setProgress((100 / r.timer.repeatCount) * (index + 1));
			r.doResize(r.queue[index]);
		});
		
		this.timer.addEventListener(air.TimerEvent.TIMER_COMPLETE, function() {
			r.progress.setLabel('');
			document.getElementById('resizingLabel').innerHTML = air.Localizer.localizer.getString('default', 'done');
			document.getElementById('resizeDoneBtn').style.display = 'block';		
		});
		
		this.timer.start();

	},

	doResize: function(source) {
		var myself = this;

        var imgLoaded = function(event) {
		air.trace('inner path ' + myself.path);
        	air.trace('loadHandler');
            var image = air.Bitmap(loader.content);
			air.trace(source+': '+ image.bitmapData.width +'x'+image.bitmapData.height);
			
			// get size
			var proportionRatio;

			if(image.bitmapData.width <= myself.MAX_SIZE && image.bitmapData.height <= myself.MAX_SIZE)
				proportionRatio = 1.0;
			else {
				if(image.bitmapData.width > image.bitmapData.height)
					proportionRatio = image.bitmapData.width / myself.MAX_SIZE;
				else
					proportionRatio = image.bitmapData.height / myself.MAX_SIZE;
			}

			var fileName = myself.basename(source);

			var bmp = new air.BitmapData(image.bitmapData.width / proportionRatio, image.bitmapData.height / proportionRatio);
			var png = null;
			var file = air.File.desktopDirectory.resolvePath(myself.path);
			if(!file.isDirectory)
				file.createDirectory();
			file = air.File.desktopDirectory.resolvePath(myself.path + '/' + fileName);
			
			var stream = new air.FileStream();
			var matrix = new air.Matrix();
						
			matrix.scale(1 / proportionRatio, 1 / proportionRatio);
			bmp.draw(image.bitmapData, matrix, null, null, null, true);
			encoder = new window.runtime.com.adobe.images.JPGEncoder(myself.QUALITY);
			png = encoder.encode( bmp );

			stream.open( file, air.FileMode.WRITE );
			stream.writeBytes( png, 0, 0 );
			stream.close();
        };
		var loader = new air.Loader(); // new runtime.flash.display.Loader();

		loader.contentLoaderInfo.addEventListener(air.Event.COMPLETE, imgLoaded);
		loader.contentLoaderInfo.addEventListener(air.IOErrorEvent.IO_ERROR, function() {
			return false;
		});
		var request = new air.URLRequest('file://' + source);
		loader.load(request);
	}
};