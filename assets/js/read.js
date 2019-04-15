var $ = require('jquery')
require('bootstrap')
const {ipcRenderer} = require('electron')
var hljs = require('highlight.js')

document.addEventListener('DOMContentLoaded',function(){
    ipcRenderer.send('read-loaded');
});
ipcRenderer.on('item-to-read',(event,arg) => {
    $('title').text(arg[0].title)
    $('#item-container').html(
        `<h5>${arg[0].title}</h5>
         <small class="text-muted">Created at : ${arg[0].created_at}</small>
            <hr>
         <p>${arg[0].body}</p>
        `
    )
    document.querySelectorAll('pre').forEach((block) => {
        hljs.highlightBlock(block);
      });
})
