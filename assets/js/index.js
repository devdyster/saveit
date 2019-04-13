require('bootstrap');
var $ = require('jquery')
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

$(document).on('click','#delete',function(){
   let itemid = $(this).data('itemid');
   $('#delete-modal input[name=itemid]').val(itemid);
   $('#delete-modal').modal('show')
})
$(document).on('click','#submit-delete',function(){
    let boilerid = $('#delete-modal input[name=itemid]').val();
    ipcRenderer.send('delete-item',{boilerid})
    $('#delete-modal').modal('hide')
})

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
                            <a class="dropdown-item" href="#" data-itemid="${item.boilerid}" id="open"><i class="fas fa-book-open"></i> Open</a>
                            <a class="dropdown-item" href="#"  data-itemid="${item.boilerid}" id="edit"><i class="fas fa-pen-square    "></i> Edit</a>
                            <a class="dropdown-item" href="#"  data-itemid="${item.boilerid}" id="delete"><i class="fas fa-trash-alt    "></i> Delele</a>
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
      
        
    })
})





