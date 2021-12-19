const userModel = require('../models/userModel');

exports.post = async function (req, res, next) {
    var user = new userModel();
    user.email = req.body.email;
    user.password = req.body.password;
    user.displayName = req.body.displayName;
    user.userRole = req.body.userRole;

    user.save(function (err) {
        if (err){
            next(err);
        }
        else{
            res.json({
                message: 'User created',
                data: user
            });
        }
    });   
};

exports.getAll = async function (req, res, next) {
    userModel.find(function (err, users) {
        if (err)
            next(err);
        res.json({
            message: 'Finding users..',
            data: users
        });
    });
};

exports.get = async function (req, res, next) {
    userModel.findOne({email: req.params.email}, function (err, user) {
        if (err){
            next(err);
        }
        res.json({
            message: 'Finding user..',
            data: user
        });
    });
};

exports.put = async function (req, res, next) {
    userModel.findOne({email: req.params.email}, function (err, user) {
        if (err){
            next(err);
        }
        
        user.email = req.body.email;
        user.password = req.body.password;
        user.displayName = req.body.displayName;
        user.userRole = req.body.userRole;

        user.save(function (err) {
            if (err) {
                next(err);
            }
            res.json({
                message: 'User info updated',
                data: user
            });
        });
    });
};

exports.patch = async function (req, res, next) {
    userModel.findOne({email: req.params.email}, function (err, user) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;
        user.displayName = req.body.displayName || user.displayName;
        user.userRole = req.body.userRole || user.userRole;

        user.save(function (err) {
            if (err) {
                next(err);
            }
            res.json({
                message: 'User info updated',
                data: user
            });
        });
    });
};

exports.delete = async function (req, res, next) {
    userModel.deleteOne({email: req.params.email}, function (err, user) {
        if (err){
            next(err);
        }
        res.json({
            message: 'User deleted',
            data: {email: req.params.email},
        });
    });
};