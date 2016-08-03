'use strict';

var Q        = require('q');
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

function getVehicles(email) {
  var foundCars, foundUser;
  return Q(User.findOne({ email: email }).exec())
  .then(function(user) {
    foundUser = user;
    return Q(Car.find({ ownerId: user._id }).exec())
  })
  .then(function(cars) {
    foundCars = cars;
    return Q(Bicycle.find({ ownerId: foundUser._id }).exec())
  })
  .then(function(bicycles) {
    return {
      bicycles: bicycles,
      cars: foundCars
    };
  });
}

getVehicles(email)
.then(function(vehicles) {
  console.log(vehicles);
})
.catch(function(err) {
  console.error('Something went wrong: ' + err);
})
.done(function() {
  mongoose.disconnect();
});

function getVehiclesV2(email) {
	  return Q(User.findOne({ email: email }).exec())
	  .then(function(user) {
	    return Q.all([
	      Q(Bicycle.find({ ownerId: user._id }).exec()),
	      Q(Car.find({ ownerId: user._id }).exec())
	    ]);
	  })
	  .then(function(results) {
	    return {
	      bicycles: results[0],
	      cars: results[1]
	    };
	  });
	}

function getVehiclesV3(email) {
	  return Q(User.findOne({ email: email }).exec())
	  .then(function(user) {
	    return [
	      Q(Bicycle.find({ ownerId: user._id }).exec()),
	      Q(Car.find({ ownerId: user._id }).exec())
	    ];
	  })
	  .spread(function(bicycles, cars) {
	    return {
	      bicycles: bicycles,
	      cars: cars
	    };
	  });
	}