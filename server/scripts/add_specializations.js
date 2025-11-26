const db = require("../models");
const Field = db.Field;

async function addSpecializations() {
	try {
		console.log("🔧 Starting to add medical specializations...");

		const specializations = [
			"General Practitioner",
			"Pediatrician",
			"Obstetrician-Gynecologist",
			"Dermatologist",
			"Cardiologist",
			"Ophthalmologist",
			"Dentist",
			"ENT Specialist",
			"Psychiatrist",
			"Gastroenterologist",
		];

		for (const name of specializations) {
			// Check if specialization already exists
			const existing = await Field.findOne({ where: { name } });

			if (existing) {
				console.log(`✓ ${name} already exists`);
			} else {
				await Field.create({
					name,
					type: "medical",
					required: true,
				});
				console.log(`✅ Added ${name}`);
			}
		}

		// Remove old specializations if they exist
		const oldFields = ["Cardiology", "Dermatology", "General Medicine", "Pediatrics", "Psychiatry"];

		for (const oldName of oldFields) {
			const old = await Field.findOne({ where: { name: oldName } });
			if (old) {
				console.log(`⚠️  Found old field: ${oldName} - Please update manually or delete if not in use`);
			}
		}

		console.log("\n✅ All specializations added successfully!");
		console.log("\nCurrent specializations:");
		const allFields = await Field.findAll({ where: { type: "medical" } });
		allFields.forEach((field) => console.log(`  - ${field.name}`));

		process.exit(0);
	} catch (error) {
		console.error("❌ Error adding specializations:", error);
		process.exit(1);
	}
}

addSpecializations();