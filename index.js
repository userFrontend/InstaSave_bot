const startServer = require('./src/db')
const changeLang = require('./src/lang')
const User = require('./src/userModel')
const { downloadApi } = require('./requests')
const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config()

const bot = new TelegramBot(process.env.TELEGRAM_API, {polling: true});
const start = async () => {
    startServer()
    let lang
    let newMess = null
    let allMess = ''
    let media = null
    let newMessage = false
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
        console.log(msg);
        
        try {
            if(user.role === 'admin' && text === '/newMessage'){
                newMessage = true
                newMess = await bot.sendMessage(chatId, lang.new, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: lang.addPic, callback_data: 'addPicture'}, {text: lang.addVid, callback_data: 'addVideo'}],
                            [{text: lang.close, callback_data: 'close'}],
                        ]
                    })
                })
                return newMess
            }
            if(newMessage && (msg.photo?.length > 0 || msg.video)){
                media = msg.photo ? msg.photo : msg.video;   
            
                await bot.sendMessage(chatId, `${msg.photo ? "Rasm" : 'Video'} saqlandi`, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: 'Natijani ko\'rish', callback_data: 'getResult'}, {text: "Habarni jo'natish", callback_data: 'sendMessage'}],
                        ]
                    })
                });
                return;
            }
            
            if(newMessage){
                allMess = text; 
                return   await bot.sendMessage(chatId, `So'z saqlandi`, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: 'Natijani ko\'rish', callback_data: 'getResult'}, {text: "Habarni jo'natish", callback_data: 'sendMessage'}],
                        ]
                    })
                });
            }
            
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
            if (text === '/help') {
                await bot.sendMessage(chatId, `${lang.help}`)
            } 
            if (text === '/language') {
                await bot.sendMessage(chatId, `${lang.success}`, {
                    reply_markup: JSON.stringify({
                        inline_keyboard: [
                            [{text: '🇺🇸 EN', callback_data: 'en'}, {text: '🇷🇺 RU', callback_data: 'ru'} , {text: '🇺🇿 Uz', callback_data: 'uz'}],
                        ]
                    })
                })
            } 
            if (text?.includes('instagram.com')) {
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
                        await bot.sendMessage(chatId, lang.error.error)
                    }  
                } else {
                    await bot.deleteMessage(chatId, search.message_id)
                    return await bot.sendMessage(chatId, lang.error.infoError)
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
                    return await bot.sendMessage(chatId, setLang.language)
                }
            }
            if(newMessage && data === 'sendMessage'){
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                const users = await User.find();
            
                for (const user of users) {
                    if (user.chatId === chatId) {
                        await bot.sendMessage(user.chatId, text);
                        await delay(1000);
                    }
                }
            
                newMessage = false;
                await bot.deleteMessage(chatId, newMess.message_id);
                return await bot.sendMessage(chatId, `Xabar barcha ${users.length} ta foydalanuvchilarga jo'natildi`);
            }
            if(newMessage && data === 'addVideo'){
                return await bot.sendMessage(chatId, 'send video')
            }
            if(newMessage && data === 'addPicture'){
                return await bot.sendMessage(chatId, 'send image')
            }
            if(newMessage && media && data === 'getResult'){
                console.log(media);
                if(media.mime_type && media.mime_type === 'video/mp4') {
                    return await bot.sendVideo(chatId, media.file_id, { 
                        caption: allMess,
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{text: "Habarni jo'natish", callback_data: 'sendMessage'}, {text: lang.close, callback_data: 'close'}],
                            ]
                        })
                    });
                }  else {
                    if(newMessage && media){
                        return await bot.sendPhoto(chatId, media[0].file_id, {
                            caption: allMess, 
                            reply_markup: JSON.stringify({
                                inline_keyboard: [
                                    [{text: "Habarni jo'natish", callback_data: 'sendMessage'}, {text: "Yopish", callback_data: 'close'}],
                                ]
                            })
                        });
                    }
                }
            }
            if(newMessage && data === 'close'){
                newMessage = false
                if(newMess){
                    await bot.deleteMessage(chatId, newMess.message_id)
                    newMess = null
                }
                return await bot.sendMessage(chatId, lang.successClose)
            }
            return await bot.sendMessage(chatId, lang.disabled)
        } catch (error) {
            console.log(error);
            await bot.sendMessage(chatId, lang ? lang.error.textError : 'Error')
            
        }
    })
} 
start()