const UserModel = require('../users/model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mailer = require('../../components/helper/Mailer')
const PasswordResetModel = require('../../components/users/modelPR')
const nodemailer = require("nodemailer");
const DetailBillCardVipModel = require('../../components/detailBillCardVip/model')

// đăng ký tài khoản
const register = async (data) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {email, username, ingame, password, age, gender} = data;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = new UserModel({
            email,
            username,
            ingame,
            password: hash,
            age,
            gender,
        });
        await user.save();
        // gửi email xác thực tài khoản
        setTimeout(() =>{
            Mailer.sendMail({
                email: user.email,
                subject: 'Xác thực tài khoản',
                content: `<a href="https://api-plantsvszombie-bason-694aafc26756.herokuapp.com/verify/${user._id}">Click vào đây</a>`
            })
        }, 0)
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi đăng ký');
    }
}

// đăng nhập tài khoản
const login = async (data) =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {username, password} = data;
        let user = await UserModel.findOne({username});
        if(!user) throw new Error('Không tìm thấy tài khoản');

        // kiểm tra password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) throw new Error('Nhập mật khẩu không đúng');
        // xóa field password trong user
        user.password = undefined;
        const detailCardVip = await DetailBillCardVipModel.find({user_id : user._id});
        
        user = {
            ...user._doc,
            listDetailCard: detailCardVip
        };
        return user;
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi đăng nhập');
    }
}

//cập nhập thông tin tài khoản
const updateProfile = async (id, data) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
       const {email, username, ingame, phone, dob, avatar, age, gender, level} = data;
       const user = await UserModel.findById(id);
       if(!user) throw new Error('Không tìm thấy người dùng');
       user.email = email || user.email
       user.username = username || user.username
       user.ingame = ingame || user.ingame
       user.phone = phone || user.phone
       user.dob = dob || user.dob
       user.avatar = avatar || user.avatar
       user.age = age || user.age
       user.gender = gender || user.gender
       user.level = level || user.level
       await user.save();
       return true;
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}

// đổi mật khẩu
const changedPassword = async (data) =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        const {email, currentPass, newPass} = data;
        const user = await UserModel.findOne({email});
        if(!user) return 'Không tìm thấy người dùng';
        // kiểm tra password
        const isValidPassword = await bcrypt.compare(currentPass, user.password);
        if(!isValidPassword) return 'Nhập mật khẩu không đúng';
        // mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPass, salt);

        user.password = hashPassword || user.password
        await user.save();
        return "thành công";
    } catch (error) {
        console.log('error', error);
        return 'Xảy ra lỗi khi cập nhập mật khẩu';
    }
}

// xem danh sách tài khoản
const getAllUser = () =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    return [];
}

// xem chi tiết tài khoản
const getUserById = async (id) =>{
    //lấy dữ liệu từ database
    //trả về dữ liệu cho client
   try {
    const user = await UserModel.findById(id);
    return user;
   } catch (error) {
    console.log("error: ", error);
    throw new Error("Xảy ra lỗi khi lấy chi tiết thông tin")
   }
}

const forgotUsername = async (email) =>{
    try {
        const user = await UserModel.findOne({email});
        if(!user) throw new Error('Không tìm thấy tài khoản');
        if (user) {
            const username = user.username;
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
                subject: "Quên username",
                html: `Username của bạn là: ${username}`,
              });
              return true;
            } catch (error) {
              // Log the error for debugging purposes
              console.error('Error sending email:', error);
              return false;
            }
          } else {
            console.log("error: ", error);
            return false;
          }
    } catch (error) {
        console.log("error: ", error);
        return false;
    }
}

// tìm kiếm tài khoản
const searchUser = () =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    return [];
}

// khóa tài khoản
const lockUser = () =>{
    // lấy dữ liệu từ database
    // trả về dữ liệu cho client
    return {};
}

// mở tài khoản
const unLockUser = () => {
    // lấy dữ liệu cho client
    // trả về dữ liệu cho client
    return {};
}


// game nâng cao
const updateLevel = async (id, data) =>{
    try {
        const {level} = data;
        const user = await UserModel.findById(id);
        if(!user) throw new Error('Không tìm thấy người chơi');
        user.level = level;
        await user.save();
    } catch (error) {
        console.log(error);
    }
}


