
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
https-quick provides a https certificate for<br>
  - ip's :
    - 127.0.0.1, https://127.0.0.1:3002/
    - 127.0.0.2, https://127.0.0.2:3002/<br>
  - dns names :
    - localhost, https://localhost:3002/
    - tst-server, https://tst-server:3002/
<br>
https-quick adds a function named <code> quick </code> to the returned server object<br>
to provide extended functionality<br>
<br>
<br>

<h4>quick(port,onrequest,'hello')</h4>

<pre>

    var server    = require('https-quick');
    
    <b>server.quick(request,'hello');</b>
    
    
    function request(req,res){
    
          server.quick.notfound(req,res);
          
    }//request
    
</pre>

visit : https://localhost:3002/hello

<br>
<br>

when the quick function is called https-quick<br>

- adds onerror and onlistening functions
- calls <code> server.listen </code>
- returns the server object for chaining
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
  
- if the string 'nokeys' is not present

  - adds keyboard event to the console allow escape to be pressed to quit the process
  
<br>

<pre>

      var server    = require('https-quick').<b>quick(2154,'hello')</b>;
      
</pre>
<br>

<h4>quick_(port,onrequest,'hello')</h4>
this calls the <code> quick </code> function but returns the quick function for ease of use<br><br>

<pre>

      var quick   = require('https-quick').<b>quick_(2154,'hello')</b>;
      
</pre>
<br>

<h4>quickh(port,onrequest,'hello')</h4>
this calls the <code> quick_ </code> function and automatically adds the 'hello' parameter<br><br>

<pre>

      var quick   = require('https-quick').<b>quickh(2154)</b>;
      
</pre>
<br>

<h4>quick.ok(req,res,msg='ok')</h4>
this produces '200 ok' response<br>

  - it requires the request and response streams as arguments
  - the response has statusCode 200
  - the response has content-type text/plain
  - the response has body that contains the text in msg
  
<pre>

      var server   = require('https-quick');
      
      server.on('request',(req,res)=>{
      
            <b>server.quick.ok(req,res,'request ok');</b>
            
      });
      
</pre>
<br>

<h4>quick.error(req,res,msg='error')</h4>
this produces '400 Bad Request' response<br>

  - it requires the request and response streams as arguments
  - the response has statusCode 400
  - the response has content-type text/plain
  - the response has body that contains the text in msg
  
<pre>

      var server   = require('https-quick');
      
      server.on('request',(req,res)=>{
      
            <b>server.quick.error(req,res,'an error occurred');</b>
            
      });
      
</pre>
<br>

<h4>quick.notfound(req,res,msg='not found on this server')</h4>
this produces '404 not found' response

  - it requires the request and response streams as arguments
  - the response has statusCode 404
  - the response has content-type text/html
  - the response has body that contains the text from msg
  
<pre>

      var server   = require('https-quick');
      
      server.on('request',(req,res)=>{
      
            <b>server.quick.notfound(req,res,'was not found on this server');</b>
            
      });
      
</pre>
<br>

<h4>quick.url(url,callback)</h4>

this function allows to quickly add a url to serve

  - url, the url to serve, if the url already exists it is removed
  
  - callback, can take a number of forms
  
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
      
      <b>quick.url('/index.html',index);</b>
      
      function index(req,res){
      
            res.end('this is the index.html page');
            
      }//index
      
</pre>

<pre>

      var quick   = require('https-quick').quickh();
      
      <b>quick.url('/index.html',`
            &lt;html>
                  &lt;head>
                  &lt;/head>
                  &lt;body>
                        &lt;h1>welcome&lt;/h1>
                  &lt;/body>
            &lt;/html>
      `);</b>
      
      
</pre>

<pre>

      var quick   = require('https-quick').quickh();
      
      <b>quick.url('/index.html',{file:'index.html',ins:{name:'matt'}});</b>
      
</pre>

<pre>

      var quick   = require('https-quick').quickh();
      var html    = `
            &lt;html>
                  &lt;head>
                  &lt;/head>
                  &lt;body>
                        &lt;h1>welcome {{name}}</h1>
                  &lt;/body>
            &lt;/html>
      `;
      <b>quick.url('/index.html',{string:html,ins:{name:'matt'}});</b>
      
</pre>
<br>

<h4>inserting strings into text</h4>

a number of functions allow strings to be inserted into text, by supplying an object whose

  - the keys are surrounded by double braces '{' and used as the search parameter, all occurrences are replaced
  - the value is used for the replace text
  
<pre>

      var insert   = {
            name    : 'john',
            age     : 27,
            drink   : 'milk'
      };
      
      var html    = `
            &lt;html>
                  &lt;head>
                  &lt;/head>
                  &lt;body>
                  
                        hello my name is {{name}}, i am {{age}}
                        my favourite drink is {{drink}}
                        
                        &lt;h2>{{drink}} sometimes falls from the sky in drops&lt;/h2>
                        
                  &lt;/body>
            &lt;/html>
      `;
      
      for(var key in insert)
            html    = html.replaceAll('{{'+key+'}}',insert[key]);
            
</pre>
<br>

<h4>quick.url.file(url,file,insert)</h4>

assigns a file to be served when the given url is accessed, if the insert parameter is given ( see above ), the file
is converted to text and search and replace is performed on the text
<br>

