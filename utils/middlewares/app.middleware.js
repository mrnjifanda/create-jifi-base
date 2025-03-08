const geoip = require('geoip-lite');
const userAgentParser = require('user-agent-parser');

const { response, configs } = require("../../configs/app.config");

const setRequestDetails = async (req, res, next) => {

    try {

        const ip = req.clientIp;
        req.login_history = {
            ip,
            token: '',
            locations: geoip.lookup(ip),
            devices: userAgentParser(req.headers['user-agent'])
        }
    } catch (err) {

        console.log(err);
        req.login_history = {
            ip: req.clientIp,
            token: '',
        };
    }

    next();
};

const xApiKey = (req, res, next) => {

    try {

        const key = req.header('x-api-key');
        if (!key || key !== configs.getXApiKey()) return response.forbidden(res, next, "Invalid KEY. Please check your key and try again.");

        next();
    } catch (error) {

        return response.forbidden(res, next, "Invalid KEY. Please check your key and try again.");
    }
};

module.exports = { setRequestDetails, xApiKey };
