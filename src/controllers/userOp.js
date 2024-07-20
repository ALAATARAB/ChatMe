const {getError} = require('../util');
const TokenServies = require('../services/TokenServices');
const UserServices = require('../services/UserServices');

exports.getFriends =async (req,res,next) => {
    // fetch all the friends for this user and grap the important info and send it back to him
    try {
        let {userId} = await TokenServies.getTokenFromCookie(req.headers.cookie);

        let contacts = await UserServices.getMyContacts(userId);
        res.status(200).json({contacts});
    }
    catch (err) {
        next(getError(err.error,err.status));
        return ;
    }
}

exports.addFriend = async (req,res,next)=> {
    try {
        let {userId} = await TokenServies.getTokenFromCookie(req.headers.cookie);
        let {friendId,userName} = req.body;
        await UserServices.addFriend(userId,friendId,userName);
        res.status(201).json({message:'added successfuly'});
    }

    catch(err) {
        next(getError(err.error,err.status));
        return;
    }
}

exports.getFriend = async (req,res,next) => {
    try {
        // for security reason
        await TokenServies.getTokenFromCookie(req.headers.cookie);
        let {friendName} = req.params;
        let friendId = await UserServices.getFriendId(friendName);
        res.status(200).json({userName:friendName,userId:friendId});
    }
    catch(err) {
        next(getError(err.error,err.status));
        return ;
    }
}

exports.blockPerson = async (req,res,next) => {
    try {
        let {personId} = req.body;
        let {userId} = await TokenServies.getTokenFromCookie(req.headers.cookie);
        await UserServices.blockPerson(userId,personId);
        res.status(201).json({message:'person blocked successfully'});
    }
    catch(err) {
        next(getError(err.error,err.status));
        return ;
    }
}

exports.unBlockPerson = async (req,res,next)=> {
    try {
        let {userId} = await TokenServies.getTokenFromCookie(req.headers.cookie);
        let {personId,userName} = req.body;
        await UserServices.unBlockPerson(userId,personId,userName);
        res.status(201).json({message:'person unBlocked successflly'});
    }
    catch(err) {
        next(getError(err.error,err.status));
        return;
    }
}

exports.getBlockedByAndBlockedUsers = async (req,res,next)=> {
    try {
        let {userId} = await TokenServies.getTokenFromCookie(req.headers.cookie);
        let {blockedByPeople} = await UserServices.getBlockedBy(userId);
        let {blockedPeopleByMe} =await  UserServices.getBlockedUsers(userId);
        res.status(200).json({
            blockedByPeople,
            blockedPeopleByMe
        });
    }
    catch(err) {
        next(getError(err.error,err.status));
        return ;
    }

}