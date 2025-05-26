import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import subcategoryRoutes from './routes/subcategories.js';
import productRoutes from './routes/products.js';
import catalogueTypeRoutes from './routes/catalogueTypes.js';
import catalogueRoutes from './routes/catalogues.js';
import userRoutes from './routes/userRoutes.js';
import favouriteRoutes from './routes/favourites.js';
import bannerRoutes from './routes/bannerRoutes.js';
import youtubeRoutes from './routes/youtubeRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import { errorHandler } from './middleware/error.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: '*' }));

// Body parser
app.use(express.json());

// Serve uploads folder statically
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/catalogue-types', catalogueTypeRoutes);
app.use('/api/catalogues', catalogueRoutes);
app.use('/api/favourites', favouriteRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Error handling middleware (should be after mounting all routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
