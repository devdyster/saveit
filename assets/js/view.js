var $ = require('jquery')
require('bootstrap')
var Quill = require('quill')
const {ipcRenderer} = require('electron')
var hljs = require('highlight.js')

var editor = document.getElementById('editor');
var closeModalBtn = document.getElementById('close-modal-btn');
var closeBtn = document.getElementById('close-btn');
var inputid = document.getElementById('inputid');
var saveModalBtn = document.getElementById('save-modal-btn');
var saveBeforeCloseBtn = document.getElementById('save-before-close');
var original = '';
document.addEventListener('DOMContentLoaded',function(){
    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'align': [] }],
        ['clean']                                         // remove formatting button
      ];
    var options = {
        modules : {
            toolbar : toolbarOptions
        },
        placeholder: 'You note goes here ..',
        readOnly: false,
        theme: 'snow'
      };
    var quillEditor = new Quill(editor,options)
    ipcRenderer.send('view-loaded');
    quillEditor.on('text-change',function(){
        document.querySelectorAll('pre').forEach((block) => {
            console.log(block)
            hljs.highlightBlock(block);
          });
       let content =  editor.children[0].innerHTML
       if(content != original){
           if($('#save').hasClass('disabled')){
               $('#save').removeClass('disabled')
           }
       }else{
        if(!$('#save').hasClass('disabled')){
            $('#save').addClass('disabled')
        }
       }
     })
});
ipcRenderer.on('item-to-view',(event,arg) =>{
    original = arg[0].body;
    editor.children[0].innerHTML = arg[0].body;
    inputid.setAttribute('value',arg[0].itemid)
    $('title').text(arg[0].title)
    document.querySelectorAll('pre').forEach((block) => {
        console.log(block)
        hljs.highlightBlock(block);
      });
})

closeBtn.addEventListener('click',() =>{
    console.log(original)
    if(original == editor.children[0].innerHTML){
        ipcRenderer.send('close-view-item');
    }else{
        $('#close-modal').modal('show');
    }
})

closeModalBtn.addEventListener('click',()=>{
    ipcRenderer.send('close-view-item');
})

saveModalBtn.addEventListener('click',() => {
    let item = {body : editor.children[0].innerHTML,itemid:inputid.getAttribute('value'),close:false}
    ipcRenderer.send('save-item',item);
    $('#save-modal').modal('hide');
    original = item.body;
    $('#save').addClass('disabled')
})
saveBeforeCloseBtn.addEventListener('click',() => {
    let item = {body : editor.children[0].innerHTML,itemid:inputid.getAttribute('value'),close:true}
    ipcRenderer.send('save-item',item);
})    



