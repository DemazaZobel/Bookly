import BookCategory from "./models/bookCategory.js"; // Adjust path if needed

async function seedCategories() {
  try {
    await BookCategory.bulkCreate([
      { category: "Fiction" },
      { category: "Classic" },
      { category: "Dystopian" },
      { category: "Romance" },
      { category: "Fantasy" },
      { category: "Magical Realism" },
      { category: "Philosophical Fiction" },
      { category: "Historical Fiction" },
      { category: "Coming-of-Age" },
      { category: "Non-Fiction" },
      { category: "Poetry" },
      { category: "Memoir" },
      { category: "Business" }
    ]);
    
    console.log("✅ Categories seeded successfully.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
}

seedCategories();
