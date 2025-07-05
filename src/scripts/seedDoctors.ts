import { createClient } from "@supabase/supabase-js";

// Create a server-side Supabase client for seeding with service role key
const supabaseUrl = "https://kxzfktuxbvcybmdtzkzy.supabase.co";
// You need to get the CORRECT service role key from your Supabase dashboard
const supabaseServiceKey = "REPLACE_WITH_ACTUAL_SERVICE_ROLE_KEY";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Kenya cities with coordinates
const kenyanCities = [
  {
    name: "Nairobi",
    state: "Nairobi County",
    latitude: -1.2921,
    longitude: 36.8219,
  },
  {
    name: "Kisumu",
    state: "Kisumu County",
    latitude: -0.0917,
    longitude: 34.768,
  },
  {
    name: "Mombasa",
    state: "Mombasa County",
    latitude: -4.0435,
    longitude: 39.6682,
  },
  {
    name: "Nakuru",
    state: "Nakuru County",
    latitude: -0.3031,
    longitude: 36.08,
  },
  {
    name: "Eldoret",
    state: "Uasin Gishu County",
    latitude: 0.5143,
    longitude: 35.2698,
  },
  {
    name: "Thika",
    state: "Kiambu County",
    latitude: -1.0332,
    longitude: 37.0691,
  },
  {
    name: "Malindi",
    state: "Kilifi County",
    latitude: -3.2194,
    longitude: 40.1169,
  },
  {
    name: "Kitale",
    state: "Trans Nzoia County",
    latitude: 1.0158,
    longitude: 35.0062,
  },
  {
    name: "Garissa",
    state: "Garissa County",
    latitude: -0.4569,
    longitude: 39.664,
  },
  {
    name: "Kakamega",
    state: "Kakamega County",
    latitude: 0.2827,
    longitude: 34.7519,
  },
];

// Updated doctors data with more common specialties
const doctorsData = [
  // Nairobi Doctors
  {
    firstName: "Sarah",
    lastName: "Wanjiku",
    specialty: "Cardiology",
    experience: 15,
    licensePrefix: "KE/CAR",
  },
  {
    firstName: "James",
    lastName: "Ochieng",
    specialty: "Neurology",
    experience: 12,
    licensePrefix: "KE/NEU",
  },
  {
    firstName: "Grace",
    lastName: "Mutua",
    specialty: "Dermatology",
    experience: 8,
    licensePrefix: "KE/DER",
  },
  {
    firstName: "David",
    lastName: "Kipkorir",
    specialty: "Orthopedics",
    experience: 10,
    licensePrefix: "KE/ORT",
  },
  {
    firstName: "Mary",
    lastName: "Nyong",
    specialty: "Pediatrics",
    experience: 9,
    licensePrefix: "KE/PED",
  },

  // Kisumu Doctors
  {
    firstName: "Peter",
    lastName: "Otieno",
    specialty: "Internal Medicine",
    experience: 14,
    licensePrefix: "KE/INT",
  },
  {
    firstName: "Alice",
    lastName: "Akinyi",
    specialty: "Gynecology",
    experience: 11,
    licensePrefix: "KE/GYN",
  },
  {
    firstName: "John",
    lastName: "Awino",
    specialty: "Psychiatry",
    experience: 7,
    licensePrefix: "KE/PSY",
  },

  // Mombasa Doctors
  {
    firstName: "Fatuma",
    lastName: "Hassan",
    specialty: "Emergency Medicine",
    experience: 6,
    licensePrefix: "KE/EME",
  },
  {
    firstName: "Ahmed",
    lastName: "Mohamed",
    specialty: "Internal Medicine",
    experience: 13,
    licensePrefix: "KE/INT",
  },
  {
    firstName: "Zainab",
    lastName: "Ali",
    specialty: "Dermatology",
    experience: 9,
    licensePrefix: "KE/DER",
  },

  // Nakuru Doctors
  {
    firstName: "Michael",
    lastName: "Kimani",
    specialty: "Ophthalmology",
    experience: 8,
    licensePrefix: "KE/OPH",
  },
  {
    firstName: "Ruth",
    lastName: "Wangari",
    specialty: "Endocrinology",
    experience: 10,
    licensePrefix: "KE/END",
  },

  // Eldoret Doctors
  {
    firstName: "Paul",
    lastName: "Koech",
    specialty: "Urology",
    experience: 12,
    licensePrefix: "KE/URO",
  },
  {
    firstName: "Susan",
    lastName: "Chepkwony",
    specialty: "Oncology",
    experience: 15,
    licensePrefix: "KE/ONC",
  },

  // Other cities - using existing specialties
  {
    firstName: "Daniel",
    lastName: "Mwangi",
    specialty: "Cardiology",
    experience: 7,
    licensePrefix: "KE/CAR",
  },
  {
    firstName: "Catherine",
    lastName: "Wanjiru",
    specialty: "Pediatrics",
    experience: 9,
    licensePrefix: "KE/PED",
  },
  {
    firstName: "Francis",
    lastName: "Karanja",
    specialty: "Orthopedics",
    experience: 11,
    licensePrefix: "KE/ORT",
  },
  {
    firstName: "Elizabeth",
    lastName: "Nduta",
    specialty: "Gynecology",
    experience: 8,
    licensePrefix: "KE/GYN",
  },
  {
    firstName: "Robert",
    lastName: "Maina",
    specialty: "Psychiatry",
    experience: 13,
    licensePrefix: "KE/PSY",
  },
];

