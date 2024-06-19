const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true
        },
        user: {
            type: Object,
            required: true
        },
        contact: {
            type: Object,
            default: {}
        },
        location: {
            type: Object,
            default: {}
        },
        role: {
            type: String,
            default: 'user'
        },
        limit: {
            type: Number,
            default: 0
        },
        role: {
            type: String,
            default: 'user'
        },
        lang: {
            type: String,
            default: 'ru',
            enam: ['uz', 'ru', 'en']
        }
    },
    {timestamps: true}   
)

module.exports = mongoose.model('User', userSchema)