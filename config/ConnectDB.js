const mongoose = require('mongoose');

const ConnectDB = async()=>{
    try{
         await mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongoDB Connected`);

    }catch(err){console.log(err)}
}
module.exports = ConnectDB