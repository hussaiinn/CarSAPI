const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://hussain62655:Hussain12@dashboard.v5gxxt9.mongodb.net/?retryWrites=true&w=majority&appName=Dashboard",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Define a schema and model for your data
const dataSchema = new mongoose.Schema({
  car_name: String,
  manufacturing_year: String,
  price: Number,
});

const Data = mongoose.model("Data", dataSchema, "cars");

// Define routes
app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Define a POST route to handle form submissions
app.post("/api/data", async (req, res) => {
  const { car_name, manufacturing_year, price } = req.body;
  console.log(req.body);
  const newData = new Data({
    car_name,
    manufacturing_year,
    price,
  });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Define a DELETE route to handle record deletions
app.delete("/api/data/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    //   console.log(id);
    const deletedData = await Data.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Record not found" });
    }

    res
      .status(200)
      .json({ message: "Record deleted successfully", deletedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//get data by ID
app.get("/api/data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const findData = await Data.findById(id);
    console.log(findData);
    res.json(findData);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// Define a PUT route to handle record updates
app.put("/api/data/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  const { car_name, manufacturing_year, price } = req.body; // Get updated data from the request body

  try {
    // Find the record by ID and update it with new data
    const updatedData = await Data.findByIdAndUpdate(
      id,
      { car_name, manufacturing_year, price },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record updated successfully", updatedData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
