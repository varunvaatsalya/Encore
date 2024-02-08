var express = require("express");
const ejs = require("ejs");
var bodyParser = require("body-parser");
const collection = require("./DB");
const event_collection = require("./events");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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
  let foundUser = await collection.findOne({ _id: cookieId });
  let events = foundUser.events;
  let isEvent = events.find((event) => event === eventName);
  if (isEvent == null) {
    return "Regiter Me!";
  } else {
    return "Registered";
  }
}

app.get('/enrolling/:name', async (req, res)=>{
  let eventName = req.params.name;
  let cookieId = req.cookies.uid;
  await insertEvent(eventName, cookieId)
  res.render(eventName, { BtnName: "Registered" });
})

app.get("/home", async (req, res) => {
  let cookieId = req.cookies.uid;
  let foundUser = await collection.findOne({ _id: cookieId });
  if (foundUser) {
    res.render("after-reg");
  } else {
    res.render("home");
  }
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/logout", (req, res) => {
  res.cookie("uid", null);
  res.render("home");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
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

app.get("/profile", async (req, res) => {
  let cookieId = req.cookies.uid;
  let foundUser = await collection.findOne({ _id: cookieId });
  if (foundUser) {
    let refcode = "-";
    if (foundUser.refcode) refcode = "campus Ambassador";
    res.render("profile.ejs", {
      name: foundUser.name,
      age: foundUser.age,
      userId: foundUser.userid,
      contact: foundUser.contact,
      college: foundUser.college,
      Ambassador: refcode,
      events: foundUser.events,
    });
  } else {
    res.render("home");
  }
});

app.get("/after-login", async (req, res) => {
  const allusers = await collection.find({});
  res.render("after-reg.ejs", { allusers });
});

app.get("/photography", async (req, res) => {
  res.render("photography.ejs");
});



app.get("/auction", async (req, res) => {
  let eventName = "auction";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("auction.ejs", { BtnName: isEnroll });
});

app.get("/band", async (req, res) => {
  let eventName = "band";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("band.ejs", { BtnName: isEnroll });
});

app.get("/cosplay", async (req, res) => {
  let eventName = "cosplay";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("cosplay.ejs", { BtnName: isEnroll });
});

app.get("/debate", async (req, res) => {
  let eventName = "debate";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("debate.ejs", { BtnName: isEnroll });
});

app.get("/digital", async (req, res) => {
  let eventName = "digital";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("digital.ejs", { BtnName: isEnroll });
});

app.get("/essay", async (req, res) => {
  let eventName = "essay";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("essay.ejs", { BtnName: isEnroll });
});

app.get("/face", async (req, res) => {
  let eventName = "face";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("face.ejs", { BtnName: isEnroll });
});

app.get("/group", async (req, res) => {
  let eventName = "group";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("group.ejs", { BtnName: isEnroll });
});

app.get("/sing", async (req, res) => {
  let eventName = "sing";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("sing.ejs", { BtnName: isEnroll });
});

app.get("/jam", async (req, res) => {
  let eventName = "jam";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("jam.ejs", { BtnName: isEnroll });
});

app.get("/live", async (req, res) => {
  let eventName = "live";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("live.ejs", { BtnName: isEnroll });
});

app.get("/marketing", async (req, res) => {
  let eventName = "marketing-mania";
  let cookieId = req.cookies.uid;
  let isEnroll = await isEventEnroll(eventName, cookieId);
  res.render("marketing-mania.ejs", { BtnName: isEnroll });
});

app.get("/mime", async (req, res) => {
  res.render("mime.ejs");
});

app.get("/mimicry", async (req, res) => {
  res.render("mimicry.ejs");
});

app.get("/model", async (req, res) => {
  res.render("model_united_nations.ejs");
});

app.get("/monoact", async (req, res) => {
  res.render("monoact.ejs");
});

app.get("/nukkad", async (req, res) => {
  res.render("nukkad.ejs");
});

app.get("/One2Onedancebattle", async (req, res) => {
  res.render("one_to_one_dance_battle.ejs");
});

app.get("/dancebattle", async (req, res) => {
  res.render("one_to_one_rap_battle.ejs");
});

app.get("/stage", async (req, res) => {
  res.render("open_stage.ejs");
});

app.get("/picture", async (req, res) => {
  res.render("picture_story.ejs");
});

app.get("/reel", async (req, res) => {
  res.render("reel_making.ejs");
});

app.get("/relay", async (req, res) => {
  res.render("relay_rangoli.ejs");
});

app.get("/film", async (req, res) => {
  res.render("short_film.ejs");
});

app.get("/skit", async (req, res) => {
  res.render("skit.ejs");
});

app.get("/solo", async (req, res) => {
  res.render("solo_dance.ejs");
});

app.get("/solosing", async (req, res) => {
  res.render("solo_singing.ejs");
});

app.get("/tshirt", async (req, res) => {
  res.render("t_shirt_painting.ejs");
});

app.get("/twist", async (req, res) => {
  res.render("twist_a_tale.ejs");
});

const requireLogin = (req, res, next) => {
  if (!session.user_id) {
    return res.redirect("/login");
  }
  next();
};
app.post("/signup", async (req, res) => {
  const {
    name,
    college,
    year,
    age,
    refcode,
    contact,
    userid,
    password,
    confpassword,
  } = req.body;
  const user = new collection({
    name,
    college,
    year,
    age,
    refcode,
    contact,
    userid,
    password,
    confpassword,
  });
  await user.save();
  res.cookie("uid", user._id);
  res.render("after-reg");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { userid, password } = req.body;

  let foundUser = await collection.findOne({ userid: userid });

  if (foundUser) {
    if (password == foundUser.password) {
      res.cookie("uid", foundUser._id);
      res.redirect("/after-login");
    } else {
      res
        .redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/event-reg", async (req, res) => {
  const { event } = req.body;
  const events_coll = new event_collection({ event });
  await events_coll.save();
  res.redirect("/after-login");
});

app.get("/", requireLogin, async (req, res) => {
  const data = await collection.findOne({ _id: session.user_id });
  console.log("Data : " + data);
  res.render("home", { data });
});

app.listen(3000, () => {
  console.log("App is listening to port 3000");
});
