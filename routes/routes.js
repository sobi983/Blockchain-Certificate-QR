const express = require("express")
const router = express.Router()


router.get('/app/v1/', require("../controller/certificateControllers").displayForm)
router.post('/app/v1/verifyPage', require("../controller/certificateControllers").displayVerificationPage)
router.post('/app/v1/submit', require("../controller/certificateControllers").submitInfo)
router.post('/app/v1/certificateVerify', require("../controller/certificateControllers").verificationResult)

module.exports = router