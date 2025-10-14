import express from 'express';
import cors from 'cors'
import 'dotenv/config.js'
import ConnectDb from './config/connectDb.js';
import deviceRouter from './routes/deviceRoute.js';
import manufacturerRouter from './routes/manufacturerRoute.js';
import distributorRouter from './routes/distributorRoute.js';
import router from './routes/userRoute.js';


const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

ConnectDb();

// Routes
app.use("/api/auth", router);
app.use('/api/device', deviceRouter)
app.use('/api/manufacturer', manufacturerRouter)
app.use('/api/distributor', distributorRouter)



app.listen(port, () => { console.log(`Server is Running on Port ${port} `) })