var http=require('http');
http.createServer(function(req, res){
    res.writeHead(200,{'ContentType':'text/html'});
    res.write("hello world!!");
    res.end("<h1>Good Morning<h1></body>")
}).listen(8080);