import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    divisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      maxlength: 20,
      trim: true,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    studentName: {
      type: String,
      maxlength: 100,
      trim: true,
    },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;
