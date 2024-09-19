const nodemailer = require('nodemailer');
const { configs } = require('../../configs/app.config');
const templateConfig = require("../../configs/template.config");
const QueueService = require('../services/queues/queue.service');

class MailService {

    static instance;
    settings;
    transport;

    /**
     * @type { Template }
     */
    templateConfig;

    /**
     * @type { QueueService }
     */
    queue;

    constructor(settings, templateConfig) {

      if (MailService.instance) return MailService.instance;

      this.settings = settings;
      this.templateConfig = templateConfig;
      this.queue = QueueService.getInstance('mailQueue');
      MailService.instance = this;
    }

    static getInstance(settings, templateConfig) {

      if (!MailService.instance) MailService.instance = new MailService(settings, templateConfig);

      return MailService.instance;
    }

    transporter () {

        if (!this.transport) this.transport = nodemailer.createTransport(this.settings);

        return this.transport;
    }

    async mail (receivers, subject, content, html =  false, sender = null) {

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

    send (receivers, subject, content, html = false, sender = null) {

        const user = sender || { email: this.settings.senderEmail, name: this.settings.senderName };
        return this.mail(receivers, subject, content, html, user);
    }

    sendWithQueue (receivers, subject, content, html = false, sender = null) {

        this.queue.add({ receivers, subject, content, html, sender });
    }

    processQueue () {

        this.queue.getQueue().process(async (job, done) => {

            console.log(job.data);
            const { receivers, subject, content, html, sender } = job.data;
            await this.send(receivers, subject, content, html, sender);
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

module.exports = MailService.getInstance(configs.getMailSettings(), templateConfig);
