/*
*
*Start the server in nodejs
*
*/

//Dependencies

var http = require("http");
var https = require("https");
var url = require("url");
var config = require("./config")
var fs = require("fs");

var StringDecoder = require('string_decoder').StringDecoder;

//Initialize HttpServer
var httpServer = http.createServer(function(request,response){
  unifiedMethod(request,response);
});

//HttpServer listening on httpPort
httpServer.listen(config.httpPort,function(){
  // console.log("listening on port "+config.httpPort);
  // console.log('working on environment  '+config.envName);
});

//Define HttpsServerOptions
var httpsServerOptions = {
  'key':fs.readFileSync("./https/key.pem"),
  'cert':fs.readFileSync("./https/cert.pem")
};

//Intialize HttpsServer
var httpsServer = https.createServer(httpsServerOptions,function(requset,response){
  unifiedMethod(request,response);
});

//HttpsServer that is listening on httpsPort
httpsServer.listen(config.httpsPort,function(){
  // console.log("listening on port "+config.httpsPort);
  // console.log('working on environment '+config.envName);
})

//Define common method for both http and httpsPort
var unifiedMethod = function(request,response){

  //Parse the request
  var parsedUrl = url.parse(request.url,true);

  //Get path from parsed url
  var path = parsedUrl.pathname;

  // Remove unwanted data from url
  var trimmedUrl = path.replace(/^\/+|\/$/g,"");

  //Get the query string object
  var queryStringObject = parsedUrl.query;

  // Get the method of http request
  var method = request.method.toLowerCase();

  // Get headers from the requested API
  var headers = request.headers;

  //Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  //Event to catch Streamed data from request using request.on('data',fucnction(){}) event  and write it to buffer
  //Data event is called only when there is payload
  request.on('data',function(data){
    buffer += decoder.write(data);
  });
 //End event will be called every time at the end of the Stream
  request.on('end',function(){
    buffer += decoder.end();
    //Define choosenHandler
    var choosenHandler = typeof(router[trimmedUrl]) !== 'undefined' ? router[trimmedUrl] : handler.notfound;
    var data = {
      'trimmedPath' : trimmedUrl,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'handler' : handler,
      'payload' : buffer
    }

    //Router the request to choosen  API
    choosenHandler(data,function(statusCode,payload){
      //Use the status code called back by the handler
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      //Use the callback payload by the choosenHandler
      payload = typeof(payload) === 'object' ? payload : {};

      //Convert the payload to StringDecoder
      var payloadString = JSON.stringify(payload);

      //Return the response
      response.setHeader('content-Type','application/json');
      response.writeHead(statusCode);
      response.end(payloadString);
      console.log('Returning this response ', statusCode);
    });
  });
}

//Define handler
var handler = {};
//P handler
handler.ping = function(data,callback){
  callback(200,{"welcome message":"Hello,Welcome to my github assignment"});
};
//Create notfound handler
handler.notfound = function(data,callback){
  callback(404);
};
//Define router
var router = {
  'ping' : handler.ping
};
