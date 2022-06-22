const router = require("express").Router();
const Category = require("../models/Category");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

//create a post

router.post("/", async (req, res) => {

  // console.log("abc",req.body.userId);
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id",  async (req, res) => {
  //verifyTokenAndAuthorization koyman lazım 
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all posts
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/popular", async (req, res) => {
  try {
    const posts = await Post.find();
    var popularPosts = [];
    
    if (posts.length!=0) {
      const likeKat = 3;
      const comKat = 2;
      var likePoint;
      var comPoint;
      var popularity;
      var ort = 0;
      var postArr = new Array(posts.length);

      for (var i = 0; i < postArr.length; i++) {
        var comments = await Comment.find({ postId: posts[i]._id });
        postArr[i] = new Array(2);
        postArr[i][0] = posts[i];
        likePoint = likeKat * (posts[i].likes.length);
        comPoint = comKat * (comments.length);
        popularity = likePoint + comPoint;
        postArr[i][1] = popularity;
        ort += popularity
      }
      ort = ort / posts.length;
      postArr = postArr.filter(post => post[1] > ort);

      for (var i = 0; i < postArr.length; i++) {
        popularPosts.push(postArr[i][0]);
      }

    }
    res.status(200).json(popularPosts);
  } catch (err) {
    res.status(500).json(err);
  }

});


//update a post

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    if (post.userId === req.params.id) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }

  } catch (err) {

    res.status(500).json(err);
  }
});
//delete a post


//like/dislike
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//yoksa hiç postu hata verebilir
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search/:name", async (req, res) => {
  try {
    var regex = new RegExp(req.params.name, 'i');
    const posts = await Post.find({ desc: regex });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    //const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followingfriends.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );


    let categoryPosts = await Promise.all(
      currentUser.followings.map((catId) => {
        return (Post.find({ categoryId: catId }));
      })
    );

    let posts = [];
    let temp = [];
    if (typeof friendPosts[0] === 'undefined' && typeof categoryPosts[0] === 'undefined') {
      console.log("ikiside yoksa tüm category postlarını getir");
      const allcategory = await Category.find();
      const allcategoryPosts = await Promise.all(
        allcategory.map((cat) => {

          return (Post.find({ categoryId: cat._id }));
        })
      );
      temp = allcategoryPosts;
      temp.map((cat) => {
        for (var z = 0; z < cat.length; z++) {
          posts.push(cat[z]);
        };
      });
    } else if (typeof friendPosts[0] === 'undefined' && typeof categoryPosts[0] !== 'undefined') {
      console.log("friends yok categori var");
      for (var i = 0; i < categoryPosts.length; i++) {
        posts = posts.concat(categoryPosts[i]);
      }


    } else if (typeof categoryPosts[0] === 'undefined' && typeof friendPosts[0] !== 'undefined') {
      console.log("categori yok ama friends var");
      for (var i = 0; i < friendPosts.length; i++) {
        posts = posts.concat(friendPosts[i]);
      }

    } else {
      console.log("ikiside var");


      for (var i = 0; i < friendPosts[0].length; i++) {

        posts = categoryPosts[0].filter(
          (item) => item.userId !== friendPosts[0][i].userId);


      };

      posts = posts.concat(friendPosts[0]);




    }

    res.status(200).json(posts);


  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;