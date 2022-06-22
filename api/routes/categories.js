const router = require("express").Router();
const Category = require("../models/Category");
const Post = require("../models/Post");
const User = require("../models/User");
const CategoryReq = require("../models/CategoryReq");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

//create category
router.post("/", async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a category
router.put("/:id", async (req, res) => {
  try {
    //console.log(req.params.name);
      const category= await Category.findById( req.params.id);
     // console.log(req.body);
      await category.updateOne({ $set: req.body });
       res.status(200).json(category);
      
  } catch (err) {
      res.status(500).json(err);
  }
});

/*
//update a category
router.put("/:id", async (req, res) => {
  try {
      const category = await Category.findById(req.params.id);

      if (comment.userId === req.body.userId) {

          await comment.updateOne({ $set: req.body });
          res.status(200).json("the comment has been updated");
      } else {
          res.status(403).json("you can update only your comment");
      }
  } catch (err) {
      res.status(500).json(err);
  }
});

//delete a category
router.delete("/:id", async (req, res) => {
  try {
      const comment = await Comment.findById(req.params.id);
      if (comment.userId === req.body.userId) {
          await comment.deleteOne();
          res.status(200).json("the comment has been deleted");
      } else {
          res.status(403).json("you can delete only your comment");
      }
  } catch (err) {
      res.status(500).json(err);
  }
});
*/
//get category userlist
router.get("/userlist/:id", async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);
    let userList = [];
    if (category.followers.length > 0) {
      const followers = await Promise.all(
        category.followers.map((userId) => {
          return User.findById(userId);
        })
      );

      followers.map((user) => {
        const { _id, username, profilePicture } = user;
        userList.push({ _id, username, profilePicture });
      });

    }
    res.status(200).json(userList)
  } catch (err) {
    res.status(500).json(err);
  }

});

//get a category
router.get("/", async (req, res) => {
  const categoryId = req.query.categoryId;
  const categoryname = req.query.categoryname;
  try {
    const category = categoryId
      ? await Category.findById(categoryId)
      : await Category.findOne({ name: categoryname });
    const { updatedAt, createdAt, ...other } = category._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a category
router.put("/:id/follow", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!category.followers.includes(req.body.userId)) {
      await category.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });

      res.status(200).json("follow cate");
    } else {
      res.status(403).json("you allready follow this category");
    }
  } catch (err) {
    res.status(500).json(err);
  }

});

//unfollow a category
router.put("/:id/unfollow", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (category.followers.includes(req.body.userId)) {
      await category.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });

      res.status(200).json("unfollow cate");
    } else {
      res.status(403).json("you already unfollow this category");
    }
  } catch (err) {
    res.status(500).json(err);
  }

});

//o category'e sahip postlar
router.get("/posts/:catname", async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.catname });
    const posts = await Post.find({ categoryId: category._id });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/popularcat", async (req, res) => {
  try {

    var hash = [];
    var catList = [];
    const categories = await Category.find();
    for (var i = 0; i < categories.length; i++) {
      const posts = await Post.find({ categoryId: categories[i]._id });
      hash[JSON.stringify(categories[i])] = posts.length;
    };

    var items = Object.keys(hash).map(
      (key) => { return [key, hash[key]] });

    items.sort(
      (first, second) => { return second[1] - first[1] }
    );

    for (var i = 0; i < items.length; i++) {

      var obj = JSON.parse(items[i][0]);
      //console.log(obj);
      catList.push(obj);
    };


    res.status(200).json(catList);
  } catch (err) {
    res.status(500).json(err);
  }
});
/*
router.get("/popularcat", async (req, res) => {
  try {

    var hash = {};
    
    const categories=await Category.find();
    for (var i = 0; i < categories.length; i++) {
    const posts = await Post.find({ categoryId:categories[i]._id });
    hash[categories[i].name]=posts.length;
    };

    var items = Object.keys(hash).map(
      (key) => { return [key, hash[key]] });
    
    items.sort(
        (first, second) => { return second[1] - first[1] }
      );

     
res.status(200).json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});
*/


//get all categories
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search/:name", async (req, res) => {
  try {
    var regex = new RegExp(req.params.name, 'i');
    const categories = await Category.find({ name: regex });


    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/req", async (req, res) => {
  try {
  
      const catReq = new CategoryReq(req.body);
      const savedCatReq = await catReq.save();
      res.status(200).json(savedCatReq);

    

  } catch (err) {
    res.status(500).json(err);
  }

});


module.exports = router;