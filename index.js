const telegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

// for importing token you need to create a 'token.js' file with a
// 'module.exports = {token : "yourToken"}' inside
const {token} = require('./token')
const bot = new telegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId, 'Я сейчас загадаю число от 0 до 9, а ты его угадай!')
    chats[chatId] = Math.floor(Math.random() * 10)
    await bot.sendMessage(chatId, 'Выбери число!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Скажи "здрасьььте!"'},
        {command: '/info', description: 'Скажу твои имя и фамилию (если есть)'},
        {command: '/game', description: 'Отгадай число! '}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/4.webp')
            return await bot.sendMessage(chatId, `Приветствую!`)
        }else if(text === '/info'){
            console.log(msg);
            if(!msg.from.last_name){
                return await bot.sendMessage(chatId, `Твоё имя: ${msg.from.first_name}, а вот фамилии почему-то нету`)
            }else if(!msg.from.first_name){
                return await bot.sendMessage(chatId, `Имени у тебя нет, но фамилия: ${msg.from.last_name}`)
            }else if(!msg.from.first_name && !msg.from.last_name){
                return await bot.sendMessage(chatId, `Тебя зовут: та видимо, никак тебя не зовут`)
            } else{
                return await bot.sendMessage(chatId, `Твоё имя: ${msg.from.first_name}, а фамилия у тебя: ${msg.from.last_name}`)
            }
        }else if(text === '/game'){
            return startGame(chatId);
        }else{
            return await bot.sendMessage(chatId, `Ты написал(а) мне ${text}`)
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId);
        }

        if (String(data) === String(chats[chatId])){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/639/a37/639a37bc-abaa-35ac-bc47-dc5a091297b1/7.webp')
            await bot.sendMessage(chatId, `Ты выбрал ${data}, бот загадал ${chats[chatId]}`)
            return bot.sendMessage(chatId, 'УРААА! Ты угадал(а)', againOptions)
        }else{
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/639/a37/639a37bc-abaa-35ac-bc47-dc5a091297b1/12.webp')
            await bot.sendMessage(chatId, `Ты выбрал ${data}, бот загадал ${chats[chatId]}`)
            return await bot.sendMessage(chatId, 'Не-а! Ты НЕ угадал(а)', againOptions)
        }
    })
}

start()