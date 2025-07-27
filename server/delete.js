import  Book  from "./models/book.js"; // adjust path if needed

const clearBooks = async () => {
  try {
    await Book.destroy({
      where: {}, // no condition = delete all
      truncate: true, // resets IDs
      cascade: true // optional: remove any dependent records if foreign keys exist
    });
    console.log('All books deleted successfully.');
  } catch (error) {
    console.error('Error deleting books:', error);
  }
};

clearBooks();
