const path = require("path");

// Load dotenv first
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Force production database connection
process.env.NODE_ENV = "production";
process.env.FORCE_PRODUCTION_DB = "true";

// Use values from .env or fallback to defaults
// Note: Make sure your .env file has the correct production database credentials
if (!process.env.DB_HOST) {
	console.log("⚠️  Warning: DB_HOST not found in .env. Using default production host.");
	process.env.DB_HOST = "db.mxfuvioxlsnegqbczsjm.supabase.co";
}
if (!process.env.DB_PORT) {
	process.env.DB_PORT = "6543"; // Use connection pooling port
}
if (!process.env.DB_NAME) {
	process.env.DB_NAME = "postgres";
}
if (!process.env.DB_USER) {
	process.env.DB_USER = "postgres";
}
if (!process.env.DB_PASSWORD) {
	console.log("⚠️  Warning: DB_PASSWORD not found in .env. Please set it in your .env file.");
}
if (!process.env.DB_SSL) {
	process.env.DB_SSL = "true";
}

const db = require("../models");

async function clearDummyAccounts() {
	try {
		await db.sequelize.authenticate();
		console.log("✅ Database connected successfully\n");

		// Find all dummy accounts (emails ending with .dev@myriad.local)
		const dummyUsers = await db.User.findAll({
			where: {
				email: {
					[db.Sequelize.Op.like]: '%.dev@myriad.local'
				}
			}
		});

		if (dummyUsers.length === 0) {
			console.log("✅ No dummy accounts found to delete.");
			return;
		}

		console.log(`📋 Found ${dummyUsers.length} dummy account(s) to delete:\n`);
		dummyUsers.forEach(user => {
			console.log(`   - ${user.email} (${user.role})`);
		});
		console.log();

		let deletedCount = 0;

		for (const user of dummyUsers) {
			const userId = user.user_id;
			const userEmail = user.email;
			const userRole = user.role;

			console.log(`🗑️  Deleting ${userEmail}...`);

			try {
				// Delete related data based on role
				if (userRole === 'doctor') {
					// Delete doctor-specific data
					const doctor = await db.Doctor.findOne({ where: { user_id: userId } });
					if (doctor) {
						const doctorId = doctor.doctor_id;
						
						// Delete appointments
						await db.Appointment.destroy({ where: { doctor_id: doctorId } });
						console.log(`   ✓ Deleted appointments`);
						
						// Delete doctor availability
						await db.DoctorAvailability.destroy({ where: { doctor_id: doctorId } });
						console.log(`   ✓ Deleted doctor availability`);
					}
					
					// Delete doctor profile
					await db.Doctor.destroy({ where: { user_id: userId } });
					console.log(`   ✓ Deleted doctor profile`);
				} else if (userRole === 'client') {
					// Delete client-specific data
					const client = await db.Client.findOne({ where: { user_id: userId } });
					if (client) {
						// Delete appointments
						await db.Appointment.destroy({ where: { user_id: userId } });
						console.log(`   ✓ Deleted appointments`);
					}
					
					// Delete client profile
					await db.Client.destroy({ where: { user_id: userId } });
					console.log(`   ✓ Deleted client profile`);
				} else if (userRole === 'admin') {
					// Delete admin profile
					await db.Admin.destroy({ where: { user_id: userId } });
					console.log(`   ✓ Deleted admin profile`);
				}

				// Delete user-related data (common to all roles)
				// Delete comments
				await db.Comment.destroy({ where: { user_id: userId } });
				console.log(`   ✓ Deleted comments`);

				// Delete likes
				await db.Like.destroy({ where: { user_id: userId } });
				console.log(`   ✓ Deleted likes`);

				// Delete notifications
				await db.Notification.destroy({ where: { user_id: userId } });
				console.log(`   ✓ Deleted notifications`);

				// Delete messages (sent and received)
				await db.Message.destroy({ 
					where: {
						[db.Sequelize.Op.or]: [
							{ sender_id: userId },
							{ receiver_id: userId }
						]
					}
				});
				console.log(`   ✓ Deleted messages`);

				// Delete event registrations
				await db.EventRegister.destroy({ where: { user_id: userId } });
				console.log(`   ✓ Deleted event registrations`);

				// Delete event interests
				await db.EventInterest.destroy({ where: { user_id: userId } });
				console.log(`   ✓ Deleted event interests`);

				// Delete OTP records
				await db.OTP.destroy({ where: { user_id: userId } });
				console.log(`   ✓ Deleted OTP records`);

				// Finally, delete the user
				await db.User.destroy({ where: { user_id: userId } });
				console.log(`   ✓ Deleted user account`);

				deletedCount++;
				console.log(`   ✅ Successfully deleted ${userEmail}\n`);

			} catch (error) {
				console.error(`   ❌ Error deleting ${userEmail}:`, error.message);
			}
		}

		console.log(`\n🎉 Cleanup complete!`);
		console.log(`   Deleted ${deletedCount} out of ${dummyUsers.length} dummy account(s).`);

	} catch (error) {
		console.error("❌ Error clearing dummy accounts:", error);
	} finally {
		await db.sequelize.close();
	}
}

clearDummyAccounts();

