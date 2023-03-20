
        var quick   = require('../../https-quick').quickh();
        
        quick.url.file('/multi','multi.html');
        quick.url('/chat',chat);
        quick.url('/join',join);
        
        var names     = [
              {name:'matt',col:'blue'},{name:'paul',col:'green'},
              {name:'emma',col:'darkorange'},{name:'kate',col:'purple'}
        ];
        var num       = 0;
        
        var msg       = [];
        var users     = [];
        users.rd      = name=>users.reduce((a,o)=>o.name===name?o.index:a,null);
        users.wt      = (name,index)=>users.reduce((a,o)=>o.name===name?o.index=index:a,false);
        users.find    = name=>users.reduce((acc,o)=>(o.name===name)?1:acc,0);
        
        
        
        async function join(req,res){
        
              var json          = await quick.req.post.json(req);
              var {name,col}    = json;
              
              if(users.find(name))return;
                                                                        console.log(name,'joined');
              users.push({name,col,index:0});
              quick.url('/'+name,rec);
              quick.ok(req,res);
              
              
              async function rec(req,res){
              
                    var json    = await quick.req.post.json(req);
                    switch(json.type){
                      case 'msg'      : msg.push({name,col,msg:json.msg});
                                        quick.ok(req,res);
                                        break;
                      case 'update'   : update(name,res);   break;
                    }
                    
              }//rec
              
        }//ready
        
        
        function update(name,res){
        
              var msg2    = [];
              var index   = users.rd(name);
              var n       = msg.length;
              for(var i=index;i<n;i++){
              
                    var o   = msg[i];
                    if(o.name!==name)msg2.push(o);
                    
              }//for
              users.wt(name,n);
              quick.res.json(res,msg2);
              
        }//update
        
        
        function chat(req,res){
        
              var info   = names[num++];
              quick.res.file(res,'chat.html',info);
              
        }//chat
        
        
        
        
        
        
        
        
        