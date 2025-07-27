import { role } from './models/index.js';

(async () => {
  try {
    await role.bulkCreate(
      [
        { name: 'Admin' },
        { name: 'User' },
      ],
      { ignoreDuplicates: true } // prevents inserting duplicates if run multiple times
    );

    console.log('Roles seeded successfully.');
    process.exit();
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
})();
