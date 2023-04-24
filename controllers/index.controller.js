const home = (req, res) => {

    const resonse = {
        status: 'SUCCESS',
        status_code: 200,
        message: 'Hello world',
        data: {}
    };
    
    return res.status(200).json(resonse);
};

module.exports = { home };