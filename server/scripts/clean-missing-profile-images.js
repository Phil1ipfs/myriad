const db = require("../models");
const fs = require("fs");
const path = require("path");

const User = db.User;

async function cleanMissingProfileImages() {
	try {
		console.log("🔍 Checking for users with invalid profile pictures...");

		// Get all users with profile pictures
		const users = await User.findAll({
			where: {
				profile_picture: {
					[db.Sequelize.Op.ne]: null,
				},
			},
		});

		let fixedCount = 0;

		for (const user of users) {
			const profilePicture = user.profile_picture;

			if (profilePicture && profilePicture.startsWith("/uploads/profiles/")) {
				// Extract filename from URL
				const filename = profilePicture.replace("/uploads/profiles/", "");
				const filePath = path.join(__dirname, "../uploads/profiles", filename);

				// Check if file exists
				if (!fs.existsSync(filePath)) {
					console.log(
						`❌ Missing file for user ${user.user_id} (${user.email}): ${profilePicture}`
					);

					// Set profile_picture to null
					await User.update(
						{ profile_picture: null },
						{ where: { user_id: user.user_id } }
					);

					fixedCount++;
					console.log(`✅ Cleared invalid profile picture for user ${user.user_id}`);
				} else {
					console.log(`✓ Profile picture exists for user ${user.user_id}`);
				}
			}
		}

		console.log(`\n✅ Done! Fixed ${fixedCount} invalid profile picture(s).`);
		process.exit(0);
	} catch (error) {
		console.error("❌ Error:", error);
		process.exit(1);
	}
}

cleanMissingProfileImages();