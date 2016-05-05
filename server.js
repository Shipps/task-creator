var express = require('express');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');
app.use(express.static(__dirname + '/static'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.bodyParser());
var exec = require('child_process').exec;

server.listen(80,function(){
  console.log("Started on PORT 8888");
  console.log("Launch url http://localhost in browser to configure");


});

app.get('/',function(req,res){
	fs.readFile(__dirname + '/index.html',
	function(err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			res.writeHead(200);
			res.end(data);
	});
});


app.post('/exportBalooJSON',function(req,res){
    var taskIdName=req.body.taskIdName;
	console.log("taskIdName: " , taskIdName);
	
	
		fs.writeFile('./src/tasklist.txt', taskIdName, function(error) {
			
			if (error) {
			  console.error("write error:  " + error.message);
			  res.end();
			} else {

					var childDir = __dirname + './src';
					exec('run.bat', {cwd: childDir}, function(error, stdout, stderr) {

						if (error !== null) {
							
							
						  console.log('exec error: ' + error);
						  res.end();
						} else {
							
							
							
							taskIdName = taskIdName.replace(/\./g, "_");

							fs.readFile('./src/output/' + taskIdName + '.json', 'utf8', function(err, file) {  
									if(err) {  
										console.log('read error: ' + err);
										res.end();
									}  
									console.log("json read successfully", file);

									res.writeHead(200, {"Content-Type": "application/json"});
									var jsonData = JSON.stringify(file);
									res.end(jsonData);

							});
						}
				});
	
			}
		});
	
	
});