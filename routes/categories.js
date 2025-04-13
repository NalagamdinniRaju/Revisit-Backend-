const express = require("express")
const Category = require("../models/Category")
const { verifyToken } = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    res.json(category)
  } catch (error) {
    console.error("Get category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new category
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, itemCount } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" })
    }

    const imageUrl = `https://revisit-backend-jr8w.onrender.com/uploads/${req.file.filename}`

    const category = new Category({
      name,
      itemCount: itemCount || 0,
      imageUrl,
    })

    await category.save()

    res.status(201).json(category)
  } catch (error) {
    console.error("Create category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update category
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, itemCount } = req.body

    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Update fields
    category.name = name
    category.itemCount = itemCount || 0

    // Update image if provided
    if (req.file) {
      category.imageUrl = `https://revisit-backend-jr8w.onrender.com/uploads/${req.file.filename}`
    }

    await category.save()

    res.json(category)
  } catch (error) {
    console.error("Update category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete category
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    await category.deleteOne()

    res.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Delete category error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
