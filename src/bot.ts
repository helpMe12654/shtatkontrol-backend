const TelegramBot = require('node-telegram-bot-api');

// ⚠️ ЗАМЕНИ НА СВОЮ ПОСТОЯННУЮ ССЫЛКУ NETLIFY
const FRONTEND_URL = 'https://shtatkontrol-app.netlify.app/';

export function startBot() {
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!BOT_TOKEN) {
    console.log('⚠️ BOT_TOKEN не задан — бот не запущен');
    return;
  }

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

  console.log('🤖 Бот запущен');

  bot.onText(/\/start/, (msg: any) => {
    const chatId = msg.chat.id;
    const firstName =
      msg.from && msg.from.first_name ? msg.from.first_name : 'друг';

    const text =
      `Привет, ${firstName}! 👋\n\n` +
      `Это *ШтатКонтроль* — приложение для проверки знаний персонала.\n\n` +
      `Выбери действие:`;

    bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '📝 Пройти аттестацию',
              web_app: { url: FRONTEND_URL },
            },
          ],
          [
            {
              text: '📊 Мой результат',
              web_app: { url: FRONTEND_URL },
            },
          ],
          [
            {
              text: '📖 Памятка',
              web_app: { url: `${FRONTEND_URL}?screen=guide` },
            },
          ],
        ],
      },
    });
  });

  bot.on('polling_error', (err: any) => {
    console.error('Ошибка polling:', err.message);
  });
}