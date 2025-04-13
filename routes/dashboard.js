const express = require("express")
const Category = require("../models/Category")

const router = express.Router()

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    // Get total categories
    const totalCategories = await Category.countDocuments()

    // For a real app, you would have Product and Order models
    // For now, we'll return placeholder data
    const totalProducts = 0
    const totalOrders = 0

    res.json({
      totalCategories,
      totalProducts,
      totalOrders,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
