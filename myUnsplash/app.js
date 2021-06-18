const express = require("express");
const mongoose = require("mongoose");

const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");
const ejs = require("ejs");
const fs = require("fs");
const Photo = require("./models/Photo");

const app = express();

//--DB CONNECT
mongoose.connect("mongodb://localhost/myUnsplash", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//-- TEMPLATE ENGINE
app.set("view engine", "ejs");

//--MIDDLEWARES
app.use(express.static("public"));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//ROUTES
app.get("/", async (req, res) => {
  const photos = await Photo.find({});
  res.render("index", {
    photos,
  });
});

app.post("/photos", async (req, res) => {


  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    const save = await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadeImage.name,
    });
    res.redirect("/");
  });
});

app.delete("/:id", async (req,res)=>{
  
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
})

const port = 3000;

app.listen(port, () => {
  console.log(`Sunucu ${port}'unda başlatıldı`);
});
