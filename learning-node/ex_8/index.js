
const http = require('http');
const port = 3000;

const requestHandler = (request, response) => {  
  response.end('<h1>Congrats you\'re using your first Node.js Web Server</h1>');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {  
  if (err) {
    return console.log(`Unable to start the server on port ${port}`, err)
  }

  console.log(`This HTTP server is running on port ${port}`)
})