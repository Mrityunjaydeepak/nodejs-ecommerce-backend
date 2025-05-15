import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import subcategoryRoutes from './routes/subcategories.js';
import productRoutes from './routes/products.js';
import catalogueTypeRoutes from './routes/catalogueTypes.js';
import catalogueRoutes from './routes/catalogues.js';
import userRoutes from './routes/userRoutes.js';
import favouriteRoutes from './routes/favourites.js';
import { errorHandler } from './middleware/error.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: '*',  
    
  }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/catalogue-types', catalogueTypeRoutes);
app.use('/api/catalogues', catalogueRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/youtube', youtubeRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));