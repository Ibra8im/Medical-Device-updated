import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import path from 'path'
import { fileURLToPath } from 'url'

import ConnectDb from './config/connectDb.js'
import deviceRouter from './routes/deviceRoute.js'
import manufacturerRouter from './routes/manufacturerRoute.js'
import distributorRouter from './routes/distributorRoute.js'
import userRouter from './routes/userRoute.js'

const app = express()
const port = process.env.PORT || 5000

// إعداد المسارات المطلقة
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(express.json())

// اتصال بقاعدة البيانات
ConnectDb()

// ✅ API Routes
app.use('/api/auth', userRouter)
app.use('/api/device', deviceRouter)
app.use('/api/manufacturer', manufacturerRouter)
app.use('/api/distributor', distributorRouter)

// ✅ React Build Path (Vite)
const frontendPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendPath))

// ✅ أي مسار آخر يعيد index.html (catch-all) بدون مشاكل path-to-regexp
app.use((req, res, next) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

// ✅ تشغيل السيرفر
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`)
})
