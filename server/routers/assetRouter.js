const express = require('express');
const { register, getAssets, deleteAsset, buyAsset, fetchAssetHistory } = require('../controllers/asset');
const router = express.Router();

router.post("/register", register);
router.get("/", getAssets)
router.get("/:userId", getAssets)
router.delete('/delete', deleteAsset);
router.post('/buyAsset', buyAsset);
router.post('/history', fetchAssetHistory);


module.exports = router;
