/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/

This is a sample Google Hangouts Chat bot built with Botkit.

# RUN THE BOT :

  Follow the instructions here to set up your Facebook app and page:
    -> https://developers.google.com/hangouts/chat/how-tos/bots-publish

  Run your bot from the command line:
    DEBUG=botkit:* \
    PORT=YOUR_APP_PORT \
    GOOGLE_APPLICATION_CREDENTIALS=YOUR_GOOGLE_CREDENTIALS_FILE \
    GOOGLE_VERIFICATION_TOKEN=YOUR_GOOGLE_VERIFICATION_TOKEN \
    node bot.js
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const env = require('node-env-file');

env(__dirname + '/.env');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('Error: Specify a GOOGLE_APPLICATION_CREDENTIALS in environment.');
    process.exit(1);
}

const Botkit = require('botkit');

const endpoint = "receive";
const token = process.env.GOOGLE_VERIFICATION_TOKEN;
const port = process.env.PORT || 3000;
const debug = true;

const controller = Botkit.googlehangoutsbot({
    endpoint,
    token,
    port,
    debug,
});

const bot = controller.spawn({});
const webserver = require(__dirname + '/components/express_webserver.js')(controller, bot);

const normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./skills/" + file)(controller);
});
