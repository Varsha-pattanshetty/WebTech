const express=require('express')
const app=express();
app.get("/",(req,resp)=>{
    resp.send("hii");
});
app.get("/about",(req,resp)=>{
    resp.send(`
        <input type="text" placeholder="username"/>
        <button>clickme</button>`
    );
});
    app.get("/help",(req,resp)=>{
        resp.send("help");
    });
app.listen(8080);