const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
var fs = require('fs');
var request = require('request');
const imageDownloader = require('node-image-downloader');

app.use(express.json());
app.use(express.static("public"));



app.get("/",function(request,res){
//	response.sendFile(__dirname + "public/index.html");
		 res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

app.get("/videoInfo",async function(request,response){
	const videoURL = request.query.videoURL;
	const info = await ytdl.getInfo(videoURL);
	response.status(200).json(info);
});

app.get("/download",function(request,response){
	const videoURL = request.query.videoURL;
	const itag = request.query.itag;
	response.header("Content-Disposition",'attachment;\ filename="video.mp4"');
	ytdl(videoURL,{
		filter: format => format.itag == itag
	}).pipe(response);
});





app.get("/downloadImage",async function(request,response){
  const { query:{ url, filename} } = request;
  await imageDownloader({
    imgs: [{
      uri: url,
      filename: filename
    }],
    dest:'./public'
  }).then(info=>{
    fs.chmod( info[0]['path'], 777, ()=>{
      console.log("permission added");
    } )
    response.status(200).json(info);
  }).catch(error=>console.log(error));
});


// var download = function(uri, filename, callback){
  
// };

// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
//   console.log('done');
// });
app.listen(4000);

