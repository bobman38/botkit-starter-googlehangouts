var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('botkit:webserver');

module.exports = function(controller, bot) {


    var webserver = express();
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({extended: true}));

    // import express middlewares that are present in /components/express_middleware
    var normalizedPath = require("path").join(__dirname, "express_middleware");

    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        require("./express_middleware/" + file)(webserver, controller);
    });

    webserver.use(express.static('public'));

    webserver.listen(process.env.PORT || 3000);

    controller.createWebhookEndpoints(webserver, bot, function () {
        debug(`🚀 Congratulation, the web server is online!`);
    });

    controller.webserver = webserver;

    return webserver;

}