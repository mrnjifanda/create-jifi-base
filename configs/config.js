require('dotenv').config();

class Config {

    static instance;
    env;
    constructor(env) {

      if (Config.instance) return Config.instance;

      this.env = env;
      Config.instance = this;
    }

    /**
     * @returns { Config }
     */
    static getInstance(env) {

      if (!Config.instance) Config.instance = new Config(env);

      return Config.instance;
    }

    getValue(key, throwOnMissing = true) {

        const value = this.env[key];
        if (!value && throwOnMissing) {

            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    ensureValues(keys) {

        keys.forEach((k) => this.getValue(k, true));
        return this;
    }

    getLists(keys, separator = ',') {

        return this.getValue(keys).split(separator);
    }

    getName() {

        return this.getValue('APP_NAME');
    }

    getMode() {

        return this.getValue('APP_MODE');
    }

    getPort() {

        return this.getValue('APP_PORT');
    }

    getUrl() {

        return this.getValue('APP_URL');
    }

    getMailSettings() {

        if (this.use('mail')) {

            const isProd = this.isProduction() ? '' : '_DEV';
            const data = {
                host: this.getValue('MAIL_HOST' + isProd),
                port: this.getValue('MAIL_PORT' + isProd),
                user: this.getValue('MAIL_USER' + isProd),
                senderName: this.getValue('MAIL_SENSER_NAME' + isProd),
                senderEmail: this.getValue('MAIL_SENSER_EMAIL' + isProd),
                secure: this.getValue('MAIL_SECURE' + isProd)
            };

            data.secure = data.secure == 'true';
            if (data.secure) {

                data['service'] = this.getValue('MAIL_SERVICE' + isProd);
                data['auth'] = {
                    user: this.getValue('MAIL_USER' + isProd),
                    pass: this.getValue('MAIL_PASSWORD' + isProd)
                };
            }
        
            return data;
        }

        return {};
    }
    
    getAppInfo() {
        return {
            name: this.getName(),
            url: this.getUrl(),
            version: this.getValue('APP_VERSION', false),
        };
    }

    getPrefixRoutes() {

        let prefix = this.getValue('APP_PREFIX_ROUTES', false) ?? '';
        if (prefix && (prefix.slice(-1) == '/')) {

            prefix = prefix.slice(0, -1);
        }
        return prefix;
    }

    getDatabase() {

        return this.getValue('DATABASE_URL');
    }

    getRedis() {

        return this.getValue('REDIS_URL');
    }

    getSecret() {
        return this.getValue('SECRET_TOKEN');
    }

    use(key) {

        const value = this.getValue(`USE_${key.toUpperCase()}`, false);
        return value && value == 'yes';
    }

    isProduction() {

        const mode = this.getValue('APP_MODE', false);
        return mode == 'PRODUCTION';
    }
}

module.exports = Config.getInstance(process.env).ensureValues([
    'APP_MODE',
]);
