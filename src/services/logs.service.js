const BaseService = require("./base.service");
const Log = require("../models/log.model");

class LogsService extends BaseService {

    constructor() {

        super(Log);
    }

    async getLogByUser(userId){
        return Log.find({user : userId }).populate({ path : 'user' , select : ['firstName' ,'lastName' , 'phone' , 'email', 'type']})
    }

    async getLogById(logId){

        return Log.findOne({_id : logId}).populate({ path : 'user' , select : ['firstName' ,'lastName' , 'phone' , 'email', 'type']})
    }
}

module.exports = new LogsService();