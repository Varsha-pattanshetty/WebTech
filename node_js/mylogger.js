const express=require('express')
const app=express()
const myLogger=function(req,res,next)
{
    console.log('LOGGED')
    next()
}
app.use(myLogger)
app.get('/',(req,res)=>{
    res.send('hello world!')
})
app.listen(3000)