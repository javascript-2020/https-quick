

        var def   = {
              port    : 3002,
              host    : ''
        };
        
        var https,fsp,path,dns,os;
        var key,cert,cacert;
        setup();
        
        var server        = createserver();
        createapi(server);
        module.exports    = server;
        
        
  //:
  
  
        function createserver(){
        
              var server              = https.createServer({key,cert});
              return server;
              
        }//create
        
        function createapi(server){
        
              var uquickh             = function(port,onrequest){return quickh.apply(null,arguments)};
              var uquick_             = function(port,onrequest){return quick_.apply(null,arguments)};
              var uquick              = function(port,onrequest){return quick.apply(null,arguments)};
              
              uquick.ok               = function(req,res,msg){return quick.ok.apply(null,arguments)};
              uquick.error            = function(req,res,msg){return quick.error.apply(null,arguments)};
              uquick.notfound         = function(req,res,msg){return quick.notfound.apply(null,arguments)};
              
              uquick.url              = function(url,callback){return quick.url.apply(null,arguments)};
              uquick.url.file         = function(url,file){return quick.url.file.apply(null,arguments)};
              uquick.url.gen          = function(callback){return quick.url.gen.apply(null,arguments)};
              uquick.url.rem          = function(url,callback){return quick.url.rem.apply(null,arguments)};
              
              uquick.dir              = function(baseurl,dir,exc){return quick.dir.apply(null,arguments)};
              
              uquick.req              = {};
              uquick.req.post         = {};
              uquick.req.post.json    = function(req){return quick.req.post.json.apply(null,arguments)};
              
              uquick.res              = {};
              uquick.res.html         = function(res,html,ins){return quick.res.html.apply(null,arguments)};
              uquick.res.json         = function(res,json){return quick.res.json.apply(null,arguments)};
              uquick.res.file         = function(res,file,ins){return quick.res.file.apply(null,arguments)};
              
              uquick.resolve          = function(dir,file){return resolve(dir,file)};
              uquick.exists           = function(dir,file){return exists(dir,file)};
              
              
              server.quick            = uquick;
              server.quick_           = uquick_;
              server.quickh           = uquickh;
              
        }//createapi
        
        
  //:
  
  
        var params;
        
        var on      = {};
        var img     = {};
        var html    = {};
        
        var keys    = keysmod();
        
        
        function quickh(){
        
              var args    = Array.prototype.slice.call(arguments);
              args.push('hello');
              quick.apply(null,args);
              return quick;
        }
        
        function quick_(){
        
              quick.apply(null,arguments);
              return quick;
              
        };
        
        function quick(port,onrequest){
        
              if(server.quick)return server;
              
              console.clear();
              
              var {port,host,onrequest,nokeys}   = getparams(arguments);
              
              server.on('request',on.request);
              server.on('listening',on.listening);
              server.on('error',on.error);
              
              if(host){
                    server.listen(port,host);
              }else{
                    server.listen(port);
              }
              
              if(!nokeys)keys.add();
              
              return server;
              
        }//quick
        
  //:
  
        quick.ok=function(req,res,msg='ok'){
        
              res.statusCode    = 200;
              res.setHeader('content-type','text/plain');
              res.end(msg);
              
        }//ok
        
        quick.error=function(req,res,msg='error'){
        
              res.statusCode    = 400;
              res.setHeader('content-type','text/plain');
              res.end(msg);
              
        }//error
        
        quick.notfound=function(req,res,msg='not found on this server'){
        
              var html2   = html.notfound;
              html2       = html2.replace('{{url}}',req.url);
              html2       = html2.replace('{{msg}}',msg);
              res.setHeader('content-type','text/html');
              res.end(html2);
              
        }//notfound
        
        
  //:
  
  
        var list    = [];
        list.find=function(url,type){
        
              var n   = list.length;
              for(var i=0;i<n;i++){
              
                    var o   = list[i];
                    if(o.url===url){
                          switch(type){
                            case 'remove'   : list.splice(i,1);       return;
                            default         : return o.callback;
                          }
                    }
                    
              }//for
              
        }//find
        
        quick.url=function(url,callback){
        
              list.find(url,'remove');
              list.push({url,callback});
              
        }//url
        
        quick.url.file=function(url,file,ins){
        
              list.find(url,'remove');
              list.push({url,callback:{file,ins}});
              
        }//file
        
        quick.url.gen=function(callback){
        
              var url   = '/';
              var n     = 10;
              
              for(var i=0;i<n;i++){
              
                    var c;
                    var index   = Math.floor(Math.random()*62);
                    
                    if(index<26){
                          c   = String.fromCharCode(index+97);
                    }
                    if((index>=26)&&(index<52)){
                          c   = String.fromCharCode((index-26)+65);
                    }
                    if(index>=52){
                          c   = String.fromCharCode((index-52)+48);
                    }
                    url  += c;
                    
              }//for
              
              quick.url(url,callback);
              return url;
              
        }//gen
        
        quick.url.rem=function(url){
        
              var n   = list.length;
              for(var i=n-1;i>=0;i--){
              
                    var o   = list[i];
                    if(o.url===url){
                          list.splice(i,1);
                          return;
                    }
                    
              }//for
              
        }//rem
        
        
        var dir   = [];
        
        quick.dir=function(baseurl,dir2,exc=[]){
        
              dir.push({baseurl,dir:dir2,exc});
              
        }//dir
        
        
  //:
  
  
        quick.req={};
        quick.req.post={};
        quick.req.post.json=async function(req){
        
              var body    = '';
              for await(chunk of req)body+=chunk;
              var post    = JSON.parse(body);
              return post;
              
        }//post
        
        quick.res={};
        quick.res.html=function(res,html,ins={}){
        
              for(var key in ins){
                    html    = html.replaceAll('{{'+key+'}}',ins[key]);
              }//for
              
              res.setHeader('content-type','text/html');
              res.end(html);
              
        }//send
        
        quick.res.json=function(res,json){
        
              res.setHeader('content-type','application/json');
              res.end(JSON.stringify(json));
              
        }//res
        
        quick.res.file=async function(res,file,ins){
        
              var ext   = path.extname(file);
              
              switch(ext){
              
                case 'html'   : res.setHeader('content-type','text/html');    break;
                
              }//switch
              
              if(ins){
                    var txt   = await fsp.readFile(file,'utf8');
                    for(var key in ins){
                          txt   = txt.replaceAll('{{'+key+'}}',ins[key]);
                    }
                    res.end(txt);
                    return;
              }
              
              var buf   = await fsp.readFile(file);
              res.end(buf);
              
        }//file
        
        
        
        
  //:
  
  
        on.request=async function(req,res){
        
              if(params.hello){
                                                                    //console.log(req.url);
                    res.setHeader('cache-control','no-store');
                    
                    if(req.method==='OPTIONS'){
                          cors(res);
                          return;
                    }
                    if(req.url==='/hello'){
                          on.request.hello(req,res);
                          return;
                    }
                    if(req.url==='/favicon.ico'){
                          on.request.favicon(req,res);
                          return;
                    }
                    if(req.url==='/cacert'){
                          on.request.cacert(req,res);
                          return;
                    }
                    
              }
              
              var n   = list.length;
              for(var i=0;i<n;i++){
              
                    var o   = list[i];
                    if(o.url===req.url){
                          switch(datatype(o.callback)){
                            case 'string'           : quick.res.html(res,o.callback);           break;
                            case 'function'         : o.callback(req,res);                      break;
                            case 'asyncfunction'    : o.callback(req,res);                      break;
                            case 'promise'          : o.callback.then({req,res});               break;
                            case 'object'           :
                                o   = o.callback;
                                if('file' in o){
                                      quick.res.file(res,o.file,o.ins);
                                }
                                if('string' in o){
                                      quick.res.html(res,o.string,o.ins);
                                }
                                break;
                            default : quick.notfound(req,res);
                          }
                          return;
                    }
                    
              }//for
              
              
                                                                    //console.log('req',req.url);
              var n   = dir.length;
              for(var i=0;i<n;i++){
              
                    var o   = dir[i];
                                                                    //console.log('base',o.baseurl);
                    if(req.url.startsWith(o.baseurl)){
                          var file    = req.url.slice(o.baseurl.length);
                          if(file[0]==='/')file=file.slice(1);
                                                                    //console.log('file',file);
                                                                    
                          if(o.exc.indexOf(file)==-1){
                                var abs     = await exists(o.dir,file);
                                                                    //console.log('abs',abs);
                                if(abs!==false){
                                      quick.res.file(res,abs);
                                      return;
                                }
                          }
                    }
                    
              }//for
              
              
              if(params.onrequest){
                    if(typeof params.onrequest==='function'){
                          params.onrequest(req,res);
                          return;
                    }
              }
              
              
              quick.notfound(req,res);
              
        }//request
        
        on.request.hello=function(req,res){
        
              res.setHeader('content-type','text/html');
              res.end(html.itworks);
              
        }//hello
        
        on.request.favicon=function(req,res){
        
              res.setHeader('content-type','image/png');
              var i     = img.favicon.indexOf('base64,');
              var buf   = Buffer.from(img.favicon.slice(i+7),'base64');
              res.end(buf);
              
        }//favicon
        
        on.request.cacert=function(req,res){
        
              res.setHeader('Content-Description','File Transfer');
              res.setHeader('Content-Type','application/octet-stream');
              res.setHeader('Content-Disposition','attachment; filename=cacert.cert.pem');
              res.end(cacert.trim());
              
        }//cacert
        
        
  //:
  
  
        on.error=function(err){
        
              console.error(err);
              
        }//error
        
        on.listening=function(){
        
              console.log();
              console.log();
              
              var {host,port}   = params;
              if(host){
                    console.log('   https server listening,',host,'port',port);
                    console.log();
                    console.log('   https://'+host+':'+port+'/');
                    console.log();
                    return;
              }
              
              console.log('   https server listening - all interfaces, port '+port);
              console.log();
              
              dns.lookup(os.hostname(),{family:4},disp);
              
              function disp(ip){
              
                    var nics    = os.networkInterfaces();
                    var i       = 1;
                    var addr    = [];
                    for(var key in nics){
                    
                          nics[key].forEach(o=>{
                          
                                if(o.family==='IPv4'){
                                      addr.push(o.address);
                                }
                                
                          });
                          
                    }//for
                    
                    if(ip){
                          console.log('   local ip : '+ip);
                          console.log();
                    }
                    
                    addr.forEach(addr=>console.log('      https://'+addr+':'+port+'/'));
                    console.log('      https://localhost:'+port+'/');
                    if(ip){
                          console.log('   https://'+ip+':'+port+'/');
                    }
                    console.log();
                    
              }//disp
              
        }//listening
        
        
  //:
  
  
        function resolve(dir,file){
        
              var p1    = path.resolve(dir);
              var n     = p1.length;
              var p2    = path.resolve(dir,file);
              var s     = p2.substring(0,n);
              if(s!==p1){
                    return false;
              }
              return p2;
              
        }//resolve
        
        async function exists(dir,file){
        
              var abs   = resolve(dir,file);
              if(abs===false){
                    return false;
              }
              
              try{
                    var stat    = await fsp.stat(abs);
              }
              catch(err){
                    var result    = false;
              }
              if(result===false){
                    return false;
              }
              
              return abs;
              
        }//exists
        
        function cors(res){
                                                    console.log('cors');
              var headers   = {
                    'Access-Control-Allow-Origin'     : '*',
                    'Access-Control-Allow-Methods'    : 'OPTIONS, POST, GET',
                    'Access-Control-Max-Age'          : 2592000,                            // 30 days
              };
              res.writeHead(204,headers);
              res.end();
              
        }//cors
        
        function getparams(args){
        
              var port;
              var host;
              var onrequest;
              var request;
              var hello     = false;
              var nokeys    = false;
              
              var arg0    = args[0];
              if(datatype(arg0)==='object'){
                    ({port,host,onrequest,request}=arg0);
              }else{
                    var ct    = {number:0,string:0,function:0};
                    var n     = args.length;
                    for(var i=0;i<n;i++){
                    
                          var arg     = args[i];
                          process(arg);
                          
                    }//for
              }
              
              
              port        = port||def.port++;
              host        = host||def.host;
              onrequest   = onrequest||request;
              
              params      = {port,host,onrequest,hello,nokeys};
              return params;
              
              
              function process(arg){
              
                    var type    = datatype(arg);
                    switch(type){
                    
                      case 'number'     :
                      
                            switch(++ct.number){
                              case 1    : port    = arg;          break;
                            }
                            break;
                            
                      case 'string'     :
                      
                            if(arg==='hello'){
                                  hello   = true;
                                  return;
                            }
                            if(arg==='no-keys'){
                                  nokeys    = true;
                            }
                            switch(++ct.string){
                              case 1    : host    = arg;          break;
                            }
                            break;
                            
                      case 'function'   :
                      
                            switch(++ct.function){
                              case 1    : onrequest   = arg;      break;
                            }
                            break;
                            
                    }//switch
                    
              }//process
              
        }//getparams
        
        function datatype(value){
        
              var str     = Object.prototype.toString.call(value);
              var i       = str.indexOf(' ');
              var type    = str.slice(i+1,-1);
              type        = type.toLowerCase();
              return type;
              
        }//datatype
        
        
        function reload(){
        
              //rem();
              console.clear();
              console.log('reload - not implemented');
              
        }//reload
        
        
        
        function keysmod(){
        
          var obj   = {};
          
                var ctrlc   = '\u0003';
                var esc     = String.fromCharCode(27);
                
                obj.add=function(){   //d
                
                      if(!process.stdin.isTTY){
                            return;
                      }
                      
                      process.stdout.setEncoding('utf8');
                      
                      process.stdin.setRawMode(true);
                      process.stdin.resume();
                      process.stdin.setEncoding('utf8');
                      process.stdin.on('data',keypressed);
                      
                }//add
                
                
                function keypressed(key){
                
                      if(key==='r'){
                            reload();
                      }
                      
                      if(
                            (key===ctrlc)   ||
                            (key==='q')     ||
                            (key===esc)
                      ){
                            process.exit();
                      }
                      
                      if(key===' '){
                            console.clear();
                            console.log('---   clear   ---');
                      }
                      
                      if(key==='-'){
                            console.log('---   ...    ---');
                      }
                      
                }//keypressed
                
                
                obj.rem=function(){return rem()}    //d
                
                function rem(){
                
                      process.stdin.off('data',keypressed);
                      
                }//rem
                
                
          return obj;
          
        }//keysmod
        
        
        function setup(){
        
              https   = require('https');
              fsp     = require('fs').promises;
              path    = require('path');
              dns     = require('dns');
              os      = require('os');
              
              key     =
`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAp1/aEck7k7OGlQe373+zEYiznlk0ORrg0UeyDGsULaGyIpG+
DW/1m6hga/y5LCObKNYhU2O2CYLOunzEXgFEhLq73zQ1rWNKdF/dE1P97lAeNmJ7
qapVHgmvqRR+M5JxGHHAr3cRS06WW2H4jJD4HWVuYhuww6igP6WhVWYoPn6sgDcW
E+HLI1DVwTxkA9J/poPSSdT/VEgvH2aOwA0h1KVa9l6DrC3E/tPo8D8NPyeViSRb
/HjyI3gXr74jQvq8+4fTcftNAtyhUXUhXvlryBGKZmARB1gXAiNCuXYK08I8PmhR
PwqVq15YYto9E4QYkfCZoJaNrztbFCfDl8yiVQIDAQABAoIBABhTaQlOuvbzj6rX
TVdksuzodlqcUme+TVB9YBZH9c3QA2jcz8d6LzMpXKI1P+B3aFSeEofhJRLqzQrz
mUKkYoX78dQ17Vs+5BJX4HSvr2dUg5+Z3qlBFU/hToN/c/wg24kW909JOd09FcNA
UPR1GWqEVG+z4JP/TRMTCoiz6UNzv4CRyWCF+iMkMQuWYXS3j+fd586eDElJGJEV
XujujNrAM/Qpj/ddLBy0vpHmiNNBJKJTWLVaCrk5zozss2uTxi3BWkwQ9w3lZyRp
ferWo0CNIDXwvA4ZX2ykKo9dKXwT1E3d/qo2LE8QGpzC5Gs50ZUUlnCGtp2qavd1
NR6WLmECgYEA1fTYqvC+BzX2/xaqAwZqfjBxvto29TjE8syrpB3S3vaS6lz/cw99
sb9l5b/KYAIsUVV3HbDIGCkHiCfochFD9ORLkuwSgijXrgEIKNyZHtL3pCq//hFq
H2k5hCmnXt3YhWF3ue3zSHyiDv/ps5n6YhI6HJyzD4XOM3z67EPnHA0CgYEAyEOu
Wd/G/w11rX9J+NcbSHUwUibrgCQFsuXohsCBVCr9zngqMfDqW5pbdc0CZ5RinC7y
bENI/4SLY7qZE3l/C8de3iSwgmw+K3blXoYtgFcp83s3hiiNvBeRGY1C8bL0bYZc
s5XfaTVjymXh6UlsIHnnJeDInMOd5FJW4zZ1ZWkCgYEAuGbCpvG+ljBopQo/lUPe
XMwb/MXOQCOhezHzbQtXR1t03BEzCVP8nUm85PsbzQuSbrceZrSKgGg8WZkrucQv
sc1hZUuZ2ByjZxD0m2MlhW+GiDNgLfWMZW4naEUOP7EsgCi1K8Ztu7fPZOYj4et/
5S6YbziPC33jbnT1PtR3R7ECgYBN2SF5hmfQ1eac3xJeTSAp9oQmK0L4uQgOFxlg
6Ixdr6iiDkw4xbIUkdhj3qHEqgX7OLS8KRvDWD7nMa43x87/QS07pX+H85PnSXy4
VehyL2/7WjanTDRsnaymBiez1SD3Qnfex6/lMf/sudYr3YLOzRRxwQO7DL/f9bIY
+R6BoQKBgFJN52moK6gfRCuTfqhihMy0O9CJCYIQm8tSMCrLD53DtoiMTuP1LDFu
5r3/rrCl5dRcb33nWz76hggtxpJo4H5DqLjoZlbajWxee5fSwqiBgWN2WNfFeui4
2DLyPhNkj/odVDub9Jxc8RoKK+D89b4/2jM955IiExkWb8MItV0E
-----END RSA PRIVATE KEY-----`;

              cert    =
`Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 4096 (0x1000)
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=tst-root-ca
        Validity
            Not Before: Aug 14 09:30:07 2022 GMT
            Not After : Dec 30 09:30:07 2049 GMT
        Subject: CN=tst-server
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:a7:5f:da:11:c9:3b:93:b3:86:95:07:b7:ef:7f:
                    b3:11:88:b3:9e:59:34:39:1a:e0:d1:47:b2:0c:6b:
                    14:2d:a1:b2:22:91:be:0d:6f:f5:9b:a8:60:6b:fc:
                    b9:2c:23:9b:28:d6:21:53:63:b6:09:82:ce:ba:7c:
                    c4:5e:01:44:84:ba:bb:df:34:35:ad:63:4a:74:5f:
                    dd:13:53:fd:ee:50:1e:36:62:7b:a9:aa:55:1e:09:
                    af:a9:14:7e:33:92:71:18:71:c0:af:77:11:4b:4e:
                    96:5b:61:f8:8c:90:f8:1d:65:6e:62:1b:b0:c3:a8:
                    a0:3f:a5:a1:55:66:28:3e:7e:ac:80:37:16:13:e1:
                    cb:23:50:d5:c1:3c:64:03:d2:7f:a6:83:d2:49:d4:
                    ff:54:48:2f:1f:66:8e:c0:0d:21:d4:a5:5a:f6:5e:
                    83:ac:2d:c4:fe:d3:e8:f0:3f:0d:3f:27:95:89:24:
                    5b:fc:78:f2:23:78:17:af:be:23:42:fa:bc:fb:87:
                    d3:71:fb:4d:02:dc:a1:51:75:21:5e:f9:6b:c8:11:
                    8a:66:60:11:07:58:17:02:23:42:b9:76:0a:d3:c2:
                    3c:3e:68:51:3f:0a:95:ab:5e:58:62:da:3d:13:84:
                    18:91:f0:99:a0:96:8d:af:3b:5b:14:27:c3:97:cc:
                    a2:55
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints: critical
                CA:FALSE
            X509v3 Key Usage: critical
                Digital Signature, Non Repudiation, Key Encipherment, Key Agreement
            X509v3 Extended Key Usage: critical
                TLS Web Server Authentication
            X509v3 Subject Key Identifier:
                3E:94:90:A9:2D:D7:71:A3:19:79:81:19:08:EE:CB:4A:AB:16:20:07
            X509v3 Authority Key Identifier:
                keyid:4B:0D:7A:26:6B:7A:A1:9E:EB:98:19:27:77:42:D0:BB:D0:A1:57:16
                DirName:/CN=tst-root-ca
                serial:EA:41:A9:B3:0F:FF:81:95
                
            X509v3 Subject Alternative Name:
                DNS:localhost, IP Address:127.0.0.1, IP Address:127.0.0.2, DNS:tst-server
    Signature Algorithm: sha256WithRSAEncryption
         93:ea:dc:4a:9c:3d:cb:df:bf:8a:9b:b9:22:40:21:c0:b1:77:
         20:31:d9:fc:ae:b1:41:bf:ca:58:52:aa:be:55:37:d4:f1:f4:
         4e:7b:2d:38:47:7c:63:2a:9f:36:d0:73:9c:7e:10:3b:8d:81:
         21:7e:10:d1:99:c0:4c:15:b4:79:66:4f:94:41:7f:15:72:3e:
         19:52:04:59:14:1d:a7:e2:04:36:60:7a:cc:ee:82:2a:46:82:
         7f:cc:90:ba:b0:d2:a4:eb:93:0b:0c:f6:ab:82:d0:90:36:3c:
         6c:04:74:6d:43:e9:ed:a6:3b:dd:e9:34:b7:a4:65:11:95:ba:
         ca:ef:67:7a:16:89:39:49:a8:9c:64:44:14:ba:26:8f:a6:37:
         e1:37:f4:0d:36:f8:39:cc:4e:a9:49:f6:21:33:e3:f5:b1:12:
         de:7e:66:eb:09:7c:41:b7:09:4c:d5:6a:04:65:29:13:07:d3:
         bb:13:4e:56:b2:28:f2:ba:c6:a7:ac:ba:92:68:06:40:49:dd:
         4a:43:85:f5:6b:87:85:7a:cf:3f:38:78:85:58:e7:80:fd:72:
         d0:0c:f8:92:f2:16:1f:33:32:ed:44:ca:3c:f3:94:be:a2:b4:
         a0:92:7a:2d:a5:59:5a:1d:be:f3:be:06:69:04:a8:ba:a9:19:
         7a:eb:8b:9b
-----BEGIN CERTIFICATE-----
MIIDdjCCAl6gAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwFjEUMBIGA1UEAwwLdHN0
LXJvb3QtY2EwHhcNMjIwODE0MDkzMDA3WhcNNDkxMjMwMDkzMDA3WjAVMRMwEQYD
VQQDDAp0c3Qtc2VydmVyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
p1/aEck7k7OGlQe373+zEYiznlk0ORrg0UeyDGsULaGyIpG+DW/1m6hga/y5LCOb
KNYhU2O2CYLOunzEXgFEhLq73zQ1rWNKdF/dE1P97lAeNmJ7qapVHgmvqRR+M5Jx
GHHAr3cRS06WW2H4jJD4HWVuYhuww6igP6WhVWYoPn6sgDcWE+HLI1DVwTxkA9J/
poPSSdT/VEgvH2aOwA0h1KVa9l6DrC3E/tPo8D8NPyeViSRb/HjyI3gXr74jQvq8
+4fTcftNAtyhUXUhXvlryBGKZmARB1gXAiNCuXYK08I8PmhRPwqVq15YYto9E4QY
kfCZoJaNrztbFCfDl8yiVQIDAQABo4HOMIHLMAwGA1UdEwEB/wQCMAAwDgYDVR0P
AQH/BAQDAgPoMBYGA1UdJQEB/wQMMAoGCCsGAQUFBwMBMB0GA1UdDgQWBBQ+lJCp
Lddxoxl5gRkI7stKqxYgBzBGBgNVHSMEPzA9gBRLDXoma3qhnuuYGSd3QtC70KFX
FqEapBgwFjEUMBIGA1UEAwwLdHN0LXJvb3QtY2GCCQDqQamzD/+BlTAsBgNVHREE
JTAjgglsb2NhbGhvc3SHBH8AAAGHBH8AAAKCCnRzdC1zZXJ2ZXIwDQYJKoZIhvcN
AQELBQADggEBAJPq3EqcPcvfv4qbuSJAIcCxdyAx2fyusUG/ylhSqr5VN9Tx9E57
LThHfGMqnzbQc5x+EDuNgSF+ENGZwEwVtHlmT5RBfxVyPhlSBFkUHafiBDZgeszu
gipGgn/MkLqw0qTrkwsM9quC0JA2PGwEdG1D6e2mO93pNLekZRGVusrvZ3oWiTlJ
qJxkRBS6Jo+mN+E39A02+DnMTqlJ9iEz4/WxEt5+ZusJfEG3CUzVagRlKRMH07sT
TlayKPK6xqesupJoBkBJ3UpDhfVrh4V6zz84eIVY54D9ctAM+JLyFh8zMu1Eyjzz
lL6itKCSei2lWVodvvO+BmkEqLqpGXrri5s=
-----END CERTIFICATE-----`;


              cacert    =
`-----BEGIN CERTIFICATE-----
MIIDOzCCAiOgAwIBAgIJAOpBqbMP/4GVMA0GCSqGSIb3DQEBCwUAMBYxFDASBgNV
BAMMC3RzdC1yb290LWNhMB4XDTIyMDgxNDA5MjgwNFoXDTQ5MTIzMDA5MjgwNFow
FjEUMBIGA1UEAwwLdHN0LXJvb3QtY2EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
ggEKAoIBAQCfdZdpipCK7gVxhhC4CvInK0n6Gf4MAJdkp3bqXXuMSIJsGrF9qbpY
FYAdpptr7X+EwkQ80nQcudXMsbou0Yg/iUG0FYp0iy8F4Fo6JTTLQAJ2l3OWrDsJ
Tp8w3HrKjPjzQUHc+NCv2RBIur+ViiF5Ur3qAvVygY3yyZWPzAHsZ+IckXtxvKZr
046zTekLJaXPA/iR5funJEJelDGOMbR4gGc3LOJp4BtRFuUX0dUdjPYzVvdhz4JA
H1+8bvY0qJCMlYFgRcPi6z47yU4ZgY0HTBtY0PqMX5HTskcvmavckPWFNigqS7zr
CikE8gbiC0E+u5mVk1j6k4hrvnEE1JGdAgMBAAGjgYswgYgwDwYDVR0TAQH/BAUw
AwEB/zAOBgNVHQ8BAf8EBAMCAYYwHQYDVR0OBBYEFEsNeiZreqGe65gZJ3dC0LvQ
oVcWMEYGA1UdIwQ/MD2AFEsNeiZreqGe65gZJ3dC0LvQoVcWoRqkGDAWMRQwEgYD
VQQDDAt0c3Qtcm9vdC1jYYIJAOpBqbMP/4GVMA0GCSqGSIb3DQEBCwUAA4IBAQCD
GB8xbbozjvEij6DESLKougYHjG33lT79tegixXnh+fFwr374VTx+nEcmz8ha0cFA
z0lig/8aOJm2vlB+iGY9/chztd91QL4/xiTIi4dYZFbQXXpsSwaIaEEDJ496p+Kx
nlh4AgczG7Yxs1MPm7QiYdLpRD128x8B4gkOwe54D9yUch/PHkb5jkII7a1ctb9q
ZzrfWtPiYt7x/DT1ljIYo2m4lLdns5CHkqHlDRjyaiV4kgi7EVlpIKvjZaNNpN1a
0aKw0m5zG50jX44AtKttW/EybFj0KR9hHeaGvB9MFIz2ZiPM9OGek6NPrLr7tSjJ
KcW4i/Y+AMJCHEjy+Mj/
-----END CERTIFICATE-----`;

        }//setup
        
        
        
