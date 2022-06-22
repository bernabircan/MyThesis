const User = require("../models/User");
const Category= require("../models/Category");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");



//update user
router.put("/:id", async (req, res) => {
  const user=await User.findById(req.params.id);
 // console.log(req.body.desc);
  //console.log(req.body.profilePicture);
  

    if (req.body.password) {
      if(req.body.password==""){

        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(user.password, salt);
        

      }else{
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      
    }
    if(req.body.desc==""){
      req.body.desc=user.desc;
    }

    if(req.body.profilePicture==""){
      req.body.profilePicture=user.profilePicture;
      }
      
    try {
      
      
      const filter = { _id: req.params.id };
      const update = { desc:req.body.desc, profilePicture:req.body.profilePicture, password:req.body.password};
      
      const updateduser = await User.findOneAndUpdate(filter, update, {
        new: true
      });
      
      res.status(200).json(updateduser);
    } catch (err) {
      return res.status(500).json(err);
    }
 
});

//delete user
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      await User.findByIdAndDelete(req.body.userId); 
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  }else{
    res.status(403).json("you cant delete yourself");
  }

});

//GET USER
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user
router.get("/",  async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get following cate
router.get("/followingcates/:id", async (req, res) => {
  try {
    
   const user = await User.findById(req.params.id);
    let cateList=[];
    if (user.followings.length > 0) {
    const user = await User.findById(req.params.id);
    const cates = await Promise.all(
      user.followings.map((cateId) => {
        return Category.findById(cateId);
      })
    );
    
    cates.map((cate) => {
      const { _id, name, profilePicture } = cate;
      cateList.push({ _id, name, profilePicture });
    });
   }
    res.status(200).json(cateList)
  } catch (err) {
    res.status(500).json(err);
  }

});



//get followingfriends
router.get("/followingfriends/:id", async (req, res) => {
  try {
    
   const user = await User.findById(req.params.id);
    let friendList=[];
    if (user.followingfriends.length > 0) {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.followingfriends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
   }
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }

});

//get followerfriends
router.get("/followerfriends/:id", async (req, res) => {
  try {
    
   const user = await User.findById(req.params.id);
    let friendList=[];
    if (user.followerfriends.length > 0) {
    const user = await User.findById(req.params.id);
    const friends = await Promise.all(
      user.followerfriends.map((friendId) => {
        return User.findById(friendId);
      })
    );
    
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
   }
    res.status(200).json(friendList)
  } catch (err) {
    res.status(500).json(err);
  }

});

//add a friend 

router.put("/:id/addfriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
     
      const currentUser = await User.findById(req.body.userId); //jaon olarak verdiğimiz deger friendıd
      const user = await User.findById(req.params.id);// url de olan id login olan user
      if (!user.followerfriends.includes(req.body.userId)) {
        await user.updateOne({ $push: { followerfriends:req.body.userId } });
        await currentUser.updateOne({ $push: {  followingfriends:req.params.id }});
        res.status(200).json("user has been added friend");
      } else {
        res.status(403).json("you allready added friend");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant add  friend yourself");
  }
});

//remove a friend

router.put("/:id/removefriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.body.userId); //takip ediyo currentuser
      const user = await User.findById(req.params.id);
      if (user.followerfriends.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followerfriends: req.body.userId} });
        await currentUser.updateOne({ $pull: {followingfriends:req.params.id} });
        res.status(200).json("user has been removed in friends");
      } else {
        res.status(403).json("you already removed in friends");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant remove yourself");
  }
});

router.get("/all", async (req, res) => {
  try {
     const users=await User.find();
     res.status(200).json(users);
   } catch (err) {
     res.status(500).json(err);
   }
 });

 router.get("/search/:name", async (req, res) => {
  try {
   
    var regex=new RegExp(req.params.name,'i');
     const users=await User.find({username:regex});
     res.status(200).json(users);
   } catch (err) {
     res.status(500).json(err);
   }
 });


module.exports = router;