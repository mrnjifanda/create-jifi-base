const nodemailer = require('nodemailer');
const { configs } = require('../../configs/app.config');
const templateConfig = require("../../configs/template.config");
const QueueService = require('./queues/queue.service');

class MailService {

    isMailActive = false;

    /**
     * @type { MailService }
     */
    static instance;

    settings;
    transport;
    userQueue;

    /**
     * @type { Template }
     */
    templateConfig;

    /**
     * @type { QueueService }
     */
    queue;

    constructor(userQueue, settings, templateConfig) {

      if (MailService.instance) return MailService.instance;

      this.settings = settings;

      if (Object.keys(this.settings).length !== 0) {

        this.isMailActive = true;
      } 

      this.userQueue = userQueue;
      this.templateConfig = templateConfig;
      this.queue = QueueService.getInstance('mailQueue');
      MailService.instance = this;
    }

    /**
     * @returns { MailService }
     */
    static getInstance(userQueue, settings, templateConfig) {

      if (!MailService.instance) MailService.instance = new MailService(userQueue, settings, templateConfig);

      return MailService.instance;
    }

    transporter () {

        if (!this.transport) this.transport = nodemailer.createTransport(this.settings);

        return this.transport;
    }

    async mail (receivers, subject, content, html =  null, sender = null) {

        if (!this.isMailActive) {

            throw new Error("Please enabled mail service in .env file");
        }

        try {

            const data = {
                from: '"' + sender.name + '" <' + sender.email + '>',
                to: receivers,
                subject: subject
            }

            if (html) {

                const template = await this.templateConfig.render(content, html);
                data['html'] = template;
            } else {

                data['text'] = content;
            }

            await this.transporter().sendMail(data);
            return { error: false };
        } catch (error) {

            console.log(error.message);
            return { error: true };
        }
    }

    /**
     * 
     * @param { String | String[] } receivers One address mail or a array of addresses mail
     * @param { String } subject Subject of the mail
     * @param { String } content  Content of the mail (Messgae or path to a file in templates folder)
     * @param { Ojbect | Null } html 
     * @param {*} sender 
     * @returns 
     */
    send (receivers, subject, content, html = null, sender = null) {

        const user = sender || { email: this.settings.senderEmail, name: this.settings.senderName };
        return this.mail(receivers, subject, content, html, user);
    }

    /**
     * 
     * @param { String | String[] } receivers One address mail or a array of addresses mail
     * @param { String } subject Subject of the mail
     * @param { String } content  Content of the mail (Messgae or path to a file in templates folder)
     * @param { Ojbect | Null } html 
     * @param {*} sender 
     * @returns { void }
     */
    sendWithQueue (receivers, subject, content, html = null, sender = null) {

        if (this.userQueue) {
            
            this.queue.add({ type: 'mail', data: { receivers, subject, content, html, sender } });
        } else {
            this.send(receivers, subject, content, html, sender);
        }
    }

    processQueue () {

        this.queue.getQueue().process(async (job, done) => {

            console.log(`Processing job ${job.id}`);
            const { type, data } = job.data;
            if (type === 'mail') {

                const { receivers, subject, content, html, sender } = data;
                await this.send(receivers, subject, content, html, sender);
            }

            done();
        });

        this.queue.getQueue().on('failed', (job, error) => {
            console.error(`Échec de la tâche ${job.id}:`, error);
        });
        
        this.queue.getQueue().on('error', (error) => {
            console.error('Erreur dans la file d\'attente:', error);
        });
    }
}

module.exports = MailService.getInstance(configs.use('QUEUE'), configs.getMailSettings(), templateConfig);
