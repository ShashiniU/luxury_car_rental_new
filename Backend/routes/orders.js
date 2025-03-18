const express = require("express")
const router = express.Router()
const multer = require("multer");
const path = require("path");
const Order = require("../models/orderModel")
// Route to create an order
router.post('/orders', async (req, res) => {
    const { userId, carId, contactInfo, scheduledDate, scheduledTime, paymentInfo } = req.body;
    try {
      const newOrder = new Order({
        userId,
        carId,
        contactInfo,
        scheduledDate,
        scheduledTime,
        paymentInfo,
      });
  
      await newOrder.save();
  
      res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  });
  
/// Get orders for a specific user
router.get("/orders/:userId",  async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from the request params
       
        const orders = await Order.find({ userId }).populate("carId", "brand model year price");
     
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
module.exports = router