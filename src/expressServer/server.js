  var express = require('express');
  const cors = require('cors')
  var fs = require('fs')
  require('module-alias/register')
  const path = require('path');
  var cookieParser = require('cookie-parser')
  var flash = require('connect-flash')
  var net = require('net')
  require('dotenv').config()
  // var fs=require('fs')
  var wav = require('node-wav');
  var isWav=require('is-wav')
  var child_process=require('child_process')
 
  // var PNGImage = require('pngjs-image')
  var extensions=[    
    'wav',
    'caf',
    'mp3',
    'flac'
  ]
  var endGameNum=1000
  processingList=[]
  doProcess=true
  linearProcessingStarted=false
  function move(oldPath, newPath, callback) {
  //fs.rename(oldPath, newPath, function (err) {
  fs.copyFile(oldPath, newPath, function (err) {
      if (err) {
          if (err.code === 'EXDEV') {
              copy();
          } else {
              callback(err);
          }
          return;
      }
      callback();
  });
  function copy() {
      var readStream = fs.createReadStream(oldPath);
      var writeStream = fs.createWriteStream(newPath);
      readStream.on('error', callback);
      writeStream.on('error', callback);
      readStream.on('close', function () {
          //fs.unlink(oldPath, callback);
          //console.log('copied')
      });
      readStream.pipe(writeStream);
  }
  }
  
  console.log(require('path').join(require('os').homedir(), 'Desktop'))
  var server = net.createServer(function(socket){
    socket.write('Echo server\r\n')
    socket.pipe(socket)
  })
  // server.listen(1337)
  
  module.exports.expressServer = function (portnumber){
  if (process.env.DYNO) {
    trustProxy = true;
  }
  var app = express();
  app.set('views', __dirname + '/views');
  app.set('view engine','ejs')
  app.use((err, req, res, next) => {
    res.locals.session = req.session
    if (err instanceof SignatureValidationFailed) {
      res.status(401).send(err.signature)
      return
    } else if (err instanceof JSONParseError) {
      res.status(400).send(err.raw)
      return
    }
    next(err) // will throw default 500
  })
  app.use(cookieParser('keyboard cat'))
  app.use(require('body-parser').urlencoded({ extended: true }));
  app.use(require('body-parser').json());
  app.use(flash())
  app.use(express.static(path.join(__dirname, '/../../build')));
  app.use(express.static(path.join(__dirname, '/html/*/*')));
  let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header('Access-Control-Allow-Headers', "*");
    next();
  }
  app.use(allowCrossDomain);
  app.get('/',cors(), function (req, res) {
      res.render(path.join(__dirname, 'build','index.html'));
  })
  app.get('/handshake',cors(),function(req,res){
    var obj={message:'hand shook',number:req.query.number}
    console.log(JSON.stringify(obj))
    //var child=child_process.execSync('node ./tests/image_iteration.js')
    //console.log(child)
    res.send(obj)
  })
  app.get('/reset-port-number',cors(),function(req,res){
    //console.log(path.join(__dirname,"../sharedInfo.json"))
    var json=JSON.parse(fs.readFileSync(path.join(__dirname,"../assets/sharedInfo.json")))
    json.portnumber=null
    fs.writeFile(path.join(__dirname,"../assets/sharedInfo.json"),JSON.stringify(json),function(){
      console.log('port number reset')
    })
    res.send({message:'port number reset'})
  })
  app.get('/file-path-list',cors(),function(req,res){
    var fileList=[]
    filesListLength=Object.keys(req.query.files).length
    // for (var i =0; i<filesListLength; i++){
    //   if(path.extname(req.query.files[i])=='.wav'){
    //     console.log(isWav(fs.readFileSync(req.query.files[i]))+req.query.files[i])
    //     // console.log(req.query.files[i])
    //     fileList.push(req.query.files[i])
    //   } 
    // }
    for (var i =0; i<filesListLength; i++){
      if(path.extname(req.query.files[i])=='.png'){
        //console.log(isWav(fs.readFileSync(req.query.files[i]))+req.query.files[i])
        // console.log(req.query.files[i])
        fileList.push({path:req.query.files[i],class:path.basename(path.resolve(req.query.files[i],'..'))})
      } 
    }
    var json={data:fileList}
    fs.writeFile(path.join(__dirname,"../assets/fileList.json"),JSON.stringify(json),function(){
      console.log('fileList written')
    })
    console.log(fileList)
    res.send({data:fileList})
  })
  app.get('/sharedinfo',cors(),function(req,res){
    var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
    res.send(sharedInfo)
  })
  app.post('/create-json',cors(),function(req,res){
    //var files=req.param('files')
    // res.header("Access-Control-Allow-Origin", "*");
    
    console.log(req.body)
    //var response=[]
  
    fs.writeFile(path.join(__dirname,"../assets/sampleDataLabels.json"),JSON.stringify(req.body,null,4),function(){
      console.log('sampleDataLabels.json written at assets/sampleDataLabels.json')
    })
    res.send({message:'sampleDataLabels.json written at assets/sampleDataLabels.json'})
  
      
    // res.send(newJson)
  })
  // app.post('/all-files',cors(),function(req,res){
  //   //var files=req.param('files')
  //   var files=req.body.data
  //   console.log(files)
  //   var response=[]
  //   function writePNG(file){
  //     //console.log(file)
  //     var extIndex=file.split('.').length-1
  //     var fileName = path.basename(file)
  //     // if(file.split('.')[extIndex]=='wav'){
  //     if(extensions.includes(file.split('.')[extIndex])){
  //         var buffer = fs.readFileSync(file)
  //         var result = wav.decode(buffer);
  //         var originalLength=result.channelData[0].length;
  //         var sampleRate=result.sampleRate
  //         var newArray=[]
  //         var frontSilenceTrim=false
  //         var endSilenceTrim=false
  //         var start=process.hrtime();
  //         for (var i=0; i<originalLength; i++){
  //             if (Math.abs(result.channelData[0][i])>0.0025){
  //                 frontSilenceTrim=true
  //             }
  //             if(frontSilenceTrim==true){
  //                 newArray.push(result.channelData[0][i])
  //             }
  //         }
  //         originalLength=newArray.length
  //         for (var i=originalLength-1; i>=0; i-=1){
  //             if(endSilenceTrim==false){
  //                 if (Math.abs(result.channelData[0][i])<0.0025){
  //                     newArray.splice(-1,1)
  //                 }
  //                 else{
  //                     endSilenceTrim=true
  //                     originalLength=i+1
  //                 }
  //             }
  //         }
  //         var width=2048
  //         var bins=2048
  //         var height=bins/2
  //         var arbitraryLength=width*height
  //         var stride = (originalLength-bins)/width
  //         var spectrogram=[]
  //         for (var i =0; i<width; i++){
  //             var tempArray=[]
  //             for(var j=0; j<bins; j++){
  //                 tempArray[j]=(newArray[Math.floor(i*stride)+j])
  //             }
  //             const float32arrayLeft = new Float32Array(tempArray);
  //             var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
  //             spectrogram.push(fft(int32arrayLeft.buffer,sampleRate));
  //         }
  //         // var end = process.hrtime(start)
  //         var image=PNGImage.createImage(width,height);
  //         image.fillRect(0,0,width,height,{red:255,green:255,blue:255,alpha:255})
  //         for (var j=0; j<height; j++){
  //             for(var i=0; i<width; i++){
  //                 var gray=Math.floor(255*spectrogram[i][j])
  //                 image.setAt(i,height-j,{red:gray,green:gray,blue:gray,alpha:255})
  //             }
  //         }
  //         // var createdImagePath=path.join('../assets',fileName+'.png')
  //         var createdImagePath=path.join(__dirname,'../assets/images/'+fileName+'.png')
  //         image.writeImage(createdImagePath, function (error) {
  //           //console.log('server Image creation : '+error)
  //           function check(filePath,i,endIndex,timeout){
  //             PNGImage.readImage(filePath, function (err, image) {
  //               if(typeof(err)==='undefined'){
  //                 // return(true)
  //                 var obj={file:filePath,message:'success'}
  //                 console.log(obj)
  //                 response.push(obj)
  //                 //res.send({data:obj})
  //               }
  //               else{
  //                 if(i<endIndex){
  //                   setTimeout(function(){check(filePath,i+1,endIndex,timeout)},timeout)
  //                 }
  //                 else{
  //                   //return false;
  //                   var obj={file:filePath,message:'questionable'}
  //                   console.log(obj)
  //                   //res.send({data:obj})
  //                   response.push(obj)
  //                 }
  //               }
  //             });
  //           }
  //           check(createdImagePath,0,10,800)
  //         })
  //       }
  //   }
  //   for (var i=0; i<files.length; i++){
  //     writePNG(files[i])
  //   }
  //   res.send({data:response})
  // })
  app.get('/model-json', (req, res) => {
  
    // fs.readFile('./data/db.json', (err, json) => {
    var obj = JSON.parse(fs.readFileSync(path.join(__dirname,"../assets/model.json")))
    //let obj = JSON.parse(json);
    res.json(obj);
   
  
  });
  // app.get('/clean-empty',cors(),function(req,res){
  //   const isDirectory = filePath => fs.statSync(filePath).isDirectory();
  //   const getDirectories = filePath =>
  //       fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isDirectory);
  
  //   const isFile = filePath => fs.statSync(filePath).isFile();  
  //   const getFiles = filePath =>
  //       fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isFile);
  
  //   const getFilesRecursively = (filePath) => {
  //       let dirs = getDirectories(filePath);
  //       let files = dirs
  //           .map(dir => getFilesRecursively(dir)) // go through each directory
  //           .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
  //       return files.concat(getFiles(filePath));
  //   };
  //   const isDir = filePath => fs.statSync(filePath).isDirectory(); 
  //   const getDirs = filePath =>
  //       fs.readdirSync(filePath).map(name => path.join(filePath, name)).filter(isDir);
  
  //   const getDirsRecursively = (filePath) => {
  //       let dirs = getDirs(filePath);
        
  //       let subDirs = dirs
  //           .map(dir => getDirsRecursively(dir)) // go through each directory
  //           .reduce((a,b) => a.concat(b), []);    // map returns a 2d array (array of file arrays) so flatten
  //       return subDirs.concat(getDirs(filePath));
  //   };
  //   const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  //   var fullPathDirectory=path.join(desktopPath,'mastered_files')
  //   var allSubDirectories=getDirsRecursively(fullPathDirectory)
  //   function cleanIt(){
  //     const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  //     var fullPathDirectory=path.join(desktopPath,'mastered_files')
  //     var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
  //     var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
  //     var filesToMovefromTemp=fs.readdirSync(tempAudioDir)
  //     var wavDirectory=path.join(fullPathDirectory,'wav')
  //     var filesToMovefromWav=fs.readdirSync(wavDirectory)
      
  //     filesToMovefromTemp.forEach((file,index)=>{ 
  //       function filemovecb(){
  //         console.log(file+' moved')
  //       }
  //       //move(path.join(tempAudioDir,file),path.join(errorPathDirectory,file),filemovecb)
  //       //var newFileName=file.split('.').slice()[0]+'.wav'
  //       var newFileName=file
  //       var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
  //       var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
  //       var filesToMovefromTemp=fs.readdirSync(tempAudioDir)
  //       var wavDirectory=path.join(fullPathDirectory,'wav')
  //       function backupWarmWav(wavPath, newFilePath){
  //         const warmer = require('../binary_build/spline/build/Release/addon');
  //         try{
  //           wavtPath=wavPath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
  //           var buffer = fs.readFileSync(wavPath);
  //           const wavefile = require('wavefile')
  //           var wavData = new wavefile.WaveFile(buffer)
  //           wavData.toSampleRate(44100)
  //           var samples = wavData.getSamples(false,Int32Array)
  //           var squwbsResult =squwbs(samples[0],samples[1],44100);
  //           const float32arrayLeft=new Float32Array(squwbsResult.left);
  //           const float32arrayRight=new Float32Array(squwbsResult.right);
  //           var int32arrayLeft = new Int32Array(float32arrayLeft.buffer);
  //           var int32arrayRight = new Int32Array(float32arrayRight.buffer);
  //           var arrayLeft = warmer.AcceptArrayBuffer(int32arrayLeft.buffer,44100);
  //           var arrayRight = warmer.AcceptArrayBuffer(int32arrayRight.buffer,44100);
  //           var finalFloat32arrayLeft=new Float32Array(arrayLeft)
  //           var finalFloat32arrayRight=new Float32Array(arrayRight)
  //           var combinedChannel=[finalFloat32arrayLeft,finalFloat32arrayRight]
  //           var newWav=wav.encode(combinedChannel,{sampleRate:44100,float:true,})
  //           function callbackTwo(){
  //             try{
  //               var newFileName=fileName.split('.').slice()[0]+'.wav'
  //               fs.unlink(path.join(tempAudioDir,newFileName),function(){
  //                 try{
  //                   fs.unlinkSync(path.join(wavDirectory,newFileName))
  //                   // linearProcessing()
  //                 }
  //                 catch(err){
  //                   console.log(err)
  //                   doProcess=true
  //                   // linearProcessing()
  //                 }
  //               })
  //             }
  //             catch(err){
  //               doProcess=true
  //               console.log(err)
  //               // linearProcessing()
  //             }
  //           }
  //           fs.writeFile(newFilePath,newWav,function(){
  //             //changeSoundExt(newFilePath,fullPathDirectory,'mp3',callbackTwo)
  //             function changeSoundExt(filePath,targetDir,desiredExt,cb){
  //               var fileName=path.basename(filePath)
  //               var fileNameOnly=fileName.split('.')[0]
  //               var newFileName=fileNameOnly+'.'+desiredExt
      
  //               var newOutputFilePath=path.join(targetDir,newFileName)
  //               console.log(newOutputFilePath)
  //               //var baseCommand=path.join(__dirname,'../binary_build/ffmpeg_convert/dist/convert')
  //               //var command=baseCommand+' inputFilePath="'+filePath+'" outputFilePath="'+newOutputFilePath+'" errorDir="'+errorPathDirectory+'"'
  //               var baseCommand=path.join(__dirname,'../bin/ffmpeg')
  //               // var command=baseCommand+' -i '+filePath+' -y -hide_banner '+newOutputFilePath
  //               // var terminalFilePath=filePath.replace(/(\s+)/g, '\\$1');
  //               // var terminalNewOutputFilePath=newOutputFilePath.replace(/(\s+)/g, '\\$1');
  //               var terminalFilePath=filePath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
  //               var terminalNewOutputFilePath=newOutputFilePath.replace(/[!?$%$#&(\')\`*(\s+)]/g,m=>'\\'+m)
  //               var terminalNewOutputFilePath=terminalNewOutputFilePath.replace(/(&)/g, '\\$1');
  //               if(desiredExt=='wav'){  
  //                 var command=baseCommand+' -i '+terminalFilePath+' -y -hide_banner -ab 16 '+terminalNewOutputFilePath
  //               }
  //               else{
  //                 var command=baseCommand+' -i '+terminalFilePath+' -y -hide_banner '+terminalNewOutputFilePath
  //               }
                
  //               child_process.exec(command,function(err,stdout,stderr){
  //                 console.log(stdout)
  //                 if(err!==null){  
  //                   function child_process_message(){
  //                     console.log(err)
  //                   }
  //                   move(filePath,path.join(errorPathDirectory,fileName),child_process_message)
  //                 }
  //                 if(typeof(cb)!=='undefined'){
  //                   try{
  //                     cb()
  //                   }
  //                   catch(err){
  //                     console.log(err)
  //                     doProcess=true
  //                     //linearProcessing()
  //                   }
  //                 }
  //               }) 
  //             }
  //             const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  //             var fullPathDirectory=path.join(desktopPath,'mastered_files')
  //             var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
  //             var wavDirectory=path.join(fullPathDirectory,'wav')
  //             var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
  //             var nextFullPathDirectory=path.join(fullPathDirectory,'mastered_fixed')
  //             var miscDirectory=path.join(fullPathDirectory,'Misc')
  //             var drumsDirectory=path.join(fullPathDirectory,'Drum')
  //             var loopsDirectory=path.join(fullPathDirectory,'Loops')
  //             var inDrumsDir=['Clap','Cymbal','Open Hat','Closed Hat','Kick','Percussion','Shaker','Snare','Tom']
  //             var inOtherDir=['Loops','Chords','One Shots','Vocals']
  //             var inOtherDirSingular=['Loop','Chord','One Shot','Vocal']
  //             var oneshotsDirectory=path.join(fullPathDirectory,'One Shots')
  //             var chordsDirectory=path.join(fullPathDirectory,'Chords')
  //             var vocalsDirectory=path.join(fullPathDirectory,'Vocals')
  //             var classification=predict(file).classification
  //             function getFinalPathDir(classification){
  //               const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  //               var fullPathDirectory=path.join(desktopPath,'mastered_files')
  //               var finalFullPathDirectory= path.join(fullPathDirectory,'Misc')
  //               inDrumsDir.forEach((subDirName)=>{
  //                 if(classification==subDirName.toLowerCase()){
  //                   finalFullPathDirectory=path.join(drumsDirectory,subDirName)
  //                 }
  //               })
  //               inOtherDirSingular.forEach((classCheck,index)=>{
  //                 if(classification==classCheck.toLowerCase()){
  //                   finalFullPathDirectory=path.join(fullPathDirectory,inOtherDir[index])
  //                 }
  //               })
                
  
  //               return finalFullPathDirectory
  //             }
  //             var classification=predict(newFilePath).classification
  //             var finalFullPathDirectory=getFinalPathDir(classification)
  //             changeSoundExt(newFilePath,finalFullPathDirectory,'mp3',callbackTwo)
  //           })
  //         }
  //         catch(err){
  //           var originalPath=wavPath
  //           var erroredFileName=path.basename(wavPath)
  //           var errorPath=path.join(errorPathDirectory,erroredFileName)
  //           var errorCallback= function(){
  //             console.log('file error : moving to '+errorPath)
  //           }
  //           move(originalPath, errorPath, errorCallback)
  //           console.log(err)
  //           doProcess=true
  //           // linearProcessing()
  //         }
          
  //       }
        
  //       //backupWarmWav(path.join(tempAudioDir,newFileName),path.join(wavDirectory,newFileName))
  //       function filemovecb(){
  //         console.log(file+' moved to errorPathDirectory')
  //         fs.unlinkSync(path.join(tempAudioDir,file))
  //       }
  //       move(path.join(tempAudioDir,newFileName),path.join(errorPathDirectory,newFileName),filemovecb)
        
  //     })
  //     filesToMovefromWav.forEach((file,index)=>{
        
  //       const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  //       var fullPathDirectory=path.join(desktopPath,'mastered_files')
  //       var tempAudioDir=path.join(fullPathDirectory,'temp_audio')
  //       var wavDirectory=path.join(fullPathDirectory,'wav')
  //       var errorPathDirectory=path.join(fullPathDirectory,'errored_files')
  //       var nextFullPathDirectory=path.join(fullPathDirectory,'mastered_fixed')
  //       var miscDirectory=path.join(fullPathDirectory,'Misc')
  //       var drumsDirectory=path.join(fullPathDirectory,'Drum')
  //       var loopsDirectory=path.join(fullPathDirectory,'Loops')
  //       var inDrumsDir=['Clap','Cymbal','Open Hat','Closed Hat','Kick','Percussion','Shaker','Snare','Tom']
  //       var inOtherDir=['Loops','Chords','One Shots','Vocals']
  //       var inOtherDirSingular=['Loop','Chord','One Shot','Vocal']
  //       var oneshotsDirectory=path.join(fullPathDirectory,'One Shots')
  //       var chordsDirectory=path.join(fullPathDirectory,'Chords')
  //       var vocalsDirectory=path.join(fullPathDirectory,'Vocals')
  //       var classification=predict(file).classification
  //       function getFinalPathDir(classification){
  //         const desktopPath = require('path').join(require('os').homedir(), 'Desktop')
  //         var fullPathDirectory=path.join(desktopPath,'mastered_files')
  //         var finalFullPathDirectory= path.join(fullPathDirectory,'Misc')
  //         inDrumsDir.forEach((subDirName)=>{
  //           if(classification==subDirName.toLowerCase()){
  //             finalFullPathDirectory=path.join(drumsDirectory,subDirName)
  //           }
  //         })
  //         inOtherDirSingular.forEach((classCheck,index)=>{
  //           if(classification==classCheck.toLowerCase()){
  //             finalFullPathDirectory=path.join(fullPathDirectory,inOtherDir[index])
  //           }
  //         })
          
  
  //         return finalFullPathDirectory
  //       }
  //       var classification=predict(file).classification
  //       var finalFullPathDirectory=getFinalPathDir(classification)
  //       function filemovecb(){
  //         console.log(file+' moved to '+classification)
  //         fs.unlinkSync(path.join(wavDirectory,file))
  //       }
  //       move(path.join(wavDirectory,file),path.join(finalFullPathDirectory,file),filemovecb)
        
  //     })
  //     //var filesToMovefromError=fs.readdirSync(errorPathDirectory)
  //     // filesToMovefromError.forEach((file,index)=>{
  //     //   function filemovecb(){
  //     //     console.log(file+' moved')
  //     //   }
  //     //   move(path.join(tempAudioDir,file),path.join(errorPathDirectory,file),filemovecb)
  //     // })
  //     allSubDirectories.forEach((dir,index)=>{
  //       fs.readdir(dir,(err,files)=>{
  //         if(files.length==0){
  //           fs.rmdirSync(dir)
  //         }
  //       })
  //     })
  //   }
  //   setTimeout(function(){
  //     console.log('cleanIt function executed.')
  //     cleanIt()
  //   },8000)
    
  // })
  app.get('/clean-slate',cors(),function(req,res){
    var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
    sharedInfo.data=[]
    sharedInfo.console='download'
    sharedInfo.error=false
    sharedInfo.percentage=100
    fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
      console.log(i+1+'/'+list.length+' '+file_name)
      res.send({data:'cleaned the slate!'})
    })
  })
  app.get('/one-file',cors(),function(req,res){
    var fs= require('fs')
    var path = require('path')
    var youtubedl = require('youtube-dl')
    var {spawnSync} = require('child_process')  
    let UUID = require("uuidjs")
    var PlaylistSummary = require('youtube-playlist-summary')
    var qs = require('querystring')
    var downloadsFolder = require('downloads-folder')

    var fullList=[]
    var fullObjList=[]
    function trim_silence(list,i){
        var commandOptions=['-i', 'temp.mp3','-af','silenceremove=1:0:-50dB', 'output.mp3']
        temp_file=list[i].uuid
        //temp_file_path=path.relative(__dirname, path.join(downloadsFolder(),temp_file))
        temp_file_path=path.join(downloadsFolder(),temp_file)
        // commandOptions[1]=temp_file
        commandOptions[1]=temp_file_path
        file_name=list[i].title+'.mp3'
        //file_name_path=path.relative(__dirname, path.join(downloadsFolder(),file_name))
        file_name_path=path.join(downloadsFolder(),file_name)
        //commandOptions[4]=file_name
        commandOptions[4]=file_name_path
        spawnSync('ffmpeg',commandOptions)
        //fs.unlinkSync(temp_file)
        fs.unlinkSync(temp_file_path)
        var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
        sharedInfo.console=i+1+'/'+list.length+' '+file_name
        fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
          console.log(i+1+'/'+list.length+' '+file_name)
        })
        if(i<list.length-1){
            trim_silence(list,i+1)
        }
        else{
          var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
          sharedInfo.finished=true
          fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
            console.log('finished')
          })
        }
    }
    function trim_silence_one(list,i){
      var commandOptions=['-i', 'temp.mp3','-af','silenceremove=1:0:-50dB', 'output.mp3']
      temp_file=list[i].uuid
      //temp_file=list[i].title
      temp_file_path=path.join(downloadsFolder(),temp_file)
      commandOptions[1]=temp_file_path
      file_name=list[i].title+'.mp3'
      //temp_file+'.mp3'
      file_name_path=path.join(downloadsFolder(),file_name)
      commandOptions[4]=file_name_path
      spawnSync('ffmpeg',commandOptions)
      // setTimeout(function(){
        fs.unlinkSync(temp_file_path)
      // },5000)
      var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
      sharedInfo.console=i+1+'/'+list.length+' '+file_name
      fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
        console.log(i+1+'/'+list.length+' '+file_name)
      })
    }
    function download_mp3(list,i){
      try{
        //console.log(list)
        var video=youtubedl(list[i].url, ['-x', '--audio-format', 'mp3'])
        var file_name=''
        // var temp_file=UUID.generate()+'.mp3'
        var temp_file=list[i].uuid
        //var temp_file=list[i].title
        var commandString=''
        var commandOptions=['-i', 'temp.mp3','-af','silenceremove=1:0:-50dB', 'output.mp3']
        video.on('info', function(info) {
            // console.log('Download started')
            var file_name=path.parse(info._filename).name+'.mp3'
            console.log(i+1+'/'+endGameNum+' '+ file_name +" -> "+ temp_file)
            
            //console.log('size: ' + info.size)
            // commandString='ffmpeg -i' +temp_file+' -af silenceremove=1:0:-50dB  '+file_name
            // commandOptions[4]=file_name
            //video.pipe(fs.createWriteStream(file_name))
            //fullObjList[i].uuid=temp_file
            //temp_file_path=path.relative(__dirname, path.join(downloadsFolder(),temp_file))
            temp_file_path=path.join(downloadsFolder(),temp_file)
            //video.pipe(fs.createWriteStream(temp_file))
            video.pipe(fs.createWriteStream(temp_file_path))
            var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
            var percentage=Math.ceil(i/(endGameNum-1)*10000)/100
            sharedInfo.percentage=percentage
            fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
              console.log(percentage+'%')
            })
        })
        //video.pipe(fs.createWriteStream(temp_file))
        
        video.on('complete', function complete(info) {
            console.log('filename: ' + file_name + ' already downloaded.')
        })
        video.on('error',function error(err){
          //console.log(file_name+ " fuck'n failed bruh")
          if(i<endGameNum-1){
            download_mp3(list,i+1)
            // res.send({data:{
            //     endGame:endGameNum
            //   }
            // })
          }
          else{
              
              // var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
              // sharedInfo.console="trimming silence and naming them correctly"
              // fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
              //   console.log("trimming silence")
              // })
              //console.log(fullObjList)
              //trim_silence(fullObjList,0)
              // trim_silence(list,0)
          }
        })
        video.on('end', function() {

            endGameNum=list.length
     
            if(i<endGameNum-1){
              download_mp3(list,i+1)
              setTimeout(function(){
                trim_silence_one(list,i)
              },15000)
            }
            else if (i==endGameNum-1){
                trim_silence_one(list,i)
            }
            // else{
            //   console.log("I think we're done")
              //fullObjList=list.slice()
              //trim_silence(fullObjList,0)
            // }
        })
      }
      catch(e){
        console.log("this part needs to be ignored for most of the time")
        // if(i<list.length-1){
        //   download_mp3(list,i+1)
        // }
        // else{
        //     console.log("I think we're done")
        //     //console.log(fullObjList)
        //     trim_silence(fullObjList,0)
        // }
      }
    }
    function run(raw_url){
      var open = require('mac-open')
      open(downloadsFolder(), { a: "Finder" }, function(error) {});
      const config = {
        GOOGLE_API_KEY:process.env.GOOGLE_API_KEY,
        PLAYLIST_ITEM_KEY: ['publishedAt', 'title', 'description', 'videoId', 'videoUrl'], // option
      }
      const ps = new PlaylistSummary(config)
      // const PLAY_LIST_ID = 'RD8uDDwDpisYI'
    //   console.log("parser result : "+qs.parse(raw_url.list))
    //   if(qs.parse(raw_url.list)==undefined){
       
    // }

    // else{
      const PLAY_LIST_ID = qs.parse(raw_url).list
      ps.getPlaylistItems(PLAY_LIST_ID)
      .then((result) => {
          //console.log(result.items)
          for (var i =0; i<result.items.length;i++){
              var tempObj={
                  title:'',
                  url:'',
                  uuid:''
              }
              tempObj.title=result.items[i].title
              tempObj.url=result.items[i].videoUrl
              tempObj.uuid=UUID.generate()+'.mp3'
              fullObjList.push(tempObj)
              //fullList.push(result.items[i].videoUrl)
          }
          //console.log(fullList)
          //download_mp3(fullList,0)
          // fs.writeFile(path.join(__dirname,"../assets/playlist_items.json"),JSON.stringify(fullObjList,null,4),function(){
          //   console.log('playlist_items.json written at assets/playlist_items.json')
          // })
          
          var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
          processingList=fullObjList.slice()
          sharedInfo.data=fullObjList.slice()
          fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
            console.log('sharedInfo written at src/sharedInfo')
          })


          //download_mp3(fullObjList,0)
          download_mp3(processingList,0)
          res.send({data:{
             message:'download started'
           }
          })
      })
      .catch((error) => {
          console.error('not a youtube playlist')
          console.log(raw_url)
          var video=youtubedl(raw_url, ['-x', '--audio-format', 'mp3'])
          var file_name=''
          //var temp_file=UUID.generate()+'mp3'

          video.on('info', function(info) {
              // console.log('Download started')
              var file_name=path.parse(info._filename).name+'.mp3'
              temp_file=path.parse(info._filename).name
              temp_file_path=path.join(downloadsFolder(),temp_file)
              //video.pipe(fs.createWriteStream(temp_file))
              video.pipe(fs.createWriteStream(temp_file_path))
              var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
              var percentage=100
              sharedInfo.percentage=percentage
              fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
                console.log(percentage+'%')
                var commandOptions=['-i', 'temp.mp3','-af','silenceremove=1:0:-50dB', 'output.mp3']
                commandOptions[1]=temp_file_path
                file_name_path=path.join(downloadsFolder(),file_name)
                commandOptions[4]=file_name_path
                setTimeout(function(){
                  spawnSync('ffmpeg',commandOptions)
                  fs.unlinkSync(temp_file_path)
                  var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
                  sharedInfo.console=1+'/'+1+' '+file_name
                  fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
                    console.log(1+'/'+1+' '+file_name)
                  })
                },15000)
                
              })
              
          })
          //video.pipe(fs.createWriteStream(temp_file))
          
          video.on('complete', function complete(info) {
              console.log('filename: ' + file_name + ' already downloaded.')
          })
          video.on('error',function error(err){
            res.send({data:{
              error:error.message
            }})
            //var sharedInfo=fs.readFileSync(path.join(__dirname,"../assets/sharedInfo.json"))
            var sharedInfo=JSON.parse(fs.readFileSync(path.join(__dirname,"../sharedInfo.json")))
            sharedInfo.error=true
            sharedInfo.console=error.message
            // fs.writeFile(path.join(__dirname,"../assets/sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
            //   console.log('error message written at assets/sharedInfo.json')
            // })
            fs.writeFile(path.join(__dirname,"../sharedInfo.json"),JSON.stringify(sharedInfo,null,4),function(){
              console.log('error message written at src/sharedInfo.json')
            })
        })
          
      })
    // }
  }
    //console.log(req.query)
    if(req.query.url!='RAW YOUTUBE PLAYLIST URL HERE'){
      if(req.query.index==0){
        run(req.query.url)
      }
      else{
        //var fullObjList=fs.readFileSync(path.join(__dirname,"../assets/playlist_items.json"))
        var fullObjList=JSON.parse(fs.readFileSync(path.join(__dirname,"../playlist_items.json"))).data
        download_mp3(fullObjList,req.query.index)
      }
    }
  })
  //console.log(path.join(__dirname,'../../build'))
  console.log('server started in port number : '+String(portnumber))
  app.listen(process.env['PORT'] || portnumber);
  }