const categoryModel = require('../../models/category/model');
const cloudinary = require('../../config/cloudinary');
const { Types } = require('mongoose');

const categoryController = {
    create: async (req, res) => {
        try {
            const category = new categoryModel(req.body);
            await category.save();
            console.log("Successfully created category:", category);
            res.status(201).json({
                message: "category successfully created",
                category
            });
        } catch (error) {
            console.error('error during create category:', error);
            res.status(500).json({
                message: "server error during create category",
                error: error.message
            });
        }
    },
    getAll: async (req, res) => {
        try {
            const categories = await categoryModel.find({})
                .populate('products')
                .exec();
            console.log("successfully retrieved categories:", categories);
            res.status(200).json({
                message: "categories successfully retrieved",
                categories
            });
        } catch (error) {
            console.error('error retrieving categories:', error);
            res.status(500).json({
                message: "server error during retrieval",
                error: error.message
            });
        }
    },
    findById: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const category = await categoryModel.findById(id)
                .populate('products')
                .exec();
            if (!category) return res.status(404).json({ message: "category not found" });

            console.log("successfully retrieved category:", category);
            res.status(200).json({
                message: "category successfully retrieved",
                category
            });
        } catch (error) {
            console.error('Error retrieving category:', error);
            res.status(500).json({
                message: "Server error during retrieval",
                error: error.message
            });
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const category = await categoryModel.findByIdAndUpdate(id, req.body, { new: true });
            if (!category) return res.status(404).json({ message: "category not found" });

            console.log("Successfully updated category:", category);
            res.status(200).json({
                message: "category successfully updated",
                category
            });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({
                message: "Server error during update",
                error: error.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "ID is required" });
            if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

            const category = await categoryModel.findByIdAndDelete(id);
            if (!category) return res.status(404).json({ message: "category not found" });

            const thumbnailPublicId = category?.thumbnail?.split("/").pop().split(".")[0];
            if(thumbnailPublicId) {
                await cloudinary.uploader.destroy(`ecomart/${thumbnailPublicId}`);
            }

            console.log("Successfully deleted category:", category);
            res.status(200).json({
                message: "category successfully deleted",
                category
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({
                message: "Server error during delete",
                error: error.message
            });
        }
    },
}

module.exports = categoryController;