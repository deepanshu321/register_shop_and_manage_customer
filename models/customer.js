const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  washno:{
      type:String

  },
  password: {
    type: String,
    required: true
  },
  alldates:[{type:String}],

  date: {
    type: Date,
    default: Date.now
  }
});

const customer = mongoose.model('Customer', customerSchema);

module.exports = customer;
