'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
    _ = require('lodash'),
	chalk = require('chalk');

// Dependencies for Cluster
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// // Start the app by listening on <port>
// app.listen(config.port);

// Start the app by listening on <port> after forking cluster

var forkWorkers = function(){
    var worker = cluster.fork();
    worker.on('online', function(){
        console.log('Cluster worker ' + worker.id + ' is online');
    });
};

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        forkWorkers();
    }
    // Restarting workers that crashed
    cluster.on('exit', function(worker, code){
        if(code !== 0 && !worker.suicide){
            console.log('worker '+ worker.id +' crashed. Starting a new worker');
            cluster.fork();
        }
    });
    // Zero downtime restart
    process.on('SIGUSR2', function(){
        console.log('Restarting workers');
        var workers = Object.keys(cluster.workers);
        function restartWorker(i){
            if(i >= workers.length) return;
            var worker = cluster.workers[workers[i]];
            worker.disconnect();

            worker.on('exit', function(){
                if(!worker.suicide) return;
                var newWorker = cluster.fork();
                newWorker.on('listening', function(){
                    restartWorker(i+1);
                });
            });
        }
        restartWorker(0);
    });
} else {
    app.listen(config.port);
}

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