// ------------ images -----------

img.favicon=
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAALxJREFUOE9jZE'+
'ADaVX9Dehi+Piz2gpR1DOiK16y6eB/W0tDosw8fPw8Q4yfPYoZOA0EKcYHQJaSZOCqTQcYVFWUsJp5+849hjA/B8oN1JAXY3jz8S'+
'vD8TOXSTdwxoJ1DEJCQlhd+O7dO4aMhCDKXQgzfdTLxKVDbMlmcMUyMXmPpJwCM/D/fwaGk9degrnmWuIMjEghRpaBJ66+ZLj6ig'+
'NsoLbYDwYLbXG44weHgVT3Mr7IIcvLFBtIaRUAAKWC3hWePif+AAAAAElFTkSuQmCC'
;




// ----------- html -----------


html.hello=`
<meta name=viewport content='width=device-width, initial-scale=1' />
<style>
      body {
        font-family   : arial, sans-serif;
        margin-top    : 50px;
        text-align    : center;
      }
      h1 {
        color         : green;
      }
      h2 {
        color         : blue;
      }
</style>
<h1>hello</h1>
<h2></h2>
<script>
      document.querySelector('h2').textContent=window.location;
</script>
`;

html.notfound=`
<meta name=viewport content='width=device-width, initial-scale=1' />
<style>
      .root {
        text-align:center;
      }
      .card {
        display:inline-block;
        margin: 8% auto;
        font-family: "Arial", sans-serif;
        font-size:18px;
        padding: 20px 45px 45px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
        color:dimgray;
        cursor: pointer;
      }
      
      .hdr {
        text-align:left;
      }
      .code {
        font-size:32px;
        color:green;
        margin-right:10px;
      }
      
      .notfound {
        font-size:16px;
        margin-bottom:20px;
      }
      
      .url {
        margin: 25px 0;
        font-weight:bold;
        color:blue;
      }
      
      .msg {
        margin: 25px 0;
        color:blue;
      }
      
      .btns {
        display:flex;
        gap:10px;
        margin-top: 50px;
      }
      
      button {
        outline: 0;
        background: #4CAF50;
        width:50%;
        border: 0;
        padding: 8px;
        color: white;
        font-size: 16px;
        cursor: pointer;
      }
      
      button:hover {
        background: #43A047;
      }
</style>

<div class=root>
  <div class=card>
    <div class=hdr>
      <span class=code>404</span>
      <span class=notfound>not found</span>
    </div>
    <div class=url>{{url}}</div>
    <div class=msg>{{msg}}</div>
    <div class=btns>
      <button class=back>BACK</button>
      <button class=reload>RELOAD</button>
      <button class=home>HOME</button>
    </div>
  </div>
</div>

<script>
      (function(){
      
            var $=v=>document.querySelector(v);
            $('.root').onclick=e=>{};
            $('.back').onclick=e=>history.back();
            $('.reload').onclick=e=>location.reload();
            $('.home').onclick=e=>location.href='/';
            
      })();
</script>
`;

