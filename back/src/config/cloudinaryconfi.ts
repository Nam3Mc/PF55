import { v2 as cloudinary } from 'cloudinary';
require ( 'dotenv').config()

(async function() {

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
        //    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
            //    public_id: 'shoes',
        //    }
    //    )
    //    .catch((error) => {
        //    console.log(error);
    //    });
        // 
    // const optimizeUrl = cloudinary.url('shoes', {
        // fetch_format: 'auto',
        // quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // const autoCropUrl = cloudinary.url('shoes', {
        // crop: 'auto',
        // gravity: 'auto',
        // width: 500,
        // height: 500,
    // });
    
    // console.log(autoCropUrl);    
})();