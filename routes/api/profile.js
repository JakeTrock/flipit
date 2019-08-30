const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load validation

const validateProfleInput = require('../../validation/profile');

const validate = require('uuid-validate');
// load profile model

const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route GET api/profile/test
// @desc Tests profile route
// @access Public route
router.get('/test', (req, res) => res.json({
    msg: "Profile Works"
}));


// @route GET api/profile/test
// @desc Get current users profile
// @access Private route

router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const errors = {};

    Profile.findOne({
            user: req.user.id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There is no such profile.";
                return res.status(404).json(errors);
            }
            res.json(profile)
        })
        .catch(err => res.status(404).json(err));
});

// @route GET api/profile/all
// @desc GET all the profiles in the database
// @access  Public route

router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofiles = 'There are no profiles'
                return res.status(404).json(errors);
            }
            res.json(profiles);
        }).catch(err => res.status(404).json({
            profile: 'There are no profiles'
        }));
})

// @route GET api/profile/handle/ :handle
// @desc Get profile by handle
// @access Public route

router.get('/handle/:handle', (req, res) => {

    const errors = {}
    Profile.findOne({
            handle: req.params.handle
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There isn't any such profile";
                res.status(404).json(errors)
            }
            res.json(profile);
        }).catch(err => res.status(404).json(err));
});


// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public

router.get('/user/:user_id', (req, res) => {

    const errors = {};
    Profile.findOne({
            user: req.params.user_id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "There isn't any such profile";
                res.status(404).json(errors)
            }
            res.json(profile);
        }).catch(err => res.status(404).json({
            profile: 'There is no profile for this user.'
        }));
});

router.get('/video/:uuid', (req, res) => {
    var uu=req.params.uuid;
    if (validate(uu))res.sendFile('../../allvids/' +uu+ '.webm');else res.status(404);
});




// @route POST api/profile
// @desc Create or edit user profile
// @acces Private route.

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validateProfleInput(req.body);

    // Check validation
    if (!isValid) {
        // Return an errors with 400 status
        return res.status(400).json(errors);
    }
    // Get fields

    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.bio) profileFields.bio = req.body.bio;
    // Social

    profileFields.social = {};
    if (req.body.website) profileFields.social.website = req.body.website;
    if (req.body.tumblr) profileFields.social.tumblr = req.body.tumblr;
    if (req.body.patreon) profileFields.social.patreon = req.body.patreon;
    if (req.body.deviantart) profileFields.social.deviantart = req.body.deviantart;
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (profile) {
                //update a profile
                Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(profile => res.json(profile));
            } else {
                // create
                // check to see if the handle exists.
                Profile.findOne({
                    handle: profileFields.handle
                }).then(profile => {
                    if (profile) {
                        errors.handle = 'Handle already exists';
                        res.status(400).json(errors);
                    }
                    // save profile

                    new Profile(profileFields).save().then(profile => res.json(profile));
                });
            }
        });

});
// @route DELETE api/profile
// @desc Delete User and profile
// @access Private Route
router.delete('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => res.json({ success: true }));
        });
});

module.exports = router;