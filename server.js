// Dependencies
const http = require('http');
const handlers = require('./handlers');
const stringDecoder = require('string_decoder').StringDecoder;

// server variable
const hostname = '127.0.0.1';
const port = 3000;

// Create the server
const server = http.createServer(function(req,res){
    // Take the url string
    let queryUrl = req.url;

    // Build the url object
    let parsedUrl = new URL(queryUrl,'http://localhost:3000');

    // Extract the path from the URL object
    let path = parsedUrl.pathname;

    // Clean from slash
    let newPath = path.replace(/^\/+|\/+$/g,'');

    //Init string decoder
    let decoder = new stringDecoder('base64');

    //Init buffer
    let buffer = '';

    // Write buffer on data event
    req.on('data',function(data){
        buffer += decoder.write(data);
    })

    // Close the data event
    req.on('end',function(){
        buffer += decoder.end();

        // Parse string into json
        parseJsonToObject = function(str){
            try{
                let obj = JSON.parse(str);
                return obj;
            } catch(e){
                return{};
            }
        }

        // Create the data object
        let data = {
            "path" : newPath,
            "payload" : parseJsonToObject(Buffer.from(buffer,"base64").toString('utf-8'))
        }

        // Routing the request
        let pathRouter = typeof(router[newPath]) !== 'undefined' ? router[newPath] : handlers.notFound;

        pathRouter(data,function(payload,contentType){
            let payloadstring = '';
            if(contentType == 'html'){
                res.setHeader('Content-Type','text/html');
                payloadstring = typeof(payload) == 'string' ? payload : '';

            }

            // Send the response
            res.statusCode = 200;
            res.end(payloadstring);
        })

    })

})

// Define the router

router = {
    '' : handlers.index,
    'upload' : handlers.upload,
}

// Start the server
server.listen(port,hostname,function(){
    console.log('Server running on port: '+port);
})