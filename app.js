const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const JWT_SECRET = "ilovecoding"
const path = require("path")

app.use(express.json())

let users = []
app.post("/up", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (users.find(u => u.username == username)) {
        res.send("You already signed up")
    }
    users.push({
        username: username,
        password: password
    })
    res.send("Signed up")
})


app.post("/in", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username == username && u.password == password);

    if (user) {
        const token = jwt.sign({ username, password }, JWT_SECRET);
        return res.json({ token });
    } else {
        return res.status(401).json({ msg: "Invalid username or password" }); 
    }
});


app.get("/dashboard", (req, res) => {
    const token = req.query.token; 
    if (!token) {
        return res.status(401).json({ msg: "Token missing" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.username === decoded.username && u.password ===decoded.password);

        if (user) {
            res.sendFile(path.join(__dirname, "/public/dashboard.html"));
        } else {
            res.status(403).json({ msg: "User not found" });
        }
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/landing.html")
})
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/public/signup.html")
})
app.get("/signin", (req, res) => {
    res.sendFile(__dirname + "/public/signin.html")
})
app.listen(3000, () => {
    console.log("Your app is running")
})