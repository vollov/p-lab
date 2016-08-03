'use strict';

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
  email    : { type: String },
  firstName: { type: String },
});
var User = mongoose.model('User', UserSchema);

var CarSchema = new Schema({
  ownerId       : { type: Schema.Types.ObjectId, ref: 'User' },
  colour        : { type: String },
  numberOfWheels: { type: Number },
});
var Car = mongoose.model('Car', CarSchema);

var BicycleSchema = new Schema({
  ownerId       : { type: Schema.Types.ObjectId, ref: 'User' },
  colour        : { type: String },
  numberOfWheels: { type: Number },
});
var Bicycle = mongoose.model('Bicycle', BicycleSchema);

mongoose.connect('mongodb://localhost/blogtest');

var email = 'rupert@example.com';

function getVehicles(email, cb) {
  User.findOne({ email: email}, function(err, user) {
    if (err) {
      return cb(err);
    }
    Car.find({ ownerId: user._id }, function(err, cars) {
      if (err) {
        return cb(err);
      }
      Bicycle.find({ ownerId: user._id }, function(err, bicycles) {
        if (err) {
          return cb(err);
        }
        cb(null, {
          cars: cars,
          bicycles: bicycles
        });
      });
    });
  });
}

getVehicles(email, function(err, vehicles) {
  if (err) {
    console.error('Something went wrong: ' + err);
  }
  else {
    console.info(vehicles);
  }
  mongoose.disconnect();
});