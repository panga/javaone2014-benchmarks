// loading vertx shim
var vertx = require('vertx.js');
var container = require('vertx/container');

// getting EventBus handler
var eb = vertx.eventBus;

// setting up MongoDB persistor
var mongo = 'vertx.mongopersistor';

container.deployVerticle('mongo-persistor', null, 1, function() {
  // clearing database
  eb.send(mongo, {
    action: 'delete',
    collection: 'vertx',
    matcher: {}
  });
});

// setting up server
var server = vertx.createHttpServer();
var routeMatcher = new vertx.RouteMatcher();

// post route handler
routeMatcher.get('/post', function(req, res) {

  var response = '';
  var startDate = new Date();

  // database access
  eb.send(mongo, {
      action: 'save',
      collection: 'vertx',
      document: {
        author: randomString(16),
        date: new Date().toString(),
        content: randomString(160)
      }
    },
    function(reply) {
      if (reply.status === 'ok') {
        eb.send(mongo, {
            action: 'find',
            collection: 'vertx',
            limit: 100,
            matcher: {}
          },
          function(reply) {
            if (reply.status === 'ok') {
              response = JSON.stringify(reply.results);
              var endDate = new Date();
              req.response.headers = {
                'Content-Type': 'application/json',
                'Date': endDate.toString(),
                'Connection': 'close',
                'X-Response-Time': endDate - startDate
              };
              req.response.end(response);
            } else {
              request.response.statusCode = 500;
              var endDate = new Date();
              req.response.headers = {
                'Content-Type': 'application/json',
                'Date': endDate.toString(),
                'Connection': 'close',
                'X-Response-Time': endDate - startDate
              };
              req.response.end(response);
            }
          });
      } else {
        request.response.statusCode = 500;
        var endDate = new Date();
        req.response.headers = {
          'Content-Type': 'application/json',
          'Date': endDate.toString(),
          'Connection': 'close',
          'X-Response-Time': endDate - startDate
        };
        req.response.end(response);
      }
    });
});

// hello route handler
routeMatcher.get('/hello', function(req, res) {
  var startDate = new Date();
  var endDate = new Date();

  req.response.headers = {
    'Content-Type': 'application/json',
    'Date': endDate.toString(),
    'Connection': 'close',
    'X-Response-Time': endDate - startDate
  };

  req.response.end(JSON.stringify({
    message: 'hello'
  }));
});

// concat route handler
routeMatcher.get('/concat', function(req, res) {
  var startDate = new Date();
  var response = randomString(10000);
  var endDate = new Date();

  req.response.headers = {
    'Content-Type': 'application/json',
    'Date': endDate.toString(),
    'Connection': 'close',
    'X-Response-Time': endDate - startDate
  };

  req.response.end(JSON.stringify({
    concat: response
  }));
});

// fibonacci route handler
routeMatcher.get('/fibonacci', function(req, res) {
  var startDate = new Date();
  fibonacci(30);
  var endDate = new Date();

  req.response.headers = {
    'Content-Type': 'application/json',
    'Date': endDate.toString(),
    'Connection': 'close',
    'X-Response-Time': endDate - startDate
  };

  req.response.end(JSON.stringify({
    fibonacci: 'calculated'
  }));
});

server.requestHandler(routeMatcher).listen(1337);

// helper function for random string generation
var randomString = function(_len) {
  var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  var len = _len || 160;
  var result = '';
  var rand;

  for (var i = 0; i < len; i++) {
    rand = Math.floor(Math.random() * (alphabet.length));
    result += alphabet.substring(rand, rand + 1);
  }

  return result;
};

// helper Fibonacci function
var fibonacci = function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 2) + fibonacci(n - 1);
}