const TelegramApi = require('node-telegram-bot-api')
const startServer = require('./src/db')
const changeLang = require('./src/lang')
const User = require('./src/userModel')
const { downloadApi } = require('./requests')
require('dotenv').config()

const bot = new TelegramApi(process.env.TELEGRAM_API, {polling: true});
let lang
const start = async () => {
    startServer()
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        const user = await User.findOne({chatId})
        if(user){
            lang = changeLang(user.lang)
        } else {
            lang = changeLang('ru')
        }
        bot.setMyCommands([
            {command: '/start', description: `${lang.commands.start}`},
            {command: '/language', description: `${lang.commands.setting}`},
            {command: '/help', description: `Help`},
        ])
        try {
            if(text === '/start'){
                if(!user){
                    await bot.sendPhoto(chatId, './logo.jpg',{caption: `${lang.info} ${msg.from.first_name} ${lang.contact} \nВыберите первый язык`,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{text: '🇺🇸 EN', callback_data: 'en'}, {text: '🇷🇺 RU', callback_data: 'ru'} , {text: '🇺🇿 Uz', callback_data: 'uz'}],
                            ]
                        })
                    })
                    return (await User.create({chatId, lang: msg.from.language_code, user: msg.chat})).save()
                }
                await bot.sendPhoto(chatId, './logo.jpg', {caption: `${lang.info} ${msg.from.first_name} \n${lang.contact}`})
            }
            if (text !== '/start' && text === '/help') {
                await bot.sendMessage(chatId, `${lang.help}`)
            } 
            if (text !== '/start' && text === '/language') {
                await bot.sendMessage(chatId, `${lang.success}`, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: '🇺🇸 EN', callback_data: 'en'}, {text: '🇷🇺 RU', callback_data: 'ru'} , {text: '🇺🇿 Uz', callback_data: 'uz'}],
                        ]
                    })
                })
            } 
            if (text !== '/start' && text?.includes('instagram.com/')) {
                const search = await bot.sendMessage(chatId, '🔎')
                const post = await downloadApi(msg.text)
                if (post?.length > 0) {
                    const video = post.filter(vid => vid.type === 'video')
                    const image = post.filter(img => img.type === 'photo')
                    if (image.length > 0 && video.length > 0) {
                        const mediaGroup = post.map(img => ({
                            type: img.type,
                            media: img.url,
                            caption: `📥 ${lang.download} @Instagram_ProBot`, // Only the first photo can have a caption
                        }));
                        await bot.deleteMessage(chatId, search.message_id)
                        return await bot.sendMediaGroup(chatId, mediaGroup )
                    } else if (image.length > 0) {
                        const mediaGroup = image.map(img => ({
                            type: 'photo',
                            media: img.url,
                            caption: `📥 ${lang.download} @Instagram_ProBot`, // Only the first photo can have a caption
                        }));
                        await bot.deleteMessage(chatId, search.message_id)
                        return await bot.sendMediaGroup(chatId, mediaGroup )
                    } else if (video.length > 0) {
                        const mediaGroup = video.map(vid => ({
                            type: 'video',
                            media: vid.url,
                            caption: `📥 ${lang.download} @Instagram_ProBot`, // Only the first photo can have a caption
                        }));
                        await bot.deleteMessage(chatId, search.message_id)
                        return await bot.sendMediaGroup(chatId, mediaGroup )
                    } else {
                        await bot.deleteMessage(chatId, search.message_id)
                        await bot.sendMessage(chatId, `${lang.error.error}`)
                    }  
                } else {
                    await bot.deleteMessage(chatId, search.message_id)
                    return await bot.sendMessage(chatId, `${lang.error.infoError}`)
                }
            } 
        } catch (error) {
            console.log(error);
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id
        const user = await User.findOne({chatId})
        try {
            if(data === '/delete'){
                return await bot.deleteMessage(chatId, msg.message.message_id)
                }
                if(data === 'uz' || data === 'ru' || data === 'en'){
                    if(user){
                        const setLang = changeLang(data)
                        user.lang = data
                        await User.findByIdAndUpdate(user._id, user, {new: true})
                        return await bot.sendMessage(chatId, `${setLang.language}`)
                }
            }
            
            return await bot.sendMessage(chatId, 'Buttons is disabled ')
        } catch (error) {
            console.log(error.message + 'callback');
            await bot.sendMessage(chatId, `${lang.error.textError}`)
        }
    })
} 
start()