const { app, BrowserWindow , Menu , shell, ipcMain} = require('electron')


// Gardez une reference globale de l'objet window, si vous ne le faites pas, la fenetre sera
// fermee automatiquement quand l'objet JavaScript sera garbage collected.
let win
let addWin
function createWindow () {
  // Créer le browser window.
  win = new BrowserWindow({ closable: false,width: 1024, height: 700, minWidth : 800, minHeight : 600,maxWidth : 1280, maxHeight : 900})

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
}
function addWindow(){
  addWin = new BrowserWindow({ parent : win,frame:false,modal : true,width: 800, height: 550, minWidth : 800, minHeight : 550,maxWidth : 800, maxHeight : 550})
  addWin.loadFile('src/add.html')
  addWin.webContents.openDevTools();
  addWin.on('closed', () => {
    addWin = null
  })
  addWin.setMenu(null);
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

ipcMain.on('new-content',function(event,arg){
    let res = knex('boilers').insert(arg);
    res.then(function(row){
      event.sender.send('item-saved', 'saved');
    })
})


// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émit.
app.on('ready', () =>{
  createWindow()

  //Sending items list to mainWindow
  ipcMain.on('main-window-loaded',(event,arg) =>{
    console.log(arg)
    let res = knex.select('boilerid','title','body','created_at').from('boilers')
    res.then(function(rows){
      event.sender.send('items-list',rows);
    })
  })

  // Sending items list to mainWindow  after an addition
  ipcMain.on('added-new-item',(event,arg) =>{
    let res = knex.select('boilerid','title','body','created_at').from('boilers')
    res.then(function(rows){
     win.webContents.send('items-list',rows);
    })
  })


  //deleting an item
  ipcMain.on('delete-item',(event,arg) =>{
    let res = knex('boilers').where('boilerid',arg.boilerid).del()

    res.then(function(row){
      let res = knex.select('boilerid','title','body','created_at').from('boilers')
      res.then(function(rows){
        event.sender.send('items-list',rows);
      })
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
