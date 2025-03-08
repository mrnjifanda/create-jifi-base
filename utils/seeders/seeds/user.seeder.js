// const { faker } = require('@faker-js/faker'); // Uncommented if you want to generate fake data.

const Seeder = require('../manager/seeder');
const User = require('../../../src/models/auth/user.model');
const { configs, ROLES } = require('../../../configs/app.config');

class UserSeeder extends Seeder {

    // password = "PassWORD@2025";

    constructor(options = {}) {

        super(User, options);
        this.setCustomData(configs.getAdminUser());
    }
    
    // generateFakeData() {

    //     const users = [];
    //     for (let i = 0; i < this.options.count; i++) {
    //       users.push({
    //         last_name: faker.person.lastName(),
    //         first_name: faker.person.firstName() ,
    //         username: faker.internet.username(),
    //         email: faker.internet.email(),
    //         password: this.password,
    //         password_confirm: this.password,
    //         role: ROLES[0],
    //       });
    //     }
    
    //     return users;
    // }
}

module.exports = UserSeeder;