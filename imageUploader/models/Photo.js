const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    title:String,
    image:String,
    dateCreated: {
        type: Date,
        default: Date.now,
      },
})
const Photo = mongoose.model('Photo', PhotoSchema);
module.exports = Photo;


// app.get("/uploading", async (req, res) => {
//   res.render("upload");
//   setTimeout(()=>{
//     res.redirect(`/photos/${save._id}`);
//     console.log("a");
//   },1500)
// });

