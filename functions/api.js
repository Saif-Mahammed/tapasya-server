const express = require('express');
const serverless = require('serverless-http')
const cors = require('cors');
const admin = require('firebase-admin'); // Import Firebase Admin SDK

const router = express.Router()
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Initialize Firebase Admin SDK (replace 'your-service-account-key.json' and 'your-database-url')
const serviceAccount = require('./school-tapasya-firebase-adminsdk-ju731-5342f66788.json'); // Replace with your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://school-tapasya-default-rtdb.firebaseio.com', // Replace with your Firebase project URL
});

// Create a Firebase Realtime Database reference
const db = admin.database();
const uploadedDataRef = db.ref('uploadedData');

// Endpoint to receive and store uploaded data from the first website
app.post('/upload', async (req, res) => {
  const uploadedData = req.body;

  try {
    // Save data to Firebase Realtime Database
    const newDataRef = uploadedDataRef.push();
    await newDataRef.set(uploadedData);

    // Optionally, you can send a response to the first website
    res.json({ message: 'Data uploaded successfully' });

    const axios = require('axios');
    const response = await axios.post('https://tapasya-home.netlify.app', uploadedData);
    console.log(response.data);

  } catch (error) {
    console.error('Failed to upload data to Firebase', error);
    res.status(500).json({ error: 'Failed to upload data' });
  }
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app)
// Export the app (to be used in your Netlify functions)
module.exports = app;
