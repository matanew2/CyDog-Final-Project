const Assignment = require("../models/assignment");
const Dog = require("../models/dog");
const User = require("../models/user"); // Fixed capitalization to match convention

/**
 * Get all assignments with associated dog and user data
 * @returns {Promise<Array>} List of assignments
 */
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: Dog, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] },
      ],
    });

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ error: "No assignments found" });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch assignments",
      details: error.message,
    });
  }
};

/**
 * Create a new assignment
 * @param {Object} req - Request object containing assignment data
 * @param {Object} res - Response object
 */
exports.createAssignment = async (req, res) => {
  try {
    const { type, dogId, userId, description } = req.body;

    // Validate required fields
    if (!type || !dogId || !userId) {
      return res
        .status(400)
        .json({ error: "Type, dogId, and userId are required" });
    }

    // Validate status if provided
    if (
      req.body.status &&
      !["Active", "Completed", "Pending"].includes(req.body.status)
    ) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Verify dog and user existence
    const [dog, user] = await Promise.all([
      Dog.findByPk(dogId),
      User.findByPk(userId),
    ]);

    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const assignmentData = {
      type,
      dogId,
      userId,
      description,
      status: req.body.status || "Pending",
    };

    const assignment = await Assignment.create(assignmentData);
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({
      error: "Failed to create assignment",
      details: error.message,
    });
  }
};

/**
 * Get an assignment by ID
 * @param {Object} req - Request object containing assignment ID
 * @param {Object} res - Response object
 */
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid assignment ID" });
    }

    const assignment = await Assignment.findByPk(id, {
      include: [
        { model: Dog, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch assignment",
      details: error.message,
    });
  }
};

/**
 * Update an existing assignment
 * @param {Object} req - Request object containing assignment data
 * @param {Object} res - Response object
 */
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, dogId, userId, status, description, completedAt } = req.body;

    // Validate assignment ID existence in db
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    if (status && !["Active", "Completed", "Pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Verify dog and user if provided
    if (dogId && !(await Dog.findByPk(dogId))) {
      return res.status(404).json({ error: "Dog not found" });
    }
    if (userId && !(await User.findByPk(userId))) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {};
    if (type) updateData.type = type;
    if (dogId) updateData.dogId = dogId;
    if (userId) updateData.userId = userId;
    if (status) updateData.status = status;
    if (description !== undefined) updateData.description = description;
    if (completedAt !== undefined) updateData.completedAt = completedAt;

    const [affectedRows, [updatedAssignment]] = await Assignment.update(
      updateData,
      {
        where: { id },
        returning: true,
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json({
      error: "Failed to update assignment",
      details: error.message,
    });
  }
};

/**
 * Delete an assignment by ID
 * @param {Object} req - Request object containing assignment ID
 * @param {Object} res - Response object
 */
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Assignment.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: "Failed to delete assignment",
      details: error.message,
    });
  }
};
