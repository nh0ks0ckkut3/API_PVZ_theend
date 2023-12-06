var express = require('express');
var router = express.Router();
const UserController = require('../components/users/controller')
const UserModel = require('../components/users/model')
const bcrypt = require('bcryptjs');

// đăng ký
//http://localhost:3000/users
// method: post
router.post('/register', async (req, res, next) => {
  try {
    const{body} = req;
    await UserController.register(body);
    return res.status(200).json({message: 'Đăng ký thành công'});
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


// đăng nhập
//http://localhost:3000/users
// method: post
router.post('/login', async (req, res, next) => {
  try {
    const {body} = req;
    const user = await UserController.login(body);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
})

router.put('/changedPassword', async (req, res, next) =>{
  try {
    const {body} = req;
    const result = await UserController.changedPassword(body);
    return res.status(200).json({message : result});
  } catch (error) {
    return res.status(500).json({message : result});
  }
})

/// lấy thông tin chi tiết
router.get('/:id', async (req, res, next) =>{
  try {
    const{id}=req.params;
    const user = await UserController.getUserById(id);
    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

/// quên username
router.post('/forgotUsername', async (req, res, next) =>{
  try {
    const {email} = req.body;
    const user = await UserController.forgotUsername(email);
    return res.status(200).json({status: user});
  } catch (error) {
    return res.status(500).json({status: user});
  }
})

/// cập nhập thông tin
router.put('/updateProfile/:id', async (req, res, next) =>{
  try {
    const {body} = req;
    const {id} = req.params;
    const user = await UserController.updateProfile(id,body);
    return res.status(200).json({status: user});
  } catch (error) {
    return res.status(500).json({status: user});
  }
})

/// game 
router.put('/updateLevel/:id', async (req, res, next) =>{
  try {
    const {body} = req;
    const {id} = req.params;
    await UserController.updateLevel(id, body);
    return res.status(200).json({message: 'cập nhập thành công'});
  } catch (error) {
    return res.status(500).json({message: 'cập nhập thất bại'});
  }
})

// gửi email


  const nodemailer = require("nodemailer");
  const crypto = require('crypto');

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    const randomIndex = Math.floor(Math.random() * 100000);

    if (user) {
      // const resetToken = crypto.randomBytes(20).toString('hex');
      // const resetTokenExpiration = Date.now() + 3600000;
      
      // user.resetToken = resetToken;
      // user.resetTokenExpiration = resetTokenExpiration;
      // await user.save();

      // const resetLink = `http://localhost:8686/users/forgot-password?token=${resetToken}`;
      // console.log('Reset link:', resetLink);
      const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(randomIndex.toString(), salt);

        user.password = hashPassword 
      await user.save();

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bason1607200@gmail.com",
            pass: "dhdbsgfafflhokzw",
          },
        });

        // send mail with defined transport object
        await transporter.sendMail({
          from: "bason1607200@gmail.com",
          to: email,
          subject: "Hello ✔",
          html: `Mật khẩu mới của bạn là: ${randomIndex}`,
        });

        // If the email is sent successfully, respond with a success message
        res.json({ message: `Gửi email thành công đến ${email}` });
      } catch (error) {
        // Log the error for debugging purposes
        console.error('Error sending email:', error);
        res.status(500).json({
          message: "Đã có lỗi xảy ra khi gửi email.",
          error: error.message,
        });
      }
    } else {
      res.status(404).json({ message: "Không tìm thấy tài khoản." });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      message: "Lỗi",
      error: error.message,
    });
  }
});

router.post('/forgetPassword', async (req, res, next) =>{
  try {
    const {email} = req.body;
    const result = await UserController.forgotPassword(email);
    res.status(200).json({status: result});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
});

router.post('/check-token-reset-password', async (req, res, next) =>{
  try {
    const {token} = req.body;
    const result = await UserController.checkTokenResetPassword(token);
    res.status(200).json({status: result});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
});

router.post('/resetpassword', async (req, res, next) =>{
  try {
    const {token, password} = req.body;
    const result = await UserController.resetPassword(token, password);
    res.status(200).json({status: result});
  } catch (error) {
    res.status(500).json({error: error});
  }
})

router.post('/verify/:id', async (req, res, next) =>{
  try {
    const {id} = req.params;
    const result = await UserController.verify(id);
    return res.status(200).json({status: result});
  } catch (error) {
    return res.status(500).json({status: false, error: error.message});
  }
});

router.post('/forgotPasswordAPP', async (req, res, next) =>{
  try {
    const {email} = req.body;
     const user = await UserController.forgotPasswordAPP(email);
    return res.status(200).json({status: user})
  } catch (error) {
    return res.status(500).json({status: user});
  }
});

router.post('/checkOTP_PassWord', async (req, res, next) =>{
  try {
    const {body} = req;
    const user = await UserController.checkOTP(body);
    return res.status(200).json({status: user})
  } catch (error) {
    return res.status(500).json({status: user});
  }
})






module.exports = router;
