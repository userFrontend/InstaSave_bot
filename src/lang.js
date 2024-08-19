const language = {
    uz:{
        commands: {
            start: 'Boshlash',
            game: "O'yinni boshlash",
            info: "Ma'lumotlar",
            setting: 'Sozlamalar',
        },
        menu: {
            contact: "Kontaktni baham ko'rish",
            start: 'Bot menyusi',
            close: 'Menyuni yopish',

        },
        error: {
            error: "Havolani yuborishda xatolik yuz berdi, keyinroq qayta urinib ko'ring",
            infoError: 'Bu havola uchun media topilmadi.',
            botError: "Texnik sabablarga ko'ra bot vaqtincha ishlamaydi",
            textError: "Ma'lum bir sabablarga ko'ra \nBot vaqtincha savollarga javob berolmaydi \nNoqulaylik uchun uzur so'raymiz 🛠"
        },
        new: "So'zni kiriting va u barcha foydalanuvchilarga yuboriladi! \n⚠ Diqqat: Agar xabar yuborishingiz shart bo'lmasa, botdan foydalanishdan oldin yuborishni bekor qiling!",
        addPic: "Rasm qo'shing 📸",
        addVid: "Video qo'shish 🎬",
        successClose: 'Yuborish bekor qilindi! ❌',
        close: 'Bekor qilish ❌',
        start: 'Assalomu alekem',
        success: "Tarjima tilini tanlang",
        delete: "O'chirish",
        contact: `Siz uni bot orqali yuklab olishingiz mumkin:
        • Instagram – istalgan formatdagi hikoyalar, postlar va IGTV!;
        🚀 Mediani yuklab olishni boshlash uchun havolani yuboring.`,
        disabled: 'Tugmalar o\'chirilgan',
        wiat: "Natijalar",
        loading: 'Havolaga ishlov berilmoqda, kuting...',
        info: `Salom`,
        download: 'Yuklab beruvchi bot',
        help: 'Siz uni bot orqali yuklab olishingiz mumkin: \n• Instagram – istalgan formatdagi hikoyalar, postlar va IGTV!; \n🚀 Mediani yuklab olishni boshlash uchun havolani yuboring. \nAgarda taklif va shikoyatlaringiz bo\'lsa @Frontend_deveIoper ga aloqaga chiqishingiz mumkin',
        language: 'Til sozlamalari muvaffaqiyatli saqlandi'
    },
    ru:{
        commands: {
            start: 'Начинать',
            game: 'Начать игру',
            info: 'Информатсия',
            setting: 'Настройки',
        },
        menu: {
            contact: 'Поделитесь контактом',
            start: 'Меню бота',
            close: 'Закрыть меню',

        },
        error: {
            error: 'При отправке ссылки произошла ошибка, повторите попытку позже.',
            infoError: 'По этой ссылке не найдены носители.',
            botError: 'Бот временно недоступен по техническим причинам.',
            textError: 'По определённым причинам\nБот временно не может отвечать на вопросы\nПриносим извинения за неудобства 🛠'
        },
        new: 'Введите слово и оно будет разослано всем пользователям!\n⚠ Внимание: Если вам не нужно отправлять сообщение, отмените отправку перед использованием бота!',
        addPic: 'Добавить картинку 📸',
        addVid: 'Добавить видео 🎬',
        successClose: 'Отправка отменена! ❌',
        close: 'Отменить ❌',
        start: 'Приветь',
        success: 'Выберите язык перевода',
        delete: 'Удалить',
        contact: 'Скачать можно через бота: \n• Инстаграм – истории, посты и IGTV в любом формате!; \n🚀 Отправьте ссылку, чтобы начать загрузку мультимедиа.',
        disabled: 'Кнопки отключены',
        wiat: 'Результаты',
        loading: 'Ссылка обрабатывается, подождите...',
        info: 'Привет',
        download: 'Скачано с помощью',
        help: 'Скачать можно через бота: \n• Инстаграм – истории, посты и IGTV в любом формате! \n🚀 Отправьте ссылку, чтобы начать загрузку мультимедиа. \nЕсли у вас есть предложения или жалобы, вы можете связаться с @Frontend_deveIoper.',
        language: 'Языковые настройки успешно сохранены.'
    },
    en:{
        commands: {
            start: 'Start',
            game: 'Start the game',
            info: 'Information',
            setting: 'Setting',
        },
        menu: {
            contact: 'Share contact',
            start: 'Bot menu',
            close: 'Close the Menu',

        },
        error: {
            error: 'There was an error sending your link, please try again later',
            infoError: 'Could not find the media for that link.',
            botError: 'The bot is temporarily down for technical reasons',
            textError: 'Due to certain reasons \nBot is temporarily unable to answer questions \nSorry for the inconvenience 🛠'
        },
        new: 'Enter a word and it will be sent to all users!\n⚠ Attention: If you do not need to send a message, cancel sending before using the bot!',
        addPic: 'Add a picture 📸',
        addVid: 'Add video 🎬',
        successClose: 'Dispatch cancelled! ❌',
        close: 'Сancel ❌',
        start: 'Hello',
        success: 'Select translation language',
        delete: 'Delete',
        contact: `You can download it via bot:
        • Instagram – stories, posts and IGTV in any format!;
        🚀 Submit link to start downloading media.`,
        disabled: 'Buttons is disabled',
        wiat: 'Results',
        loading: 'Processing your link, please wait...',
        info: 'Welcome',
        download: 'Downloaded with',
        help: 'You can download it via bot: \n• Instagram – stories, posts and IGTV in any format! \n🚀 Submit link to start downloading media. \nIf you have any suggestions or complaints, you can contact @Frontend_deveIoper',
        language: 'Language settings saved successfully'
    },
}

const changeLang = (lang) => {
    for (const res in language) {
        if (Object.hasOwnProperty.call(language, res)) {
            const element = language[lang];
            return element;
        }
    }
}

module.exports = changeLang

