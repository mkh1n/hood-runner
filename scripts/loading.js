const run = 'assets/sprites/run/'
const jump = 'assets/sprites/jump/'
const idle = 'assets/sprites/idle/'

var loader = new PxLoader(); 
function downloadImages(path, length){
	for (let i = 1; i < length + 1; i += 1){
		loader.addImage(path + i);
	}
}

downloadImages(run, 12)
downloadImages(jump, 4)
