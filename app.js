var http = require('http');
const pathtosettings = "settings.json"
var url = require ('url');
var fs = require('fs');
var child_process = require('child_process');
var hostname = '127.0.0.1';
var port = 3001;

var server = http.createServer(function (req, res) {
	var reqparsed=url.parse(req.url,true);
	if (req.method=='GET')
	{
		console.log("GET request for "+reqparsed.pathname);
		var filename="./"+reqparsed.pathname;
		fs.readFile(filename,function(err,data){
			if (err) {
				res.writeHead(404, {'Content-Type': 'text/html'});
				return res.end("404 Not Found");
			}  
			if (/\.(html)$/.test(filename))
			{
				res.writeHead(200, {'Content-Type': 'text/html'});
			}
			if (/\.(css)$/.test(filename))
			{
				res.writeHead(200, {'Content-Type': 'text/css'});
			}
			if (/\.(js)$/.test(filename))
			{
				res.writeHead(200, {'Content-Type': 'text/javascript'});
			}
			res.write(data);
			res.end();
		});
	}	
	if (req.method=='POST')
	{
		console.log("New Post request");
		var body = '';
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			AnalyzePostRequest(body);
		});
	}	
});

server.listen(port, hostname, () => {
	 console.log(`Server running at http://${hostname}:${port}/`);
});

function AnalyzePostRequest(body) {
	var myobj=JSON.parse(body);
	
}
