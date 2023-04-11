module.exports.pageError = (req,res, next)=>{
    next()
    return res.status(401).json({
        "status": "Api Doesn't exist"
    })
    
}