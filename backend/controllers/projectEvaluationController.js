import ProjectEvaluation from "../models/projectEvaluation.js";
import EvaluationParameter from "../models/evaluationParameter.js";

// Get all evaluations
export const getAllProjectEvaluations = async (req, res) => {
  try {
    const evaluations = await ProjectEvaluation.find({})
      .populate("parameterId", "marks")
      .populate("projectId", "name projectTitle");
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get evaluations for a project
export const getProjectEvaluations = async (req, res) => {
  try {
    const evaluations = await ProjectEvaluation.find({
      projectId: req.params.projectId,
    })
      .populate("parameterId", "name description marks")
      .populate("evaluatedBy", "name");
    res.status(200).json(evaluations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update evaluation marks
export const updateProjectEvaluation = async (req, res) => {
  try {
    const { givenMarks } = req.body;
    const evaluation = await ProjectEvaluation.findOneAndUpdate(
      { projectId: req.params.projectId, parameterId: req.params.parameterId },
      { givenMarks, evaluatedBy: req.admin.id },
      { new: true, upsert: true }
    )
      .populate("parameterId", "name description marks")
      .populate("evaluatedBy", "name");
    res.status(200).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
