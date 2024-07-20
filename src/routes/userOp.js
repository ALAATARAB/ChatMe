const express = require('express');
const router = express.Router();
const {getFriends,addFriend,getFriend,blockPerson,unBlockPerson,getBlockedByAndBlockedUsers} = require('../controllers/userOp')

router.get('/friends',getFriends);

router.post('/addFriend',addFriend);

router.get('/friend/:friendName',getFriend);

router.post('/blockPerson',blockPerson);

router.get('/blockedAndBlockedBy',getBlockedByAndBlockedUsers);

router.post('/unBlockPerson',unBlockPerson);

module.exports = router;