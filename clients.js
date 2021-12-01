var express = require("express");
var router = express.Router();
var db = require("../database");
var jwt = require("../node_modules/jsonwebtoken");
const bcrypt = require("../node_modules/bcrypt");
var faker = require("../node_modules/faker");

const secret = "proiect_tic";

//Check auth
function checkAuthorization(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, secret, (err, decoded) => {
            if (err) {
                if (err.expiredAt) {
                    res.json({ message: "Your token expired!" });
                } else {
                    res.json({ message: "Decoding error!" });
                }
            } else {
                console.log(decoded.email);
                next();
            }
        });
    } else {
        res.json({ message: "Missing token!" });
    }
}

router.post("/getUserEmail", async(req, res) => {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, secret, (err, decoded) => {
            if (err) {
                if (err.expiredAt) {
                    res.json({ message: "Your token expired!" });
                } else {
                    res.json({ message: "Decoding error!" });
                }
            } else {
                res.json({ message: decoded.email });
            }
        });
    } else {
        res.json({ message: "Missing token!" });
    }
});

router.post("/getUserData", checkAuthorization, async(req, res) => {
    let data = req.body.email;
    let clients = [];

    const posts = await db.collection("Clients").where("email", "==", data).get();

    posts.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        let client = {};

        client.id = doc.id;
        client.name = doc.data().name;
        client.phone = doc.data().phone;
        client.yearsOld = doc.data().yearsOld;

        clients.push(client);
    });

    res.json(clients);
});

router.post("/getAppointmentsOnDate", checkAuthorization, async(req, res) => {
    let reqq = new Date(req.body.date);

    let data = `${reqq.getDate()}-${reqq.getMonth() + 1}-${reqq.getFullYear()}`;
    let appointments_list = [];

    const posts = await db
        .collection("Appointments")
        .where("date", "==", data)
        .where("doctorSpecialization", "==", req.body.specialization)
        .get();

    let nr = 0;
    posts.forEach((doc) => {
        let app = {};

        app.id = doc.id;
        app.doctorName = doc.data().doctorName;
        app.doctorSpecialization = doc.data().doctorSpecialization;
        app.date = doc.data().date;
        app.hour = doc.data().hour;

        console.log(app);

        appointments_list.push(app);
    });
    res.json(appointments_list);
});

router.get("/getAllAppointments", checkAuthorization, async(req, res) => {
    let appointments_list = [];

    const posts = await db.collection("Appointments").get();

    posts.forEach((doc) => {
        let app = {};

        app.id = doc.id;
        app.doctorName = doc.data().doctorName;
        app.doctorSpecialization = doc.data().doctorSpecialization;
        app.date = doc.data().date;
        app.hour = doc.data().hour;

        appointments_list.push(app);
    });
    res.json(appointments_list);
});

router.get("/doctors", async(req, res) => {
    let doctors = [];
    //Get all products
    const response = await db.collection("Doctors").get();
    //Iterate over
    response.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        let doctor = {};
        doctor.id = doc.id;
        doctor.name = doc.data().name;
        doctor.specialization = doc.data().specialization;
        //Push every elem into Obj Array
        doctors.push(doctor);
    });

    //Respond with products array
    res.json(doctors);
});

router.post("/new_appointment", checkAuthorization, async(req, res) => {
    console.log("Vrei sa adaugi o noua programare.");
    let app = req.body;
    const insert = await db.collection("Appointments").add(app);
    res.json({ id: insert.id });
});

module.exports = router;