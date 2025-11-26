// routes/event.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");

// ✅ Make sure the filename is correct: "../controllers/event.controller.js"
const eventController = require("../controllers/event.controllers");
const upload = require("../middleware/upload");

// ✅ Multer error handling middleware
const handleUploadError = (err, req, res, next) => {
	if (err) {
		console.error("❌ Upload error:", err.message);
		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({
					message: "File too large. Maximum size is 5MB.",
					error: err.message,
				});
			}
			return res.status(400).json({
				message: "File upload error.",
				error: err.message,
			});
		}
		return res.status(400).json({
			message: err.message || "File upload failed.",
			error: err.message,
		});
	}
	next();
};

// ✅ Routes
router.post("/", upload.single("image"), handleUploadError, eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/stats/:year", eventController.getMonthlyEvents);
router.get("/upcoming", eventController.getUpcomingEventsThisMonth);
router.delete("/:event_id", eventController.deleteEvent);
router.get("/stats-2", eventController.getEventStats);
router.put("/update-past", eventController.updatePastEvents);
router.post("/register", eventController.registerEvent);
router.post("/cancel", eventController.cancelRegistration);
router.get(
	"/:event_id/registrations",
	eventController.getRegisteredUsersForEvent
);

module.exports = router;
