const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');
const moment = require("moment");
const dataSorter = require("./sortData.js");


// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

const spreadsheetId = JSON.parse(fs.readFileSync("spreadsheetId.json")).spreadsheetId;


const weekdays = ["monday", "tuesday", "wedneday", "thursday", "friday", "saturday"];
const range = "A2:S40";
const currentCalendarWeek = moment().week();

module.exports.getScheduleData = () => {

    return new Promise(resolve => {
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), authorizationSucceded)
                .then(scheduleData => resolve(scheduleData));
        });
    })

}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    return new Promise(r => {
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            authorizationSucceded(oAuth2Client)
                .then(html => r(html));
        });
    })

}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function authorizationSucceded(auth) {

    const sheets = google.sheets({
        version: 'v4',
        auth
    });

    return new Promise(r => {

        sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "KW" + currentCalendarWeek + "!" + range
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);

            r(dataSorter.sortData(res.data));
    
        });

    })

};