const mongoose = require("mongoose");

const aboutFeatureSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

const aboutSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    highlight: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    features: {
      type: [aboutFeatureSchema],
      required: true,

      validate: {
        validator: (value) =>
          value.length >= 1 && value.length <= 6,

        message:
          "About must have between 1 and 6 features",
      },
    },
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model("About", aboutSchema);

module.exports = About;