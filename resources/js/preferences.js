var Preferences = function(defaults) {

	this.byteArray = new air.ByteArray();
	this.preferences = (typeof(defaults) == 'undefined' ? {} : defaults);
	this.init();
	
};

Preferences.prototype = {

	init: function() {
		if(!this.empty())
			this.preferences = air.EncryptedLocalStore.getItem('preferences').readObject();
	},
	
	empty: function() {
		var values = air.EncryptedLocalStore.getItem('preferences');
		return (values == null);
	},

	get: function(key) {
		return (typeof(this.preferences[key]) != 'undefined' ? this.preferences[key] : null);
	},
	
	set: function(key, value) {
		this.preferences[key] = value;	
	},
	
	clear: function(key) {
		delete this.preferences[key];
	},
	
	reset: function() {
		air.EncryptedLocalStore.reset();
	},
	
	commit: function() {
		var byteArray = new air.ByteArray();
		byteArray.writeObject(this.preferences);
		air.EncryptedLocalStore.setItem('preferences', byteArray);
	}

};