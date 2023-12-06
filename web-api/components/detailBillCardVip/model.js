const mongoose = require('mongoose');
const {Schema} = mongoose;
const ObjectID = Schema.ObjectId;

const detailBillCardVip = new Schema({
    name:{type:String, required:true},
    detail:{type:String, required:true},
    price:{type:Number, required:true},
    image:{type:String, required:true},
    cardVip_id:{type:ObjectID, require:true, ref:'CardVip'},
    user_id:{type:ObjectID, require: true, ref:'User'},
    created_at:{type: Date, default: Date.now},
})

module.exports = mongoose.model('DetailBillCardVip', detailBillCardVip) || mongoose.models.DetailBillCardVip;