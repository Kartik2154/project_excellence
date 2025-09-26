import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    divisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
