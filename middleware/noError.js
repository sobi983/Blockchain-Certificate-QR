module.exports.noError = async(error,req,res,next)=>{
    res.status(401).json({'message': 'Page Not found'})
    return console.log("helo")
}