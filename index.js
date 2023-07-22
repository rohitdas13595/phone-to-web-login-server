var express = require('express')
var app = express()

var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
        origin: "*"
      }
});
const generateQR  =  require('./qr')
const cors = require('cors');
const { access } = require('fs');


app.use(express.json())
app.use(cors());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/qr', async (req,res)=>{
    const qr = await generateQR();
    // console.log('qr', qr)
    res.status(200).json(qr)
})

app.post('/trigger', async(req,res)=>{
    const userId = req.body.userId;
    const accessToken =  req.body.token;
    const code = req.body.code

    console.log('req.body',req.body);

    io.sockets.in(code).emit('login', {acessToken: accessToken,userId});



    res.status(200).json({
        success: true
    })
})

http.listen(process.env.PORT || 4000, function() {
  var host = http.address().address
  var port = http.address().port
  console.log('App listening at http://%s:%s', host, port)
});

io.on('connection', function(socket) {
  console.log('Client connected to the WebSocket');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('join', function (data) {
    socket.join(data.code); // We are using room of socket io
    console.log('joined',data.code)
  });

  socket.on('chat message', function(msg) {
    console.log("Received a chat message");
    io.emit('chat message', msg);
  });
})
