const express = require("express");
const router = express.Router();
const dogsController = require("../controllers/dogs");

/**
 * @swagger
 * components:
 *   schemas:
 *     Dog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the dog
 *         name:
 *           type: string
 *           description: Name of the dog
 *         breed:
 *           type: string
 *           description: Breed of the dog
 *         age:
 *           type: integer
 *           description: Age of the dog in years
 *         type:
 *           type: string
 *           description: Type or category of the dog
 *         image:
 *           type: string
 *           description: URL or path to the dog's image (optional)
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user associated with the dog
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the dog was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the dog was last updated
 *       required:
 *         - name
 *         - breed
 *         - age
 *         - type
 *         - userId
 *         - createdAt
 *         - updatedAt
 */

/**
 * @swagger
 * tags:
 *   name: Dogs
 *   description: API for managing dogs
 */

/**
 * @swagger
 * /dogs:
 *   get:
 *     tags: [Dogs]
 *     summary: Retrieve a list of dogs
 *     responses:
 *       200:
 *         description: A list of dogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Dogs not found
 *       500:
 *         description: Internal server error
 */
router.get("/", dogsController.getAllDogs);

/**
 * @swagger
 * /dogs/{id}:
 *   get:
 *     tags: [Dogs]
 *     summary: Retrieve a specific dog by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the dog to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A specific dog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Dog not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", dogsController.getDogById);

/**
 * @swagger
 * /dogs:
 *   post:
 *     tags: [Dogs]
 *     summary: Create a new dog
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the dog
 *               breed:
 *                 type: string
 *                 description: Breed of the dog
 *               age:
 *                 type: integer
 *                 description: Age of the dog in years
 *               type:
 *                 type: string
 *                 description: Type or category of the dog
 *               image:
 *                 type: string
 *                 description: URL or path to the dog's image (optional)
 *             required:
 *               - name
 *               - breed
 *               - age
 *               - type
 *     responses:
 *       201:
 *         description: Dog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", dogsController.createDog);

/**
 * @swagger
 * /dogs/{id}:
 *   put:
 *     tags: [Dogs]
 *     summary: Update an existing dog
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the dog to update
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
 *               name:
 *                 type: string
 *                 description: Name of the dog
 *               breed:
 *                 type: string
 *                 description: Breed of the dog
 *               age:
 *                 type: integer
 *                 description: Age of the dog in years
 *               type:
 *                 type: string
 *                 description: Type or category of the dog
 *               image:
 *                 type: string
 *                 description: URL or path to the dog's image (optional)
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user associated with the dog
 *     responses:
 *       200:
 *         description: Dog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dog'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Dog not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", dogsController.updateDog);

/**
 * @swagger
 * /dogs/{id}:
 *   delete:
 *     tags: [Dogs]
 *     summary: Delete a dog
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the dog to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Dog deleted successfully
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Dog not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", dogsController.deleteDog);

module.exports = router;
