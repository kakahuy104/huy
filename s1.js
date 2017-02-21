var port = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT  || 8000;
var ipaddress = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
    WebSocket = require('ws');
var request=require("request");
var cheerio=require("cheerio");
var http = require('http');

var server = http.createServer(function(request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.write("Welcome to Node.js!\n\n");
      response.end("Thanks for visiting us! \n");
});

server.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

ip="";
var name="";

var go=function (){
wss = new WebSocket("ws://zui-zuize2.rhcloud.com:8000");
wss.onopen=function (){
 console.log("go!");
 wss.send(JSON.stringify({name:"login",p:"airequest"}));
}
wss.onmessage=function (data){
// console.log(data);
 data=JSON.parse(data.data);
 if(data.name=="laytitle"){
 name=data.name;
  checkPort(data.ip,80,function (status,host,port){
  if(status=="open")  re(data.ip);
  else wss.send(JSON.stringify({name:name,data:"Loi.Code",status:"-1"}));
  });
 }
}
wss.onerror=function (){
 setTimeout(go,5000);
}
wss.onclose=function (){
 setTimeout(go,5000);
}

}

go()


function re(p){
ip=p;
console.log(ip);
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     "http://wap9.info/source.php",
  body:    "codigo=codigo&box=on&url=http://"+p
}, function (error, response, body){
  console.log(response.statusCode);
  if(error){
  console.log(error);
   wss.send(JSON.stringify({name:name,data:"Loi.Mang",status:"-1"}));
  } else  if(response.statusCode==200){
  body=tohtml((body.split("<textarea>")[1]).split("<textarea>")[0]);
//  console.log(body);
  $ = cheerio.load(body);
  titles = $("title");
  console.log(titles.length);
if(titles.length>0)
  $(titles).each(function(i, title){
//    console.log("---tua de");
    console.log($(title).text());
  wss.send(JSON.stringify({name:name,data:$(title).text(),status:response.statusCode}));
  });
else wss.send(JSON.stringify({name:name,data:"KO.TITLE",status:response.statusCode}));

 } else if(response.statusCode!=0){
 wss.send(JSON.stringify({name:name,data:"Loi.Mang",status:response.statusCode}));
 }

});

}

tohtml = function(a) {
__a=a;
__a=__a.replace(new RegExp("&amp;", 'g'), "&");
__a=__a.replace(new RegExp("&lt;", 'g'), "<");
__a=__a.replace(new RegExp("&gt;", 'g'), ">");
__a=__a.replace(new RegExp("&quot;", 'g'), '"');
__a=__a.replace(new RegExp("&#039;", 'g'), "'");
return __a;
    }

var net    = require('net'), Socket = net.Socket;
var checkPort = function(host, port, callback) {
    var socket = new Socket(), status = null;

    // Socket connection established, port is open
    socket.on('connect', function() {status = 'open';socket.end();});
    socket.setTimeout(1500);// If no response, assume port is not listening
    socket.on('timeout', function() {status = 'closed';socket.destroy();});
    socket.on('error', function(exception) {status = 'closed';});
    socket.on('close', function(exception) {callback( status,host,port);});
    socket.connect(port, host);
}

//re("http://113.184.209.227");
