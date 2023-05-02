require('dotenv').config();

class Config {

    constructor(env) {

        this.env = env;
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

    // getSwaggerConfig() {

    //     return {
    //         'title': this.getValue('SWAGGER_TITLE', false),
    //         'description': this.getValue('SWAGGER_DESCRIPTION', false),
    //         'version': this.getValue('SWAGGER_VERSION', false),
    //         'persistAuthorization': this.getValue('SWAGGER_PERSISTAUTHORIZATION', false)
    //     }
    // }

    // getJWT() {
    //     return {
    //         secret: this.getValue('JWT_SECRET')
    //     }
    // }

    // getSentryConfiguration() {

    //     return {
    //         dsn: this.getValue('SENTRY_DNS', false),
    //         environment: this.getValue('APP_MODE', false),
    //     };
    // }
}

const configs = new Config(process.env).ensureValues([
    'APP_MODE',
]);

module.exports = configs;