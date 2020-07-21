const fs = require('fs');
// set up express app
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const hbs = require('hbs');

const path = require('path'); //adding path module
//const data = require('./data.txt'); // importing own module with data information, will be substituted for database.
const { fstat } = require('fs');

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
  res.send(readData('./data.txt'));
})

// get route for item
app.get('/item', (req, res) => {
  res.render('item');
})



// post route for add form
app.post('/item', (req, res) => {
  let data = readData('./data.txt');
  data.push(req.body);

  // write data to file
  fs.writeFileSync('./data.txt', JSON.stringify(data), (err, res) => {
    if (err) {
      return console.log('Unable to save database');
    }
  })

  // redirect to main page
  res.redirect('/');
})

app.get('/item/*', (req,res) => {
  if (typeof +req.params[0] !== 'number') {
    return res.send('No item to delete');
  }
  let data = readData('./data.txt');
  let modifiedData = data.filter((item) => data.indexOf(item) !== +req.params[0]);

  fs.writeFileSync('./data.txt', JSON.stringify(modifiedData), (err, res) => {
    if (err) {
      return console.log(err);
    }
  });
  res.redirect('/');
})

// set express server to listen
app.listen(port, (req, res) => {
  console.log(`Server has started listening on port ${port}`);
});

// read data function
function readData(file) {
  const dataBuffer = fs.readFileSync(file, (err, res) => {
    if (err) {
      return console.log('Unable to read from file.');
    } 
    return res;
  })
  let data;
  if (dataBuffer.length > 0) {
    data = JSON.parse(dataBuffer.toString());
  } else {
    data = [];
  }
  return data;
}