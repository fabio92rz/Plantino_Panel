/**
 * Created by Fabio on 28/02/2017.
 */

var user = {
        name: String,
        surname: String,
        mail: String,
        password: String
    };

user.methods.validPassword = function (password) {
    return compare(password, this.local.password);
    
};

module.exports = user;