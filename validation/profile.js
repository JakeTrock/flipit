const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateProfileInput(data) {
    let errors = {};
    //important about empty string.
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!Validator.isLength(data.handle, {
            min: 2,
            max: 40
        })) {
        errors.handle = 'Handle needs to be between 2 to 40 characters.'
    }
    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Handle is required.';
    }
    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = 'Not a valid url';
        }
    }
    if (!isEmpty(data.tumblr)) {
        if (!Validator.isURL(data.tumblr)) {
            errors.tumblr = 'Not a valid url';
        }
    }
    if (!isEmpty(data.patreon)) {
        if (!Validator.isURL(data.patreon)) {
            errors.patreon = 'Not a valid url';
        }
    }
    if (!isEmpty(data.deviantart)) {
        if (!Validator.isURL(data.deviantart)) {
            errors.deviantart = 'Not a valid url';
        }
    }
    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid url';
        }
    }
    if (isEmpty(!data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid url';
        }
    }
    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid url';
        }
    }
    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid url';
        }
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};