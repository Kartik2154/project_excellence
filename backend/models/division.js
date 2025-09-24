import mongoose from "mongoose";

const divisionSchema = new mongoose.Schema(
  {
    course: {
      type: String,
      required: true,
      enum: ["BCA", "MCA", "BBA", "MBA"],
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    year: {
      type: Number,
      required: true,
      min: 2020,
      max: 2030,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Division = mongoose.model("Division", divisionSchema);
export default Division;