export async function seedDoctors() {
  try {
    console.log("Starting to seed doctors with service role...");

    // First, get all specialties to map names to IDs
    const { data: specialties, error: specialtyError } = await supabase
      .from("specialties")
      .select("*");

    if (specialtyError) {
      console.error("Error fetching specialties:", specialtyError);
      return;
    }

    console.log(
      "Found specialties:",
      specialties?.map((s) => s.name)
    );

    // Create missing specialties (now with service role permissions)
    const existingSpecialtyNames =
      specialties?.map((s) => s.name.toLowerCase()) || [];
    const requiredSpecialties = [
      { name: "Ophthalmology", description: "Eye and vision care" },
      { name: "Endocrinology", description: "Hormone and metabolic disorders" },
      {
        name: "Urology",
        description: "Urinary system and male reproductive health",
      },
      { name: "Oncology", description: "Cancer diagnosis and treatment" },
      {
        name: "Internal Medicine",
        description: "Comprehensive adult medical care",
      },
      { name: "Emergency Medicine", description: "Emergency and urgent care" },
      { name: "Radiology", description: "Medical imaging and diagnostics" },
      { name: "Pulmonology", description: "Lung and respiratory disorders" },
      { name: "Rheumatology", description: "Joint and autoimmune disorders" },
      { name: "Nephrology", description: "Kidney and urinary disorders" },
      { name: "Hematology", description: "Blood disorders and cancers" },
      {
        name: "Infectious Disease",
        description: "Infectious and communicable diseases",
      },
      { name: "Gastroenterology", description: "Digestive system disorders" },
    ];

    const specialtiesToAdd = requiredSpecialties.filter(
      (req) => !existingSpecialtyNames.includes(req.name.toLowerCase())
    );

    if (specialtiesToAdd.length > 0) {
      console.log(
        "Adding missing specialties:",
        specialtiesToAdd.map((s) => s.name)
      );

      const { data: newSpecialties, error: addSpecialtyError } = await supabase
        .from("specialties")
        .insert(specialtiesToAdd)
        .select();

      if (addSpecialtyError) {
        console.error("Error adding specialties:", addSpecialtyError);
        return;
      }

      // Update specialties list with new ones
      const allSpecialties = [
        ...(specialties || []),
        ...(newSpecialties || []),
      ];
      specialties?.splice(0, specialties.length, ...allSpecialties);

      console.log("✅ Successfully added missing specialties");
    }

    // Create profiles and doctors based on the doctors table structure
    let successCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < doctorsData.length; i++) {
      const doctor = doctorsData[i];
      const city = kenyanCities[i % kenyanCities.length];

      // Find matching specialty
      const specialty = specialties?.find(
        (s) =>
          s.name.toLowerCase().includes(doctor.specialty.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(s.name.toLowerCase()) ||
          s.name.toLowerCase() === doctor.specialty.toLowerCase()
      );

      if (!specialty) {
        console.warn(
          `Skipping Dr. ${doctor.firstName} ${doctor.lastName} - Specialty '${doctor.specialty}' not found in database.`
        );
        skippedCount++;
        continue;
      }

      // Create a dummy user profile first
      const email = `${doctor.firstName.toLowerCase()}.${doctor.lastName.toLowerCase()}@medicalpro.ke`;

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      let profile = existingProfile;

      if (!existingProfile) {
        // Insert profile (service role bypasses RLS)
        const { data: newProfile, error: profileError } = await supabase
          .from("profiles")
          .insert({
            first_name: doctor.firstName,
            last_name: doctor.lastName,
            email: email,
            user_type: "doctor",
          })
          .select()
          .single();

        if (profileError) {
          console.error(
            `Error creating profile for ${doctor.firstName} ${doctor.lastName}:`,
            profileError
          );
          skippedCount++;
          continue;
        }

        profile = newProfile;
      }

      // Check if doctor already exists
      const { data: existingDoctor } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", profile.id)
        .single();

      if (existingDoctor) {
        console.log(
          `Doctor already exists: Dr. ${doctor.firstName} ${doctor.lastName}`
        );
        continue;
      }

      // Insert doctor record based on the table structure shown
      const { data: doctorRecord, error: doctorError } = await supabase
        .from("doctors")
        .insert({
          user_id: profile.id,
          specialty_id: specialty.id,
          license_number: `${doctor.licensePrefix}/${Math.floor(
            Math.random() * 10000
          )
            .toString()
            .padStart(4, "0")}`,
          years_of_experience: doctor.experience,
          // Note: Adding location fields if they exist in your schema
          city: city.name,
          state: city.state,
          country: "Kenya",
          latitude: city.latitude + (Math.random() - 0.5) * 0.1,
          longitude: city.longitude + (Math.random() - 0.5) * 0.1,
          address: `${Math.floor(Math.random() * 999) + 1} Medical Center, ${
            city.name
          }, ${city.state}, Kenya`,
        });

      if (doctorError) {
        console.error(
          `Error creating doctor record for ${doctor.firstName} ${doctor.lastName}:`,
          doctorError
        );
        skippedCount++;
        continue;
      }

      console.log(
        `✅ Created doctor: Dr. ${doctor.firstName} ${doctor.lastName} (${doctor.specialty}) in ${city.name}`
      );
      successCount++;
    }

    console.log(
      `✅ Finished seeding doctors! Created: ${successCount}, Skipped: ${skippedCount}`
    );
  } catch (error) {
    console.error("Error seeding doctors:", error);
    throw error;
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDoctors();
}