//quên mật khẩu
const forgotPassword = async (email) =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        // tim user theo email
        const user = await UserModel.findOne({email})
        if(!user) throw new Error('Không tìm thấy người dùng');
        // tạo token
        const token = jwt.sign(
            {_id: user._id, email: user.email},
            'ahihi',
            {expiresIn: 60 * 60 * 1000}
        );
        // lưu token và email vào db
        const passwordReset = new PasswordResetModel({email, token});
        await passwordReset.save();
        // gửi email khôi phục mật khẩu
        setTimeout(() =>{
            Mailer.sendMail({
                email: user.email,
                subject:'Khôi phục mật khẩu',
                content:`Link khôi phục mật khẩu: https://api-plantsvszombie-bason-694aafc26756.herokuapp.com/reset-password/${token}`
            })
        }, 0);
        return true;
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
}

// check token reset password
const checkTokenResetPassword = async (token) =>{
    try {
        const decoded = jwt.verify(token, 'ahihi');
        if(decoded){
            const {email} = decoded;
            const passwordReset = await PasswordResetModel.findOne({
                email,
                token,
                status: true,
                created_at: {$gte: new Date(Date.now() - 60 * 60 * 1000)}
            });
            if(passwordReset) return true;
            return false;
        }
        return false;
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
};

// reset password
const resetPassword = async (token, password) =>{
    try{
        const decode = jwt.verify(token, 'ahihi');
        if(!decode) throw new Error('Không tìm thấy người dùng');
        const {email} = decode;
        const passwordReset = await PasswordResetModel.findOne({
            email,
            token,
            status: true,
            created_at: {$gte: new Date(Date.now() - 60 * 60 * 1000)}// $gte hơn hơn hoặc bằng
        });
        if(!passwordReset) throw new Error('Token không hợp lệ');

        // mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        // lưu vào db mật khẩu mới
        const user = await UserModel.findOne({email});
        user.password = hashPassword;
        await user.save();
        // xóa token
        await PasswordResetModel.updateOne({email, token},{status: false});
        return true; 
    }catch (error) {
        console.log(error);
        return false;
    }
}

// xác thực tài khoản
const verify = async (id) =>{
    try {
        const user = await UserModel.findById(id);
        if(!user) throw new Error('Không tìm thấy tài khoản');
        if(user.isVerified) throw new Error('Tài khoản đã xác thực');
        user.isVerified = true;
        await user.save();
        return true;
    } catch (error) {
        console.log("create error: ", error);
        return false;
    }
}

//quên mật khẩu
const forgotPasswordAPP = async (email) =>{
    //lấy dữ liệu từ database
    // trả về dữ liệu cho client
    try {
        // tim user theo email
        const user = await UserModel.findOne({email})
        console.log(user);
        if(!user) throw new Error('Không tìm thấy người dùng');
        // tạo token
        const token = Math.floor(Math.random() * 9000) + 1000;
        // lưu token và email vào db
        const passwordReset = new PasswordResetModel({email, token});
        await passwordReset.save();
        // gửi email khôi phục mật khẩu
        setTimeout(() =>{
            Mailer.sendMail({
                email: user.email,
                subject:'Khôi phục mật khẩu',
                content: `Mã otp của bạn là: ${token}`
            })
        }, 0);
        return true;
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
}

// check token reset password
const checkOTP = async (data) =>{
    const {otp, passNew} = data;
    try {
            const passwordReset = await PasswordResetModel.findOne({token : otp});
            if(passwordReset){

            // mã hóa mật khẩu
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(passNew, salt);
        // lưu vào db mật khẩu mới

        const email = passwordReset.email;
        console.log("ahihi", email)
        const user = await UserModel.findOne({email});
        user.password = hashPassword;
        await user.save();

        setTimeout(async () =>{
            try {
                const result = await PasswordResetModel.findByIdAndDelete(email);
                return result;
            } catch (error) {
                console.log("error", error);
            }
        }, 1000);

        return true;
    }
    } catch (error) {
        console.log("error : ", error);
        return false;
    }
};

module.exports = {
    register,
    login,
    updateProfile,
    changedPassword,
    forgotPassword,
    getAllUser,
    searchUser,
    lockUser,
    unLockUser,
    updateLevel,
    resetPassword,
    checkTokenResetPassword,
    getUserById,
    forgotUsername,
    verify,
    forgotPasswordAPP,
    checkOTP
}
