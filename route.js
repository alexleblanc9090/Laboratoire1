const { Console } = require('console');
const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) =>{
    var mathsOps = require('./controller.js');
    if(url.parse(req.url, true).pathname == "/api/maths" && req.method == 'GET')
    {
        mathsOps.executeRequest(req, res);
    }
    else if(url.parse(req.url, true).pathname == "/api/maths" && req.method == 'GET')
    {
        mathsOps.showFormula();
    }
    else{
        mathsOps.invalidUrl(req, res);
    }
});