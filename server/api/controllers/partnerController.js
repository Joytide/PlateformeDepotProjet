'use strict';

var mongoose = require('mongoose');
var Partner = mongoose.model('Partner');

exports.list_all_partners = function (req, res) {
  Partner.find({}, function (err, partner) {
    if (err)
      res.send(err);
    res.json(partner);
  });
};

exports.create_a_partner = function (req, res) {
  var new_partner = new Partner(req.body);
  console.log(new_partner);
  new_partner.save(function (err, partner) {
    if (err)
      res.send(err);
    res.json(partner);
  });
};

exports.find_by_mail = (req, res) => {
  Partner.findOne({ email: req.params.email }, (err, partner) => {
    if (err) {
      res.send(err);
    }
    res.json(partner);
  });
}

exports.update_a_partner = (req, res) => {
  Partner.findOneAndUpdate({ _id: req.params.partnerId }, req.body, { new: true }, (err, partner) => {
    if (err) {
      res.send(err);
    }
    res.json(partner);
  });
}

exports.delete_a_partner = (req, res) => {
  Partner.findByIdAndRemove(req.params.partnerId, function (err, note) {
    if (err) {
      console.log(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: "Partner not found with id " + req.params.partnerId });
      }
      return res.status(500).send({ message: "Could not delete Partner with id " + req.params.partnerId });
    }

    if (!note) {
      return res.status(404).send({ message: "Partner not found with id " + req.params.partnerId });
    }

    res.send({ message: "Partner deleted successfully!" })
  });
}