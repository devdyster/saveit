const { app, BrowserWindow , Menu , shell, ipcMain ,dialog} = require('electron')

const fs = require('fs');
// Gardez une reference globale de l'objet window, si vous ne le faites pas, la fenetre sera
// fermee automatiquement quand l'objet JavaScript sera garbage collected.
let win
let addWin
let viewWin
let readWin

var currentItem= [];
function createWindow () {
  // Créer le browser window.
  win = new BrowserWindow({ show:false, closable: false,width: 1024, height: 700, minWidth : 800, minHeight : 600,maxWidth : 1280, maxHeight : 900})

  // et charge le index.html de l'application.
  win.loadFile('src/index.html')
  win.webContents.openDevTools();
  // Émit lorsque la fenêtre est fermée.
  win.on('closed', () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    win = null
  })
  win.setMenu(null);
  win.once('ready-to-show', () => {
    win.show();
  })
}
function addWindow(){
  addWin = new BrowserWindow({ show:false,parent : win,frame:false,modal : true,width: 800, height: 550, minWidth : 800, minHeight : 550,maxWidth : 800, maxHeight : 550})
  addWin.loadFile('src/add.html')
  addWin.webContents.openDevTools();
  addWin.on('closed', () => {
    addWin = null
  })
  addWin.setMenu(null);
  addWin.once('ready-to-show', () => {
    addWin.show();
  })
}

function viewWindow(){
 viewWin = new BrowserWindow({show:false, parent : win,modal:true,closable:false,width: 800, height: 550, minWidth : 800, minHeight : 550,maxWidth : 800, maxHeight : 550})
 viewWin.loadFile('src/view.html')
 viewWin.webContents.openDevTools();
 viewWin.on('closed', () => {
   viewWin = null
  })
 viewWin.setMenu(null);
 viewWin.once('ready-to-show', () => {
  viewWin.show();
})
}

function readWindow(){
 readWin = new BrowserWindow({show:false, parent : win,width: 1024, height: 550, minWidth : 800, minHeight : 550,maxWidth : 1280, maxHeight : 550})
 readWin.loadFile('src/read.html')
 readWin.webContents.openDevTools();
 readWin.on('closed', () => {
   readWin = null
   })
 readWin.setMenu(null);
 readWin.once('ready-to-show', () => {
  readWin.show();
 })
 }

 function restore(){
  let res = dialog.showOpenDialog(win,{title : 'Choose your backup file to restore',filters : [{name : 'sqlite file',extensions : ['sqlite']}]})
  if(res){
    let filepath = res[0];
    fs.copyFile(filepath,'./db.sqlite', (err) => {
      if(err) throw err;
    })
    let query = knex.select('itemid','title','body','created_at').from('boilers')
    query.then(function(rows){
      win.webContents.send('items-list',rows);
    })
  }
  return res;
 
 }

 function save(){
  let savePath = dialog.showSaveDialog(win,{title : 'Choose where to save the backup',defaultPath :'backup',filters : [{name : 'sqlite file',extensions : ['sqlite']}]})
  if(savePath){
    fs.copyFile('./db.sqlite',savePath, (err) => {
      if(err) throw err;
    })
  }
  return savePath;
 }
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./db.sqlite"
  }
});

ipcMain.on('exit-the-app', (event,arg) =>{
    // win.closable = true;
   win.setClosable(true);
    app.quit();
})

ipcMain.on('github-repo',(event,arg) =>{
 shell.openExternal('https://github.com/devdyster/saveit');
});

ipcMain.on('open-add-window',(event,arg) => {
 addWindow();
});

ipcMain.on('close-add-window',(event,arg) =>{
 addWin.close();
});

ipcMain.on('close-view-item',(event,arg) => {
  viewWin.setClosable(true);
  viewWin.close();
})

ipcMain.on('new-content',function(event,arg){
    let res = knex('boilers').insert(arg);
    res.then(function(row){
      event.sender.send('item-saved');
    })
})

ipcMain.on('save-item',(event,arg) => {
 let res =  knex('boilers').where('itemid',arg.itemid).update({
    body: arg.body
  })
  res.then(function(row){
    if(arg.close){
      viewWin.setClosable(true)
      viewWin.close()
    }
  })
})

// Backuping data : 
ipcMain.on('create-backup-dialog',(event,arg) => {
  save()
})

//Backuping then restoring data
ipcMain.on('save-then-restore',(event,arg) => {
  if(save())
  restore()
})
 //Checking if db is empty before restoring 
ipcMain.on('check-if-empty',(event,arg) => {
   let res = knex('boilers').count('itemid')
   res.then(function(count){
     let num = parseInt(Object.values(count[0])[0]);
     if(num > 0){
       event.sender.send('db-not-empty')

     }else{
      restore()
     }
   })
})

ipcMain.on('restore-backup',(event,arg) => {
  restore()
})

// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émit.
app.on('ready', () =>{
  createWindow()

  //Sending items list to mainWindow
  ipcMain.on('main-window-loaded',(event,arg) =>{
    let res = knex.select('itemid','title','body','created_at').from('boilers')
    res.then(function(rows){
      event.sender.send('items-list',rows);
    })
  })

  // Sending items list to mainWindow  after an addition
  ipcMain.on('added-new-item',(event,arg) =>{
    let res = knex.select('itemid','title','body','created_at').from('boilers')
    res.then(function(rows){
     win.webContents.send('items-list',rows);
    })
  })

  //viewing item : 
  ipcMain.on('view-item',(event,arg) =>{
     viewWindow();
     let res = knex('boilers').where('itemid',arg.itemid)
     res.then(function(rows){
      currentItem = [...rows];
     })
  })
  ipcMain.on('view-loaded',(event,arg) =>{
     viewWin.webContents.send('item-to-view',currentItem)
     currenItem = [];
  })

  //reading an item : 
  ipcMain.on('read-item',(event,arg) => {
    readWindow();
    let res  = knex('boilers').where('itemid',arg.itemid)
    res.then(function(rows){
       currentItem =[...rows]
    })
  })
  ipcMain.on('read-loaded',(event,arg) => {
     readWin.webContents.send('item-to-read',currentItem)
     currentItem = [];
  })


  //deleting an item
  ipcMain.on('delete-item',(event,arg) =>{
    let res = knex('boilers').where('itemid',arg.itemid).del()

    res.then(function(row){
      let res = knex.select('itemid','title','body','created_at').from('boilers')
      res.then(function(rows){
        event.sender.send('items-list',rows);
      })
    })

  })

  //searching item : 
  ipcMain.on('search-item',(event,arg) => {
      let res = knex('boilers').where('title','like',`${arg.txt}%`)
      res.then(function(rows){
        win.webContents.send('items-list',rows)
      })
  })
})

// Quitte l'application quand toutes les fenêtres sont fermées.
app.on('window-all-closed', () => {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
  if (win === null) {
    createWindow()
  }
})
