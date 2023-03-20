

    var quick    = require('../../https-quick').quick_();
    
    quick.url('/progress',progress);
    
    
    function progress(req,res){
    
          var url   = quick.url.gen(update);
          
          quick.res.html(res,html,{url});
          
          
          var ct      = 0;
          var num     = 200;
          var abort   = false;
          var time    = 250;
          fn();
          
          function fn(){
          
                ct++;
                if(abort)return;
                setTimeout(fn,time);
                
          }//fn
          
          async function update(req,res){
          
              var json    = await quick.req.post.json(req);
              switch(json.type){
                case 'abort'    : abort   = true;
                                  quick.ok(req,res);
                                  break;
                default         : quick.res.json(res,{type:'progress',ct,num});
              }
              
          }//update
          
    }//progress
    
    
    
    var html   = `
<html>
  <head>
    <style>
      body {
        text-align        : center;
        margin            : 50px;
        font-size         : 18px;
        font-family       : arial;
      }
      h2 {
      }
      #track {
        border            : 1px solid lightgray;
        height            : 20px;
        width             : 70%;
        margin            : 60px auto;
      }
      #bar {
        background        : aquamarine;
        width             : 0;
        height            : 100%;
      }
      #abortbtn {
        font-size         : 18px;
        padding           : 5px 10px;
        cursor            : pointer;
        margin-bottom     : 25px;
      }
    </style>
  </head>
  <body>
    <h2>progress</h2>
    <div id=track>
          <div id=bar></div>
    </div>
    <div>
          <input id=abortbtn value=abort type=button>
    </div>
    <script>
          console.clear();
          
          var url       = '{{url}}';
          var status    = 'progress';
          log('progressing ...');
          
          abortbtn.onclick=e=>{
          
                if(status!=='progress')return;
                post(url,{type:'abort'})
                status='abort';
                log('aborting ...');
                
          };
          update();
          
          async function update(){
          
                var json          = await post(url);
                
                switch(json.type){
                
                  case 'progress'   :
                  
                      var {ct,num}      = json;
                                                                            console.log('progress',ct,'/',num);
                      var v             = Math.ceil(ct/num*100)+'%';
                      bar.style.width   = v;
                      
                      if(ct===num){
                            status='done';
                            log('done.');
                            return;
                      }
                      if(status==='abort'){
                            log('aborted');
                            return;
                      }
                      
                      setTimeout(update,500);
                      break;
                      
                }//switch
                
          }//update
          
          async function post(url,data={}){
          
                var response = await fetch(url,{
                      method    : 'post',
                      headers   : {'content-type':'application/json'},
                      body      : JSON.stringify(data),
                });
                
                var type    = response.headers.get('content-type');
                switch(type){
                  case 'application/json'   : var json    = await response.json();
                                              return json;
                }
                return response;
                
          }//post
          
          function log(str){
          
                var div   = document.createElement('div');
                div.textContent   = str;
                document.body.append(div);
                
          }//log
          
    </script>
  </body>
</html>
`;





