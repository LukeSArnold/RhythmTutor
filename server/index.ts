import express from 'express';
import { config } from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import * as crypto from 'crypto';
import fs from 'fs';
import exp from 'constants';


// load environment variables
config();

const path = require('path');
const app = express();

const rhythmLessonsRawData = fs.readFileSync('lessons/rhythm-lessons.json', 'utf-8');
const rhythmLessonsJsonData = JSON.parse(rhythmLessonsRawData);

const rhythmLessons = new Map<string, any>(Object.entries(rhythmLessonsJsonData));


// slightly modified version of the code we wrote in class.
// we wrap the express app in a node http server so that we can
// expose the server to socket.io later on.
const server = http.createServer(app);
const io = new Server(server);
const port = parseInt(process.env.PORT || '3000');

// a simple middleware the redirects
// to the asset server if the request
// path contains a dot. We use the dot
// to differentiate between asset requests
// and normal requests because file names have
// dots in them.
app.use((req, res, next) => {
  if (req.path.includes(".")) {
    res.redirect(process.env.ASSET_URL + req.path);
    return;
  }
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="${process.env.ASSET_URL}/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React-Express Starter App</title>
        <script type="module">
          import RefreshRuntime from '${process.env.ASSET_URL}/@react-refresh'
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" src="${process.env.ASSET_URL}/@vite/client"></script>
        </head>
        <body>
        <div id="root"></div>
        <script type="module" src="${process.env.ASSET_URL}/src/main.tsx"></script>
      </body>
    </html>
    `);
});

  app.get('/transcript-lessons', (req, res) => {
    res.sendFile(path.join(__dirname, 'lessons', 'rhythm-lessons.json'));
  });

  app.get('/interval-lessons', (req, res) => {
    res.sendFile(path.join(__dirname, 'lessons', 'interval-lessons.json'));
  });

  app.get('/audiofiles', (req, res) => {
    const filename = req.query.file;
    const filePath = path.join(__dirname, 'lessons/audio/', filename);
  
    res.sendFile(filePath, err => {
      if (err) {
        console.error(err);
        res.status(404).send('File not found');
      }
    });
  });

  app.get('/verify', (req, res) => {

    let submission: string = req.query.submission as string;
    let lesson: string = req.query.lesson as string;

    let lessonObj = rhythmLessons.get(lesson) as { rhythm: string, "rhythm-wav-path": string };

    if (!lessonObj) {
      throw new Error(`Lesson "${lesson}" not found`);
    }
    
    const sequence = lessonObj.rhythm.replace(/;/g, "");    
    const groundTruth = sequence.replace(/;/g, "");

    let success_state: boolean = true;
    let error_at: number = -1;

    let expected: string = ""
    let actual: string = ""
    for (let i: number = 0; i <groundTruth.length; i++){
      console.log("---------------------------------")

      console.log(`GROUND TRUTH: ${groundTruth[i]} || SUBMISSION ${submission[i]}`)
      
      console.log("---------------------------------")
      if (groundTruth[i] != submission[i]){
        success_state = false;
        expected = groundTruth[i];
        actual = submission[i];
        
        error_at = Math.floor(i / 4) + 1;

        break;
      }
    }

    let message_response: string = "";
    if (success_state){
      message_response = "Correct! Well done, if able move onto the next lessons, if not avalible try this one again for some more practice."
    } else {
      message_response = `Your transcription isn't quite right! You have your first error at beat ${error_at}. Expected
      ${expected} but received ${actual}. Listen closely and try again!`
    }

    console.log(`MESSAGE RESPONSE: ${message_response}`)

    const result = {
      message: message_response,
      success: success_state,
    }
    res.send(result)
  });

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});