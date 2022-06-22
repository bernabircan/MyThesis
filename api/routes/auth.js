const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../routes/sendEmail");
const crypto = require("crypto");
const { listeners } = require("process");
const generator = require('generate-password');


//activate account
router.post("/activateAccount", async (req, res) => {

  try {
    //generate new password
    const activateToken = jwt.sign(
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      }, process.env.JWT_Activate, //secret key
      { expiresIn: "20m" }  // 20 dakika
    );

    const data = {
      from: process.env.EMAIL_USERNAME,
      to: req.body.email,
      subject: 'Hesabı Aktifleştirme',
      html: `<h2> Hesabı Aktifleştirme işlemi</h2>
                   <p> Hesabınızı aktifleştirmek için <a href="${process.env.CLIENT_URL}/uyelik-onayi/${activateToken}">link</a>'e tıklayın. </p>`
    }

    sendEmail(req.body.email, data);
    res.status(200).json(activateToken);

  } catch (err) {
    res.status(500).json(err)
  }

});

//register
router.post("/register", async (req, res) => {

  const activatedToken = req.body.activatedToken;
  let username;
  let email;
  let password;

  if (activatedToken) {
    jwt.verify(activatedToken, process.env.JWT_Activate, (err, decodedToken) => {
      if (err) {
        return res.status(403).json("Token is not valid!");

      }
      username = decodedToken.username;
      email = decodedToken.email;
      password = decodedToken.password;

    });
  } else {
    return res.status(401).json("Something went wrong!");
  }


  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    await User.findByIdAndUpdate(user._id, { isActivated: true });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }


});

router.post("/mailcontrol", async (req, res) => {
  try {
    console.log(req.body.email)
    var exist = false;
    const users = await User.find();
    users.map((user) => {
      if (user.email == req.body.email) {
        exist = true;

      }
    });

    res.status(200).json(exist);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.post("/usernamecontrol", async (req, res) => {
  try {
    var exist = false;
    const users = await User.find();
    users.map((user) => {
      if (user.username == req.body.username) {
        exist = true;


      }
    });

    res.status(200).json(exist);
  } catch (err) {
    res.status(500).json(err);
  }




});


//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username});
    if (!user) {
      return res.status(404).json("user not found");

    }


    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      console.log("aynı şifre değil");
      return res.status(400).json("wrong password");

    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      }, process.env.JWT_SEC, //secret key
      { expiresIn: "3d" }  //3d 3 gün sonra bu accessToken tekrar kullanılamıcakmışş
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others });


  } catch (err) {
    res.status(500).json(err)
  }
});

//forgot password
router.put("/forgotpassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(422).json({ error: "user dont be exist" });
  }

  const resetToken = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    }, process.env.JWT_RESET, //secret key
    { expiresIn: Date.now() + 3600000 }  // 1 saniye 600 , 1 saat bu değer
  );

  const data = {
    from: process.env.EMAIL_USERNAME,
    to: req.body.email,
    subject: 'Parola Sıfırlama',
    html: `<h2> Parola Sıfırlama İşlemi</h2>
                 <p> Parolanızı sıfırlamak için <a href="${process.env.CLIENT_URL}/sifremi-unuttum/${resetToken}">link</a>'e tıklayın</p>`
  }

  var password = generator.generate({
    length: 10,
    numbers: true
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);



  await User.findByIdAndUpdate(user._id, { resetToken: resetToken });
  await User.findByIdAndUpdate(user._id, { password: hashedPassword });

  // await User.findByIdAndUpdate(user._id, { password: password}); 
  sendEmail(req.body.email, data);
  res.json({ message: "Please check your email" });

});

router.put("/nomailforgot", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(422).json({ error: "user dont be exist" });
    }
    const resetToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      }, process.env.JWT_RESET, //secret key
      { expiresIn: Date.now() + 3600000 }  // 1 saniye 600 , 1 saat bu değer
    );
    var password = generator.generate({
      length: 10,
      numbers: true
    });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(user._id, { resetToken: resetToken });
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    // await User.findByIdAndUpdate(user._id, { password: password}); 
    res.status(200).json(resetToken);
  } catch {
    res.status(500).json(err)
  }
});



//reset password
router.put("/resetpassword", async (req, res) => {

  const user = await User.findOne({ resetToken: req.body.resetToken })

  try {
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });
      await User.findByIdAndUpdate(user._id, { $unset: { 'resetToken': 1 } });


    } else {
      return res.status(422).json({ error: "Lütfen dogru linke tıkladığınızdan emin olun" });
    }

    res.status(200).json("abc");


  } catch (err) {
    res.status(500).json(err)
  }
  // eski şifreyle aynı olamazı kontrol et

});




module.exports = router;