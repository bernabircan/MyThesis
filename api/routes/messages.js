const Message = require("../models/Message");
const router = require("express").Router();

//add
router.post("/", async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});
//isopen messgaes
router.put("/new/:id",  async (req, res) => {
    try {
      var message = await Message.findById(req.params.id);
         await message.updateOne({ $set: req.body });
         const newMes=  await Message.findById(req.params.id);
        res.status(200).json(newMes);
      } catch (err) {
  
      res.status(500).json(err);
    }
  });

  //get user's new new messages
  router.get("/convsnew/:id", async (req, res) => {
    try {
       const messages=await Message.find({conversationId:req.params.id,isNew:"T"});

       res.status(200).json(messages.length);
     } catch (err) {
       res.status(500).json(err);
     }
   });
    

//get
router.get("/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/:id" , async (req, res) => {
    try {
      const message = await  Message.findById(req.params.id);
     
        await message.updateOne({ $set: req.body });
        res.status(200).json("the message has been updated");
     
  
    } catch (err) {
  
      res.status(500).json(err);
    }
  });



   
 

module.exports = router;
