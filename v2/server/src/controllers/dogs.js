const Dog = require("../models/dog");
const User = require("../models/user"); // Assuming you have a User model defined

//TODO: NEED TO ENABLE ACCESS IMAGE FOR DOGS AT LOCALHOST:8080/uploads/dogs/filename.jpg

// Get all dogs
exports.getAllDogs = async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    if (!dogs || dogs.length === 0) {
      return res.status(404).json({ error: "No dogs found" });
    }
    res.status(200).json(dogs);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    res.status(500).json({ error: "Failed to fetch dogs" });
  }
};

// Get dog by ID
exports.getDogById = async (req, res) => {
  try {
    const dog = await Dog.findByPk(req.params.id);
    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }
    res.status(200).json({ data: dog });
  } catch (error) {
    console.error("Error fetching dog:", error);
    res.status(500).json({ error: "Failed to fetch dog" });
  }
};

// Create a new dog
exports.createDog = async (req, res) => {
  try {
    const { name, breed, age, type } = req.body;
    if (!name || !breed || !age || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      return res.status(400).json({ error: "Age must be a positive number" });
    }
    const imagePath = req.file ? `/uploads/dogs/${req.file.filename}` : null;
    const newDog = await Dog.create({
      name,
      breed,
      age: ageNumber,
      type,
      image: imagePath,
    });
    res.status(201).json(newDog);
  } catch (error) {
    console.error("Error creating dog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a dog
exports.updateDog = async (req, res) => {
  try {
    // Validate params
    const dogId = req.params.id;
    if (!dogId) {
      return res.status(400).json({ error: "Dog ID is required" });
    }
    // Check if dogId exists
    const dogExists = await Dog.findByPk(dogId);
    if (!dogExists) {
      return res.status(404).json({ error: "Dog not found" });
    }

    // Validate the request body
    console.log("Request body:", req.body); // Debugging line
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required" });
    }
    const { name, breed, age, type } = req.body;

    if (!name || !breed || !type) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (typeof age !== "undefined") {
      const ageNumber = parseInt(age);
      if (isNaN(ageNumber) || ageNumber <= 0) {
        return res.status(400).json({ error: "Age must be a positive number" });
      }
    }
    if (
      typeof name !== "string" ||
      typeof breed !== "string" ||
      typeof type !== "string"
    ) {
      return res.status(400).json({ error: "Invalid input types" });
    }
    if (name.length < 2 || breed.length < 2 || type.length < 2) {
      return res.status(400).json({
        error: "Name, breed, and type must be at least 2 characters long",
      });
    }

    const dog = await Dog.findByPk(req.params.id);
    const imagePath = req.file
      ? `/uploads/dogs/${req.file.filename}`
      : dog.image;

    await dog.update({
      name,
      breed,
      age: age ? parseInt(age) : dog.age,
      type,
      image: imagePath,
    });
    res.status(200).json({ data: dog });
  } catch (error) {
    console.error("Error updating dog:", error);
    res.status(500).json({ error: "Failed to update dog" });
  }
};

// Delete a dog
exports.deleteDog = async (req, res) => {
  try {
    // Validate params
    const dogId = req.params.id;
    if (!dogId) {
      return res.status(400).json({ error: "Dog ID is required" });
    }
    // Check if dogId exists
    const dog = await Dog.findByPk(req.params.id);
    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }
    await dog.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting dog:", error);
    res.status(500).json({ error: "Failed to delete dog" });
  }
};
