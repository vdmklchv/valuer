const {MongoClient, ObjectId} = require('mongodb');
const assert = require('assert');
const url = 'mongodb+srv://vdmclcv:testconnect@cluster0.bjsgz.mongodb.net/valuer?retryWrites=true&w=majority' || 'mongodb://localhost:27017';
const dbName = 'valuer';
// set up express app
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const hbs = require('hbs');

const path = require('path'); //adding path module

const port = process.env.PORT || 3000; // defining port variable

hbs.registerPartials(__dirname + '/templates/partials'); // register partials dir

app.set('view engine', 'hbs');  // setting view engine for handlebars 
app.set('views', path.join(__dirname, '/templates/views')); // setting directory names for 'view'
app.use(express.static('public')); // setting a folder to serve static assets from
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// default route
app.get('/', (req, res) => {
  res.render('valuer');
})

// data route
app.get('/data', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
   
    const db = client.db(dbName);
    db.collection('item').find({}).toArray().then((result) => res.send(result));
    client.close();
  });
})

// get route for item
app.get('/item', (req, res) => {
  res.render('item');
})



// post route for add form
app.post('/item', (req, res) => {

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
   
    const db = client.db(dbName);
    db.collection('item').insertOne(req.body);
   
    client.close();
  });

  res.redirect('/');
})

app.get('/item/*', (req,res) => {
  if (typeof +req.params[0] !== 'number') {
    return res.send('No item to delete');
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
   
    const db = client.db(dbName);
    db.collection('item').deleteOne( {"_id": ObjectId(req.params[0])});
   
    client.close();
  });
  
 console.log(req.params[0]);
  res.redirect('/');
})

// set express server to listen
app.listen(port, (req, res) => {
  console.log(`Server has started listening on port ${port}`);
});