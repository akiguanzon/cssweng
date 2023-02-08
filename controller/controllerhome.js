var Record = require('../model/record');
var User = require('../model/user');

const controllerHome = {
    goHome: async (req, res) => {
        if (req.session.username) {
            let records = await Record.find({}).sort({ 'date': -1 });
            res.render('home/home', { records });
        }
        else {
            console.log('Login to proceed.');
            res.redirect('/user/login');
        }
    }
}

module.exports = controllerHome;