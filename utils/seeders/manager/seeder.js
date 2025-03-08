class Seeder {

    constructor(model, options = {}) {

        this.model = model;
        this.options = {
          truncate: true,
          count: 10,
          ...options
        };
        this.customData = null;
    }

    setCustomData(data) {

        this.customData = Array.isArray(data) ? data : [data];
        return this;
    }

    generateFakeData() {

        throw new Error('The generateFakeData method must be implemented in child classes');
    }

    async truncate() {

        if (this.options.truncate) {

            console.log(`Cleaning the collection ${this.model.collection.name}...`);
            await this.model.deleteMany({});
        }
    }

    async run() {

        try {

            await this.truncate();

            const dataToInsert = this.customData || this.generateFakeData();
            
            console.log(`Inserting ${dataToInsert.length} documents into ${this.model.collection.name}...`);
            await this.model.insertMany(dataToInsert);
            
            console.log(`Seed de ${this.model.collection.name} terminé avec succès`);
            return true;
        } catch (error) {
            console.error(`Erreur lors du seed de ${this.model.collection.name}:`, error);
            return false;
        }
    }
}

module.exports = Seeder;
