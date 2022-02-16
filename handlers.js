const fs = require('fs');

let handlers = {};

// Index handler
handlers.index = function(data,callback){
    let contentType = 'html';
    fs.readFile(__dirname+'/index.html','utf-8',function(err,data){
        if(!err){
            callback(data,contentType);
        } else {
            console.log(err);
        }
    })
}

// 404 handler
handlers.notFound = function(data,callback){
    callback(404)
}

// Upload handler

handlers.upload = function(data){
    let imageData = data.payload.image;
    let fileExtension = data.payload.fileExtension;
    let randomNumber = Math.floor((Math.random()*1000)*Math.random() * 1000).toString();
    fs.writeFile(__dirname+'/'+randomNumber+'.'+fileExtension,imageData,'base64',function(err){
        if(!err){
            console.log('file saved!');
        } else {
            console.log(err);
        }
    }) 
}

module.exports = handlers;