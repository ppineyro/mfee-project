const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000', 'https://www.google.com.mx'];

export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

export default { corsOptions };