const CardVipModel = require('./model');

const getAllCardVip = async () =>{
    try {
        const cardVip = await CardVipModel.find({});
        return cardVip;
    } catch (error) {
        console.log(error);
        throw new Error('Xảy ra lỗi khi lấy danh sách thẻ vip')
    }
}

const createCardVip = async (data) => {
    try {
        const {name, price, image} = data;
        const cardVip = new CardVipModel({
            name:name,
            price:price,
            image:image,
        });
        await cardVip.save();
    } catch (error) {
        console.log(error);
        throw new Error('Xảy ra lỗi khi thêm thẻ vip mới')
    }
}

const getDetailCardVip = async (id) =>{
    try {
        const cardVip = await CardVipModel.findById(id);
        return cardVip;
    } catch (error) {
        console.log(error);
        throw new Error('Xảy ra lỗi khi lấy chi tiết Card vip')
    }
}

const deleteCardVip = async (id) =>{
    try {
        const cardVip = await CardVipModel.findByIdAndDelete(id);
        return cardVip;
    } catch (error) {
        console.log(error);
        throw new Error('Xảy ra lỗi khi xóa card vip');
    }
}


module.exports = {
    getAllCardVip,
    getDetailCardVip,
    createCardVip,
    deleteCardVip
}