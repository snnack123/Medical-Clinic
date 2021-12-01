
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./Firebase_credentials/vue-calendar-f02b2-firebase-adminsdk-ge55s-2edea3d991.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(); //this is the reference to the database

module.exports = db;
