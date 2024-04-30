const TelegramApi = require('node-telegram-bot-api')

const token ='6313985522:AAGowu3AeraWWKkH3Xd6ep83YAoTmvItPSU'

const bot = new TelegramApi(token, {polling:true})

const chats ={}

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'1',callback_data:'1'},{text:'2',callback_data:'2'},{text:'3',callback_data:'3'}],
            [{text:'4',callback_data:'4'},{text:'5',callback_data:'5'},{text:'6',callback_data:'6'}],
            [{text:'7',callback_data:'7'},{text:'8',callback_data:'8'},{text:'9',callback_data:'9'}],
            [{text:'0',callback_data:'0'}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard:[
            [{text:'Играть еще раз',callback_data:'/again'}]
        ]
    })
}

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId,`Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,'Отгадывай',gameOptions)
}

const start = () => {

    bot.setMyCommands([
        {command: '/start',description:'Начальное приветствие'},
        {command: '/info',description:'Получить информацию о себе'},
        {command: '/game',description:'Играй в отгадывание цифры'}
    ])
    
    bot.on('message', async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg)
    
        if (text === '/start') {
           await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/527/010/5270106b-d03e-3152-8034-c764f908bba6/1.webp')
           return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот TGBOS автора Даниила Соколова. Вы можете можете посмотреть доступные команды`);
        } 
        if (text === '/info') {
           return bot.sendMessage(chatId, `Информация о тебе: Тебя зовут: ${msg.from.first_name}. Твой никнейм: ${msg.from.username}`);
        }
        if (text === '/game'){
            return startGame(chatId);
        }
        return bot.sendMessage(chatId,'Я тебя не понимаю, попробуй еще раз!)')

        

    })

    bot.on('callback_query',async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
           return startGame(chatId)
        }
        if (Number(data) === chats[chatId]){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/509/656/509656c3-0b65-49bf-a4b1-bb017d285daf/192/75.webp')
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру: ${chats[chatId]}`,againOptions)
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/509/656/509656c3-0b65-49bf-a4b1-bb017d285daf/3.webp')
            return bot.sendMessage(chatId, `Ты не угадал, бот загадал цифру: ${chats[chatId]}`,againOptions)
        }
        
    })
 
}

start()