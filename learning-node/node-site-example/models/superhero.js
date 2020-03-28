
const mongoose = require('mongoose');
const supheroSchema = new mongoose.Schema({
  name: String,
  image: String,
  comments: [
    {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Comment"
    }
 ]
}, { collection: 'superheroes' }); //Set a different name for your collection

module.exports = mongoose.model("Superhero",supheroSchema);