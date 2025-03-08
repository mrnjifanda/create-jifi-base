const { bcrypt, jwt, SECRET_TOKEN } = require('../../configs/app.config');
const mailService = require('./mail.service');

class BaseService {

    constructor(model) {

        if (this.constructor == BaseService) {

            throw new Error("Your Error Message...");
        }

        this.model = model;
    }

    mail () {
        return mailService;
    }

    async hash(value) {

        try {

            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(value, salt);
        } catch (error) {

            console.log(error);
            return false;
        }
    }

    async hashCompare(value, hash) {

        try {

            return await bcrypt.compare(value, hash);
        } catch (error) {

            console.log(error);
            return false;
        }
    }

    token(data, expiresIn = '365d') {

        return jwt.sign(data, SECRET_TOKEN, { expiresIn });
    }

    tokenVerify (token) {

        try {
        
            return jwt.verify(token, SECRET_TOKEN)
        } catch (error) {

            return false;
        }
    }

    getModel(model = null) {

        return model ?? this.model;
    }

    querySelect(select_string, separator = ',') {

        select_string = select_string.replace(/\s/g, '');
        const selects_query = select_string.split(separator);
        let selects = {};
        selects_query.forEach(select => {
            selects[select] = 1
        });

        return selects;
    }

    /**
     * Executes a default find operation on the specified model using the provided method, filter, and query.
     *
     * @param {string} method - The method to be used for the find operation (e.g., 'find', 'findOne').
     * @param {object} filter - The filter criteria for the find operation.
     * @param {object} [query={}] - Additional query options for the find operation (e.g., { select: 'name, email', populate: [ { path: 'users', select: 'name, email' } ] }).
     * @param {string} [query.select] - A string of fields to be selected in the find operation (e.g., 'name, email').
     * @param {string|array} [query.populate] - A field or fields to be populated in the find operation , (e.g., populate: [{ path: 'users', select: 'name, email' }].
     * @param {object} [model=null] - The specific model to be used for the find operation. If not provided, the default model will be used.
     *
     * @returns {Promise} - A promise that resolves to an object containing the results of the find operation.
     * The resolved object has the following structure:
     * {
     *   error: boolean - Indicates whether the find operation was successful (false) or encountered an error (true).
     *   data: mixed - The results of the find operation. If an error occurred, this will be undefined.
     * }
     *
     * @throws {Error} - If the method parameter is not provided or is not a valid method name.
     */
    async defaultFind(method, filter, query = {}, model = null) {

        try {

            const use_model = this.getModel(model);
            let mongooseQuery = use_model[method](filter);

            if (query.select) mongooseQuery = mongooseQuery.select(this.querySelect(query.select));

            if (query.populate) {

                if (Array.isArray(query.populate)) {

                    query.populate.forEach(populateField => {

                        mongooseQuery = mongooseQuery.populate(populateField);
                    });
                } else {
                    mongooseQuery = mongooseQuery.populate(query.populate);
                }
            }

            const results = await mongooseQuery;

            // const results = (Object.keys(query).length != 0 && query.select)
            //     ? await use_model[method](filter).select(this.querySelect(query.select))
            //     : await use_model[method](filter);

            return {
                error: false,
                data: results
            };
        } catch (err) {

            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async find(filter, query = {}, model = null) {

        return this.defaultFind('find', filter, query, model);
    }

    async paginate(filters, page = 1, limit = 10, model = null) {

        try {

            let find = [];
            const total = await this.count(filters, model);
            if (total) {

                find = await this.getModel(model).find(filters)
                    .limit(parseInt(limit))
                    .skip(limit * page)
                    .sort({ created_at: 'desc' });
            }

            return {
                error: false,
                data: {
                    paginate: { total, page, limit },
                    content: find
                },
            };
        } catch (error) {

            return {
                error: true,
                message: error.message,
                name: error.name
            };
        }
    }

    /**
     * Executes a findOne operation on the specified model using the provided filter and query.
     *
     * @param {object} filter - The filter criteria for the findOne operation.
     * @param {object} [query={}] - Additional query options for the findOne operation (e.g., { select: 'name, email', populate: [ { path: 'users', select: 'name, email' } ] }).
     * @param {string} [query.select] - A string of fields to be selected in the findOne operation (e.g., 'name, email').
     * @param {string|array} [query.populate] - A field or fields to be populated in the findOne operation , (e.g., populate: [{ path: 'users', select: 'name, email' }].
     * @param {object} [model=null] - The specific model to be used for the findOne operation. If not provided, the default model will be used.
     *
     * @returns {Promise} - A promise that resolves to an object containing the results of the findOne operation.
     * The resolved object has the following structure:
     * {
     *   error: boolean - Indicates whether the findOne operation was successful (false) or encountered an error (true).
     *   data: mixed - The results of the findOne operation. If an error occurred, this will be undefined.
     * }
     *
     * @throws {Error} - If the defaultFind method fails to execute.
     */
    async findOne(filter, query = {}, model = null) {

        return this.defaultFind('findOne', filter, query, model);
    }

    async create(data, model = null) {

        try {

            const classModel = this.getModel(model);
            const create = new classModel(data);
            const save = await create.save();
            return {
                error: false,
                data: save
            }
        } catch (err) {

            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async update(filter, data, model = null) {

        try {

            await this.getModel(model).updateOne(filter, {
                $set: data
            }, { new: true });

            return { error: false }
        } catch (err) {

            console.log(err);
            return {
                error: true,
                message: err.message,
                name: err.name
            };
        }
    }

    async count (filter, model = null) {

        return this.getModel(model).countDocuments(filter);
    }
}

module.exports = BaseService;
