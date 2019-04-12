require('bootstrap')
var Quill = require('quill')
const {ipcRenderer} = require('electron')
window.onload = function(){
    var editor = document.getElementById('editor')
    var options = {
        placeholder: 'You note goes here ..',
        readOnly: false,
        theme: 'snow'
      };
    var quillEditor = new Quill(editor,options)
}
var closeBtn = document.getElementById('close-btn')

closeBtn.addEventListener('click', () =>{
    ipcRenderer.send('close-add-window','close-add')
})