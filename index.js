var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
var morgan = require('morgan');
var methodOverride = require('method-override');
var compression = require('compression');
var fs = require('fs');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json());
// compress all responses
app.use(compression());
// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn’t support it.
app.use(methodOverride());
// HTTP request logger middleware for node.js
app.use(morgan('dev'));
// enable all CORS requests
app.use(cors());
// App routes
fs
  .readdirSync(__dirname + "/models")
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js' && file !== 'index.js');
  })
  .forEach(file => {
    var model = require('./routes/' + file);
    app.use(model(express.Router()));
  });
// Static files 
app.use(express.static(__dirname + '/'));
// Models of the server
var models = require('./models/');

models.sequelize
    .authenticate()
    .then(function() {
        console.log('Connection successful');
    })
    .catch(function(error) {
        console.log('Error creating connection');
    });

//Teste cron (TRANSLADAR A OTRO ARCHIVO)
var cron = require('cron');
/**
 * Seconds: 0-59
 * Minutes: 0-59
 * Hours: 0-23
 * Day of Month: 1-31
 * Months: 0-11 (Jan-Dec)
 * Day of Week: 0-6 (Sun-Sat)
 */

var job1 = new cron.CronJob({
  cronTime: '* * * * * *',
  onTick: function() {
    console.log('job 1 ticked');
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});

// Listen server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    job1.start(); // job 1 started
    console.log('job1 status', job1.running); // job1 status true
    console.log('Server listen on http://localhost:3000');
});