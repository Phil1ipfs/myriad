const db = require("../models");
const Field = db.Field;
const Doctor = db.Doctor;

exports.getActiveFields = async (req, res) => {
  try {
    // Return all fields, ordered by name
    const fields = await Field.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json(fields);
  } catch (error) {
    console.error("Error fetching fields:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch fields", error: error.message });
  }
};

exports.getActiveDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { status: "enabled" }, // only active doctors
      include: [
        {
          model: Field,
          as: "field",
          attributes: ["field_id", "name"],
        },
      ],
      order: [["first_name", "ASC"]],
      attributes: ["doctor_id", "first_name", "last_name", "field_id"], // only necessary fields
    });

    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch doctors", error: error.message });
  }
};

exports.seedSpecializations = async (req, res) => {
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

    const results = {
      added: [],
      existing: [],
      errors: [],
    };

    for (const name of specializations) {
      try {
        // Check if specialization already exists
        const existing = await Field.findOne({ where: { name } });

        if (existing) {
          console.log(`✓ ${name} already exists`);
          results.existing.push(name);
        } else {
          await Field.create({
            name,
            type: "medical",
            required: true,
          });
          console.log(`✅ Added ${name}`);
          results.added.push(name);
        }
      } catch (error) {
        console.error(`❌ Error adding ${name}:`, error.message);
        results.errors.push({ name, error: error.message });
      }
    }

    console.log("\n✅ Specialization seeding completed!");

    res.status(200).json({
      message: "Specialization seeding completed",
      results,
    });
  } catch (error) {
    console.error("❌ Error seeding specializations:", error);
    res.status(500).json({
      message: "Failed to seed specializations",
      error: error.message,
    });
  }
};
