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
	UpdateSettingsFileWithJSONObject(myobj)
}
function ReplaceParameter(newset,oldset)
{
	for(var key in newset)
	{
		oldset[key]=newset[key];
	}
}
function ParseAndModify(jsonobject,settingsobject)
{
	console.log(jsonobject);
	for (var key in jsonobject)
	{
		if(jsonobject.hasOwnProperty(key) && settingsobject.hasOwnProperty(key) && key != 'parameters' )
		{
			ParseAndModify(jsonobject[key],settingsobject[key]);			
		}
		else{
			console.log(jsonobject[key]);
			if (Array.isArray(jsonobject[key])){
				try{
					for (var p=0; p<jsonobject[key].length; p++)
					{
						var name=jsonobject[key][p]["name"];	//Identify by name 
						var j=0;
						while(j<settingsobject[key].length)
						{
							if (settingsobject[key][j]["name"]==name)
							{
								break;
							}
							j+=1;
						}
						console.log (jsonobject[key][p]);
						console.log (settingsobject[key][j]);
						ReplaceParameter(jsonobject[key][p],settingsobject[key][j]);
					}
				}
				catch (e){
					console.log("Mismatch while replacing parameter "+e);
				}
			}
			else 
			{
	 			settingsobject[key]=jsonobject[key]
			}
		}
	}
	return;
}
function UpdateSettingsFileWithJSONObject(jsonobject)
{
	settings = JSON.parse(fs.readFileSync(pathtosettings, 'utf8'));
	ParseAndModify(jsonobject,settings);
	console.log("here");
	console.log(jsonobject);
	console.log(settings);
	fs.writeFile('result.json', JSON.stringify(settings,null,2), function(err) {
		if (err) {
			console.log(err);
		}
	});
}

