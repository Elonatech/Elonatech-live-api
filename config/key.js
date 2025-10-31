require('dotenv').config();


const config = {
    PORT: process.env.PORT,
    mongourl:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    token_key: process.env.TOKEN_KEY,
    mailchimp_url: process.env.MAILCHIMP_URL,
    mailchimp_api_key: process.env.MAILCHIMP_API_KEY
}

module.exports = config;