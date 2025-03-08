class ManagerSeeder {

  constructor() {

    this.seeders = new Map();
  }

  register(name, seeder) {

    this.seeders.set(name, seeder);
    return this;
  }

  get(name) {

    if (!this.seeders.has(name)) {

      throw new Error(`Seeder "${name}" is not registered`);
    }

    return this.seeders.get(name);
  }

  list() {

    return Array.from(this.seeders.keys());
  }

  async runOne(name) {

    const seeder = this.get(name);
    console.log(`Running seeder: ${name}`);
    return await seeder.run();
  }

  async run() {

    const results = {};    
    for (const [name, seeder] of this.seeders) {

      console.log(`Running seeder: ${name}`);
      results[name] = await seeder.run();
    }
    
    return results;
  }
}
  
module.exports = ManagerSeeder;
