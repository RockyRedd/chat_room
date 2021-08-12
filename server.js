const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
let anonymous = 0
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  socket.on('sendMsg', (data) => {
    io.emit('receiveMsg', data)
  })
  socket.on('login', (data) => {
    if (data === '' || data === null) data = `匿名用户${++anonymous}`
    socket.cacheName = data
    io.emit('welcome', data)
  })
  socket.on('disconnect', () => {
    io.emit('goodbye', socket.cacheName)
  })
})

server.listen(3000, () => {
  console.log('Listening 3000 port')
})
