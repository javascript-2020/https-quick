
<h3>https-quick</h3>

https-quick tries to be a drop in for https,
for when you just want to throw together a quick https server<br>
it has keys and certificates built in and some extra functionality

<pre>

    npm install https-quick
    
</pre>


useage:

<pre>

    var server    = require('https-quick');
    
</pre>


which in this simplest form executes

<pre>

    //https-quick.js
    
    var key           = `...`;
    var cert          = `...`;
    var https         = require('https');
    var server        = https.createServer({key,cert});
    
    module.exports    = server;
    
</pre>
<br>

<h4>server.quick</h4>

https-quick adds a function named <code> quick </code> to the returned server object<br>
to provide extended functionality

<br>
<br>

<pre>

    var server    = require('https-quick');
    
    <b>server.quick(request,'hello');</b>
    
    
    function request(req,res){
    
          server.quick.notfound(req,res);
          
    }//request
    
</pre>

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
  - it adds a 'cache-control:no-store' header
  
<pre>

      var server    = require('https-quick').<b>quick(2154,'hello')</b>;
      
</pre>
<br>

<h4>server.quick_</h4>
there is another function <code> quick_ </code> which calls <code> quick </code>
but returns the quick object for ease of use

<pre>

      var quick   = require('https-quick').<b>quick_(2154,'hello')</b>;
      
</pre>
<br>

<h4>server.quickh</h4>
there is another function <code> quickh </code> whcih calls <code> quick_ </code>
and automatically adds the 'hello' parameter

<pre>

      var quick   = require('https-quick').quickh(2154);
      
</pre>
<br>

<h4>quick.ok</h4>
there is a convenience '200 ok' at <code> quick.ok(req,res,msg='ok') </code>
  - it requires the request and response streams as arguments
  - it returns statusCode 200
  - it has content-type text/plain
  - it has body that contains the text in msg
  
<pre>

      var server   = require('https-quick');
      server.on('request',(req,res)=>{
      
            server.quick.ok(req,res,'request ok');
            
      });
      
</pre>
<br>

<h4>quick.error</h4>
there is a convenience '400 Bad Request' as <code> quick.error(req,res,msg='error') </code>
  - it requires the request and response streams as arguments
  - it returns statusCode 400
  - it has content-type text/plain
  - it has body that contains the text in msg
  
<pre>

      var server   = require('https-quick');
      server.on('request',(req,res)=>{
      
            server.quick.error(req,res,'an error occurred');
            
      });
      
</pre>
<br>

<h4>quick.notfound</h4>
there is a convenience '404 not found' at <code> quick.notfound(req,res) </code>
  - it requires the request and response streams as arguments
  - it returns statusCode 404
  - it has content-type text/html
  
<pre>

      var server   = require('https-quick');
      server.on('request',(req,res)=>{
      
            server.quick.notfound(req,res,'was not found on this server');
            
      });
      
</pre>
<br>

<h4>quick.url(url,callback)</h4>

this function allows to quickly add a url to serve

  url       - the url to serve, if the url already exists it is removed
  
  callback  - can take a number of forms
              - a function to be called when a request for the url is made, the function is called with arguments req,res
              - a string taken to be html and given in response
              - a promise which is then resolved with arguments req,res
              - an object
                - if the object has a 'file' key this is taken as a filename
                  if the object has a 'ins' key this is used to search and replace within the file text
                  
                - if the object has a 'string' key this is taken as html
                  if the object has a 'ins' key this is used to search and replace within the html
                  
<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/index.html',index);
      
      function index(req,res){
      
            res.end('this is the index.html page');
            
      }//index
      
</pre>

