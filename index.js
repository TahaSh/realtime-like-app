const app = require('express')()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)

let likes = 0

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.get('/', (req, res) => {
  res.render(path.join(__dirname + '/index.ejs'), { likes }, (err, html) => {
    res.send(html)
  })
})

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname + '/style.css'))
})

app.post('/like', (req, res) => {
  likes++
  res.json({ likes })
})

io.on('connection', socket => {
  console.log('a user connected!')
  socket.on('likes:updated', () => {
    socket.broadcast.emit('likes:update', likes)
  })
  socket.on('disconnect', () => {
    console.log('user disconnected!')
  })
})

http.listen(3000, () => console.log('the app is running on localhost:3000'))
