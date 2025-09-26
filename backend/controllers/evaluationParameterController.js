import EvaluationParameter from "../models/evaluationParameter.js";

// GET /api/evaluation-parameters - Get all evaluation parameters
export const getAllEvaluationParameters = async (req, res) => {
  try {
    const parameters = await EvaluationParameter.find().sort({ createdAt: -1 });
    res.json(parameters);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/evaluation-parameters - Create a new evaluation parameter
export const createEvaluationParameter = async (req, res) => {
  try {
    const { name, description, marks } = req.body;

    // Validation
    if (!name || !description || marks === undefined) {
      return res
        .status(400)
        .json({ message: "Name, description, and marks are required" });
    }
    if (typeof marks !== "number" || marks < 0) {
      return res
        .status(400)
        .json({ message: "Marks must be a positive number" });
    }

    const newParameter = new EvaluationParameter({
      name: name.trim(),
      description: description.trim(),
      marks,
    });

    const savedParameter = await newParameter.save();
    res.status(201).json(savedParameter);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Parameter with this name already exists",
      });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

// PUT /api/evaluation-parameters/:id - Update an evaluation parameter
export const updateEvaluationParameter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, marks } = req.body;

    // Validation
    if (!name || !description || marks === undefined) {
      return res
        .status(400)
        .json({ message: "Name, description, and marks are required" });
    }
    if (typeof marks !== "number" || marks < 0) {
      return res
        .status(400)
        .json({ message: "Marks must be a positive number" });
    }

    const parameter = await EvaluationParameter.findById(id);
    if (!parameter) {
      return res
        .status(404)
        .json({ message: "Evaluation parameter not found" });
    }

    parameter.name = name.trim();
    parameter.description = description.trim();
    parameter.marks = marks;

    const updatedParameter = await parameter.save();
    res.json(updatedParameter);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/evaluation-parameters/:id - Delete an evaluation parameter
export const deleteEvaluationParameter = async (req, res) => {
  try {
    const { id } = req.params;
    const parameter = await EvaluationParameter.findById(id);

    if (!parameter) {
      return res
        .status(404)
        .json({ message: "Evaluation parameter not found" });
    }

    await EvaluationParameter.findByIdAndDelete(id);
    res.json({ message: "Evaluation parameter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
