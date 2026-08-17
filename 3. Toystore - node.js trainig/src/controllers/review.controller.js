const ReviewModel = require('../models/review.model');
require('dotenv').config();


// получение отзыва на товар
const getReviews = async (req, res) => {
    try {
        const {id} = req.params;
        const reviews = await ReviewModel.getReviews(id);

        res.json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    }catch (error){
        console.error('Ошибка получения отзывов:', error);
        res.status(500).json({
            success: false,
            message: 'оШибка получения отзывов',
            error: error.message
        })
    }

};

// пост нового отзыва
const postReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const {product_id, rating, comment} = req.body;
        // рейтинг может быть от 1 до пяти
        if (!product_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Некорректные данные: rating от 1 до 5 или неправильный айди товара'
            });   
        }
        await ReviewModel.postReview(userId, product_id, rating, comment);
        res.status(201).json({
            success: true,
            message: 'Отзыв оставлен'
        });
    }catch (error){
        if (error.message === 'Вы уже оставили отзыв на этот товар') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        console.error('Ошибка создания отзыва:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка создания отзыва',
            error:error.message
        })
    }
};

// пут отзывов - редактироваание отзыва
const changeReview = async (req, res) => {
    try {
const userId = req.user.id;
const {product_id, rating, comment} = req.body;
        // рейтинг может быть от 1 до пяти
        if (!product_id || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Некорректные данные: rating от 1 до 5 или неправильный айди товара'
            });   
        }
        await ReviewModel.changeReview(userId, product_id, rating, comment);
        res.status(200).json({
            success: true,
            message: 'Отзыв обновлен'
        });
    }catch (error){
        if (error.message === 'Отзыв не найден') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error('Ошибка редактирования отзыва:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка редактирования отзыва',
            error:error.message
        })  
    }
};
// делит - удаление отзыва
const deleteReview = async (req, res) =>{
        try {
const userId = req.user.id;
const {id} = req.params;
        await ReviewModel.deleteReview(userId, id);
        res.status(200).json({
            success: true,
            message: 'Отзыв удален'
        });
    }catch (error){
                if (error.message === 'Отзыв не найден') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        console.error('Ошибка удаления отзыва:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка удаления отзыва',
            error:error.message
        })  
    }
};
module.exports = {
    getReviews,
    postReview,
    changeReview,
    deleteReview
};