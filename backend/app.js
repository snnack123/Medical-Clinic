const express = require("express");
var cors = require("cors");
var jwt = require("jsonwebtoken");
const app = express();
var morgan = require("morgan");
const { nextTick } = require("process");
var faker = require("faker");
const { v4: uuidv4 } = require("uuid");
const port = 3000;

const bcrypt = require("bcrypt");
const { exists } = require("fs");
const saltRounds = 12;
const secret = "proiect_tic";

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
var db = require("./database");

var clientsRouter = require("./clients/clients"); //ne trebuie
app.use("/", clientsRouter); //ne trebuie

//ruta GET de populare Bd
app.get("/generateRandomDoctors/:noOfRecords", async(req, res) => {
    let number = req.params.noOfRecords;

    for (let i = 0; i < number; i++) {
        let obj = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            yearsOld: Math.floor(Math.random() * 40) + 1,
        };
        const res = await db.collection("Doctors").add(obj);
    }
    res.send("Vrei sa introduci urmatorul numar de date random : " + number);
});

app.get("/generateRandomClients/:noOfRecords", async(req, res) => {
    let number = req.params.noOfRecords;

    for (let i = 0; i < number; i++) {
        let obj = {
            name: faker.name.findName(),
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
            yearsOld: Math.floor(Math.random() * 60) + 1,
        };
        const res = await db.collection("Clients").add(obj);
    }
    res.send("Vrei sa introduci urmatorul numar de date random : " + number);
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.post("/data", (req, res) => {
    let data = req.body;
    console.log("trying to post the following data: ", data);
    res.send("Succes");
});

app.post("/user", async(req, res) => {
    let data = req.body;
    let emailExist = false;

    const userRef = db.collection("Clients");
    const snapshot = await userRef.where("email", "==", data.email).get();
    if (!snapshot.empty) {
        emailExist = true;
    }

    if (emailExist) {
        res.send("User already registered.");
    } else {
        bcrypt.hash(data.password, saltRounds).then(async function(hash) {
            data.password = hash;
            const user = await db.collection("Clients").add(data);
            console.log(`You've just register with id ${user.id}`);
            res.send("Succesfull registration");
        });
    }
});

app.post("/login", async(req, res) => {
    let data = req.body;

    let emailFound = false;

    const usersRef = db.collection("Clients");
    const snapshot = await usersRef.where("email", "==", data.email).get();

    console.log(snapshot);

    if (snapshot.empty) {
        let response = {};
        response.message = "No such email address.";
        res.json(response);
    } else {
        emailFound = true;
        snapshot.forEach((doc) => {
            bcrypt
                .compare(data.password, doc.data().password)
                .then(async function(result) {
                    if (result) {
                        let token = jwt.sign({
                                email: doc.data().email,
                            },
                            secret, { expiresIn: 60 * 60 }
                        );

                        let response = {};
                        response.token = token;
                        response.message = "You have the right to access private resources";

                        res.json(response);
                    } else {
                        let response = {};
                        response.message = "Password missmatch";
                        res.json(response);
                    }
                });
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

module.exports = app;
module.exports = db;