const fs = require('fs');

function ucfirst(str) {

    return str[0].toUpperCase() + str.slice(1);
}

const g = process.env.npm_config_controller;

const controllerName = ucfirst(g);
console.log(controllerName);
let controller = `
const Controller = require('./controller');

class ${controllerName}Controller extends Controller {

    static instance;
    constructor() {

      if (${controllerName}Controller.instance) return ${controllerName}Controller.instance;

      super();
      ${controllerName}Controller.instance = this;
    }

    static getInstance() {

      if (!${controllerName}Controller.instance) ${controllerName}Controller.instance = new ${controllerName}Controller();

      return ${controllerName}Controller.instance;
    }

    index (request, response, next) {}
}

module.exports = ${controllerName}Controller.getInstance();
`;

fs.writeFile('./src/controllers/' + g + '.controller.js', controller, (error, data) => {
    console.log(error);
    console.log(data);
})

