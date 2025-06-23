import { seedUsers } from './users.seeder.js';
import { seedChats } from './chats.seeder.js';
import { seedGroupMembers } from './groupMembers.seeder.js';
import { seedMessages } from './messages.seeder.js';
import { seedFiles } from './files.seeder.js';
import { seedReactions } from './reactions.seeder.js';

const runAllSeeders = async () => {
  try {
    console.log('🌱 Starting seed process...\n');

    await seedUsers();
    await seedChats();
    await seedGroupMembers();
    await seedMessages();
    await seedReactions();
    await seedFiles();

    console.log('\n✅ All seeders executed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder failed:', err.message);
    process.exit(1);
  }
};

runAllSeeders();
