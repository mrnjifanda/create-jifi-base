const { express, response, configs, ALLOWED_METHODS, path, morgan } = require('./configs/app.config');

const cors = require('cors');
const routes = require('./routes/routes');
const db = require('./configs/database.config');
const swagger = require('./docs/swagger');

const allowedOrigins = configs.getLists('ALLOWED_ORIGINS');
const app = express();

app.use(cors({ origin: allowedOrigins, optionsSuccessStatus: 200 }));

if (configs.use('database')) db.connect(configs.getDatabase());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan('combined'));

routes.forEach(route => {

    try {

        app.use(configs.getPrefixRoutes() + route.path, require(`./routes/${route.route}.route`));
    } catch (error) {

        throw new Error(`Router error: ${error.message}`);
    }
});

swagger(app);

// METHODS NOT ALLOWED MIDDLEWARE
app.use((req, res, next) => {

    if (!ALLOWED_METHODS.includes(req.method)) {

        return response.failed(res, next, `${req.method} method not allowed.`, null, 405);
    }

    next();
});

// NOT FOUND ROUTE MIDDLEWARE
app.use((req, res, next) => {

    return response.notFound(res, next, 'Endpoint not found, please verify your request !!!', {
        protocol: req.protocol,
        method: req.method.toUpperCase(),
        host: req.get('host'),
        url: req.originalUrl
    });
});

// INTERNAL SERVER ERROR
app.use((error, req, res, next) => {

    return response.internalError(res, next, error);
});

app.listen(configs.getPort(), () => {

    console.log(`Application running on: ${ configs.getUrl() }`);
});
