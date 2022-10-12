const mongoose = require("mongoose");
const { Schema } = mongoose;

const donationSchema = new Schema(
  {
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "BloodRequest"
    },
    facility: {
      type: Schema.Types.ObjectId,
      ref: "Facility"
    },
    expert: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

donationSchema.pre("validate", function (next) {
  if ((this.receiver && this.facility) || (!this.receiver && !this.facility))
    return next(
      new Error(
        "At least and only one field (receiver, facility) should be populated as a receiver"
      )
    );
  else next();
});

module.exports = mongoose.model("Donation", donationSchema);
