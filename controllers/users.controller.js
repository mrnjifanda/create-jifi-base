
const USERS = [
    {
        id: 1,
        name: "Eric",
        email: "eric@gmail.com"
    },
    {
        id: 2,
        name: "Eric 2",
        email: "eric2@gmail.com"
    },
    {
        id: 3,
        name: " 3",
        email: "eric3@gmail.com"
    },
];

const users = (req, res) => {
    const resonse = {
        status: 'SUCCESS',
        status_code: 200,
        message: 'Lists of all users',
        data: USERS
    };
    
    return res.status(200).json(resonse);
};

module.exports = { users };