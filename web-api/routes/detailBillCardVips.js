var express = require('express');
var router = express.Router();
const DetailBillCardVip = require('../components/detailBillCardVip/controller');

// http://localhost:8686/DetailBiilCardVips
router.get('/', async (req, res, next) => {
    try {
        const DetailBill = await  DetailBillCardVip.getAllDetailBill();
        return res.status(200).json(DetailBill);
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({message: error});
    }
})

// http://localhost:8686/DetailBiilCardVips/:id
router.get("/:id", async (req, res, next) =>{
    try {
        const {id} = req.params;
        const DetailBill = await DetailBillCardVip.getDetailBillID(id);
        return res.status(200).json(DetailBill);
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error});
    }
})

// http://localhost:8686/detaiBillCardVips
router.post("/", async (req, res, next) =>{
    try {
        const {body} = req;
        const detailBill = await DetailBillCardVip.createDetailBill(body);
        return res.status(200).json(detailBill);
        return res.status(200).json({status: detailBill});
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({status: detailBill});
    }
})

router.delete("/", async (req, res, next) =>{
    try {
        const {id} = req.params;
        await DetailBillCardVip.deleteDetailBill(id);
        return res.status(200).json({message:'Xóa thành công hóa đơn chi tiết'});
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({message: error});
    }
})

module.exports = router;
