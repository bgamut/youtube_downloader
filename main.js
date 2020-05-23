const { app, BrowserWindow,Tray,dialog } = require('electron')

const path = require('path')
const fs=require('fs')
const isDev=false
// Disable error dialogs by overriding
dialog.showErrorBox = function(title, content) {
    console.log(`${title}\n${content}`);
};

function createWindow () {
  var portfinder = require('portfinder')
  
  
  // Create the browser window.
  let win = new BrowserWindow({
    //width: 1024,
    minWidth:150,
    width: 300,
    minHeight: 150,
    height:150,
    webPreferences: {
      nodeIntegration: true
    },
    maximizable:true,
    resizable:true,
    //resizable:false,
    // frame:false,
    //transparent:true,
    title:'Utility',
    appIcon:__dirname + '/squwbs.icns',
    
  })
  function findPort(){
    portfinder.getPort(function(err,port){
        console.log(path.join(__dirname,'./src/assets/sharedInfo.json'))
        // path.join(__dirname,'./src/assets/sharedInfo.json')
        console.log("express server started in localhost:"+port)

        // var originalJson=JSON.parse(fs.readFileSync("./src/assets/sharedInfo.json"))
        var originalJson=JSON.parse(fs.readFileSync(path.join(__dirname,'./src/assets/sharedInfo.json')))
        originalJson.portnumber=port
        console.log(originalJson)
        // fs.writeFile("./src/sharedInfo.json",JSON.stringify(originalJson),function(){
        //   require("./src/expressServer/server").expressServer(port)
        //   win.loadURL("http://localhost:"+port)
        // })
        fs.writeFile(path.join(__dirname,'./src/assets/sharedInfo.json'),JSON.stringify(originalJson),function(){
          require(path.join(__dirname,"./src/expressServer/server")).expressServer(port)
          win.loadURL("http://localhost:"+port)
        })
    })  
}
findPort()
var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"/src/sharedInfo.json")))

    sharedInfo.console='DOWNLOAD'
    sharedInfo.error=false
    sharedInfo.percentage=100
    fs.writeFile(path.join(__dirname,"/src/sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
      console.log('check src/sharedInfo.json')
    })
  // win.loadURL(
  //   isDev 
  //   ? "http://localhost:3000" 
  //   : `file://${path.join(__dirname,"/build/index.html")}`
  // )
  // isDev
  // ? win.loadURL("http://localhost:3000")
  // : win.loadFile("dist/index.html")
  
  
  // win.loadURL("http://localhost:3000")
  // win.loadURL("http://localhost:"+port)
  // and load the index.html of the app.
  //win.loadFile('app/dist/index.html')
  const tray = new Tray(__dirname+'/src/assets/tray_icon.png')
  //const tray = new Tray()
  tray.on('click',()=>{
    if(win.isVisible() == false){
      win.show()
    }
    else{
      win.hide()
    }
  })
  win.on('show',()=>{
  //  tray.setHighlightMode('never')
  })
  win.on('hide',()=>{
    // tray.setHighlightMode('never')
    
  })
  win.on('will-quit',()=>{
    
  })
  win.on('quit',()=>{
    tray.webContents.clearHistory()
  })
}
app.on('ready', createWindow)