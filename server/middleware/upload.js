const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Create uploads directories if they don't exist
const eventsDir = path.join(__dirname, "../uploads/events");
const validIdsDir = path.join(__dirname, "../uploads/valid_ids");
const profilesDir = path.join(__dirname, "../uploads/profiles");

if (!fs.existsSync(eventsDir)) {
	fs.mkdirSync(eventsDir, { recursive: true });
}
if (!fs.existsSync(validIdsDir)) {
	fs.mkdirSync(validIdsDir, { recursive: true });
}
if (!fs.existsSync(profilesDir)) {
	fs.mkdirSync(profilesDir, { recursive: true });
}

// ✅ Configure local file storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let folder = eventsDir; // default for event images
		
		// Determine folder based on fieldname and route
		if (file.fieldname === "valid_id") {
			folder = validIdsDir;
		} else if (file.fieldname === "image") {
			// Check if this is a profile image (route contains "profile" or "admin/profile")
			const routePath = req.route?.path || req.path || "";
			if (routePath.includes("profile") || req.originalUrl?.includes("profile")) {
				folder = profilesDir;
			} else {
				// Default to events folder for event images
				folder = eventsDir;
			}
		}
		
		console.log(`📁 Saving file to: ${folder}, fieldname: ${file.fieldname}, route: ${req.route?.path || req.path}`);
		cb(null, folder);
	},
	filename: function (req, file, cb) {
		// Generate unique filename: timestamp-randomstring.ext
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname) || ".jpg"; // Default to .jpg if no extension

		let prefix = "event-"; // Default prefix for event images
		if (file.fieldname === "valid_id") {
			prefix = "valid-id-";
		} else if (file.fieldname === "image") {
			const routePath = req.route?.path || req.path || "";
			if (routePath.includes("profile") || req.originalUrl?.includes("profile")) {
				prefix = "profile-";
			} else {
				prefix = "event-"; // Event images
			}
		}

		const filename = prefix + uniqueSuffix + ext;
		console.log(`📝 Generated filename: ${filename}`);
		cb(null, filename);
	},
});

// ✅ File filter to accept only images
const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
	const allowedExtensions = [".jpg", ".jpeg", ".png"];

	const ext = path.extname(file.originalname).toLowerCase();

	// Accept if either MIME type or extension is valid
	if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
		cb(null, true);
	} else {
		cb(new Error("Only JPG, JPEG, and PNG images are allowed"), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
