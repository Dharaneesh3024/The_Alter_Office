const required = (name) => {
    const val = process.env[name];
    return val === undefined ? undefined : val;
};

module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: required('MONGO_URI'),
    jwtSecret: required('JWT_SECRET')
};
