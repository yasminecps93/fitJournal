$(document).ready(function() {

  $('input').blur(function() {

    // check if the input has any value (if we've typed into it)
    if ($(this).val())
      $(this).addClass('used');
    else
      $(this).removeClass('used');
  });

 // 	document.getElementById("createFile").addEventListener("click", createFile);
//	document.getElementById("writeFile").addEventListener("click", writeFile);
//	document.getElementById("readFile").addEventListener("click", readFile);
//	document.getElementById("removeFile").addEventListener("click", removeFile);

});

/*function createFile() {
	console.log("called function!");
   var type = window.TEMPORARY;
   var size = 5*1024*1024;

   window.requestFileSystem(type, size, successCallback, errorCallback)

   function successCallback(fs) {
      fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
         alert('File creation successfull!')
      }, errorCallback);
   }

   function errorCallback(error) {
      alert("ERROR: " + error.code)
   }
	
}
*/