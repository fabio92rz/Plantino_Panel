/**
 * Created by Fabio on 28/02/2017.
 */

var user = {
        name: String,
        surname: String,
        mail: String,
        password: String
    };

function getName() {
    user.name = this;
}

module.exports = user;