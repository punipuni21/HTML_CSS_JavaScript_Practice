const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

const index_page = fs.readFileSync('./index.ejs','utf8');

var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

function getFromClient(request,response){
    var content = ejs.render(index_page);
    response.writeHead(200,{'Content-Type':'text/html'});
    response.write(content);
    response.end();
}