const cloudinary = require('../../config/cloudinary');

const cloudinaryController = {
	delete: async (req, res) => {
		const { publicId } = req.body;
		try {
			const response = await cloudinary.uploader.destroy(publicId);
			res.json({
				message: "successfully deleted cloudinary image",
				response
			});
		} catch (error) {
			res.status(500).json({ 
				message: "server error during cloudinary image deletion",
				error: error.message 
			});
		}
	}
}


module.exports = cloudinaryController;