<pre>

      var quick   = require('https-quick').quickh();
      
      <b>quick.url.file('/index.html','static/index.html');</b>
      
</pre>
<br>

<h4>quick.url.gen(callback)</h4>

generates a random alpha-numeric url, 10 characters in length<br>
if callback is given <code> quick.url(url,callback) </code> is called
<br>

<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/',main);
      
      
      function main(req,res){
      
            var url   = <b>quick.url.gen(complete);</b>
            
            var html    = `
                  &lt;html>
                        &lt;head>
                        &lt;/head>
                        &lt;body>
                              &lt;pre id=output>&lt;/pre>
                              &lt;script>
                                    (async ()=>{
                                          var response          = await fetch('{{url}}');
                                          var json              = await response.json();
                                          output.textContent    = JSON.stringify(json,null,4);
                                    })();
                              &lt;/script>
                        &lt;/body>
                  &lt;/html>
            `;
            
            quick.res.html(res,html,{url});
            
            
            function complete(req,res){
            
                  quick.res.json({hello:'world'});
                  
            }//complete
            
      }//main
      
</pre>

<br>

<h4>quick.url.rem(url)</h4>

removes the given from the current list<br>

<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url.file('/index.html','index.html');
      
      <b>quick.url.rem('/index.html');</b>
      
</pre>
<br>

<h4>quick.dir(base,dir,exclude)</h4>

serve the files in directory <code> dir </code><br>
from the url starting with <code> base </code><br>
the exclude parameter is an array of relative paths from <code> dir </code> to exclude from serving<br>

<pre>

      var quick   = require('https-quick').quickh();
      
      <b>quick.dir('/','',['server.js']);</b>
      
</pre>
<br>

<h4>quick.req.post.json(req)</h4>

processes a post request with content-type application/json<br>
returns a promise which resolves to a javascript json value

<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/test',test);
      
      async function test(req,res){
      
            var json    = await <b>quick.req.post.json(req);</b>
            
            console.log(json);
            
      }//test
      
</pre>
<br>

<h4>quick.res.html(res,html,insert)</h4>

send a html response, html is the string to return and search and replace is performed ( see above ) using the insert
parameter
<br>
<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/',main);
      
      function main(req,res){
      
            var name    = 'emma';
            
            var html    = `
                  &lt;html>
                        &lt;head>
                        &lt;/head>
                        &lt;body>
                              &lt;h2>Hello World&lt;/h2>
                              &lt;h3>{{name}}&lt;/h3>
                        &lt;/body>
                  &lt;/html>
            `;
            
            <b>quick.res.html(res,html,{name});</b>
            
      }//main
      
</pre>
<br>


<h4>quick.res.json(res,json)</h4>

send a json response
<br>
<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/',main);
      
      function main(req,res){
      
            var json    = {hello:'world'};
            
            <b>quick.res.json(res,json);</b>
            
      }//main
      
</pre>
<br>

<h4>quick.res.file(res,file,insert)</h4>

send a file<br>
if the insert parameter is given the file is converted to text and search and replace performed ( see above )<br>

<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/',main);
      
      function main(req,res){
      
            <b>quick.res.file(res,'index.html');</b>
            
      }//main
      
</pre>
<br>

<h4>quick.resolve(dir,file)</h4>

a convenience function to test if the given file resolves into directory dir
  - returns the absolute filename if true
  - false on failure
  
<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/',main);
      
      async function main(req,res){
      
            var json    = await quick.req.post.json(req);
            
            var abs     = <b>quick.resolve('static/',json.file);</b>
            
            if(abs===false){
                  quick.error(req,res,'invalid filename');
                  return;
            }
            
            quick.res.file(res,abs);
            
      }//main
      
</pre>
<br>


<h4>quick.exists(dir,file)</h4>

a convenience function to test if a given file <code> file </code> exists in directory <code> dir </code>
return a promise that resolves into the absolute filename if true
or false on failure<br>

<pre>

      var quick   = require('https-quick').quickh();
      
      quick.url('/',main);
      
      async function main(req,res){
      
            var json    = await quick.req.post.json(req);
            
            var abs     = await <b>quick.exists('static/',json.file);</b>
            
            if(abs===false){
                  quick.error(req,res,'invalid filename');
                  return;
            }
            
            quick.res.file(res,abs);
            
      }//main
      
</pre>
<br>

<br>

  ---
  
  
example useage:
<br>

<pre>

    var server    = require('https-quick');
    
    server.on('request',request);
    server.on('error',console.error);
    server.listen(3002,()=>console.log('server listening'));
    
    function request(req,res){
    
          switch(req.url){
          
            case '/index.html'      : index(req,res);       break;
            
            default                 : notfound(req,res);
            
          }//switch
          
    }//request
    
    async function index(req,res){
    
          var html    = await require('fs').promises.readFile('./index.html');
          res.setHeader('content-type','text/html');
          res.end(html);
          
    }//index
    
    function notfound(req,res){
    
          res.statusCode    = 404;
          res.end();
          
    }//notfound
    
</pre>

<pre>

    require('https-quick').quick((req,res)=>{
    
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

      require('https-quick.js').quickh().dir('/','',['server.js']);
      
</pre>

see github examples directory for more woking examples











