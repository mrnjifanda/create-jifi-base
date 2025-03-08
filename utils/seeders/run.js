const { configs } = require('../../configs/app.config');
const db = require('../../configs/database.config');

const ManagerSeeder = require('./manager/manager.seeder');

const UserSeeder = require('./seeds/user.seeder');

async function run(seeders, seederName = null) {

    await db.connect(configs.getDatabase());
    console.log('📦 MongoDB connection successful');

    const manager = new ManagerSeeder();
    seeders.forEach(seeder => {
        manager.register(seeder.name, seeder.data);
    });

    let results = '';
    if (seederName) {

        results = await manager.runOne();
    } else {

        results = await manager.run();
    }

    console.log('✅ Résultats des seeders:', results);
    await db.disconnect();
}

const data = [
    { name: 'users', data: new UserSeeder({ count: 10 }) },
];

run(data).catch(err => {
  console.error('Erreur lors de l\'exécution des seeders:', err);
  process.exit(1);
});
