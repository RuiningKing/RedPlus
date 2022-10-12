const BloodRequest = require("../models/BloodRequest");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const { receiveFrom } = require("../utils/bloodUtil");
const Notification = require("../models/Notification");
const Donation = require("../models/Donation");
const Facility = require("../models/Facility");
const ObjectId = require("mongoose").ObjectId;

const getAllBloodRequsts = asyncHandler(async (req, res) => {
  const { lng: longitude, lat: latitude } = req.query;
  const coordinates = [longitude, latitude];
  const reqs = await BloodRequest.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates
        },
        $maxDistance: 2000
      }
    },
    fulfilled: false,
    receiver: { $ne: req.user._id }
  }).populate("receiver", "-phone -name");
  res.status(200).send(reqs);
});

const postBloodRequest = asyncHandler(async (req, res) => {
  const coordinates = [req.body.lng, req.body.lat];
  const bloodType = req.body.bloodType;
  const doc = {
    receiver: req.user._id,
    location: { type: "Point", coordinates },
    bloodType
  };
  const newReq = await BloodRequest.create(doc);
  if (!newReq) throw new Error("Error creating blood request");

  const nearByUsers = await User.find({
    _id: { $ne: req.user._id },
    bloodType: { $in: receiveFrom(bloodType) },
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates
        },
        $maxDistance: 2000
      }
    }
  });

  if (nearByUsers && nearByUsers.length > 0) {
    await Notification.insertMany(
      nearByUsers.map((nearByUser) => {
        const doc = {
          user: nearByUser._id,
          message: `${
            nearByUser.name.split(" ")[0]
          }, there is person of blood type ${bloodType} who requires your donation`
        };
        return doc;
      })
    );
  }

  res.status(201).send(newReq);
});

const postDonation = asyncHandler(async (req, res) => {
  const { requestId } = req.body;
  const origRequest = await BloodRequest.findById(requestId);
  if (!origRequest) throw new Error("Cannot find blood request");
  if (origRequest.fulfilled) {
    res.status(400);
    throw new Error("Blood request has already been donated to");
  }

  const existingDonation = await Donation.findOne({
    donor: req.user._id,
    receiver: new Object(requestId)
  });
  if (existingDonation) {
    res.status(400);
    throw new Error("Donation already exists");
  }
  const don = await Donation.create({
    donor: req.user._id,
    receiver: new Object(requestId)
  });

  if (!don) throw new Error("Cannot create donation");
  res.status(201).send(don);
});

const postDonationFacility = asyncHandler(async (req, res) => {
  const { facilityId } = req.body;
  const facility = await Facility.findById(facilityId);
  if (!facility) throw new Error("Facility not found");
  const don = await Donation.create({
    user: req.user._id,
    facility: new ObjectId(facilityId)
  });
  if (!don) throw new Error("Cannot create donation");
  if (facility.donations) facility.donations = [];
  facility.donations = facility.donations.push(new ObjectId(don._id));
  const newFac = await facility.save();
  if (!newFac) throw new Error("Cannot update facility");
  res.status(201).send(don);
});

const acceptDonation = asyncHandler(async (req, res) => {
  const { donationId } = req.body;
  const newDon = await Donation.findByIdAndUpdate(
    donationId,
    { expert: req.user._id },
    { new: true }
  );
  if (!newDon) throw new Error("Cannot accept donation");
  console.log(
    await (
      await Donation.deleteMany({ receiver: newDon.receiver })
    ).deletedCount
  );
  if (
    !(await BloodRequest.findByIdAndUpdate(
      newDon.receiver,
      { fulfilled: true },
      { new: true }
    ))
  )
    throw new Error("Cannot update blood request to fulfilled");
  res.status(200).send(newDon);
});

const transferDonationToFacility = asyncHandler(async (req, res) => {
  const { donationId, facility: facilityId } = req.body;
  if (!facilityId) {
    res.status(400);
    throw new Error("Please select a facility");
  }
  const newDon = await Donation.findByIdAndUpdate(
    donationId,
    {
      expert: req.user._id,
      facilityId: new ObjectId(facilityId)
    },
    { new: true }
  );
  if (!newDon) throw new Error("Cannot convert donation");
  res.status(200).send(newDon);
});

const getFacility = asyncHandler(async (req, res) => {
  const { lng: longitude, lat: latitude, keyword } = req.query;
  var options = {};
  if (keyword)
    options = {
      name: { $regex: keyword, $options: "i" }
    };
  else if (longitude !== undefined && latitude != undefined)
    options = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 2000
        }
      }
    };
  console.log(options);
  const facs = await Facility.find(
    Object.keys(options).length > 0 ? options : null
  );
  if (!facs) throw new Error("Cannot fetch facilities");
  res.status(200).send(facs);
});

const getPendingDonations = asyncHandler(async (req, res) => {
  const { lng: longitude, lat: latitude } = req.query;
  console.log(latitude, longitude);
  const dons = await Donation.find({ expert: { $exists: false } })
    .populate({
      path: "receiver",
      match: {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: 2000
          }
        }
      },
      populate: {
        path: "receiver"
      }
    })
    .populate(["donor", "facility"])
    .exec();
  if (!dons) throw new Error("Cannot fetch donations");
  res.status(200).send(dons);
});

module.exports = {
  getAllBloodRequsts,
  postBloodRequest,
  postDonation,
  acceptDonation,
  transferDonationToFacility,
  postDonationFacility,
  getFacility,
  getPendingDonations
};
