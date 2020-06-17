var http = require('http');


var path = require('path');
var express = require('express');




//Including controller/dao for testtable

var app = express();
var connection  = require('express-myconnection'); 
//var mysql = require('mysql');
// all environments

//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.logger('dev'));
/*app.use(express.urlencoded());
app.use(express.methodOverride());*/
//app.use(express.static(path.join(__dirname, 'public')));
// development only
/*if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}*/
//var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
//app.set('view engine', 'ejs'); 
//var path = require('path');




var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());












const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';

// Database Name
const dbName = 'myproject1';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  createValidated(db, function() {
    client.close();
  });
});
function createValidated(db, callback) {
  db.createCollection("review", 
	   {
	      'validator': { '$or':
	         [
	            { 'employeename': { '$type': "string" } },
	            { 'employeeid': { '$type': "string" } },
	            
	            { 'field': { '$type': "string" }},
	            { 'quality': { '$type': "string" }},
	            { 'quantity': { '$type': "string" }},
	            { 'dependability': { '$type': "string" }},
	            { 'punctuality': { '$type': "string" }},
	            { 'communication': { '$type': "string" }},
	            { 'problemsolving': { '$type': "string" }},
	            { 'team': { '$type': "string" }},
	            { 'reviewername': { '$type': "string" }},
	            { 'reviewerid': { '$type': "string" }},


	         ]
	      }
	   },
    function(err, results) {
      console.log("Collection created.");
      
    }
  );
};


app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/front.html'));
});
app.get('/update', function(request, response) {
	response.sendFile(path.join(__dirname + '/front.html'));
});
app.post('/insert', function(request, response) {
	
console.log(request.body);
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);

  
  dbo.collection("review").insertOne(request.body, function(err, res) {
    if (err) throw err;
    else
    {
    console.log("Number of documents inserted: " + res.insertedCount);
    response.send("ur reviw was succesfully inserted");
}
    
    
  });
});

	});

app.get('/details', function(request, response) {
	MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);
  dbo.collection("review").find({}).toArray(function(err, data) {
    if (err) throw err;
    console.log(data);
    app.set('view engine', 'ejs');
	response.render('details',{ title: 'details', data: data});
	
  });
});
	
});
app.post('/delete', function(request, response) {


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);
  var myquery = { employeeid : request.body.employeeid };
  dbo.collection("review").remove(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " document(s) deleted");
    response.send("deleted successfully");
  });
});
});


app.post('/search', function(request, response) {
	console.log(request.body);
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db(dbName);
  var query = { employeeid : request.body.employeeid};
  dbo.collection("review").find(query).toArray(function(err, data) {
    if (err) throw err;
    console.log(data);
    /*response.send('<!doctype html>\n<html lang="en">\n' + 
  '\n<meta charset="utf-8">\n<title>RESULT OF SEARCH</title>\n' + 
  '<style type="text/css">* { font-family:arial, sans-serif;}</style>\n' + 
  '<style type="text/css">html { height: 100%;}body {  margin:0;  padding:0;  font-family: sans-serif;  background: linear-gradient(#141e30, #243b55);}\n' +
  
  '\n\n<h1>Employee-Name</h1>\n'  +
  '\n\n<h1>Employee -id</h1>\n' +
  '\n\n<h1>field</h1>\n' +  
  

  '\n\n' );*/
  if(data.length==0)
  	response.send("no data");
  else
  {
  response.write('<!doctype html>\n<html lang="en">\n' + 
  '\n<meta charset="utf-8">\n<title>Test web page on node.js</title>\n' + 
  '<style type="text/css">* {font-family:arial, sans-serif; } html {  height: 100%;}body {  margin:0;  padding:0;  font-family: sans-serif;  background: linear-gradient(#141e30, #243b55);}</style>\n' + 
  '\n\n<h1 style="color:white;">Employee-FOUND</h1>\n' + 
  '<div id="content"  style="background-color:white;"><p>Details of employee :</p><ul><li>EMPLOYEE-Name:: ' + data[0].employeename+'<li>EMPLOYEE-ID:: ' + data[0].employeeid+'</li><li>EMPLOYEE FIELD:: ' + data[0].field+' </li><li>REVIEWER NAME :: ' + data[0].reviewername+'</li><li>REVIEWERID:: ' + data[0].reviewerid+'</li></ul></div>' + 
  '\n\n');
  response.end();
}
    
    //response.send( "ur search result :: \n" + "employee name = " + data[0].employeename + "\nemployee id = " + data[0].employeeid  + "\nfield = " + data[0].field);
    
    
  });
});
});

app.listen(4030);