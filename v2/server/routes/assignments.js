const express = require("express");
const router = express.Router();
const assignmentsController = require("../controllers/assignments");

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the assignment
 *         type:
 *           type: string
 *           description: Type of the assignment
 *         dogId:
 *           type: string
 *           format: uuid
 *           description: ID of the dog associated with the assignment
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user assigned to the task
 *         status:
 *           type: string
 *           enum: [Active, Completed, Pending]
 *           default: Pending
 *           description: Current status of the assignment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the assignment was created
 *         completedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Timestamp when the assignment was completed
 *         description:
 *           type: string
 *           nullable: true
 *           description: Detailed description of the assignment
 *       required:
 *         - id
 *         - type
 *         - dogId
 *         - userId
 *         - status
 *         - createdAt
 */

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: API for managing dog assignments
 */

/**
 * @swagger
 * /assignments:
 *   get:
 *     tags: [Assignments]
 *     summary: Retrieve a list of assignments
 *     responses:
 *       200:
 *         description: A list of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: No assignments found
 *       500:
 *         description: Internal server error
 */
router.get("/", assignmentsController.getAllAssignments);

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     tags: [Assignments]
 *     summary: Retrieve a specific assignment by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the assignment to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A specific assignment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", assignmentsController.getAssignmentById);

/**
 * @swagger
 * /assignments:
 *   post:
 *     tags: [Assignments]
 *     summary: Create a new assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the assignment
 *               dogId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the dog associated with the assignment
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user assigned to the task
 *               description:
 *                 type: string
 *                 description: Detailed description of the assignment
 *               status:
 *                 type: string
 *                 enum: [Active, Completed, Pending]
 *                 description: Initial status of the assignment
 *             required:
 *               - type
 *               - dogId
 *               - userId
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Dog or user not found
 *       500:
 *         description: Internal server error
 */
router.post("/", assignmentsController.createAssignment);

/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     tags: [Assignments]
 *     summary: Update an existing assignment
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the assignment to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the assignment
 *               dogId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the dog associated with the assignment
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user assigned to the task
 *               status:
 *                 type: string
 *                 enum: [Active, Completed, Pending]
 *                 description: New status of the assignment
 *               description:
 *                 type: string
 *                 description: Detailed description of the assignment
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp when the assignment was completed
 *     responses:
 *       200:
 *         description: The updated assignment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", assignmentsController.updateAssignment);

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     tags: [Assignments]
 *     summary: Delete an assignment by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the assignment to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Assignment deleted successfully
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Assignment not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", assignmentsController.deleteAssignment);

module.exports = router;
