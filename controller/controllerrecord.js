var User = require('../model/user');
var Record = require('../model/record');
var types = ['Surgical', 'Purely Medical', 'Checkup'];



const controllerRecord = {

    //Get page to create a new patient in the DB
    createPatient: async (req, res) => {
        res.render('patient/newPatient', { types });
    },

    //Post the new patient data into the DB
    addPatient: async (req, res) => {
        if (req.session.username) {
            var data = req.body;
            data.creator = req.session.username;
            var newData = new Record(data);
            await newData.save()
                .then(async () => {
                    res.redirect('/');
                })
                .catch((err) => {
                    message = err;
                    res.redirect('/record/new');
                })

        }
        else {
            message = 'Login to proceed.';
            console.log('Login to proceed.');
            res.redirect('/user/login');
        }
    }
}

module.exports = controllerRecord;
