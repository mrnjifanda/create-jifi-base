const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request_ip = require('request-ip');
const Joi = require("joi");
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const configs = require('./config');
const response = require('./response.config');

const router = express.Router();
const Schema = mongoose.Schema;
const SECRET_TOKEN = configs.getSecret();
const ROLES = ['USER', 'ADMIN'];
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+\-=!])[\w@#$%^&+\-=!]{3,30}$/;
const ALLOWED_METHODS = configs.getLists('ALLOWED_METHODS');

const BaseSchema = (collectoion, schema) => {

    const base = {
        created_at: {
            type: Date,
            required: false,
            default: Date.now
        },
        updated_at: {
            type: Date,
            required: false,
            default: null
        },
        deleted_at: {
            type: String,
            required: false,
            default: null
        }
    };

    const collectionSchema = new Schema({ ...schema, ...base });
    collectionSchema.pre('save', function(next) {

        const now = new Date();
        this.updated_at = now;
        next();
    });
    return mongoose.model(collectoion, collectionSchema);
};

const Validation = (data, rules, res, next) => {

    const schema = Joi.object(rules);
    const { error } = schema.validate(data);
    if (error) {

        const details = error.details;
        let errors = [];
        details.forEach(detail => {

            errors.push({
                message: detail.message,
                field: detail.context.label
            });
        });

        return response.unprocessable(res, null, errors);
    }

    next();
    return ;
};

module.exports = {
    express, mongoose, Joi, bcrypt, request_ip, jwt, morgan, fs, path,
    configs, router, response, ROLES, PASSWORD_REGEX, ALLOWED_METHODS, SECRET_TOKEN,
    BaseSchema, Validation, Schema
};
