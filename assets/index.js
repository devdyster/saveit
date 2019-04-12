require('bootstrap');
const {ipcRenderer} = require('electron')
var exitBtn = document.getElementById('exit-btn');
var githubBtn = document.getElementById('github-btn');
exitBtn.addEventListener('click', () =>{
    ipcRenderer.send('exit-the-app','exit');
});
githubBtn.addEventListener('click', () =>{
    ipcRenderer.send('github-repo','github');
});

