const Conversation = require("../models/Conversation");
const User = require("../models/Conversation");
const router = require("express").Router();

//create conversation
router.post("/", async (req, res) => {
  try {
    var conversation;
    var conv;
    var sonconv;
     conversation = await Conversation.find({members :[ req.body.senderId,req.body.receiverId] });
     conv=await Conversation.find({members :[ req.body.receiverId,req.body.senderId] });
    
    if (conversation.length>0 || conv.length>0 ) {
      console.log("bu var");
      if(conversation.length>0){
        sonconv=conversation[0];

      }
      if(conv.length>0){
        sonconv=conv[0];
        
      }
    
      
     } else{
      console.log("bu yok");
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
      sonconv = await newConversation.save(); 

    }
    res.status(200).json(sonconv);

 } catch (err) {
    res.status(500).json(err);
  }
});
//get conv of a user
router.get("/convid", async (req, res) => {
  try {
    var conversation;
    var conv;
    var convId="";
     conversation = await Conversation.find({members :[ req.body.senderId,req.body.receiverId] });
     conv=await Conversation.find({members :[ req.body.receiverId,req.body.senderId] });
     if (conversation.length>0 ) {
      convId=conversation[0]._id;
   
      
      
     

    } else if(conv.length>0){
      convId=conv[0]._id;
      

     
    }
   
    res.status(200).json(convId);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get conv of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});




router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});







module.exports = router;