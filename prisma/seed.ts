import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addQuestion(
  text: string,
  profession: string,
  category: string,
  options: { text: string; isCorrect: boolean }[]
) {
  await prisma.question.create({
    data: { text, profession, category, options: { create: options } },
  });
}

async function main() {
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();

  await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: { email: 'test@test.com', name: 'Тестовый Сотрудник' },
  });

  // ═══════════════ ОБЩИЕ (80) ═══════════════
  const general: { text: string; cat: string; opts: { text: string; isCorrect: boolean }[] }[] = [
    { text: 'Что нужно сказать гостю при входе?', cat: 'Сервис', opts: [{ text: 'Привет', isCorrect: false }, { text: 'Здравствуйте! Добро пожаловать!', isCorrect: true }, { text: 'Че надо?', isCorrect: false }] },
    { text: 'Что делать, если гость недоволен заказом?', cat: 'Сервис', opts: [{ text: 'Спорить', isCorrect: false }, { text: 'Извиниться и предложить решение', isCorrect: true }, { text: 'Позвать охрану', isCorrect: false }] },
    { text: 'Как часто мыть руки на кухне?', cat: 'Санитария', opts: [{ text: 'Раз в смену', isCorrect: false }, { text: 'Каждый час и после смены задачи', isCorrect: true }, { text: 'Когда вспомнишь', isCorrect: false }] },
    { text: 'Что такое «Додо-стиль»?', cat: 'Культура', opts: [{ text: 'Быстро, вежливо, с улыбкой', isCorrect: true }, { text: 'Дорого и пафосно', isCorrect: false }, { text: 'Как получится', isCorrect: false }] },
    { text: 'Сколько времени до подачи заказа?', cat: 'Стандарты', opts: [{ text: 'Не более 15 минут', isCorrect: true }, { text: 'Не более 30 минут', isCorrect: false }, { text: 'Как получится', isCorrect: false }] },
    { text: 'Что делать с просроченным продуктом?', cat: 'Санитария', opts: [{ text: 'Утилизировать и сообщить менеджеру', isCorrect: true }, { text: 'Использовать', isCorrect: false }, { text: 'Спрятать', isCorrect: false }] },
    { text: 'Как общаться с коллегами?', cat: 'Культура', opts: [{ text: 'Вежливо', isCorrect: true }, { text: 'Кричать', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Что делать, если не знаешь ответ на вопрос гостя?', cat: 'Сервис', opts: [{ text: 'Уточнить у менеджера', isCorrect: true }, { text: 'Придумать', isCorrect: false }, { text: 'Уйти', isCorrect: false }] },
    { text: 'Как часто менять перчатки?', cat: 'Санитария', opts: [{ text: 'После каждой смены задачи', isCorrect: true }, { text: 'Раз в день', isCorrect: false }, { text: 'Никогда', isCorrect: false }] },
    { text: 'Что такое «гость всегда прав»?', cat: 'Культура', opts: [{ text: 'Уважаем гостя и решаем проблему в рамках правил', isCorrect: true }, { text: 'Гость может всё', isCorrect: false }, { text: 'Просто слоган', isCorrect: false }] },
    { text: 'Что делать при пожаре?', cat: 'Безопасность', opts: [{ text: 'Вывести гостей по эвакуационным выходам', isCorrect: true }, { text: 'Продолжить работу', isCorrect: false }, { text: 'Снимать на телефон', isCorrect: false }] },
    { text: 'Как хранить продукты в холодильнике?', cat: 'Санитария', opts: [{ text: 'По категориям, товарное соседство', isCorrect: true }, { text: 'Всё вместе', isCorrect: false }, { text: 'Как влезет', isCorrect: false }] },
    { text: 'Что делать с забытыми вещами?', cat: 'Сервис', opts: [{ text: 'Сдать менеджеру, записать в журнал', isCorrect: true }, { text: 'Забрать себе', isCorrect: false }, { text: 'Выкинуть', isCorrect: false }] },
    { text: 'Как часто проходить медосмотр?', cat: 'Санитария', opts: [{ text: 'Раз в год', isCorrect: true }, { text: 'Раз в 5 лет', isCorrect: false }, { text: 'Никогда', isCorrect: false }] },
    { text: 'Что делать при агрессивном госте?', cat: 'Безопасность', opts: [{ text: 'Сохранять спокойствие, звать менеджера', isCorrect: true }, { text: 'Ответить агрессией', isCorrect: false }, { text: 'Убежать', isCorrect: false }] },
    { text: 'Что такое «апсейл»?', cat: 'Сервис', opts: [{ text: 'Предложение доп. товара', isCorrect: true }, { text: 'Скидка', isCorrect: false }, { text: 'Возврат', isCorrect: false }] },
    { text: 'Как правильно мыть посуду?', cat: 'Санитария', opts: [{ text: 'Мойка → ополаскивание → сушка', isCorrect: true }, { text: 'Ополоснуть', isCorrect: false }, { text: 'Протереть тряпкой', isCorrect: false }] },
    { text: 'Что делать, если закончился товар?', cat: 'Стандарты', opts: [{ text: 'Сообщить менеджеру', isCorrect: true }, { text: 'Промолчать', isCorrect: false }, { text: 'Придумать отговорку', isCorrect: false }] },
    { text: 'Что важно во внешнем виде?', cat: 'Стандарты', opts: [{ text: 'Чистая форма, причёска, бейдж', isCorrect: true }, { text: 'Главное — удобно', isCorrect: false }, { text: 'Всё равно', isCorrect: false }] },
    { text: 'Что делать после смены?', cat: 'Стандарты', opts: [{ text: 'Убрать место, сдать смену', isCorrect: true }, { text: 'Уйти сразу', isCorrect: false }, { text: 'Оставить как есть', isCorrect: false }] },
    { text: 'Кому подчиняется сотрудник?', cat: 'Стандарты', opts: [{ text: 'Менеджеру смены', isCorrect: true }, { text: 'Сам себе', isCorrect: false }, { text: 'Никому', isCorrect: false }] },
    { text: 'Что делать, если коллега нарушает правила?', cat: 'Культура', opts: [{ text: 'Сообщить менеджеру', isCorrect: true }, { text: 'Промолчать', isCorrect: false }, { text: 'Поспорить', isCorrect: false }] },
    { text: 'Что такое «стандарт обслуживания»?', cat: 'Сервис', opts: [{ text: 'Правила работы с гостем', isCorrect: true }, { text: 'Бумажка', isCorrect: false }, { text: 'Совет коллеги', isCorrect: false }] },
    { text: 'Сколько раз мыть полы в зале?', cat: 'Санитария', opts: [{ text: 'По мере загрязнения и по графику', isCorrect: true }, { text: 'Раз в неделю', isCorrect: false }, { text: 'Никогда', isCorrect: false }] },
    { text: 'Что делать при насекомых на кухне?', cat: 'Санитария', opts: [{ text: 'Сообщить менеджеру и обработать', isCorrect: true }, { text: 'Убить и забыть', isCorrect: false }, { text: 'Спрятать', isCorrect: false }] },
    { text: 'Что делать с жалобой?', cat: 'Сервис', opts: [{ text: 'Выслушать, извиниться, решить', isCorrect: true }, { text: 'Сказать, что не наша проблема', isCorrect: false }, { text: 'Проигнорировать', isCorrect: false }] },
    { text: 'Сколько хранить готовую еду без холодильника?', cat: 'Санитария', opts: [{ text: 'Не более 2 часов', isCorrect: true }, { text: 'Весь день', isCorrect: false }, { text: '24 часа', isCorrect: false }] },
    { text: 'Что такое «тайный гость»?', cat: 'Культура', opts: [{ text: 'Проверяющий под видом гостя', isCorrect: true }, { text: 'VIP', isCorrect: false }, { text: 'Друг менеджера', isCorrect: false }] },
    { text: 'Что делать, если гостю не хватило сдачи?', cat: 'Сервис', opts: [{ text: 'Извиниться и найти решение', isCorrect: true }, { text: 'Сказать «нет»', isCorrect: false }, { text: 'Обвинить гостя', isCorrect: false }] },
    { text: 'Что важнее всего в команде?', cat: 'Культура', opts: [{ text: 'Уважение и взаимопомощь', isCorrect: true }, { text: 'Личная выгода', isCorrect: false }, { text: 'Конкуренция', isCorrect: false }] },
    { text: 'Как кашлять на работе?', cat: 'Санитария', opts: [{ text: 'В локоть или салфетку', isCorrect: true }, { text: 'В ладонь', isCorrect: false }, { text: 'В сторону', isCorrect: false }] },
    { text: 'Что делать при первых признаках простуды?', cat: 'Санитария', opts: [{ text: 'Сообщить менеджеру, надеть маску', isCorrect: true }, { text: 'Скрыть', isCorrect: false }, { text: 'Уйти молча', isCorrect: false }] },
    { text: 'Как вести себя при знакомом госте?', cat: 'Сервис', opts: [{ text: 'Поздороваться, но без фамильярности', isCorrect: true }, { text: 'Обнять', isCorrect: false }, { text: 'Дать скидку', isCorrect: false }] },
    { text: 'Что такое «своевременность»?', cat: 'Сервис', opts: [{ text: 'Делать вовремя', isCorrect: true }, { text: 'Приходить на работу вовремя', isCorrect: false }, { text: 'Работать быстро без качества', isCorrect: false }] },
    { text: 'Что делать с чаевыми?', cat: 'Сервис', opts: [{ text: 'Поблагодарить', isCorrect: true }, { text: 'Отказаться', isCorrect: false }, { text: 'Потребовать больше', isCorrect: false }] },
    { text: 'Как часто проверять сроки годности?', cat: 'Санитария', opts: [{ text: 'Ежедневно', isCorrect: true }, { text: 'Раз в неделю', isCorrect: false }, { text: 'Раз в месяц', isCorrect: false }] },
    { text: 'Что делать, если гость уронил еду?', cat: 'Сервис', opts: [{ text: 'Помочь убрать, предложить замену', isCorrect: true }, { text: 'Сказать «сам виноват»', isCorrect: false }, { text: 'Проигнорировать', isCorrect: false }] },
    { text: 'Что делать, если гость хочет говорить только с менеджером?', cat: 'Сервис', opts: [{ text: 'Позвать менеджера', isCorrect: true }, { text: 'Уговорить говорить с вами', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Что делать с посторонним предметом в еде?', cat: 'Безопасность', opts: [{ text: 'Убрать, извиниться, сообщить менеджеру', isCorrect: true }, { text: 'Убрать предмет и подать снова', isCorrect: false }, { text: 'Обвинить гостя', isCorrect: false }] },
    { text: 'Как правильно передавать нож?', cat: 'Безопасность', opts: [{ text: 'Рукояткой вперёд', isCorrect: true }, { text: 'Лезвием вперёд', isCorrect: false }, { text: 'Бросить', isCorrect: false }] },
    { text: 'Сколько хранить открытое молоко?', cat: 'Санитария', opts: [{ text: 'Не более 3 суток', isCorrect: true }, { text: 'Неделю', isCorrect: false }, { text: 'До скисания', isCorrect: false }] },
    { text: 'Что делать, если не успеваешь выполнить задачу?', cat: 'Культура', opts: [{ text: 'Сообщить заранее', isCorrect: true }, { text: 'Молчать', isCorrect: false }, { text: 'Свалить на коллегу', isCorrect: false }] },
    { text: 'Что делать, если гость спрашивает о составе блюда?', cat: 'Сервис', opts: [{ text: 'Точно ответить или уточнить у повара', isCorrect: true }, { text: 'Придумать', isCorrect: false }, { text: 'Сказать «не знаю»', isCorrect: false }] },
    { text: 'Что значит «чистая смена»?', cat: 'Стандарты', opts: [{ text: 'Убрано, смена сдана', isCorrect: true }, { text: 'Чистая одежда', isCorrect: false }, { text: 'Помыл руки', isCorrect: false }] },
    { text: 'Что делать с плохим отзывом?', cat: 'Сервис', opts: [{ text: 'Сообщить менеджеру и разобрать', isCorrect: true }, { text: 'Ответить в соцсетях', isCorrect: false }, { text: 'Удалить', isCorrect: false }] },
    { text: 'Как вытирать стол?', cat: 'Санитария', opts: [{ text: 'Чистой салфеткой с дезраствором', isCorrect: true }, { text: 'Тряпкой', isCorrect: false }, { text: 'Рукой', isCorrect: false }] },
    { text: 'Что делать при поломке оборудования?', cat: 'Безопасность', opts: [{ text: 'Отключить, сообщить', isCorrect: true }, { text: 'Починить самому', isCorrect: false }, { text: 'Продолжать', isCorrect: false }] },
    { text: 'Что такое «командный дух»?', cat: 'Культура', opts: [{ text: 'Готовность помочь', isCorrect: true }, { text: 'Каждый сам за себя', isCorrect: false }, { text: 'Соревнование', isCorrect: false }] },
    { text: 'Что делать, если гость хочет изменить заказ?', cat: 'Сервис', opts: [{ text: 'Уточнить у менеджера и помочь', isCorrect: true }, { text: 'Отказать', isCorrect: false }, { text: 'Сказать «поздно»', isCorrect: false }] },
    { text: 'Как часто дезинфицировать доски?', cat: 'Санитария', opts: [{ text: 'После каждой смены продукта', isCorrect: true }, { text: 'Раз в неделю', isCorrect: false }, { text: 'Никогда', isCorrect: false }] },
    { text: 'Что делать при утечке газа?', cat: 'Безопасность', opts: [{ text: 'Не включать свет, открыть окна, сообщить', isCorrect: true }, { text: 'Зажечь спичку', isCorrect: false }, { text: 'Продолжать', isCorrect: false }] },
    { text: 'Что делать, если гость оскорбляет?', cat: 'Безопасность', opts: [{ text: 'Сохранять спокойствие, позвать менеджера', isCorrect: true }, { text: 'Ответить тем же', isCorrect: false }, { text: 'Заплакать', isCorrect: false }] },
    { text: 'Что такое «стоп-лист»?', cat: 'Стандарты', opts: [{ text: 'Список блюд, которых нет', isCorrect: true }, { text: 'Уволенные', isCorrect: false }, { text: 'Гости', isCorrect: false }] },
    { text: 'Что делать при опоздании?', cat: 'Культура', opts: [{ text: 'Предупредить заранее', isCorrect: true }, { text: 'Молчать', isCorrect: false }, { text: 'Не прийти', isCorrect: false }] },
    { text: 'Как хранить ножи?', cat: 'Безопасность', opts: [{ text: 'В держателе', isCorrect: true }, { text: 'В ящике со всем', isCorrect: false }, { text: 'На столе', isCorrect: false }] },
    { text: 'Что делать, если гость не может оплатить?', cat: 'Сервис', opts: [{ text: 'Вежливо предложить способы, позвать менеджера', isCorrect: true }, { text: 'Кричать', isCorrect: false }, { text: 'Простить долг', isCorrect: false }] },
    { text: 'Что делать, если ребёнок без присмотра?', cat: 'Безопасность', opts: [{ text: 'Сообщить менеджеру, не оставлять', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Увести', isCorrect: false }] },
    { text: 'Что делать с гостем с ограниченными возможностями?', cat: 'Сервис', opts: [{ text: 'Помочь, но не навязываться', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Говорить громче', isCorrect: false }] },
    { text: 'Что делать, если гость фотографирует еду?', cat: 'Сервис', opts: [{ text: 'Не мешать', isCorrect: true }, { text: 'Запретить', isCorrect: false }, { text: 'Попросить удалить', isCorrect: false }] },
    { text: 'Что делать, если увидел нарушение у коллеги?', cat: 'Культура', opts: [{ text: 'Сообщить менеджеру', isCorrect: true }, { text: 'Сделать замечание при гостях', isCorrect: false }, { text: 'Промолчать', isCorrect: false }] },
    { text: 'Что важнее: скорость или качество?', cat: 'Стандарты', opts: [{ text: 'Качество без лишних задержек', isCorrect: true }, { text: 'Только скорость', isCorrect: false }, { text: 'Только качество', isCorrect: false }] },
    { text: 'Что делать, если гость не может найти столик?', cat: 'Сервис', opts: [{ text: 'Проводить', isCorrect: true }, { text: 'Показать рукой', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Что такое «сервис-чарт»?', cat: 'Стандарты', opts: [{ text: 'Схема рассадки', isCorrect: true }, { text: 'Меню', isCorrect: false }, { text: 'План эвакуации', isCorrect: false }] },
    { text: 'Что делать, если гость хочет в туалет?', cat: 'Сервис', opts: [{ text: 'Показать направление', isCorrect: true }, { text: 'Сказать «нет»', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Как реагировать на критику от менеджера?', cat: 'Культура', opts: [{ text: 'Выслушать, спросить как исправить', isCorrect: true }, { text: 'Спорить', isCorrect: false }, { text: 'Уйти', isCorrect: false }] },
    { text: 'Что делать, если гость сильно пьян?', cat: 'Безопасность', opts: [{ text: 'Не подавать алкоголь, сообщить менеджеру', isCorrect: true }, { text: 'Налить ещё', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Что делать, если в зале драка?', cat: 'Безопасность', opts: [{ text: 'Не вмешиваться, позвать менеджера и охрану', isCorrect: true }, { text: 'Снимать', isCorrect: false }, { text: 'Разнимать самому', isCorrect: false }] },
    { text: 'Что делать при запахе гари?', cat: 'Безопасность', opts: [{ text: 'Найти источник, сообщить менеджеру', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Открыть окно', isCorrect: false }] },
    { text: 'Что такое «открытие смены»?', cat: 'Стандарты', opts: [{ text: 'Подготовка зала и кухни к работе', isCorrect: true }, { text: 'Закрытие', isCorrect: false }, { text: 'Перерыв', isCorrect: false }] },
    { text: 'Что делать, если гость хочет забрать еду с собой?', cat: 'Сервис', opts: [{ text: 'Упаковать аккуратно', isCorrect: true }, { text: 'Отказать', isCorrect: false }, { text: 'Дать в руках', isCorrect: false }] },
    { text: 'Что делать при жалобе на качество еды?', cat: 'Сервис', opts: [{ text: 'Извиниться, заменить, сообщить менеджеру', isCorrect: true }, { text: 'Сказать «так и должно быть»', isCorrect: false }, { text: 'Спорить', isCorrect: false }] },
    { text: 'Что такое «доп. продажа»?', cat: 'Сервис', opts: [{ text: 'Предложение к основному заказу', isCorrect: true }, { text: 'Скидка', isCorrect: false }, { text: 'Возврат', isCorrect: false }] },
    { text: 'Что делать при большой очереди?', cat: 'Сервис', opts: [{ text: 'Сообщить менеджеру, извиниться перед гостями', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Уйти', isCorrect: false }] },
    { text: 'Что делать, если гость ругается матом?', cat: 'Безопасность', opts: [{ text: 'Сохранять спокойствие, позвать менеджера', isCorrect: true }, { text: 'Ответить матом', isCorrect: false }, { text: 'Заплакать', isCorrect: false }] },
    { text: 'Что важно помнить про улыбку?', cat: 'Сервис', opts: [{ text: 'Улыбка — часть стандарта', isCorrect: true }, { text: 'Необязательно', isCorrect: false }, { text: 'Только для знакомых', isCorrect: false }] },
    { text: 'Что делать в конце смены?', cat: 'Стандарты', opts: [{ text: 'Убрать рабочее место, сдать смену', isCorrect: true }, { text: 'Уйти сразу', isCorrect: false }, { text: 'Оставить как есть', isCorrect: false }] },
    { text: 'Как относиться к новичкам?', cat: 'Культура', opts: [{ text: 'Помогать и объяснять', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Подшучивать', isCorrect: false }] },
    { text: 'Что делать, если гость оставил много еды?', cat: 'Сервис', opts: [{ text: 'Уточнить, всё ли понравилось', isCorrect: true }, { text: 'Молча убрать', isCorrect: false }, { text: 'Сделать замечание', isCorrect: false }] },
    { text: 'Что значит «работа в команде»?', cat: 'Культура', opts: [{ text: 'Помогать друг другу', isCorrect: true }, { text: 'Каждый сам за себя', isCorrect: false }, { text: 'Соревноваться', isCorrect: false }] },
  ];
  for (const q of general) await addQuestion(q.text, 'general', q.cat, q.opts);

  // ═══════════════ ОФИЦИАНТ (15) ═══════════════
  const waiter = [
    { text: 'С чего начинается обслуживание за столом?', cat: 'Официант', opts: [{ text: 'С подачи меню и приветствия', isCorrect: true }, { text: 'Сразу заказ', isCorrect: false }, { text: 'С уборки', isCorrect: false }] },
    { text: 'Как нести поднос?', cat: 'Официант', opts: [{ text: 'На левой ладони у плеча', isCorrect: true }, { text: 'Двумя руками', isCorrect: false }, { text: 'Под мышкой', isCorrect: false }] },
    { text: 'Когда убирать грязную посуду?', cat: 'Официант', opts: [{ text: 'Сразу после того, как гость закончил', isCorrect: true }, { text: 'В конце смены', isCorrect: false }, { text: 'По просьбе', isCorrect: false }] },
    { text: 'Что делать, если блюда нет?', cat: 'Официант', opts: [{ text: 'Предложить альтернативу', isCorrect: true }, { text: 'Сказать «нет»', isCorrect: false }, { text: 'Молча принести другое', isCorrect: false }] },
    { text: 'Как принимать заказ?', cat: 'Официант', opts: [{ text: 'Записать, повторить, уточнить', isCorrect: true }, { text: 'Запомнить', isCorrect: false }, { text: 'Кивнуть', isCorrect: false }] },
    { text: 'Как подавать счёт?', cat: 'Официант', opts: [{ text: 'В папке или на подносе', isCorrect: true }, { text: 'Назвать сумму', isCorrect: false }, { text: 'Бросить', isCorrect: false }] },
    { text: 'Как часто проверять стол?', cat: 'Официант', opts: [{ text: 'Каждые 10–15 минут', isCorrect: true }, { text: 'Раз в час', isCorrect: false }, { text: 'Только по зову', isCorrect: false }] },
    { text: 'Что делать, если гость торопится?', cat: 'Официант', opts: [{ text: 'Уточнить время и предложить быстрое блюдо', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Сказать «не успеем»', isCorrect: false }] },
    { text: 'Как ставить блюдо?', cat: 'Официант', opts: [{ text: 'Справа, аккуратно', isCorrect: true }, { text: 'Слева', isCorrect: false }, { text: 'Как получится', isCorrect: false }] },
    { text: 'Что делать, если гость просит заменить приборы?', cat: 'Официант', opts: [{ text: 'Принести чистые с улыбкой', isCorrect: true }, { text: 'Сказать «они чистые»', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Как правильно накрывать на стол?', cat: 'Официант', opts: [{ text: 'Приборы слева и справа от тарелки', isCorrect: true }, { text: 'Всё в кучу', isCorrect: false }, { text: 'Только вилку', isCorrect: false }] },
    { text: 'Что делать, если гость хочет оставить чаевые?', cat: 'Официант', opts: [{ text: 'Поблагодарить', isCorrect: true }, { text: 'Отказаться', isCorrect: false }, { text: 'Спрятать', isCorrect: false }] },
    { text: 'Как реагировать, если гость жалуется на блюдо?', cat: 'Официант', opts: [{ text: 'Извиниться, предложить замену, позвать менеджера', isCorrect: true }, { text: 'Спорить', isCorrect: false }, { text: 'Проигнорировать', isCorrect: false }] },
    { text: 'Как убирать стол после ухода гостя?', cat: 'Официант', opts: [{ text: 'Собрать посуду, протереть', isCorrect: true }, { text: 'Оставить', isCorrect: false }, { text: 'Ждать', isCorrect: false }] },
    { text: 'Как подавать напитки?', cat: 'Официант', opts: [{ text: 'Справа, за основание стакана', isCorrect: true }, { text: 'За верх', isCorrect: false }, { text: 'Слева', isCorrect: false }] },
  ];
  for (const q of waiter) await addQuestion(q.text, 'официант', q.cat, q.opts);

  // ═══════════════ ПОВАР (15) ═══════════════
  const cook = [
    { text: 'Температура в холодильнике?', cat: 'Повар', opts: [{ text: '+2…+4 °C', isCorrect: true }, { text: '+10 °C', isCorrect: false }, { text: '0 °C', isCorrect: false }] },
    { text: 'Что делать при порезе?', cat: 'Повар', opts: [{ text: 'Обработать, заклеить, надеть перчатку', isCorrect: true }, { text: 'Работать', isCorrect: false }, { text: 'Замотать тряпкой', isCorrect: false }] },
    { text: 'Как размораживать мясо?', cat: 'Повар', opts: [{ text: 'В холодильнике', isCorrect: true }, { text: 'В горячей воде', isCorrect: false }, { text: 'На столе', isCorrect: false }] },
    { text: 'Что такое «товарное соседство»?', cat: 'Повар', opts: [{ text: 'Сырое и готовое отдельно', isCorrect: true }, { text: 'Всё вместе', isCorrect: false }, { text: 'По цвету', isCorrect: false }] },
    { text: 'Через сколько выбрасывать еду с раздачи?', cat: 'Повар', opts: [{ text: '2–3 часа', isCorrect: true }, { text: '12 часов', isCorrect: false }, { text: 'Не выбрасывать', isCorrect: false }] },
    { text: 'Как мыть овощи?', cat: 'Повар', opts: [{ text: 'Под проточной водой', isCorrect: true }, { text: 'Протереть', isCorrect: false }, { text: 'Не мыть', isCorrect: false }] },
    { text: 'Как хранить яйца?', cat: 'Повар', opts: [{ text: 'В холодильнике отдельно', isCorrect: true }, { text: 'На столе', isCorrect: false }, { text: 'Рядом с мясом', isCorrect: false }] },
    { text: 'Что делать с испорченным продуктом?', cat: 'Повар', opts: [{ text: 'Выбросить, сообщить', isCorrect: true }, { text: 'Использовать', isCorrect: false }, { text: 'Специи добавь', isCorrect: false }] },
    { text: 'Как держать нож?', cat: 'Повар', opts: [{ text: 'Уверенно, указательный на обухе', isCorrect: true }, { text: 'За лезвие', isCorrect: false }, { text: 'Как получится', isCorrect: false }] },
    { text: 'Что такое «прожарка»?', cat: 'Повар', opts: [{ text: 'Степень готовности мяса', isCorrect: true }, { text: 'Тип масла', isCorrect: false }, { text: 'Нарезка', isCorrect: false }] },
    { text: 'Что делать, если еда подгорела?', cat: 'Повар', opts: [{ text: 'Выбросить и приготовить заново', isCorrect: true }, { text: 'Подать', isCorrect: false }, { text: 'Спрятать', isCorrect: false }] },
    { text: 'Как проверять готовность мяса?', cat: 'Повар', opts: [{ text: 'Термометром', isCorrect: true }, { text: 'На глаз', isCorrect: false }, { text: 'На вкус сырым', isCorrect: false }] },
    { text: 'Как хранить специи?', cat: 'Повар', opts: [{ text: 'В закрытой таре, в тёмном месте', isCorrect: true }, { text: 'Открытыми', isCorrect: false }, { text: 'В холодильнике', isCorrect: false }] },
    { text: 'Что делать с остатками еды?', cat: 'Повар', opts: [{ text: 'Утилизировать', isCorrect: true }, { text: 'Оставить на завтра', isCorrect: false }, { text: 'Отдать гостям', isCorrect: false }] },
    { text: 'Как правильно нарезать хлеб?', cat: 'Повар', opts: [{ text: 'Ровными ломтями, острым ножом', isCorrect: true }, { text: 'Как получится', isCorrect: false }, { text: 'Руками', isCorrect: false }] },
  ];
  for (const q of cook) await addQuestion(q.text, 'повар', q.cat, q.opts);

  // ═══════════════ БАРМЕН (15) ═══════════════
  const bartender = [
    { text: 'Что проверить перед сменой?', cat: 'Бармен', opts: [{ text: 'Лёд, ингредиенты, чистоту', isCorrect: true }, { text: 'Только лёд', isCorrect: false }, { text: 'Ничего', isCorrect: false }] },
    { text: 'Как подавать напитки?', cat: 'Бармен', opts: [{ text: 'Аккуратно, со стороны гостя', isCorrect: true }, { text: 'Через стойку', isCorrect: false }, { text: 'Молча', isCorrect: false }] },
    { text: 'Что делать с сильно пьяным гостем?', cat: 'Бармен', opts: [{ text: 'Не подавать алкоголь, звать менеджера', isCorrect: true }, { text: 'Налить ещё', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Как хранить открытые бутылки?', cat: 'Бармен', opts: [{ text: 'Закрытыми, в холодильнике, с датой', isCorrect: true }, { text: 'Как попало', isCorrect: false }, { text: 'Открытыми', isCorrect: false }] },
    { text: 'Что такое «фрифлоу»?', cat: 'Бармен', opts: [{ text: 'Бесплатная подача', isCorrect: true }, { text: 'Быстрая подача', isCorrect: false }, { text: 'Скидка', isCorrect: false }] },
    { text: 'Как проверять возраст гостя?', cat: 'Бармен', opts: [{ text: 'Попросить документ', isCorrect: true }, { text: 'На глаз', isCorrect: false }, { text: 'Не проверять', isCorrect: false }] },
    { text: 'Как использовать мерный стакан?', cat: 'Бармен', opts: [{ text: 'Для точной дозировки', isCorrect: true }, { text: 'Не нужен', isCorrect: false }, { text: 'Для украшения', isCorrect: false }] },
    { text: 'Как мыть шейкер?', cat: 'Бармен', opts: [{ text: 'После каждого напитка', isCorrect: true }, { text: 'Раз в день', isCorrect: false }, { text: 'Никогда', isCorrect: false }] },
    { text: 'Что делать, если закончился лёд?', cat: 'Бармен', opts: [{ text: 'Сообщить менеджеру', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Использовать воду', isCorrect: false }] },
    { text: 'Как украшать коктейли?', cat: 'Бармен', opts: [{ text: 'Съедобными элементами', isCorrect: true }, { text: 'Чем угодно', isCorrect: false }, { text: 'Бумагой', isCorrect: false }] },
    { text: 'Как хранить лёд?', cat: 'Бармен', opts: [{ text: 'В чистом контейнере, отдельно от еды', isCorrect: true }, { text: 'В раковине', isCorrect: false }, { text: 'На столе', isCorrect: false }] },
    { text: 'Что делать, если гость просит коктейль, которого нет в меню?', cat: 'Бармен', opts: [{ text: 'Предложить альтернативу', isCorrect: true }, { text: 'Отказать', isCorrect: false }, { text: 'Приготовить из чего попало', isCorrect: false }] },
    { text: 'Как правильно наливать пиво?', cat: 'Бармен', opts: [{ text: 'По стенке стакана, с пеной', isCorrect: true }, { text: 'Как получится', isCorrect: false }, { text: 'Без пены', isCorrect: false }] },
    { text: 'Что делать с разбитым стеклом?', cat: 'Бармен', opts: [{ text: 'Убрать, выбросить в спецконтейнер', isCorrect: true }, { text: 'Оставить', isCorrect: false }, { text: 'Смести в раковину', isCorrect: false }] },
    { text: 'Как общаться с гостем за баром?', cat: 'Бармен', opts: [{ text: 'Вежливо, ненавязчиво', isCorrect: true }, { text: 'Грубо', isCorrect: false }, { text: 'Молча', isCorrect: false }] },
  ];
  for (const q of bartender) await addQuestion(q.text, 'бармен', q.cat, q.opts);

  // ═══════════════ ХОСТЕС (15) ═══════════════
  const hostess = [
    { text: 'Что делает хостес при входе?', cat: 'Хостес', opts: [{ text: 'Приветствует и провожает', isCorrect: true }, { text: 'Сразу заказ', isCorrect: false }, { text: 'Ждёт', isCorrect: false }] },
    { text: 'Как рассаживать гостей?', cat: 'Хостес', opts: [{ text: 'С учётом зон и пожеланий', isCorrect: true }, { text: 'Как получится', isCorrect: false }, { text: 'Только у окна', isCorrect: false }] },
    { text: 'Что делать, если нет свободных столов?', cat: 'Хостес', opts: [{ text: 'Предложить подождать, записать', isCorrect: true }, { text: 'Сказать «мест нет»', isCorrect: false }, { text: 'Посадить к другим', isCorrect: false }] },
    { text: 'Как отвечать на звонки по брони?', cat: 'Хостес', opts: [{ text: 'Вежливо, уточнить детали', isCorrect: true }, { text: 'Коротко да/нет', isCorrect: false }, { text: 'Не отвечать', isCorrect: false }] },
    { text: 'Что делать при жалобе в зоне хостес?', cat: 'Хостес', opts: [{ text: 'Выслушать, позвать менеджера', isCorrect: true }, { text: 'Спорить', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Как приветствовать по телефону?', cat: 'Хостес', opts: [{ text: 'Здравствуйте, [название]!', isCorrect: true }, { text: 'Алло', isCorrect: false }, { text: 'Да', isCorrect: false }] },
    { text: 'Что делать, если гость с ребёнком?', cat: 'Хостес', opts: [{ text: 'Предложить детский стул и меню', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Отказать', isCorrect: false }] },
    { text: 'Как распределять гостей по зонам?', cat: 'Хостес', opts: [{ text: 'Равномерно, по загрузке официантов', isCorrect: true }, { text: 'Всё в одну зону', isCorrect: false }, { text: 'Как получится', isCorrect: false }] },
    { text: 'Что делать, если гость опоздал на бронь?', cat: 'Хостес', opts: [{ text: 'Держать стол 15 минут', isCorrect: true }, { text: 'Отдать сразу', isCorrect: false }, { text: 'Отменить', isCorrect: false }] },
    { text: 'Как провожать гостя к столу?', cat: 'Хостес', opts: [{ text: 'Идти впереди, показывать рукой', isCorrect: true }, { text: 'Сзади', isCorrect: false }, { text: 'Не провожать', isCorrect: false }] },
    { text: 'Что делать с VIP-гостями?', cat: 'Хостес', opts: [{ text: 'Особое внимание, лучший стол', isCorrect: true }, { text: 'Как обычно', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Как вести журнал брони?', cat: 'Хостес', opts: [{ text: 'Записывать всех, точно', isCorrect: true }, { text: 'На память', isCorrect: false }, { text: 'Не вести', isCorrect: false }] },
    { text: 'Что делать при большом потоке гостей?', cat: 'Хостес', opts: [{ text: 'Сообщить менеджеру, извиниться, вести лист ожидания', isCorrect: true }, { text: 'Игнорировать', isCorrect: false }, { text: 'Уйти', isCorrect: false }] },
    { text: 'Как прощаться с гостем?', cat: 'Хостес', opts: [{ text: 'Спасибо, приходите снова!', isCorrect: true }, { text: 'Молча', isCorrect: false }, { text: 'Пока', isCorrect: false }] },
    { text: 'Что делать, если гость недоволен местом?', cat: 'Хостес', opts: [{ text: 'Предложить другой стол', isCorrect: true }, { text: 'Спорить', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
  ];
  for (const q of hostess) await addQuestion(q.text, 'хостес', q.cat, q.opts);

  // ═══════════════ КУРЬЕР (15) ═══════════════
  const courier = [
    { text: 'Что проверить перед выездом?', cat: 'Курьер', opts: [{ text: 'Адрес, заказ, терминал, сумку', isCorrect: true }, { text: 'Только адрес', isCorrect: false }, { text: 'Ничего', isCorrect: false }] },
    { text: 'Как перевозить пиццу?', cat: 'Курьер', opts: [{ text: 'В термосумке, горизонтально', isCorrect: true }, { text: 'Как угодно', isCorrect: false }, { text: 'В руках', isCorrect: false }] },
    { text: 'Что делать, если гость не открывает?', cat: 'Курьер', opts: [{ text: 'Позвонить, потом связаться с менеджером', isCorrect: true }, { text: 'Уехать', isCorrect: false }, { text: 'Оставить под дверью', isCorrect: false }] },
    { text: 'Как вести себя при доставке?', cat: 'Курьер', opts: [{ text: 'Вежливо, с улыбкой', isCorrect: true }, { text: 'Молча', isCorrect: false }, { text: 'Грубо', isCorrect: false }] },
    { text: 'Что делать при поломке транспорта?', cat: 'Курьер', opts: [{ text: 'Сообщить менеджеру', isCorrect: true }, { text: 'Бросить заказ', isCorrect: false }, { text: 'Ничего', isCorrect: false }] },
    { text: 'Как проверять адрес?', cat: 'Курьер', opts: [{ text: 'Сверить с приложением', isCorrect: true }, { text: 'По памяти', isCorrect: false }, { text: 'Спросить у прохожих', isCorrect: false }] },
    { text: 'Что делать, если опоздал?', cat: 'Курьер', opts: [{ text: 'Предупредить менеджера и гостя', isCorrect: true }, { text: 'Молчать', isCorrect: false }, { text: 'Не приехать', isCorrect: false }] },
    { text: 'Как передавать заказ?', cat: 'Курьер', opts: [{ text: 'Лично в руки, улыбнуться', isCorrect: true }, { text: 'Оставить под дверью', isCorrect: false }, { text: 'Отдать соседу', isCorrect: false }] },
    { text: 'Что делать с деньгами?', cat: 'Курьер', opts: [{ text: 'Вести учёт, сдавать смену', isCorrect: true }, { text: 'Оставить себе', isCorrect: false }, { text: 'Потерять', isCorrect: false }] },
    { text: 'Как ездить на транспорте?', cat: 'Курьер', opts: [{ text: 'Соблюдать ПДД', isCorrect: true }, { text: 'Как хочется', isCorrect: false }, { text: 'Быстро, без правил', isCorrect: false }] },
    { text: 'Что делать при ДТП?', cat: 'Курьер', opts: [{ text: 'Сообщить менеджеру, вызвать ГИБДД', isCorrect: true }, { text: 'Уехать', isCorrect: false }, { text: 'Молчать', isCorrect: false }] },
    { text: 'Как относиться к заказу?', cat: 'Курьер', opts: [{ text: 'Бережно, как к своему', isCorrect: true }, { text: 'Как получится', isCorrect: false }, { text: 'Не важно', isCorrect: false }] },
    { text: 'Что делать, если гость недоволен?', cat: 'Курьер', opts: [{ text: 'Извиниться, сообщить менеджеру', isCorrect: true }, { text: 'Спорить', isCorrect: false }, { text: 'Уехать', isCorrect: false }] },
    { text: 'Как прощаться с гостем?', cat: 'Курьер', opts: [{ text: 'Приятного аппетита, до свидания!', isCorrect: true }, { text: 'Молча', isCorrect: false }, { text: 'Пока', isCorrect: false }] },
    { text: 'Что делать, если потерял заказ?', cat: 'Курьер', opts: [{ text: 'Сообщить менеджеру', isCorrect: true }, { text: 'Скрыть', isCorrect: false }, { text: 'Купить новый', isCorrect: false }] },
  ];
  for (const q of courier) await addQuestion(q.text, 'курьер', q.cat, q.opts);

  // ═══════════════ УПРАВЛЯЮЩИЙ (15) ═══════════════
  const manager = [
    { text: 'Что важнее всего в работе управляющего?', cat: 'Управляющий', opts: [{ text: 'Люди, стандарты, результат', isCorrect: true }, { text: 'Только цифры', isCorrect: false }, { text: 'Только жалобы', isCorrect: false }] },
    { text: 'Как проводить разбор смены?', cat: 'Управляющий', opts: [{ text: 'Спокойно, по фактам, с планом', isCorrect: true }, { text: 'Кричать', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Что делать при жалобе на сотрудника?', cat: 'Управляющий', opts: [{ text: 'Выслушать, разобраться, принять меры', isCorrect: true }, { text: 'Встать на сторону сотрудника', isCorrect: false }, { text: 'Уволить сразу', isCorrect: false }] },
    { text: 'Кто отвечает за санитарию?', cat: 'Управляющий', opts: [{ text: 'Управляющий и вся смена', isCorrect: true }, { text: 'Только уборщица', isCorrect: false }, { text: 'Только повар', isCorrect: false }] },
    { text: 'Как часто обучать персонал?', cat: 'Управляющий', opts: [{ text: 'Регулярно, по плану', isCorrect: true }, { text: 'Только при приёме', isCorrect: false }, { text: 'Никогда', isCorrect: false }] },
    { text: 'Как мотивировать команду?', cat: 'Управляющий', opts: [{ text: 'Хвалить и премировать', isCorrect: true }, { text: 'Кричать', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Что делать при конфликте сотрудников?', cat: 'Управляющий', opts: [{ text: 'Разобрать один на один', isCorrect: true }, { text: 'Публично', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Как контролировать закупки?', cat: 'Управляющий', opts: [{ text: 'Проверять накладные и остатки', isCorrect: true }, { text: 'Не проверять', isCorrect: false }, { text: 'На глаз', isCorrect: false }] },
    { text: 'Что делать при проверке Роспотребнадзора?', cat: 'Управляющий', opts: [{ text: 'Спокойно предоставить документы', isCorrect: true }, { text: 'Спрятать', isCorrect: false }, { text: 'Не пустить', isCorrect: false }] },
    { text: 'Как вести отчётность?', cat: 'Управляющий', opts: [{ text: 'Ежедневно, точно', isCorrect: true }, { text: 'Раз в год', isCorrect: false }, { text: 'Никак', isCorrect: false }] },
    { text: 'Что делать при кассовом расхождении?', cat: 'Управляющий', opts: [{ text: 'Разобраться, зафиксировать', isCorrect: true }, { text: 'Скрыть', isCorrect: false }, { text: 'Списать', isCorrect: false }] },
    { text: 'Как контролировать время смены?', cat: 'Управляющий', opts: [{ text: 'Вести учёт прихода и ухода', isCorrect: true }, { text: 'Не вести', isCorrect: false }, { text: 'На доверии', isCorrect: false }] },
    { text: 'Что делать, если сотрудник опоздал?', cat: 'Управляющий', opts: [{ text: 'Выяснить причину, принять меры', isCorrect: true }, { text: 'Уволить', isCorrect: false }, { text: 'Игнорировать', isCorrect: false }] },
    { text: 'Как оценивать работу смены?', cat: 'Управляющий', opts: [{ text: 'По стандартам и метрикам', isCorrect: true }, { text: 'По настроению', isCorrect: false }, { text: 'Не оценивать', isCorrect: false }] },
    { text: 'Что делать с лучшими сотрудниками?', cat: 'Управляющий', opts: [{ text: 'Поощрять и продвигать', isCorrect: true }, { text: 'Не замечать', isCorrect: false }, { text: 'Увольнять', isCorrect: false }] },
  ];
  for (const q of manager) await addQuestion(q.text, 'управляющий', q.cat, q.opts);

  const total = await prisma.question.count();
  console.log(`✅ База заполнена: ${total} вопросов`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });