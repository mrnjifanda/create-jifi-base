const handlebars = require("handlebars");
const { configs, path } = require("./app.config");
const storageHelper = require("../utils/helpers/storage.helper");

class Template {

  static instance;
  storage;
  templatePath;
  constructor(storage) {

    if (Template.instance) return Template.instance;

    this.storage = storage;
    this.templatePath = configs.getValue("TEMPLATE_PATH");
    Template.instance = this;
  }

  static getInstance(storage) {

    if (!Template.instance) Template.instance = new Template(storage);

    return Template.instance;
  }

  getPath (file, extension) {

    return path.join(__dirname, '../' + this.templatePath + '/' + file + extension);
  }

  async render(template, options, layout = 'layouts/default', extension = '.hbs') {

    const layoutPath = this.getPath(layout, extension);
    const layoutSource = await this.storage.getFile(layoutPath);
    const layoutTemplate = handlebars.compile(layoutSource);

    const contentPath = this.getPath(template, extension);
    const contentSource = await this.storage.getFile(contentPath);
    handlebars.registerPartial('body', contentSource);

    const result = layoutTemplate({
      body: handlebars.compile('{{> body }}')({ app_name: configs.getName(), ...options}),
    });

    return result;
  }
}

module.exports = Template.getInstance(storageHelper);
