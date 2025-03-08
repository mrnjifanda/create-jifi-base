const fs = require('fs');

class StorageHelper {

    static instance;
    constructor() {

      if (StorageHelper.instance) return StorageHelper.instance;

      StorageHelper.instance = this;
    }

    /**
     * @returns { StorageHelper }
     */
    static getInstance(settings = null) {

      if (!StorageHelper.instance) StorageHelper.instance = new StorageHelper();

      return StorageHelper.instance;
    }

    checkIfFileOrDirectoryExists (path) {

        return fs.existsSync(path);
    };
    
    readFolder (folder) {

        return fs.readdirSync(folder);
    }
    
    async getFile (path, encoding = 'utf-8') {

        return encoding ? fs.readFileSync(path, encoding) : fs.readFileSync(path, {});
    };
    
    async createFile (path, fileName, data) {
    
        if (!checkIfFileOrDirectoryExists(path)) {
    
            fs.mkdirSync(path);
        }

        return fs.writeFileSync(`${path}/${fileName}`, data, 'utf8');
    };
    
    deleteFile (path) {

      return fs.unlinkSync(path);
    };
}

module.exports = StorageHelper.getInstance();
