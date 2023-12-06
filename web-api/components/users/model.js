const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    email:{type:String, required:true, unique:true},
    username:{type:String, required:true, unique:true},
    ingame:{type:String, required: true, unique: true},// tên trong game của người dùng
    password:{type:String, required:true},
    phone:{type:String, required:false},
    role:{type:Number, required:false},
    dob:{type:String, required:false},
    avatar:{type:String, required:false},
    age:{type:Number, required:true},
    gender:{type:String, required:true},
    level:{type:Number, required:true, default : 1},
    


})

module.exports = mongoose.model('User', userSchema) || mongoose.models.User;
