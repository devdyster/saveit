require('bootstrap');
var $ = require('jquery')
const {ipcRenderer} = require('electron')


// Menu button declaration : 
var exitBtn = document.getElementById('exit-btn');
var githubBtn = document.getElementById('github-btn');
var addBtn = document.getElementById('add');
var createBackupBtn = document.getElementById('create-backup');
var restoreBackupBtn = document.getElementById('restore-backup');


// search input 
var search = document.getElementById('search');


// Search control 

search.addEventListener('keyup',(e)=>{
    let txt = e.currentTarget.value;
    if(txt.trim()!=''){
     ipcRenderer.send('search-item',{txt})
    }else{
     ipcRenderer.send('main-window-loaded');
    }
   
})


// Menu controls
exitBtn.addEventListener('click', () =>{
    ipcRenderer.send('exit-the-app','exit');
});

githubBtn.addEventListener('click', () =>{
    ipcRenderer.send('github-repo','github');
});

addBtn.addEventListener('click', () => {
    ipcRenderer.send('open-add-window','add-window');
});

createBackupBtn.addEventListener('click',() =>{
   ipcRenderer.send('create-backup-dialog')
})

restoreBackupBtn.addEventListener('click',() => {
    ipcRenderer.send('check-if-empty');
})

// reading item :
$(document).on('click','#read',function(){
    let itemid = $(this).data('itemid')
    ipcRenderer.send('read-item',{itemid})
});

//Viewing/editing an item : 
$(document).on('click','#view',function(){
    let itemid = $(this).data('itemid');
    ipcRenderer.send('view-item',{itemid});
})

// Deleting items : 
$(document).on('click','#delete',function(){
   let itemid = $(this).data('itemid');
   $('#delete-modal input[name=itemid]').val(itemid);
   $('#delete-modal').modal('show')
})
$(document).on('click','#submit-delete',function(){
    let itemid = $('#delete-modal input[name=itemid]').val();
    ipcRenderer.send('delete-item',{itemid})
    $('#delete-modal').modal('hide')
});

// Backup restore
ipcRenderer.on('db-not-empty',(event,arg) => {
    $('#restore-modal').modal('show')
})

$(document).on('click','#restore-save',function(){
    ipcRenderer.send('save-then-restore')
    $('#restore-modal').modal('hide')
})

$(document).on('click','#restore-erase',function(){
    ipcRenderer.send('restore-backup')
    $('#restore-modal').modal('hide')
})
//Loading items : 
document.addEventListener('DOMContentLoaded',function(){
    ipcRenderer.send('main-window-loaded');
 
    ipcRenderer.on('items-list',(event,arg) =>{
        if(arg.length > 0){
            $('#no-items').hide();
            $('#table-row').show();
            $('#boilers-container').empty();
            arg.forEach((item) => {
                $('#boilers-container').append(
                   `<tr title="Created at ${item.created_at}">
                    <td class="itemColumn" itemid="${item.itemid}">${item.title}</td>
                    <td><button class="btn btn-outline-dark btn-sm" id="read" data-itemid="${item.itemid}"><i class="fas fa-book-open    "></i></button> </td>
                    <td>
                    <div class="dropdown">
                        <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                           <i class="fas fa-cog    "></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" data-itemid="${item.itemid}" id="view"><i class="fas fa-pen-square    "></i> Edit</a>
                         
                            <a class="dropdown-item" href="#"  data-itemid="${item.itemid}" id="delete"><i class="fas fa-trash-alt    "></i> Delele</a>
                        </div>
                    </div>
                    </td>
                </tr>`
                )
            })
        }else{
            $('#no-items').show();
            $('#table-row').hide();
        }
      
        
    });
});





