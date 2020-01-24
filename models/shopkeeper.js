const mongoose = require('mongoose');

const ShopkeeperSchema = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  phoneno:{type:Number,required:true},
  customer:[{
			  	
  }],
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Shopkeeper = mongoose.model('Shopkeeper', ShopkeeperSchema);

module.exports = Shopkeeper;
