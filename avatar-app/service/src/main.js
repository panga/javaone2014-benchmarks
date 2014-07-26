var avatar = require("org/glassfish/avatar");
var Module = require('module');

//UUID
var uuid = new Module().require('node-uuid');

//MongoDB connection
var mongoose = new Module().require('mongoose');

var db = mongoose.connect('mongodb://localhost:27017/nodejs', function() {
    //clearing database
    PostModel.remove({}, function(err, deleted) {});
});

//post schema
var Schema = mongoose.Schema;

var Post = new Schema({
    _id: {
        type: String,
        index: {
            unique: true
        },
        default: function genUUID() {
            return uuid.v1();
        }
    },
    author: String,
    date: Date,
    content: String
}, {
    versionKey: false
});

mongoose.model('Post', Post);
PostModel = mongoose.model('Post');

//post route handler
avatar.registerRestService({
    url: "/post"
}, function() {
    this.onGet = function(req, res) {
        var post = new PostModel();
        post.author = randomString(16);
        post.date = new Date();
        post.content = randomString(160);

        post.save(function(err) {
            if (err) {
                res.status = 500;
                res.send();
            } else {
                PostModel.find().limit(100).exec(function(err, data) {
                    if (err) {
                        res.status = 500;
                        res.send();
                    } else {
                        res.status = 200;
                        res.send(data);
                    }
                });
            }
        });
    };
});

//hello route handler
avatar.registerRestService({
    url: "/hello"
}, function() {
    this.onGet = function(req, res) {
        res.status = 200;
        res.send({
            message: 'hello'
        });
    };
});

//concat route handler
avatar.registerRestService({
    url: "/concat"
}, function() {
    this.onGet = function(req, res) {
        var response = randomString(10000);

        res.status = 200;
        res.send({
            concat: response
        });
    };
});

//fibonacci route handler
avatar.registerRestService({
    url: "/fibonacci"
}, function() {
    this.onGet = function(req, res) {
        fibonacci(30);

        res.status = 200;
        res.send({
            fibonacci: 'calculated'
        });
    };
});

//helper function for random string generation
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

//helper Fibonacci function
var fibonacci = function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 2) + fibonacci(n - 1);
};