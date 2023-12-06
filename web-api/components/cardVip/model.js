const mongoose =  require('mongoose');
const {Schema} = mongoose;

const cardVipSchema = new Schema({
    name:{type:String, required: true},
    price:{type:Number, required: true},
    image:{type:String, required: true},

});

module.exports = mongoose.model('CardVip', cardVipSchema) || mongoose.models.CardVip;
