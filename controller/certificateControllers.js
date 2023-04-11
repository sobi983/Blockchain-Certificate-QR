const qrcode = require("qrcode")
const Web3 = require("web3")
const db = require("../model/DB_connection")
require('dotenv').config()
const abi = require("../artifacts/contracts/studentCertificate.sol/Certification.json")
const {Error}= require('../errors/errors')


module.exports.displayForm = async (req, res) => {
   return await res.render('index')
}

module.exports.displayVerificationPage = async(req, res)=>{
   return res.render('certificateVerfication')
}

module.exports.verificationResult = async(req, res)=>{
   const regNumber = req.body.RegNumber
   const contract = blockchainConnection()
   let name, org, course;
   try {
      const result = await contract.methods.getData(regNumber).call()
      name = result[0]
      org = result[1]
      course = result[2]
   
      return res.render('certificateVerfication', {name, org, course})
   } catch (error) {
      name = "No Result Found"
      org = "No Result Found"
      course = "No Result Found"
      return res.render('certificateVerfication', {name, org, course})
      
   }
}



module.exports.submitInfo = async (req, res) => {

   const regNumber = req.body.RegNumber
   const fullName = req.body.FullName
   const orgName = req.body.OrgName
   const courseName = req.body.CourseName
   const insertQuery = "INSERT INTO studentinformation.`students data`(regNumber, candidateName, organisationName,courseName, QR_ID) VALUES (?,?,?,?,?)"
   const contract = blockchainConnection()
   
   const transactionResponse = await contract.methods.generateCertificate(regNumber, fullName, orgName, courseName, "1").send({from: '0x2D0a7B531eA68a07e84906dc87F2f92DF725d3De', gasLimit: 2000000})
   const QR_ID = transactionResponse.events.certificateGenerated.returnValues._certificateId
   
   
   try {
      await db.query(insertQuery, [regNumber, fullName, orgName, courseName, QR_ID])
   } catch (error) {
      return console.log("Error while saving data into the Database")
   }
   
   const studentData = [
      { data: regNumber, mode: 'byte' },
      { data: fullName, mode: 'byte' },
      { data: orgName, mode: 'byte' },
      { data: courseName, mode: 'byte' }
   ]
   
   const responseData =  await qrcode.toDataURL(studentData)
   res.render('qrPage', { responseData, QR_ID })
   console.log("Data Saved in DB and on Blockchain!!")
}

function blockchainConnection(){
   const web3 =  new Web3('https://data-seed-prebsc-2-s1.binance.org:8545/')
   web3.eth.accounts.wallet.add(process.env.RINKEBY_PRIVATE_KEY)
   const contract =  new web3.eth.Contract(abi.abi, process.env.CONTRACT_ADDRESS)
   return contract
}