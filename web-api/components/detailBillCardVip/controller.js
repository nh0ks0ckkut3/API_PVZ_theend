const DetailBillCardVipModel =  require('./model');
const CardVipModel = require('../cardVip/model');

const getAllDetailBill = async () =>{
    try {
        const DetailBill = await DetailBillCardVipModel.find({})
        return DetailBill;
    } catch (error) {
        console.log(error);
        throw new Error('Xảy ra lỗi khi lấy danh sách hóa đơn');
    }
}

//lấy chi tiết hóa đơn
const getDetailBillID =  async (id) =>{
    try {
        const DetailBill = await DetailBillCardVipModel.findById(id);
        return DetailBill;
    } catch (error) {
        console.log(error);
        throw new Error('Xảy ra lỗi khi lấy chi tiết hóa đơn')
    }
}

const createDetailBill = async (data) =>{
    
    try {
        const {detail, cardVip_id, user_id} = data;
        const {name, detail, price, image, cardVip_id, user_id} = data;
        const cardVip = await CardVipModel.findById(cardVip_id);
        const detailBill = new DetailBillCardVipModel({
            name: cardVip.name,
            detail:detail,
            price:cardVip.price,
            image:cardVip.image,
            cardVip_id:cardVip_id,
            user_id: user_id
        });
        await detailBill.save();
        const detaiBill_id = await DetailBillCardVipModel.find({user_id : user_id});
        return detaiBill_id;
        return true;
    } catch (error) {
        console.log('error', error);
        return false;
    }
}

const deleteDetailBill = async (id) =>{
    try {
        await DetailBillCardVipModel.findOneAndDelete(id);
    } catch (error) {
        console.log('error', error);
        throw new Error('Xảy ra lỗi khi xóa hóa đơn chi tiết');
    }
}

module.exports = {
    getAllDetailBill,
    getDetailBillID,
    createDetailBill,
    deleteDetailBill
}
