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
var os = require('os');

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

var forkWorker = function(){
    var worker = cluster.fork();
    worker.on('online', function(){
        console.log('Cluster worker ' + worker.id + ' is online');
    });
};

if (cluster.isMaster) {

    var cpus = os.cpus().length;
    for (var i = 0; i < cpus; i++) {
        forkWorker();
    }

    cluster.on('exit', function(worker, code) {
        if(code !== 0 && !worker.suicide) {
            console.log('Worker crashed. Starting a new worker');
            forkWorker();
        }
    });

    // process.on('SIGUSR2', function() {
    //     console.log('Restarting workers');
    //     var workers = Object.keys(cluster.workers);
    //
    //     function restartWorker(i) {
    //         if(i >= workers.length) return;
    //         var worker = cluster.workers[workers[i]];
    //         console.log(i);
    //         console.log('Stopping worker '+ i +': ' + worker.process.pid);
    //         worker.disconnect();
    //
    //         worker.on('exit', function() {
    //             if(!worker.suicide) return;
    //             var newWorker = cluster.fork();
    //             newWorker.on('listening', function() {
    //                 restartWorker(i + 1);
    //             });
    //         });
    //     }
    //
    //     restartWorker(0);
    //
    // });

} else {
    app.listen(config.port);
}

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Application started on port ' + config.port);
