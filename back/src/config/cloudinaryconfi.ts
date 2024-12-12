import { v2 as cloudinary } from 'cloudinary';
require ( 'dotenv').config()

(async function() {

    cloudinary.config({ 
        cloud_name: "dxbzgjvar",
        api_key: "948375937681559",
        api_secret: "DalJiX4jWy15R1wKVMu6ZJuZxt8",
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