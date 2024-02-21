require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
const collection = require("./DB");
const path = require("path");
var favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const sendMail = require("./mail");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
let PORT = process.env.PORT;

function correctEventArrayFunc(eventArray) {
  let events = {
    photography: "Darpan (Photography)",
    reel_making: "Reel Making",
    treasure_hunt: "Treasure Hunt",
    marketing_mania: "Marketing Mania",
    picture_story: "Tasveeron ki Dastan (Picture Story)",
    one_to_one_dance_battle: "One to One Dance Battle",
    debate: "Roobaroo (Debate)",
    open_stage: "Rangmanch (Open Stage)",
    solo_singing: "Sargam (Solo Singing)",
    band_war: "Swarsangam (Band War)",
    graffiti_extravanza: "Graffiti Extravanza",
    face_painting: "Mukhauta (Face Painting)",
    monoact: "Ekanki (Monoact)",
    t_shirt_painting: "T-Shirt Painting",
    case_study: "Tehkikat (Case Study)",
    live_sketching: "Pratibimb (Live Sketching)",
    mr_ms_encore: "Mr & Miss Encore",
    relay_rangoli: "Rangsaaz (Relay Rangoli)",
    nukkad: "Bawaal (Nukkad)",
    one_to_one_rap_battle: "Raftaar (Rap Battle)",
    mimicry: "Kirdaar (Mimicry)",
    skit: "Tamasha (Skit)",
    solo_dance: "Natraj (Solo Dance)",
    short_film: "Safarnama (Short Film)",
    auction: "Maya Bazaar (Auction)",
    twist_a_tale: "Afsane (Twist a Tale)",
    group_dance: "Raqs (Group Dance)",
    jam: "Jumla (Jam)",
  };

  return eventArray.map((key) => events[key]);
}

async function insertEvent(eventName, cookieId) {
  let foundUser = await collection.findOne({ _id: cookieId });
  let events = foundUser.events;
  let isEvent = await events.find((event) => event === eventName);
  if (!isEvent) {
    foundUser.events.push(eventName);
    await collection.updateOne({ _id: cookieId }, { $set: { events: events } });
  }
}
async function isEventEnroll(eventName, cookieId) {
  if (!cookieId) {
    return "Regiter Me!";
  } else {
    let foundUser = await collection.findOne({ _id: cookieId });
    let events = foundUser.events;
    let isEvent = events.find((event) => event === eventName);
    if (isEvent == null) {
      return "Regiter Me!";
    } else {
      return "Registered";
    }
  }
}

app.get("/enrolling/:name", async (req, res) => {
  let eventName = req.params.name;
  let cookieId = req.cookies.uid;
  if (cookieId) {
    await insertEvent(eventName, cookieId);
    res.render(eventName, { BtnName: "Registered" });
  } else {
    res.redirect("/login");
  }
});

app.get("/events/:name", async (req, res) => {
  let eventName = req.params.name;
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render(eventName, { BtnName: isEnroll });
});

app.get("/", (req, res) => {
  res.redirect("home");
});

app.get("/home", async (req, res) => {
  let cookieId = req.cookies.uid;
  let foundUser;
  // console.log(cookieId);
  if (cookieId) {
    foundUser = await collection.findOne({ _id: cookieId });
  }
  if (foundUser) {
    res.render("after-reg");
  } else {
    res.render("home");
  }
});

app.get("/profile", async (req, res) => {
  let cookieId = req.cookies.uid;
  let foundUser;
  if (cookieId) {
    foundUser = await collection.findOne({ _id: cookieId });
  }
  if (foundUser) {
    let refcode = "College Student";
    if (foundUser.refcode) refcode = `referal code : ${foundUser.refcode}`;
    res.render("profile.ejs", {
      name: foundUser.name,
      age: foundUser.age,
      email: foundUser.email,
      contact: foundUser.contact,
      college: foundUser.college,
      Ambassador: refcode,
      events: correctEventArrayFunc(foundUser.events),
    });
  } else {
    res.render("login");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("uid");
  res.render("home");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs", { alreadyRegistered: false, paaswordFalse: false });
});

app.get("/events", (req, res) => {
  res.render("event.ejs");
});

app.get("/event-reg", (req, res) => {
  res.render("event-reg.ejs");
});

app.get("/sponsor", (req, res) => {
  res.render("sponsor.ejs");
});

app.get("/caportal", (req, res) => {
  res.render("caportal.ejs");
});

// app.get("/photography", async (req, res) => {
//   let eventName = "photography";
//   let cookieId = req.cookies.uid;
//   let isEnroll = await isEventEnroll(eventName, cookieId);
//   res.render("photography.ejs", { BtnName: isEnroll });
// });

app.post("/signup", async (req, res) => {
  const {
    name,
    college,
    year,
    age,
    refcode,
    contact,
    email,
    password,
    confpassword,
  } = req.body;
  // console.log(email, name);
  if (password !== confpassword) {
    res.render("signup", { paaswordFalse: true, alreadyRegistered: false });
  } else {
    let foundUser = await collection.findOne({ email: email });
    if (foundUser) {
      res.render("signup", { alreadyRegistered: true, paaswordFalse: false });
    } else {
      let regDate = new Date().toLocaleString("en-Us", {
        timeZone: "Asia/Kolkata",
      });
      const user = new collection({
        name,
        college,
        year,
        age,
        refcode,
        contact,
        email,
        password,
        confpassword,
        regDate,
      });
      await user.save();
      sendMail(name, email);
      res.cookie("uid", user._id);
      res.render("after-reg");
    }
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let foundUser = await collection.findOne({ email: email });

  if (foundUser) {
    if (password == foundUser.password) {
      res.cookie("uid", foundUser._id);
      res.render("after-reg");
    } else {
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

app.listen(PORT, () => {
  console.log("App is listening to port", PORT);
});
