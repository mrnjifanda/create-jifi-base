const { configs } = require('../../../configs/app.config');
const Queue = require('bull');

class QueueService {

    name;
    queue;
    static instances = {};
    constructor (name) {

        if (name in QueueService.instances) return QueueService.instances[name];

        this.name = name;
        this.queue = new Queue(name, configs.getRedis());
    }

    static getInstance(name) {

        if (!(name in QueueService.instances)) QueueService.instances[name] = new QueueService(name);
  
        return QueueService.instances[name];
    }

    add (data) {

        this.queue.add(data);
    }

    getQueue () {

        return this.queue;
    }

    process () {

        return this.queue.process;
    }
}

module.exports = QueueService;
