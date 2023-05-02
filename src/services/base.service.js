const { bcrypt, jwt, SECRET_TOKEN } = require('../../configs/app.config');

class BaseService {

    constructor(model) {

        if (this.constructor == BaseService) {

            throw new Error("Your Error Message...");
        }

        this.model = model;
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

    token(data) {

        return jwt.sign(data, SECRET_TOKEN);
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

    async defaultFind(method, filter, query = {}, model = null) {
    
        try {

            const use_model = this.getModel(model);
            const results = (Object.keys(query).length != 0 && query.select)
                ? await use_model[method](filter).select(this.querySelect(query.select))
                : await use_model[method](filter);

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

            const update = await this.getModel(model).updateOne(filter, {
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