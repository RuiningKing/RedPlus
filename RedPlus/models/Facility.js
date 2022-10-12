const mongoose = require("mongoose");
const { Schema } = mongoose;

const faciltiySchema = new Schema(
  {
    name: {
      type: String,
      default: "RedPlus Facility",
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    donations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Donation"
      }
    ],
    staff: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

faciltiySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Faciltiy", faciltiySchema);
