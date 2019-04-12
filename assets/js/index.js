require('bootstrap');

const {ipcRenderer} = require('electron')
var exitBtn = document.getElementById('exit-btn');
var githubBtn = document.getElementById('github-btn');
var addBtn = document.getElementById('add');

exitBtn.addEventListener('click', () =>{
    ipcRenderer.send('exit-the-app','exit');
});

githubBtn.addEventListener('click', () =>{
    ipcRenderer.send('github-repo','github');
});

addBtn.addEventListener('click', () => {
    ipcRenderer.send('open-add-window','add-window');
});



