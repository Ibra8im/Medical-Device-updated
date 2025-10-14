import mongoose from 'mongoose';


async function ConnectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Conected To MongoDb....")
  } catch (error) {
    console.log("Conection Failed To MongoDb ", error)
  }
}


export default ConnectDb;