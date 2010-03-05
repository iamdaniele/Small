var Button = function(config) {
	this.id = config.id;
	this.localInnerHTML = (typeof(config.localInnerHTML) != 'undefined' ? config.localInnerHTML : null);
	this.label = config.label;
	this.posX = config.posX; 
	this.posY = config.posY; 
	this.callback = config.callback;

	this.build();
};

Button.prototype = {
	button: null,
	
	segments: [
		'resources/hud/blkSegmentSelectedL.1.png',
		'resources/hud/blkSegmentSelectedM.1.png',
		'resources/hud/blkSegmentSelectedR.1.png'
	],
	
	preload: function() {
		var img;
		for(i in this.segments) {
			img = new Image();
			img.src = this.segments[i];
		}
	},

	getElement: function() { return this.button; },

	setDisplay: function(style) {
		this.button.setAttribute('style', this.button.getAttribute('style').replace(/display: block/, 'display: ' + style));
	},

	build: function() {
	
		this.button = document.createElement('div');
		this.button.id = this.id;
		this.button.setAttribute('style', 'display: block; -webkit-user-select: none; cursor: default; font-family: Lucida Grande, Helvetica Neue, Helvetica, Arial, sans-serif; position: absolute; top: ' + this.posX + 'px; left: ' + this.posY + 'px; font-size: 11px');

		var left = document.createElement('div');
		left.id = this.id + 'L';
		left.setAttribute('style', 'width: 4px; height: 20px; background: url(resources/hud/blkSegmentL.1.png) no-repeat; float: left');
		
		var middle = document.createElement('div');
		middle.id = this.id + 'M';
		middle.setAttribute('style', 'padding: 2px; height: 20px; background: url(resources/hud/blkSegmentM.1.png) repeat-x; float: left; color: white');
		middle.setAttribute('local_innerHTML', this.localInnerHTML);
//		middle.innerHTML = this.label;

		var right = document.createElement('div');
		right.id = this.id + 'R';
		right.setAttribute('style', 'width: 4px; height: 20px; background: url(resources/hud/blkSegmentR.1.png) no-repeat; float: left');


		this.button.addEventListener('mousedown', function(e) {
			left.setAttribute('style', left.getAttribute('style').replace(/blkSegmentL.1.png/, 'blkSegmentSelectedL.1.png'));
			middle.setAttribute('style', middle.getAttribute('style').replace(/blkSegmentM.1.png/, 'blkSegmentSelectedM.1.png'));
			right.setAttribute('style', right.getAttribute('style').replace(/blkSegmentR.1.png/, 'blkSegmentSelectedR.1.png'));
		});

		var callback = this.callback;	
		this.button.addEventListener('mouseout', function() {
			left.setAttribute('style', left.getAttribute('style').replace(/blkSegmentSelectedL.1.png/, 'blkSegmentL.1.png'));
			middle.setAttribute('style', middle.getAttribute('style').replace(/blkSegmentSelectedM.1.png/, 'blkSegmentM.1.png'));
			right.setAttribute('style', right.getAttribute('style').replace(/blkSegmentSelectedR.1.png/, 'blkSegmentR.1.png'));
		});

		this.button.addEventListener('mouseup', function() {
			left.setAttribute('style', left.getAttribute('style').replace(/blkSegmentSelectedL.1.png/, 'blkSegmentL.1.png'));
			middle.setAttribute('style', middle.getAttribute('style').replace(/blkSegmentSelectedM.1.png/, 'blkSegmentM.1.png'));
			right.setAttribute('style', right.getAttribute('style').replace(/blkSegmentSelectedR.1.png/, 'blkSegmentR.1.png'));
			callback();
		});

		this.button.appendChild(left);
		this.button.appendChild(middle);
		this.button.appendChild(right);
		air.Localizer.localizer.update(this.button);
		return this.button;
	}
	
};


var ProgressBar = function(config) {
	this.id = config.id;
	this.localInnerHTML = (typeof(config.localInnerHTML) != 'undefined' ? config.localInnerHTML : null);
	this.posX = config.posX;
	this.posY = config.posY;
	this.label = config.label;
	this.percent = 0;
	this.build();
	return this;
};

ProgressBar.prototype = {

	getLabel: function() {
		return document.getElementById(this.id + '-label').innerHTML;
	},

	setLabel: function(text) {
		document.getElementById(this.id + '-label').innerHTML = text;
	},
	
	setProgress: function(percent) {
		this.percent = percent; 
		document.getElementById(this.id + '-completed').style.width = percent + '%';
		document.getElementById(this.id + '-remaining').style.width = (100 - percent) + '%';
	},
	
	getProgress: function() {
		return this.percent;
	},
	
	getElement: function() {
		return this.progressBar;
	},

	build: function() {
		this.progressBar = document.createElement('div');
		this.progressBar.setAttribute('id', this.id);
		this.progressBar.style.width = '200px';
		this.progressBar.style.position = 'absolute';
		this.progressBar.style.top = this.posX;
		this.progressBar.style.left = this.posY;
		
		var label = document.createElement('div');
		label.setAttribute('id', this.id + '-label');
		label.setAttribute('local_innerHTML', this.localInnerHTML);
		label.style.fontSize = '11px';
		label.style.color = 'grey';
		label.style.textAlign = 'center';
		label.style.marginBottom = '10px';
		label.style.textOverflow = 'ellipsis';
//		label.innerHTML = this.label;

		var completed = document.createElement('div');
		completed.setAttribute('id', this.id + '-completed');
		completed.style.width = '0%';
		completed.style.height = '9px';
		completed.style.background = 'url(resources/hud/blkProgressBar.1.png) repeat-x';
		completed.style.float = 'left';

		var remaining = document.createElement('div');
		remaining.setAttribute('id', this.id + '-remaining');
		remaining.style.width = '100%';
		remaining.style.height = '9px';
		remaining.style.background = 'url(resources/hud/blkProgressBack.1.png) repeat-x';
		remaining.style.float = 'left';


		this.progressBar.appendChild(label);
		this.progressBar.appendChild(completed);
		this.progressBar.appendChild(remaining);
	}
};
