const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validatePostInput(data) {
    let errors = {};
    //important about empty string.
    data.body.text = !isEmpty(data.body.text) ? data.body.text : '';


    if (!Validator.isLength(data.body.text, {
            min: 10,
            max: 300
        })) {
        errors.text = 'Post must  be between 10 and 300 characters'
    }

    if (Validator.isEmpty(data.body.text)) {
        errors.text = 'Text field is required';
    }

    if (Object.keys(data.files).length == 0) {
        errors.text = 'No files were uploaded.';
    }




    return {
        errors,
        isValid: isEmpty(errors)
    };
};