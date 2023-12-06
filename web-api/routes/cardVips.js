var express = require('express');
var router = express.Router();
const CardVipController = require('../components/cardVip/controller');


//http://localhost:8686/cardVips
router.get('/', async (req, res, next) =>{
    try {
        const cardVip = await CardVipController.getAllCardVip();
        return res.status(200).json(cardVip);
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error});
    }
})

// http://localhost:8686/cardVips/
router.get('/:id', async (req, res, next) =>{
    try {
        const {id} = req.params;
        const cardVip = await CardVipController.getDetailCardVip(id);
        return res.status(200).json(cardVip);
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error});
    }
})

// http://localhost:8686/cardVips
router.post('/', async (req, res, next) =>{
    try {
        const {body} = req;
        await CardVipController.createCardVip(body);
        return res.status(200).json({message: 'Thêm thành công card vip'});
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error});
    }
})

// http://localhost:8686/cardVips
router.delete('/:id', async (req, res, next) =>{
    try {
        const {id} = req.params;
        await CardVipController.deleteCardVip(id);
        return res.status(200).json({message: 'Xóa thành công card vip'});
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error});
    }
})

module.exports = router;