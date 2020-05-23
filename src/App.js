import React,{Component,useContext,useState,useEffect,useRef} from 'react';
import {Text,View,Dimensions,TouchableOpacity} from 'react-native';
import logo from './logo.svg';
import './App.css';
import stringifyObject from 'stringify-object'
import { NONAME } from 'dns';
const clearModule = require('clear-module');
const withQuery = require('with-query').default;
var child_process=require('child_process')

function App(props) {

  const bar = useRef(null)
  const textBox = useRef(null)
  const percentageText = useRef(null)
  const buttonRef = useRef(null)
  //var currentIndex=0
  var height=100
  const [portnumber,setPortnumber]=useState(8000)
  const [handshakeStatus,setHandshakeStatus]=useState(false)
  const [updates,setUpdates]=useState(null)
  const [currentIndex,setCurrentIndex]=useState(0)
  const [greyOut,setGreyOut]=useState(false)
  const [userSelect,setUserSelect]=useState('auto')
  // const [stop,setStop]=useState(false)
  var progressBarStyleOne={
    //flex:1,
    height:26,
    //width:'calc(100% - px)',
    width:'100%',
    marginLeft:4,
    marginRight:4,
    paddingTop:0,
    paddingBottom:0,
    paddingLeft:0,
    paddinrgRight:0,
    backgroundColor:'rgb(110, 110, 110)',
    flexDirection:'column',
    //justifyContent:'center',
    alignItems:'center',
    boxSizing:"border-box",
    borderRadius:3,
    borderColor:'transparent',
    borderStyle:'solid',
    
  };
  var progressBarStyleTwo={
    //flex:1,
    height:26,
    width:'calc(100% + 6px)',
    //width:'calc(100% + 4 px)',
    backgroundColor:'rgb(234,179,65)',
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:3,
    borderWidth:1,
    borderColor:'rgb(81,81,81)',
    borderStyle:'solid',
    overflow:'hidden',
    boxSizing:"border-box",
    shadowColor:'#000',
    shadowOpacity:0.85,
    shadowRadius:2,
    shadowOffset:{
      width:0,
      height:0
    },
    elevation:2,
    transform: `translate(-3px, -3px)`,
    zIndex:2
  };
  var textStyle={
      fontSize: 10,
      fontWeight:'700',
      textDecorationLine:'none',
      color:'rgb(90,90,90)',
      userSelect:{userSelect},
      // textShadowColor: 'rgba(0, 0, 0, 0.85)',
      // textShadowOffset: {width: 0, height: 0},
      // textShadowRadius: 2,
      textAlign:'center',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
      margin:5,
      transform: `translate(0px, +1px)`,
      zIndex:1 
  }
  var innerTextStyle={
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  }
  var buttonStyle={
    zIndex:0
    //transform: `translate(0px, -22px)` 
}
var textBoxBorderOne={
  //flex:1,
  height:40,
  //width:'calc(100% - px)',
  width:'100%',
  marginLeft:4,
  marginRight:4,
  marginBottom:4,
  paddingTop:0,
  paddingBottom:0,
  paddingLeft:0,
  paddinrgRight:0,
  backgroundColor:'rgb(110, 110, 110)',
  flexDirection:'column',
  //justifyContent:'center',
  alignItems:'center',
  boxSizing:"border-box",
  borderRadius:3,
  borderColor:'transparent',
  borderStyle:'solid',
  
};
var textBoxBorderTwo={
  //flex:1,
  height:40,
  width:'calc(100% + 6px)',
  //width:'calc(100% + 4 px)',
  backgroundColor:'rgb(255,255,255)',
  flex:1,
  flexDirection:'column',
  justifyContent:'center',
  alignItems:'center',
  borderRadius:3,
  borderWidth:1,
  borderColor:'rgb(81,81,81)',
  borderStyle:'solid',
  overflow:'hidden',
  boxSizing:"border-box",
  shadowColor:'#000',
  shadowOpacity:0.85,
  shadowRadius:2,
  shadowOffset:{
    width:0,
    height:0
  },
  elevation:2,
  transform: `translate(-3px, -3px)`,
  zIndex:2
};
  var textBoxStyle={
    height:40,
    width:'calc(100% + 6px)',
    fontSize: 10,
    fontWeight:'700',
    textDecorationLine:'none',
    color:'rgb(90,90,90)',
    boxSizing: 'border-box',
    border:'solid 1px transparent',
    backgroundColor:'transparent',
    //color:'rgb(142,142,142)',
    position:'relative',
    transform: `translate(-1px, -1px)`,
    opacity:1.0,
    zIndex:1,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    whiteSpace: 'nowrap',
    paddingTop:11
  }

  var percentage=0
  var barWidth=150
  // function setPercent(endIndex){
  //   // if(go==true){
  //     // if(currentIndex==0){
  //     //   setStop(true)
  //     // }
  //     if(currentIndex+1<endIndex){
  //       //currentIndex=currentIndex+1
  //       setCurrentIndex(currentIndex+1)
  //     }
  //     else{
  //       //currentIndex=endIndex
  //       setCurrentIndex(endIndex)
  //     }
  //     //console.log(currentIndex)
  //     //console.log(endIndex)
  //     percentage = Math.ceil(currentIndex/(endIndex-1)*10000)/100
  //     console.log(percentage)
  //     barWidth=Math.floor(394*currentIndex/endIndex)
  //     if (percentage!=0){
  //       percentageText.current.innerHTML=percentage+' %'
  //       if(currentIndex==endIndex-1){
  //         percentageText.current.innerHTML="Ready"
  //         var obj={}
  //         cleanEmptyDirectories()
  //         clearSlate("clean-slate",{}).then(function(){
  //           console.log('slate clean message sent')
  //         })
  //         // const app = require('electron').remote.app
  //         // app.exit(0)
  //         //setStop(false)
  //       }
  //     }
  //     else{
  //       percentageText.current.innerHTML="Ready"
  //       // setStop(false)
  //     }
  //     //bar.current.style.width=barWidth+'px'
  //     //bar.current.style.width=percentage+'%'
  //     bar.current.style.width='calc('+percentage+'% + 6px)'
  //     //console.log(bar.current.style.width)
  //   // }
    
  // }
  function setPercent(percentage){
      barWidth=Math.floor(394*percentage/100)
      if (percentage!=0){
        percentageText.current.innerHTML=percentage+' %'
        bar.current.style.width='calc('+percentage+'% + 2px)'
      }
    
      else{
        percentageText.current.innerHTML="DOWNLOAD"
        bar.current.style.width='calc(100% + 6 px)'
        // setStop(false)
      }
        
  }
  const resetPortSettings=async()=>{
    function getPortnumberFromJSON(){
        setPortnumber(portnumber)
        fetch(withQuery('http://127.0.0.1:'+portnumber+'/reset-port-number', {
            mode:'cors',
        }))
        .then(result=>{
        return result.json()
        })
        .then((json)=>{
            console.log(stringifyObject(json))
        })
        .catch((err)=>{
            console.error(err)
        })
    }
    getPortnumberFromJSON()  
  }
const postApi=(endPoint,obj,cb)=>{
  if(portnumber!=null){
      fetch('http://127.0.0.1:'+portnumber+'/'+endPoint, {
          method:"POST",
          headers:{
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body:JSON.stringify(obj),
          mode:'cors',
      })
      .then(result=>{
          return result.json()
          //return stringifyObject(result.json())
      })
      .then((json)=>{
          console.log(stringifyObject(json))
          console.log('do something here')
          var stringedJson = stringifyObject(json)
          //return(stringedJson)
      })
      .catch((err)=>{
          //console.error(err)
          console.log()
          //return(null)
      })

  }
  else{
      if(cb!=undefined){
          setTimeout(cb())
      }
  } 
}
  const cleanEmptyDirectories=async()=>{
    // var json = require('../assets/sharedInfo.json')
    if(portnumber!=null){
        fetch(withQuery('http://127.0.0.1:'+portnumber+'/clean-empty', {
            mode:'cors',
        }))
        .then(result=>{
            return result.json()
        })
        .then((json)=>{
            console.log('clean empty directories function executed')
        })
        .catch((err)=>{
            console.error(err)
        })
  
    }
  } 
  const oneFileEndPoint=async(endPoint,queries,cb)=>{
    // var json = require('../assets/sharedInfo.json')
    if(portnumber!=null){
        fetch(withQuery('http://127.0.0.1:'+portnumber+'/'+endPoint, {
            ...queries,
            mode:'cors',
        }))
        .then(result=>{
            return result.json()
        })
        .then((json)=>{
            setUpdates(json)
        })
        .catch((err)=>{
            console.error(err)
        })
  
    }
    else{
        if(cb!=undefined){
            setTimeout(cb())
        }
    }
  }  
  const clearSlate=async(endPoint,queries,cb)=>{
    // var json = require('../assets/sharedInfo.json')
    if(portnumber!=null){
        fetch(withQuery('http://127.0.0.1:'+portnumber+'/'+endPoint, {
            ...queries,
            mode:'cors',
        }))
        .then(result=>{
            return result.json()
        })
        .then((json)=>{
            console.log('clean slate fired '+json.data)
            //setUpdates(json)
        })
        .catch((err)=>{
            console.error(err)
        })
  
    }
    else{
        if(cb!=undefined){
            setTimeout(cb())
        }
    }
  } 
  const handshake=()=>{
      var portnum = require('./sharedInfo.json').portnumber
      var queries={number:Math.random()}
      console.log('http://127.0.0.1:'+portnum+'/handshake')
      if(portnum!=null){
          fetch(withQuery('http://127.0.0.1:'+portnum+'/handshake', {
              ...queries,
              mode:'cors',
          }))
          .then(result=>{
              return result.json()
          })
          .then((json)=>{
              if(json.number=queries.number){
                  setHandshakeStatus(true)
                  setPortnumber(portnum)
              }
          })
          .catch((err)=>{
              clearModule('./sharedInfo.json')
              console.error(err)
              setTimeout(function(){
                  console.log('err')
                  handshake()
              },15000)
          })
      }
      else{ 
          clearModule('./sharedInfo.json')
          setTimeout(function(){
              console.log('else')
              handshake()
          },15000)
      }
  }  
  const observingState=()=>{
          fetch(withQuery('http://127.0.0.1:'+portnumber+'/sharedinfo', {
              mode:'cors',
          }))
          .then(result=>{
              return result.json()
          })
          .then((json)=>{
            
            setTimeout(function(){
              console.log("data length : "+json.data.length)
              console.log("console : "+json.console)
              console.log("error state : "+json.error)
              console.log(json.percentage+"%")
              setPercent(json.percentage)
              if(json.percentage>=100){
                percentageText.current.innerHTML=json.console
                if(percentage>=100){
                  percentageText.current.innerHTML="DOWNLOAD"
                  setGreyOut(false)
                  // var obj={}
                  // cleanEmptyDirectories()
                  clearSlate("clean-slate",{}).then(function(){
                    console.log('slate clean message sent')
                  })
                }
              }
              observingState()
            },3000)
          })
          .catch((err)=>{
              console.error(err)
              setTimeout(function(){
                  console.log('err')
                  observingState()
              },15000)
          })     
      }


  

  useEffect(()=>{
      console.log('started')
      //console.log(textBox)
      textBox.current.focus()
      textBox.current.selectionEnd=29
     
      handshake()
      observingState()
      //getPort()
      document.getElementById('business').onchange = function(e){ 
        //document.getElementById('business').oninput = function(e){
            setCurrentIndex(0)
            
            var files = e.target.files; 
            var filePaths =[];
            var obj={}
            for (var i = 0; i < files.length; i++) {
                filePaths.push(files[i].path)
            }
            var fileIndex=0
            obj.files=filePaths
            //  oneFileEndPoint('file-path-list',obj)
            var i = 0
            function callback(){
  
            }
            //postApi("all-files",{data:filePaths})
            // async function start(){
            //     await clearSlate("clean-slate",{})
            //     var endGame=filePaths.length
            //     for(var i =0; i<endGame; i++){
            //         var obj={file:filePaths[i],fraction:i/filePaths.length,currentGame:i,endGame:endGame}
            //         //console.log(obj)
            //         var json= await oneFileEndPoint("one-file",obj)
            //         //console.log(json)
            //     }
            // }
            // start()
  
  
        }

  },[])
  useEffect(()=>{
      if(handshakeStatus==true){
          console.log("handshake successful")
          resetPortSettings()
      }
  },[handshakeStatus])
  useEffect(()=>{
      console.log('portnumber status changed!')
      console.log(portnumber)
  },[portnumber])
  useEffect(()=>{
      console.log(updates)
      if(updates!=null && typeof(updates)!=='undefined'){
          console.log(updates)
          //setPercent(parseInt(updates.data.endGame))
          setPercent(0)
      }
  },[updates])
  useEffect(()=>{
    // setStop(false)
    console.log(currentIndex)
    var obj={url:textBox.current.value,index:currentIndex}
      //oneFileEndPoint("one-file",obj)
  },[currentIndex])
  // useEffect(()=>{
  //   // setStop(false)
  //   console.log(stop)
  // },[stop]) 
  const pushed=()=>{
    // if(stop==false){
      
     // resetPortSettings()
      buttonRef.current.display='hide'
      console.log(textBox.current.value)
      setGreyOut(true)
      setUserSelect('none')
      // var downloadsFolder = require('downloads-folder')
      // console.log(downloadsFolder())
      var obj={url:textBox.current.value,index:0}
      //console.log(obj)
      //console.log(obj)
      oneFileEndPoint("one-file",obj)
      //document.getElementById('business').click()
    // }
  }
  const keyPushed=(e)=>{
    console.log(e.key)
    if(e.key==='Enter'){
      e.preventDefault();
      pushed()
      console.log('enter')
    }
  }
  return (
    <div className="App">
      <div className='out-most'>
      <div className="outter">
      <div className="App-header">
        <div style={{...textBoxBorderOne}}>
          <div style={{...textBoxBorderTwo}}>
            <textarea className='textBox' ref={textBox} style={{...textBoxStyle}} disabled={greyOut} onKeyPress={keyPushed}>
            RAW YOUTUBE PLAYLIST URL HERE
            </textarea>
          </div>
        </div>
        <div className="progressBar" style={{...progressBarStyleOne}}>
   
          <div ref={bar} style={{...progressBarStyleTwo}}>
            <View
              style={{
                height:22,
                justifyContent:'center',
                alignItems:'center'
              }}
            >
              
              <TouchableOpacity 
                ref={buttonRef}
                disabled={greyOut}
                onPress={(e)=>{ 
                // if(stop==false){
                  //restart({entry:'./expressServer/server.js'})
                  pushed()
                // }
              }}>
                <Text selectable={false} style={textStyle}><a ref={percentageText} style={innerTextStyle}>DOWNLOAD</a></Text>
              </TouchableOpacity>
            </View>
          </div>
          
        </div>
        <input id="business" type="file" webkitdirectory='true' directory='true' style={{display: "none"}}/>
        {/* <Trainer/> */}
        
        {/* <MLFiveKNN/> */}
      </div>
      </div>
      </div>
    </div>
  );
}

export default App;
