const User = require('../models/user');
const bcrypt = require('bcryptjs');

async function createNewUser(userName,email,password) {
    try {
        let exsistedUser = await User.findOne({$or:[{email:email},{userName,userName}]});
        
        if (exsistedUser) {
            let error;
            if (userName == exsistedUser.userName)
            error = "The User Name is Used,Try new one";
            else error = "The Email is Used,Try new one";
            throw {error,status:409};
        }
        // encrypt the password for security reason
        let nPassword =await bcrypt.hash(password,12);
        let createdUser = await User.create({userName,email,password:nPassword});
        return {userId:createdUser._id};
    }
    catch (err) {
        throw {error:'There is an issue in server',status:500};
    }
}

const retriveExistedUser = async (email,password)=> {
    let user = await User.findOne({email:email});
    if (!user) {
        throw {error:'User Not Found',status:401};
    }
    let correctPassword = await bcrypt.compare(password,user.password);
    if (!correctPassword) {
        throw {error:'Wrong Password',status:404};
    }
    return {userId:user._id.toString(),userName:user.userName};
}


module.exports.retriveExistedUser = retriveExistedUser;
module.exports.createNewUser = createNewUser;