require('bootstrap');
var $ = require('jquery')
const {ipcRenderer} = require('electron')


// Menu button declaration : 
var exitBtn = document.getElementById('exit-btn');
var githubBtn = document.getElementById('github-btn');
var addBtn = document.getElementById('add');
var createBackupBtn = document.getElementById('create-backup')





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

//Viewing an item : 
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


//Loading items : 
document.addEventListener('DOMContentLoaded',function(){
    ipcRenderer.send('main-window-loaded','main-loaded');
 
    ipcRenderer.on('items-list',(event,arg) =>{
        if(arg.length > 0){
            $('#no-items').hide();
            $('#table-row').show();
            $('#boilers-container').empty();
            arg.forEach((item) => {
                $('#boilers-container').append(
                   `<tr>
                    <td>${item.title}</td>
                    <td>${item.created_at}</td>
                    <td>
                    <div class="dropdown">
                        <button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                           <i class="fas fa-cog    "></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" data-itemid="${item.itemid}" id="view"><i class="fas fa-book-open"></i> Open</a>
                         
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





