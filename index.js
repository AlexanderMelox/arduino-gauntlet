const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { Board, Led } = require('johnny-five');

const board = new Board();

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

board.on('ready', () => {
  const led = new Led(13);
  io.on('connection', function(socket) {
    console.log('Socket connected');

    socket.on('blink', data => {
      console.log('Blink fired');
      led.blink(100);
    });

    socket.on('stop', () => {
      led.stop();
    });
    socket.on('disconnect', function() {
      console.log('user disconnected');
    });
  });
});

board.on('error', err => console.log(err));

http.listen(3000, () => {
  console.log('🚀 App running on http://localhost:3000');
});
