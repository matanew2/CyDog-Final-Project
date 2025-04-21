const Assignment = require("../models/assignment");
const Dog = require("../models/dog");
const User = require("../models/user"); // Fixed capitalization to match convention
const { startRtspToHlsConversion } = require("../utils/ffmpeg"); // Import the conversion function

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

    // Validate UUID format instead of using isNaN which is inappropriate for UUIDs
    const uuidV4Regex =
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    if (!id || !uuidV4Regex.test(id)) {
      return res.status(400).json({ error: "Invalid assignment ID format" });
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
    const { type, dogId, userId, status, description } = req.body;

    console.log("Update assignment request:", req.body);

    // Validate assignment ID existence
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Validate status value
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

    // Prepare update data
    const updateData = {};
    if (type) updateData.type = type;
    if (dogId) updateData.dogId = dogId;
    if (userId) updateData.userId = userId;
    if (description !== undefined) updateData.description = description;

    // Special handling for status changes
    if (status) {
      updateData.status = status;

      // Auto-set completedAt when status changes to Completed
      if (status === "Completed" && assignment.status !== "Completed") {
        updateData.completedAt = new Date().toISOString();
      }

      // Clear completedAt when changing from Completed to another status
      if (status !== "Completed" && assignment.status === "Completed") {
        updateData.completedAt = null;
      }
    }

    // Update the assignment
    await Assignment.update(updateData, { where: { id } });

    // Fetch the updated assignment to return complete data
    const updatedAssignment = await Assignment.findByPk(id, {
      include: [
        { model: Dog, attributes: ["id", "name"] },
        { model: User, attributes: ["id", "name"] },
      ],
    });

    res.status(200).json(updatedAssignment);
  } catch (error) {
    console.error("Update assignment error:", error);
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

/**
 * Convert RTSP stream to HLS format
 * @param {Object} req - Request object containing rtspUrl and dogId
 * @param {Object} res - Response object
 */
exports.convertRTSPToHLS = async (req, res) => {
  try {
    const { rtspUrl, dogId } = req.body;

    // Validate required fields
    if (!rtspUrl || !dogId) {
      return res
        .status(400)
        .json({ error: "RTSP URL and Dog ID are required" });
    }

    // Validate URL format (basic validation)
    if (!rtspUrl.startsWith("rtsp://")) {
      return res.status(400).json({ error: "Invalid RTSP URL format" });
    }

    // Verify dog existence
    const dog = await Dog.findByPk(dogId);
    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }

    // Generate a unique identifier for this stream
    const streamId = `${dogId}_${Date.now()}`;

    // Start the ffmpeg process to convert RTSP to HLS
    const conversionResult = await startRtspToHlsConversion(rtspUrl, streamId);

    // Store the correct HLS URL in the dog record
    await dog.update({ hlsUrl: conversionResult.hlsUrl });

    console.log(
      `Started RTSP to HLS conversion for dog ${dogId} with URL ${rtspUrl}`
    );
    console.log(`HLS stream will be available at ${conversionResult.hlsUrl}`);

    // Return the HLS URL to the client
    res.status(200).json({
      success: true,
      message: "RTSP to HLS conversion started",
      data: {
        dogId,
        hlsUrl: conversionResult.hlsUrl, // Use the correct URL
        streamId,
        status: conversionResult.status,
        pid: conversionResult.pid,
      },
    });
  } catch (error) {
    console.error("Error converting RTSP to HLS:", error);
    res.status(500).json({
      error: "Failed to convert RTSP to HLS",
      details: error.message,
    });
  }
};

/**
 * Stop an active HLS stream
 * @param {Object} req - Request object containing streamId
 * @param {Object} res - Response object
 */
exports.stopStream = async (req, res) => {
  try {
    const { streamId } = req.body;

    if (!streamId) {
      return res.status(400).json({ error: "Stream ID is required" });
    }

    // Stop the FFmpeg process
    const result = await stopRtspToHlsConversion(streamId);

    res.status(200).json({
      success: true,
      message: "Stream stopped successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error stopping stream:", error);
    res.status(500).json({
      error: "Failed to stop stream",
      details: error.message,
    });
  }
};