<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/index.html',`
            <html>
                  <head>
                  </head>
                  <body>
                        <h1>welcome</h1>
                  </body>
            </html>
      `);
      
      
</pre>

<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/index.html',{file:'index.html',ins:{name:'matt'}});
      
</pre>

<pre>

      var quick   = require('https-quick').quickh();
      var html    = `
            <html>
                  <head>
                  </head>
                  <body>
                        <h1>welcome {{name}}</h1>
                  </body>
            </html>
      `;
      quick.url('/index.html',{string:'index.html',ins:{name:'matt'}});
      
</pre>
<br>

a number of functions allow strings to be inserted into text, the keys are surrounded by double squirly braces and
used as needles for a search and replace all, the value being used as the replace text

<pre>

      var ins   = {
            name    : 'matt',
            age     : 44,
            drink   : 'milk'
      };
      
      var html    = `
            <html>
                  <head>
                  </head>
                  <body>
                  
                        hello my name is {{name}}, i am {{age}}
                        my favourite drink is {{drink}}
                        
                        <h2>{{drink}} sometimes falls from the sky in drops</h2>
                        
                  </body>
            </html>
      `;
      
      for(var key in ins)
            html    = html.replaceAll('{{'+key+'}}',ins[key]);
            
</pre>
<br>

<h4>quick.url.file(url,file,insert)</h4>

assigns a file to be served when the given url is accessed, if the insert parameter is given ( see above ), the file
is converted to text and a search and replace is performed on the text

<br>
<br>

<h4>quick.url.gen(callback)</h4>

generates an random alpha-numeric url 10 characters in length, this with the callback is then passed to
<code> quick.url(url,callback) </code>

<br>
<br>

<h4>quick.url.rem(url)</h4>

removes the given from the current list

<br>
<br>

<h4>quick.dir(base,dir,exclude)</h4>

quickly serve the files in dir <code> dir </dir> from the url stating with <code> base </code>
the exclude parameter is an array of relative paths from <code> dir </code> to exclude from serving

<br>
<br>

<h4>quick.req.post.json(req)</h4>

processes a post request with content-type application/json, the function returns a promise which resolves
to a javascript json value

<br>
<br>

<h4>quick.res.html(res,html,insert)</h4>

send a html response, html is the string to return and search and replace is performed ( see above ) using the insert
parameter

<br>
<br>
<h4>quick.res.json(res,json)</h4>

send a json response

<br>
<br>

<h4>quick.res.file(res,file,ins)</h4>

send a file if the insert parameter is given the file is converted to text and search and replace performed ( see above )

<br>
<br>

<h4>quick.resolve(dir,file)</h4>

a convenience function to test if the given file resolves into directory dir
returns the absolute filename if true
false on failure

<br>
<br>

<h4>quick.exists(dir,file)</h4>

a convenience function to test if a given file <code> file </code> exists in directory <code> dir </code>
return a promise that resolves into the absolute filename if true
or false on failure


<br>
<br>
<br>

example useage:

<pre>

    var server    = require('https-quick').quick(request,'hello');
    
    function request(req,res){
    
          switch(req.url){
          
            case '/index.html'      : request.index(req,res);       break;
            
            default                 : <b>server.quick.notfound(req,res);</b>
            
          }//switch
          
    }//request
    
    request.index=async function(req,res){
    
          var html    = await require('fs').promises.readFile('./index.html');
          res.setHeader('content-type','text/html');
          res.end(html);
          
    }//index
    
</pre>

<pre>

    require('./https-quick').quick((req,res)=>{
    
          res.setHeader('content-type','text/html');
          res.end(`
                &lt;div id=center style='position:relative;top:33%;text-align:center;font-family:arial;font-weight:bold;'>
                    &lt;div id=time style='font-size:42px;color:green'>&lt;/div>
                    &lt;div id=date style='font-size:32px;color:blue;margin-top:20px'>&lt;/div>
                &lt;/div>
                &lt;script>
                      var text=()=>{
                            var d=new Date().toString();
                            var i1=d.indexOf(':'),i2=d.lastIndexOf(':');
                            time.textContent=d.slice(i1-2,i2+3);
                            date.textContent=d.slice(0,i1-2);
                      };
                      text();
                      setInterval(text,1000);
                &lt;/script>
          `);
          
    });
    
</pre>

<pre>

    var server    = require('./https-quick').quick(request);
    
    function request(req,res){
    
          var file    = chk(req,res);
          if(!file)return;
          
          var data    = require('fs').readFileSync(file);
          res.end(data);
          
    }//request
    
    function chk(req,res){
    
          var file    = req.url.slice(1);
          file        = file||'index.html';
          
          var p1      = require('path').resolve(__dirname,file).substring(0,__dirname.length);
          if(p1!==__dirname){
                server.quick.notfound(req,res);
                return false;
          }
          
          var abs   = __dirname+'/'+file;
          
          try{
                require('fs').statSync(abs);
          }
          catch(err){
                console.error(err);
                server.quick.notfound(req,res);
                return false;
          }
          return abs;
          
    }//chk
    
</pre>


<pre>

      var quick   = require('../https-quick.js').quickh();
      quick.dir('/','');
      
</pre>











