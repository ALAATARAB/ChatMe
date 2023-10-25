const User = require('../models/user');
const {loopOverLivePeople} = require('./WebSocketServices');
const {OnlinePeople} = require('../util');

async function getMyContacts(userId) {
    try {
        let userData = await User.findById(userId).select('contacts').populate('contacts');
        let contacts = userData.contacts;
        let result = [];
        for (let idx = 0; idx < contacts.length; idx++)
            result.push({userId:contacts[idx]._id.toString(),userName:contacts[idx].userName});
        return result;
    }
    catch(err) {
        throw {error:"There is an error in server",status:500};
    }
}

async function addFriend(userId,friendId,userName) {

    if (userId == friendId) {
        throw {error:"You Can't Add Your self!",status:409};
    }
    try {
        await User.findOneAndUpdate({_id:userId},{$push:{contacts:friendId}});
        await User.findOneAndUpdate({_id:friendId},{$push:{contacts:userId}});
        // let the new friend knows that you become a friend otherwise maybe he will send another request to add me
        if (OnlinePeople.has(friendId)) {
            loopOverLivePeople((client)=>client.userId==friendId,{newFriend: {userId:userId,userName:userName}});
        }
    }
    catch(err) {
        console.log(err);
        throw {error:"There is an issue in server",status:500};
    }
}

async function getFriendId(friendName) {
    try {
        let friend = await User.findOne({userName:friendName});
        if (!friend)
            throw {error:"There is no userName like this",status:404};
        return friend._id;
    }
    catch(err) {
        throw {error:"There is an issue in server",status:500};
    }
}

async function blockPerson(userId,personId) {
    try {
        await User.findOneAndUpdate({_id:userId},{$pull:{contacts:personId},$push:{blockedPeopleByMe:personId}});
        await User.findOneAndUpdate({_id:personId},{$pull:{contacts:userId},$push:{blockedByPeople:userId}});

        if (OnlinePeople.has(personId)) {
            loopOverLivePeople((client)=>client.userId==personId,{blockedBy: {userId:userId}});
        }
        return true;
    }
    catch(err) {
        throw {error:"There is an issue in server",status:500};
    }
}

async function unBlockPerson(userId,personId,userName) {
    try {
        await User.findByIdAndUpdate({_id:userId},{$pull:{blockedPeopleByMe:personId},$push:{contacts:personId}});
        await User.findByIdAndUpdate({_id:personId},{$pull:{blockedByPeople:userId},$push:{contacts:userId}});
        if (OnlinePeople.has(personId)) {
            loopOverLivePeople((client)=>client.userId==personId,{unBlockBy: {userId,userName}});
        }
        return true;
    }
    catch(err) {
        throw {error:"There is an issue in server",status:500};
    }
}

async function getBlockedBy(userId) {
    try {
        let user = await User.findById(userId);
        return {blockedByPeople:user.blockedByPeople};
    } catch (err) {
        throw {error:"There is an issue in server",status:500};
    }
}

async function getBlockedUsers(userId) {
    try {
        let user = await User.findById(userId);
        return {blockedPeopleByMe:user.blockedPeopleByMe};
    } catch (err) {
        throw {error:"There is an issue in server",status:500};
    }
}

module.exports.addFriend = addFriend;
module.exports.getMyContacts = getMyContacts;
module.exports.getFriendId = getFriendId;
module.exports.blockPerson = blockPerson;
module.exports.unBlockPerson = unBlockPerson;
module.exports.getBlockedBy = getBlockedBy;
module.exports.getBlockedUsers = getBlockedUsers;