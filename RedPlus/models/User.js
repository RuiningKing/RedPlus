const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: String,
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    diseases: {
      type: [
        {
          type: String,
          enum: [
            "Babesiosis",
            "Chagas Disease",
            "Leishmaniasis",
            "Malaria",
            "ChikV",
            "DF",
            "HAV",
            "HBV",
            "HCV",
            "HEV",
            "HIV",
            "HTLV",
            "WNV",
            "ZIKV"
          ]
        }
      ]
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "expert"]
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
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
