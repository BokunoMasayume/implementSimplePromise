function MyPromise(callback){
    let successcb,errorcb;
    let svalue;
    let subPro = [];
    let subProErr = [];
    
    function setChild(v){
        if(v instanceof MyPromise){
            v.then(()=>{
                subPro.forEach(e=>{e(v)});
            });
            v.catch(()=>{
                subProErr.forEach(e=>{e(v)});
            });
        }
        else subPro.forEach(e=>{e(v)});
    }
    let setSvalue = (svalue, suc_or_err_cb  , successcb,errorcb)=>{
        if(svalue instanceof MyPromise){
            svalue.then((ss)=>{
                setSvalue(ss , successcb);
            });
            svalue.catch((ss)=>{
                setSvalue(ss , errorcb);

            });
            return;
        }

        let v = suc_or_err_cb(svalue);
        setChild(v)
    };
    let spawn = (function(){
        let status = "pending";
        
        return {
            getter:function(){return status},
            setter:function(str){
                if(status!="pending")return;
                if(str == "resolve"){
                    queueMicrotask(()=>{
                    	status = str;
                        
                    	if(successcb){
        					setSvalue(svalue, successcb , successcb,errorcb)  
                        }  
                    })
                }else if(str == "reject"){
                    queueMicrotask(()=>{
                    	status = str;
                    	
                    	if(errorcb){
                            setSvalue(svalue, errorcb , successcb,errorcb)  
                            
                        }  
                    })
                    
                }
                
            }
        }
    })();
    Object.defineProperty(this,"status",{
        configurable:true,
        enumerable:true,
        get:spawn.getter,
        set : spawn.setter
    });
    
    this.then = (successcallback)=>{
        if(this.status=="reject")return this;
        successcb = successcallback;
        if(this.status=="pending"){
            return new MyPromise((res,rej)=>{subPro.push(res);subProErr.push(rej)});
        }
        if(svalue instanceof MyPromise)return svalue.then(successcallback);
        let  t = successcb(svalue);
        return t instanceof MyPromise?t:new MyPromise((res)=>{ res(t )});
    
    }   
    
    this.catch = (errorcallback)=>{
        if(this.status=="resolve")return this;
        errorcb = errorcallback;
        if(this.status=="pending")
            return new MyPromise((res,rej)=>{subPro.push(res);subProErr.push(rej)});
         if(svalue instanceof MyPromise)return svalue.then(errorcallback);
        let t = errorcallback(svalue);
        return t instanceof MyPromise?t:new MyPromise((res)=>{ res(t )});
          
    }
    resolve= (obj)=>{
        if(this.status!="pending")return;
        svalue = obj;
        
        this.status = "resolve";
    }
    reject = (obj)=>{
        if(this.status!="pending")return;
        svalue = obj;
        
        this.status= "reject";
    }
    
    callback(resolve, reject);
}

