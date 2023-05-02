const { morgan } = require('../../configs/app.config');
const logsService = require('../../src/services/logs.service');

const getActions = (word) => {

    const actions = {
        insert: ['add', 'create', 'upload'],
        update: ['update', 'modify'],
        delete: ['delete', 'del', 'remove'],
        subscribe: ['subscribe']
    }

    for (const [key, value] of Object.entries(actions)) {

        const find = value.find(element => {

            if (word.toLowerCase().includes(element.toLowerCase())) {

                return true;
            }
        });

        if (find) return key;
    }

    return '';
};

const getEntity = (word) => {

    const separateWords = word.split('/');
    if (separateWords.length === 3) {
        return separateWords[2];
    } else if (separateWords.length > 3) {
        const r = separateWords.splice(2, 2);
        return r.join('_');
    }

    return ''
}

const logInterceptor = morgan((tokens, req, res) => {

    setTimeout(async () => {

        try {

            const url = tokens.url(req, res);
            const create = await logsService.create({
                ip: req.ip,
                user: req.auth ? req.auth.id : null,
                method: tokens.method(req, res).toUpperCase(),
                hostname: req.hostname,
                url,
                status_code: tokens.status(req, res),
                action: getActions(req.path),
                entity: getEntity(url),
                details: {
                    params: req.params ?? null,
                    query: req.query ?? null,
                    headers: req.headers ?? null,
                    body: req.body ?? null,
                },
                response_body: res.response_body,
                response_time: tokens['response-time'](req, res)
            });
        } catch (error) {

            console.log('interceptor error : ', error.message);
        }
    }, 3000);
});

module.exports = logInterceptor;