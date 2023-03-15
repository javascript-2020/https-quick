
<h3>https-quick</h3>

https-quick tries to be a drop in for https,
for when you just want to throw together a quick https server<br>
it has keys and certificates built in and some extended functionality


    npm install https-quick
    
    
useage:


    var server    = require('https-quick');
    
    
which in this simplest form executes


    //https-quick.js
    
    var key           = `...`;
    var cert          = `...`;
    var https         = require('https');
    var server        = https.createServer({key,cert});
    
    module.exports    = server;
    
    
<br>
https-quick adds a function named <code> quick </code> to the returned server object<br>
to provide some extended functionality
<br>
<br>

    var server    = require('https-quick');
    
    server.quick(request,'hello');
    
    
    function request(req,res){
    
          server.quick.notfound(req,res);
          
    }//request
    
    
https://localhost:3002/hello

<br>
<br>

when the quick function is called<br>

- https-quick adds onerror and onlistening functions
- calls <code> server.listen </code>


- it returns the server object for chaining

<br>
<br>

the exposed <code> quick </code> function takes parameters in any order

- the first number in the parameter list is used as the port
  i.e <code> server.quick(2154) </code> will start the server
  listening on port 2154
  
- the first function in the parameter list will be used for the
  onrequest callback
  
- if the string 'hello' is found within the parameter list

  - the server will return a simple hello page on the url <code> /hello </code>
  - it also provides <code> /favicon.ico </code>
  - the cacert can be downloaded from <code> /cacert </code>
  - it adds cors support, for all origins to get and post requests
  
<br>
<br>

there is a convenience 404 not found at <code> quick.notfound </code>
it requires the request and response streams as arguments


    var server    = require('https-quick').quick(request,'hello');
    
    function request(req,res){
    
          switch(req.url){
          
            case '/index.html'      : request.index(req,res);       break;
            
            default                 : <b>server.quick.notfound(req,res);</b>
            
          }//switch
          
    }//request
    
    request.index=function(req,res){
    
          var html    = require('fs').readFileSync('./index.html');
          res.setHeader('content-type','text/html');
          res.end(html);
          
    }//index
    
<br>
<br>
<br>

example useage:

    var server    = require('https-quick').quick(request);
    
    function request(req,res){
    
          var file    = chk(req);
          if(!file)return;
          
          var data    = require('fs').readFileSync(file);
          res.end(data);
          
    }//request
    
    function chk(req,res){
    
          var file    = req.url.slice(1);
          var p1      = path.resolve(__dirname,file).substring(0,__dirname.length);
          if(p1!==__dirname){
                server.quick.notfound(req,res);
                return false;
          }
          return __dirname+'/'+file;
          
    }//chk
    
    
    