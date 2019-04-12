var $ = require('jquery')
require('bootstrap')
var Quill = require('quill')
const {ipcRenderer} = require('electron')

var editor = document.getElementById('editor')
var titleInput = document.getElementById('title')

var dtnow = function(){
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

 
    var today = year + "-" + this.pad(month) + "-" + this.pad(day); 

    var date = new Date();
    var time = date.getHours() + ":" + this.pad(date.getMinutes()) + ":" + this.pad(date.getSeconds());

    return today + ' ' + time;


}
function pad(n){
    return (n < 10) ? '0' + n.toString() : n.toString();
}

window.onload = function(){
   
    var options = {
        placeholder: 'You note goes here ..',
        readOnly: false,
        theme: 'snow'
      };
    var quillEditor = new Quill(editor,options)
}
var closeBtn = document.getElementById('close-btn')
var addBtn = document.getElementById('add')
var saveBtn = document.getElementById('save')
closeBtn.addEventListener('click', () =>{
    ipcRenderer.send('close-add-window','close-add')
})
addBtn.addEventListener('click', () =>{
let content = editor.children[0].innerHTML;
let title =  titleInput.value;
    if(content != '<p><br></p>' && title.trim() != ''){
        $('#add-confirm').modal('show')
    }
})

saveBtn.addEventListener('click',() =>{
let body = editor.children[0].innerHTML;
let title = titleInput.value;
let created_at = dtnow();
ipcRenderer.send('new-content',{title,body,created_at})
})

ipcRenderer.on('item-saved',(event,arg) =>{
    $('#add-confirm').modal('hide')
    ipcRenderer.send('close-add-window','close-add')
    ipcRenderer.send('added-new-item','new-item')
})

