function directoryListing(folder) {
	var fileList = new Array();

	//the current folder object
	var currentFolder = new air.File(folder);
	
	//the current folder's file listing
	var files = currentFolder.getDirectoryListing();
	
	//iterate and put files in the result and process the sub folders recursively
	for (var f = 0; f < files.length; f++) {
		if (files[f].isDirectory) {
			if (files[f].name != "." && files[f].name !=".."
			&& files[f].name != 'Thumbs.db' && files[f].name != '.DS_Store') {
				//it's a directory
				filesFromFolder = directoryListing(files[f].nativePath);
				for(var i = 0; i < filesFromFolder.length; i++)
					fileList.push(filesFromFolder[i]);
			}
		} else {
			//it's a file yupeee
			fileList.push(files[f].nativePath);
		}
	}   
	return fileList;
}

var resizer = new Resizer(progress);

function dragStartHandler(event) {
	event.dataTransfer.effectAllowed = "copy";
} 

function dragEndHandler(event){
//	document.body.style.background = "url(resources/images/GenericFolderIcon.png) no-repeat center center";
	air.trace(event.type + ": " + event.dataTransfer.dropEffect);
} 

function dragEnterOverHandler(event) { 
//	document.body.style.background = "url(resources/images/OpenFolderIcon.png) no-repeat center center";
	event.preventDefault();	
}


function dropHandler(event, recur) {

	resizeDoneBtn.setDisplay('none');
	document.getElementById('welcome').style.display = 'none';
	document.getElementById('resizingLabel').innerHTML = air.Localizer.localizer.getString('default', 'converting');
	document.getElementById('resizing').style.display = 'block';
	
	var files = event.dataTransfer.getData('application/x-vnd.adobe.air.file-list');
	var list = [];
	for(var f = 0; f < files.length; f++) {

		if(files[f].isDirectory) {
			filesFromDirectory = directoryListing(files[f].nativePath);
			
			for(var f = 0; f < filesFromDirectory.length; f++)
				list.push(filesFromDirectory[f]);
		}
		else list.push(files[f].nativePath);
	}

	resizer.path = preferences.get('savePath');
	air.trace(resizer.path);
	resizer.progress = progress;
	resizer.resize(list);
	
}