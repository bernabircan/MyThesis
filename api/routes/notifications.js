const router = require("express").Router();
const Notification = require("../models/Notification");

router.post("/", async (req, res) => {

    // console.log("abc",req.body.userId);
    const newNotification  = new Notification (req.body);
    try {
      const savedNotification  = await newNotification.save();
      res.status(200).json(savedNotification );
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get last notification
router.get("/last", async (req, res) => {
  try {
     const notification=await Notification.findOne({}, { sort: { _id: -1 }, limit: 1 });
     res.status(200).json(notification);
   } catch (err) {
     res.status(500).json(err);
   }
 });

//get  all Notification 
router.get("/all", async (req, res) => {
    try {
       const notifications=await Notification.find();
       res.status(200).json(notifications);
     } catch (err) {
       res.status(500).json(err);
     }
   });

//get user's all Notification 
router.get("/users/:id", async (req, res) => {
    try {
       const notifications=await Notification.find({receiverId:req.params.id});

       res.status(200).json(notifications.reverse());
     } catch (err) {
       res.status(500).json(err);
     }
   });
//get user's new notification
   router.get("/usersnew/:id", async (req, res) => {
    try {
       const notifications=await Notification.find({receiverId:req.params.id,isNew:"T"});

       res.status(200).json(notifications.length);
     } catch (err) {
       res.status(500).json(err);
     }
   });
    
  //isopen notification
  router.put("/:id",  async (req, res) => {
    try {
      var notification = await Notification.findById(req.params.id);
         await notification.updateOne({ $set: req.body });
         const newNot=  await Notification.findById(req.params.id);
        res.status(200).json(newNot);
      } catch (err) {
  
      res.status(500).json(err);
    }
  });
  
  
  //update a post
  router.put("/:id",  async (req, res) => {
    try {
      const notification = await Notification.findById(req.body.notificationId);
      if (notification.userId === req.params.id) {
        await notification.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
  
    } catch (err) {
  
      res.status(500).json(err);
    }
  });
  
  //delete a Notification
  router.delete("/:id", async (req, res) => {
    try {
      const notification = await Notification.findById(req.body.notificationId);
      if (notification.userId === req.params.id) {
        await notification.deleteOne();
        res.status(200).json("the Notification has been deleted");
      } else {
        res.status(403).json("you can delete only your Notification");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

  
router.get("/:id", async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);
      res.status(200).json(notification);
    } catch (err) {
      res.status(500).json(err);
    }
  });






module.exports = router;