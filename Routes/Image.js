import express from "express"
import axios  from "axios";
import sharp from "sharp";

const router = express.Router()

router.post('/generate', async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
    }

    try {
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        const imageBuffer = Buffer.from(response.data, 'binary');

       
        const thumbnail = await sharp(imageBuffer)
            .resize(50, 50)
            .toBuffer();

       
        res.set('Content-Type', 'image/png');
        return res.send(thumbnail);
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        return res.status(500).json({ error: 'Failed to generate thumbnail' });
    }
});


export const imageRoute = router