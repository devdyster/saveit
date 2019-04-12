require('bootstrap');
var $ = require('jquery')
const {ipcRenderer} = require('electron')
var exitBtn = document.getElementById('exit-btn');
var githubBtn = document.getElementById('github-btn');
var addBtn = document.getElementById('add');

var tab
exitBtn.addEventListener('click', () =>{
    ipcRenderer.send('exit-the-app','exit');
});

githubBtn.addEventListener('click', () =>{
    ipcRenderer.send('github-repo','github');
});

addBtn.addEventListener('click', () => {
    ipcRenderer.send('open-add-window','add-window');
});

document.addEventListener('DOMContentLoaded',function(){
    ipcRenderer.send('main-window-loaded','main-loaded');
 
    ipcRenderer.on('items-list',(event,arg) =>{
        $('#boilers-container').empty();
        arg.forEach((item) => {
            $('#boilers-container').append(
                ` <tr>
                <td>${item.title}</td>
                <td>${item.created_at}</td>
                <td><button class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#delete-modal"><i class="fas fa-pen-square    "></i></button></td>
                <td><button class="btn btn-outline-danger btn-sm" data-toggle="modal" data-target="#delete-modal"><i class="fas fa-trash-alt    "></i></button></td>
            </tr>`
            )
        })
    })
})





