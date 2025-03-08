const BaseService = require("../../../utils/bases/base.service");
const xApiKey = require("../../models/auth/x-api-key.model");

class XApiKeyService extends BaseService {

    static instance;
    constructor() {
        if (XApiKeyService.instance) return XApiKeyService.instance;
        super(xApiKey);
        XApiKeyService.instance = this;
    }

    /**
     * @returns { XApiKeyService }
     */
    static getInstance() {
        if (!XApiKeyService.instance) XApiKeyService.instance = new XApiKeyService();
        return XApiKeyService.instance;
    }
}

module.exports = XApiKeyService.getInstance();
