const mongoose = require("mongoose");
const { Schema } = mongoose;

const bloodRequestSchema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    facility: {
      type: Schema.Types.ObjectId,
      ref: "Facility"
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
    bloodType: {
      type: String,
      enum: ["O-", "O+", "B-", "B+", "A-", "A+", "AB-", "AB+"],
      required: true
    },
    fulfilled: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  {
    timestamps: true
  }
);

bloodRequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
