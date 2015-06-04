/**
 *  
 *
 */

var child_process = require('child_process')
var child = null;
var fs = require("fs");

var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('broker http and socket.io listening at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
        res.send('Hello World!');
        });

app.use(express.static('public'));

var isRunning = false;

io.on('connection', function (socket) {
      
      console.log("socket:" + socket.id +" connect");
      
      // when 'run' button is clicked.
      socket.on('run', function (msg) {
                if(isRunning==true){
                    console.log("websocket get a 'run' message from client while worker is running");
                    return;  // socket.on('run', function (msg) ...
                }
                
                console.log("websocket get a 'run' message from client:");
                console.log(msg);
                //write file
                fs.writeFile("./worker.js", msg, function(err){
                             if(!err){
                             
                             console.log("write worker.js File successfully");
                             
                             //spawn a new process and run the program with debug
                             child = child_process.spawn('node', [ './worker.js', '--debug' ],{ stdio: ['pipe', 'pipe','pipe','ipc'] });
                             isRunning = true
                             
                             //build the inter process communication channel
                             child.stdout.on('data', function (data) {
                                             //convert to string
                                             var msg = data.toString();
                                             msg = '['+child.pid+']' + '[stdout]:' + msg;
                                             console.log(msg);
                                             
                                             //send to client and display on the web page
                                             socket.emit('worker_stdout', msg);
                                             });
                             
                             child.stderr.on('data', function (data) {
                                             //convert to string
                                             var msg = data.toString();
                                             msg = '['+child.pid+']' + '[stderr]:' + msg;
                                             console.log(msg);
                                             
                                             //send to client
                                             socket.emit('worker_stderr', msg);
                                             });
                             
                             child.on('exit', function (code) {
                                      isRunning = false;
                                      var msg = '['+child.pid+']' + '[sysout]:' + 'program exits!';
                                      console.log(msg);
                                      //send to client
                                      socket.emit('worker_sysout', msg);
                                      });
                             
                             console.log("spawn worker.js process successfully");
                             } // if(!err)...
                             });  //fs.writeFile("./worker.js" ...
                
                });   // socket.on('run',...
      
      //when 'stop' button is clicked
      socket.on('stop', function (msg) {
                if (child == null) {
                    var msg = '[null]' + '[sysout]:' + 'program is not started yet!';
                    socket.emit('worker_sysout', msg);
                }
                else{
                    if(isRunning==true){
                        child.send('stop');
                    }
                    else{
                        var msg = '[null]' + '[sysout]:' + 'program is not running!';
                        socket.emit('worker_sysout', msg);
                    }
                }
                });  //socket.on('stop'...
      
      //when socket is disconnected
      socket.on('disconnect', function () {
                console.log("socket disconnected");
                
                if (child != null)
                {
                    if(isRunning==true){
                        child.send('stop');
                    }
                }
                }); 
      
      });  //io.on('connection', function (socket) ...

process.on('exit', function(code) {
    if (child != null)
    {
        if(isRunning==true){
           child.send('stop');
        }
    }
});

