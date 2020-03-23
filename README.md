try in browser:
```js
a =new MyPromise((res)=>{
    res(21)
}).then((n)=>{
    console.log(n);
    return new MyPromise((res1,rej1)=>{
        setTimeout(()=>{rej1("wwwww")},2000)
    })
}).catch((n)=>{
        console.log(n);return new MyPromise((res)=>{setTimeout(()=>{res("sss")},2000)})
    }).then((n)=>{console.log(n)});
 b=new MyPromise((res)=>{res(55)}).then((n)=>{console.log(n);return 77}).then((n)=>{console.log(n)});
 ```
output:
>21 \
55\
77\
wwwww\
sss