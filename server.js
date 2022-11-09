const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
app.use('/public', express.static('public'));



var db, collection; // 
const url = "mongodb+srv://hannahenoy:JT7rvwRgT8rZCQyC@cluster0.mfse9bk.mongodb.net/?retryWrites=true&w=majority";
const dbName = "demo";


app.listen(3000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
  db.collection('messages').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', { messages: result })
  })
})

app.post('/messages', (req, res) => {
  
  // conditional for high priority posts
  // (conditional to change color in index.ejs)
  let option = req.body.priority  // name of radio input
    if ( option === 'on') {
      importance = 'high';
    } else {
      importance = 'low'
    }

  db.collection('messages').insertOne(
    {
      msg: req.body.msg,
      thumbUp:0,
      thumbDown:0,
      priority: importance }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages', (req, res) => {
  console.log('message', req.body.msg, 'thumb up', req.body.thumbUp)
  db.collection('messages')
  .findOneAndUpdate({msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


app.delete('/messages', (req, res) => {
  console.log('message "' + req.body.msg + '"', 'thumb up', req.body.thumbUp)
  db.collection('messages').findOneAndDelete({ msg: req.body.msg }, (err, result) => {
    if (err) return res.send(500, err)
    console.log(err)
    res.send('Message deleted!')
  })
})