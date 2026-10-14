import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let questionCounter = 0;

async function addQuestion(
  text: string,
  profession: string,
  category: string,
  options: { text: string; isCorrect: boolean }[]
) {
  questionCounter++;
  await prisma.question.create({
    data: {
      number: questionCounter,
      text,
      profession,
      category,
      options: { create: options },
    },
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
    { text: 'Что нужно сказать гостю при входе?', cat: 'Сервис', opts: [
      { text: 'Привет', isCorrect: false },
      { text: 'Здравствуйте! Добро пожаловать!', isCorrect: true },
      { text: 'Че надо?', isCorrect: false },
      { text: 'Молча кивнуть', isCorrect: false },
    ] },
    { text: 'Что делать, если гость недоволен заказом?', cat: 'Сервис', opts: [
      { text: 'Спорить с гостем', isCorrect: false },
      { text: 'Извиниться и предложить решение', isCorrect: true },
      { text: 'Позвать охрану', isCorrect: false },
      { text: 'Уйти в подсобку', isCorrect: false },
    ] },
    { text: 'Как часто нужно мыть руки на кухне?', cat: 'Санитария', opts: [
      { text: 'Один раз в смену', isCorrect: false },
      { text: 'Каждый час или после смены задачи', isCorrect: true },
      { text: 'Когда вспомнишь', isCorrect: false },
      { text: 'Перед уходом домой', isCorrect: false },
    ] },
    { text: 'Что такое «Додо-стиль» в обслуживании?', cat: 'Культура', opts: [
      { text: 'Быстро, вежливо, с улыбкой', isCorrect: true },
      { text: 'Дорого и пафосно', isCorrect: false },
      { text: 'Как получится', isCorrect: false },
      { text: 'Строго по инструкции без эмоций', isCorrect: false },
    ] },
    { text: 'Сколько времени должно пройти до подачи заказа?', cat: 'Стандарты', opts: [
      { text: 'Не более 10 минут', isCorrect: false },
      { text: 'Не более 15 минут', isCorrect: true },
      { text: 'Не более 30 минут', isCorrect: false },
      { text: 'Как получится', isCorrect: false },
    ] },
    { text: 'Что делать при обнаружении просроченного продукта?', cat: 'Санитария', opts: [
      { text: 'Использовать, если пахнет нормально', isCorrect: false },
      { text: 'Сразу утилизировать и сообщить менеджеру', isCorrect: true },
      { text: 'Отдать коллеге', isCorrect: false },
      { text: 'Спрятать в дальний угол', isCorrect: false },
    ] },
    { text: 'Как правильно общаться с коллегами?', cat: 'Культура', opts: [
      { text: 'Вежливо и уважительно', isCorrect: true },
      { text: 'Кричать, если что-то не так', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Обсуждать за спиной', isCorrect: false },
    ] },
    { text: 'Что делать, если не знаешь ответ на вопрос гостя?', cat: 'Сервис', opts: [
      { text: 'Придумать что-нибудь', isCorrect: false },
      { text: 'Уточнить у менеджера и вернуться с ответом', isCorrect: true },
      { text: 'Сказать «не знаю» и уйти', isCorrect: false },
      { text: 'Перевести тему', isCorrect: false },
    ] },
    { text: 'Как часто нужно менять перчатки на кухне?', cat: 'Санитария', opts: [
      { text: 'Раз в день', isCorrect: false },
      { text: 'После смены задачи или загрязнения', isCorrect: true },
      { text: 'Когда порвутся', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
    ] },
    { text: 'Что такое «гость всегда прав»?', cat: 'Культура', opts: [
      { text: 'Гость всегда получает то, что хочет', isCorrect: false },
      { text: 'Мы уважаем гостя и решаем проблему в рамках правил', isCorrect: true },
      { text: 'Гость может делать что угодно', isCorrect: false },
      { text: 'Это просто слоган', isCorrect: false },
    ] },
    { text: 'Что делать при пожаре?', cat: 'Безопасность', opts: [
      { text: 'Спокойно вывести гостей', isCorrect: true },
      { text: 'Продолжить работу', isCorrect: false },
      { text: 'Снимать на телефон', isCorrect: false },
      { text: 'Бежать первым', isCorrect: false },
    ] },
    { text: 'Как правильно хранить продукты в холодильнике?', cat: 'Санитария', opts: [
      { text: 'Всё в одном месте', isCorrect: false },
      { text: 'По категориям, с товарным соседством', isCorrect: true },
      { text: 'Как влезет', isCorrect: false },
      { text: 'Только на верхней полке', isCorrect: false },
    ] },
    { text: 'Что делать с забытыми вещами гостя?', cat: 'Сервис', opts: [
      { text: 'Забрать себе', isCorrect: false },
      { text: 'Сдать менеджеру и записать в журнал', isCorrect: true },
      { text: 'Выкинуть', isCorrect: false },
      { text: 'Оставить на столе', isCorrect: false },
    ] },
    { text: 'Как часто проходить медосмотр?', cat: 'Санитария', opts: [
      { text: 'Раз в год', isCorrect: true },
      { text: 'Раз в 5 лет', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
      { text: 'Только при приёме на работу', isCorrect: false },
    ] },
    { text: 'Что делать при агрессивном госте?', cat: 'Безопасность', opts: [
      { text: 'Ответить агрессией', isCorrect: false },
      { text: 'Сохранять спокойствие и позвать менеджера', isCorrect: true },
      { text: 'Убежать', isCorrect: false },
      { text: 'Снять на видео', isCorrect: false },
    ] },
    { text: 'Что такое «апсейл»?', cat: 'Сервис', opts: [
      { text: 'Предложение доп. товара или услуги', isCorrect: true },
      { text: 'Скидка', isCorrect: false },
      { text: 'Жалоба', isCorrect: false },
      { text: 'Возврат', isCorrect: false },
    ] },
    { text: 'Как правильно мыть посуду?', cat: 'Санитария', opts: [
      { text: 'Ополоснуть водой', isCorrect: false },
      { text: 'Мойка → ополаскивание → сушка', isCorrect: true },
      { text: 'Протереть тряпкой', isCorrect: false },
      { text: 'Замочить на час', isCorrect: false },
    ] },
    { text: 'Что делать, если закончился товар?', cat: 'Стандарты', opts: [
      { text: 'Сообщить менеджеру и внести в систему', isCorrect: true },
      { text: 'Сказать гостю «больше нет»', isCorrect: false },
      { text: 'Подождать до конца смены', isCorrect: false },
      { text: 'Ничего не делать', isCorrect: false },
    ] },
    { text: 'Что важно во внешнем виде сотрудника?', cat: 'Стандарты', opts: [
      { text: 'Чистая форма, причёска, бейдж', isCorrect: true },
      { text: 'Главное — удобно', isCorrect: false },
      { text: 'Можно в чём угодно', isCorrect: false },
      { text: 'Только для менеджеров', isCorrect: false },
    ] },
    { text: 'Что делать после окончания смены?', cat: 'Стандарты', opts: [
      { text: 'Уйти сразу', isCorrect: false },
      { text: 'Убрать рабочее место, сдать смену', isCorrect: true },
      { text: 'Оставить всё как есть', isCorrect: false },
      { text: 'Ждать, пока попросят', isCorrect: false },
    ] },
    { text: 'Кому подчиняется сотрудник на смене?', cat: 'Стандарты', opts: [
      { text: 'Менеджеру смены', isCorrect: true },
      { text: 'Самому себе', isCorrect: false },
      { text: 'Старшему гостю', isCorrect: false },
      { text: 'Никому', isCorrect: false },
    ] },
    { text: 'Что делать, если коллега нарушает правила?', cat: 'Культура', opts: [
      { text: 'Сообщить менеджеру', isCorrect: true },
      { text: 'Промолчать', isCorrect: false },
      { text: 'Сделать вид, что не заметил', isCorrect: false },
      { text: 'Начать ссору', isCorrect: false },
    ] },
    { text: 'Что такое «стандарт обслуживания»?', cat: 'Сервис', opts: [
      { text: 'Правила работы с гостем', isCorrect: true },
      { text: 'Просто бумажка', isCorrect: false },
      { text: 'Что-то для менеджеров', isCorrect: false },
      { text: 'Совет от коллеги', isCorrect: false },
    ] },
    { text: 'Сколько раз в день мыть полы в зале?', cat: 'Санитария', opts: [
      { text: 'По мере загрязнения и по графику', isCorrect: true },
      { text: 'Раз в неделю', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
      { text: 'Только утром', isCorrect: false },
    ] },
    { text: 'Что делать при обнаружении насекомых на кухне?', cat: 'Санитария', opts: [
      { text: 'Сообщить менеджеру и обработать зону', isCorrect: true },
      { text: 'Убить и забыть', isCorrect: false },
      { text: 'Спрятать', isCorrect: false },
      { text: 'Никому не говорить', isCorrect: false },
    ] },
    { text: 'Что делать с жалобой гостя?', cat: 'Сервис', opts: [
      { text: 'Выслушать, извиниться, решить, зафиксировать', isCorrect: true },
      { text: 'Сказать, что не наша проблема', isCorrect: false },
      { text: 'Перевести на другого', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
    ] },
    { text: 'Сколько можно хранить готовую еду без холодильника?', cat: 'Санитария', opts: [
      { text: 'Не более 2 часов', isCorrect: true },
      { text: 'Весь день', isCorrect: false },
      { text: 'Неограниченно', isCorrect: false },
      { text: '24 часа', isCorrect: false },
    ] },
    { text: 'Что такое «тайный гость»?', cat: 'Культура', opts: [
      { text: 'Проверяющий под видом обычного гостя', isCorrect: true },
      { text: 'VIP-гость', isCorrect: false },
      { text: 'Друг менеджера', isCorrect: false },
      { text: 'Курьер', isCorrect: false },
    ] },
    { text: 'Что делать, если гостю не хватило сдачи?', cat: 'Сервис', opts: [
      { text: 'Извиниться и предложить решение', isCorrect: true },
      { text: 'Сказать «нет и не будет»', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
      { text: 'Обвинить гостя', isCorrect: false },
    ] },
    { text: 'Что важнее всего в работе с командой?', cat: 'Культура', opts: [
      { text: 'Уважение и взаимопомощь', isCorrect: true },
      { text: 'Личная выгода', isCorrect: false },
      { text: 'Конкуренция', isCorrect: false },
      { text: 'Молчание', isCorrect: false },
    ] },
    { text: 'Как кашлять и чихать на работе?', cat: 'Санитария', opts: [
      { text: 'В локоть или салфетку', isCorrect: true },
      { text: 'В ладонь', isCorrect: false },
      { text: 'В сторону коллеги', isCorrect: false },
      { text: 'Никак', isCorrect: false },
    ] },
    { text: 'Что делать при первых признаках простуды?', cat: 'Санитария', opts: [
      { text: 'Сообщить менеджеру, надеть маску', isCorrect: true },
      { text: 'Скрыть и работать', isCorrect: false },
      { text: 'Уйти домой без предупреждения', isCorrect: false },
      { text: 'Пить чай на рабочем месте', isCorrect: false },
    ] },
    { text: 'Как вести себя при виде знакомого гостя?', cat: 'Сервис', opts: [
      { text: 'Поздороваться, но не фамильярничать', isCorrect: true },
      { text: 'Обнять', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Дать скидку без разрешения', isCorrect: false },
    ] },
    { text: 'Что такое «своевременность» в обслуживании?', cat: 'Сервис', opts: [
      { text: 'Делать всё вовремя и не заставлять ждать', isCorrect: true },
      { text: 'Приходить на работу вовремя', isCorrect: false },
      { text: 'Отвечать только когда спросят', isCorrect: false },
      { text: 'Работать быстро без качества', isCorrect: false },
    ] },
    { text: 'Что делать, если гость хочет оставить чаевые?', cat: 'Сервис', opts: [
      { text: 'Поблагодарить', isCorrect: true },
      { text: 'Отказаться', isCorrect: false },
      { text: 'Спрятать, чтобы не видел менеджер', isCorrect: false },
      { text: 'Потребовать больше', isCorrect: false },
    ] },
    { text: 'Как часто проверять сроки годности продуктов?', cat: 'Санитария', opts: [
      { text: 'Ежедневно', isCorrect: true },
      { text: 'Раз в неделю', isCorrect: false },
      { text: 'Раз в месяц', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
    ] },
    { text: 'Что делать, если гость уронил еду?', cat: 'Сервис', opts: [
      { text: 'Помочь убрать и предложить замену', isCorrect: true },
      { text: 'Сказать «сам виноват»', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
      { text: 'Позвать охрану', isCorrect: false },
    ] },
    { text: 'Что делать, если гость хочет говорить только с менеджером?', cat: 'Сервис', opts: [
      { text: 'Сразу позвать менеджера', isCorrect: true },
      { text: 'Сказать, что менеджер занят', isCorrect: false },
      { text: 'Уговорить говорить с вами', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
    ] },
    { text: 'Что делать при постороннем предмете в еде?', cat: 'Безопасность', opts: [
      { text: 'Убрать блюдо, извиниться, сообщить менеджеру', isCorrect: true },
      { text: 'Убрать предмет и подать снова', isCorrect: false },
      { text: 'Сказать, что так и должно быть', isCorrect: false },
      { text: 'Обвинить гостя', isCorrect: false },
    ] },
    { text: 'Как правильно передавать нож?', cat: 'Безопасность', opts: [
      { text: 'Рукояткой вперёд', isCorrect: true },
      { text: 'Лезвием вперёд', isCorrect: false },
      { text: 'Как получится', isCorrect: false },
      { text: 'Бросить', isCorrect: false },
    ] },
    { text: 'Сколько хранить открытое молоко?', cat: 'Санитария', opts: [
      { text: 'Не более 3 суток', isCorrect: true },
      { text: 'Неделю', isCorrect: false },
      { text: 'Месяц', isCorrect: false },
      { text: 'До скисания', isCorrect: false },
    ] },
    { text: 'Что делать, если не успеваешь выполнить задачу?', cat: 'Культура', opts: [
      { text: 'Сообщить менеджеру заранее', isCorrect: true },
      { text: 'Молчать до последнего', isCorrect: false },
      { text: 'Свалить на коллегу', isCorrect: false },
      { text: 'Уйти домой', isCorrect: false },
    ] },
    { text: 'Что делать, если гость спрашивает о составе блюда?', cat: 'Сервис', opts: [
      { text: 'Точно ответить или уточнить у повара', isCorrect: true },
      { text: 'Придумать', isCorrect: false },
      { text: 'Сказать «не знаю»', isCorrect: false },
      { text: 'Сменить тему', isCorrect: false },
    ] },
    { text: 'Что значит «чистая смена»?', cat: 'Стандарты', opts: [
      { text: 'Рабочее место в порядке, смена сдана', isCorrect: true },
      { text: 'Пришёл в чистой одежде', isCorrect: false },
      { text: 'Помыл руки', isCorrect: false },
      { text: 'Ничего не делал', isCorrect: false },
    ] },
    { text: 'Что делать с плохим отзывом?', cat: 'Сервис', opts: [
      { text: 'Сообщить менеджеру и разобрать', isCorrect: true },
      { text: 'Написать ответ в соцсетях', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
      { text: 'Удалить отзыв', isCorrect: false },
    ] },
    { text: 'Как правильно вытирать стол?', cat: 'Санитария', opts: [
      { text: 'Чистой салфеткой с дезраствором', isCorrect: true },
      { text: 'Тряпкой, что была', isCorrect: false },
      { text: 'Рукой', isCorrect: false },
      { text: 'Никак', isCorrect: false },
    ] },
    { text: 'Что делать при поломке оборудования?', cat: 'Безопасность', opts: [
      { text: 'Отключить, сообщить менеджеру', isCorrect: true },
      { text: 'Починить самому', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Продолжать работать', isCorrect: false },
    ] },
    { text: 'Что такое «командный дух»?', cat: 'Культура', opts: [
      { text: 'Готовность помочь и работать вместе', isCorrect: true },
      { text: 'Каждый сам за себя', isCorrect: false },
      { text: 'Соревнование', isCorrect: false },
      { text: 'Молчание', isCorrect: false },
    ] },
    { text: 'Что делать, если гость хочет изменить заказ?', cat: 'Сервис', opts: [
      { text: 'Уточнить у менеджера и постараться помочь', isCorrect: true },
      { text: 'Отказать', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
      { text: 'Сказать «поздно»', isCorrect: false },
    ] },
    { text: 'Как часто дезинфицировать разделочные доски?', cat: 'Санитария', opts: [
      { text: 'После каждой смены типа продукта', isCorrect: true },
      { text: 'Раз в неделю', isCorrect: false },
      { text: 'Раз в месяц', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
    ] },
    { text: 'Что делать при утечке газа?', cat: 'Безопасность', opts: [
      { text: 'Не включать свет, открыть окна, сообщить', isCorrect: true },
      { text: 'Зажечь спичку для проверки', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Продолжать работу', isCorrect: false },
    ] },
    { text: 'Что делать, если гость оскорбляет сотрудника?', cat: 'Безопасность', opts: [
      { text: 'Сохранять спокойствие, позвать менеджера', isCorrect: true },
      { text: 'Ответить тем же', isCorrect: false },
      { text: 'Уйти', isCorrect: false },
      { text: 'Заплакать', isCorrect: false },
    ] },
    { text: 'Что такое «стоп-лист»?', cat: 'Стандарты', opts: [
      { text: 'Список блюд, которых нет в наличии', isCorrect: true },
      { text: 'Список уволенных', isCorrect: false },
      { text: 'Список гостей', isCorrect: false },
      { text: 'Список поставщиков', isCorrect: false },
    ] },
    { text: 'Что делать, если ты опоздал на смену?', cat: 'Культура', opts: [
      { text: 'Заранее предупредить менеджера', isCorrect: true },
      { text: 'Молчать', isCorrect: false },
      { text: 'Сказать, что пробки', isCorrect: false },
      { text: 'Не прийти вообще', isCorrect: false },
    ] },
    { text: 'Как правильно хранить ножи?', cat: 'Безопасность', opts: [
      { text: 'В специальном держателе или чехле', isCorrect: true },
      { text: 'В ящике со всем', isCorrect: false },
      { text: 'На столе', isCorrect: false },
      { text: 'В кармане', isCorrect: false },
    ] },
    { text: 'Что делать, если гость не может оплатить заказ?', cat: 'Сервис', opts: [
      { text: 'Вежливо предложить способы, позвать менеджера', isCorrect: true },
      { text: 'Кричать', isCorrect: false },
      { text: 'Отобрать телефон', isCorrect: false },
      { text: 'Простить долг', isCorrect: false },
    ] },
    { text: 'Что делать, если ребёнок без присмотра?', cat: 'Безопасность', opts: [
      { text: 'Сообщить менеджеру, не оставлять без внимания', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Сделать замечание родителям при всех', isCorrect: false },
      { text: 'Увести ребёнка', isCorrect: false },
    ] },
    { text: 'Что делать, если гость с ограниченными возможностями?', cat: 'Сервис', opts: [
      { text: 'Помочь, но не навязываться', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Говорить громче', isCorrect: false },
      { text: 'Усадить отдельно', isCorrect: false },
    ] },
    { text: 'Что делать, если гость фотографирует еду?', cat: 'Сервис', opts: [
      { text: 'Не мешать, предложить помочь', isCorrect: true },
      { text: 'Запретить', isCorrect: false },
      { text: 'Сфотографировать в ответ', isCorrect: false },
      { text: 'Попросить удалить', isCorrect: false },
    ] },
    { text: 'Что делать, если увидел нарушение у коллеги?', cat: 'Культура', opts: [
      { text: 'Сообщить менеджеру', isCorrect: true },
      { text: 'Сделать замечание при гостях', isCorrect: false },
      { text: 'Промолчать', isCorrect: false },
      { text: 'Написать в соцсетях', isCorrect: false },
    ] },
    { text: 'Что важнее: скорость или качество?', cat: 'Стандарты', opts: [
      { text: 'Качество, но без лишних задержек', isCorrect: true },
      { text: 'Только скорость', isCorrect: false },
      { text: 'Только качество', isCorrect: false },
      { text: 'Ни то, ни другое', isCorrect: false },
    ] },
    { text: 'Что делать, если гость не может найти столик?', cat: 'Сервис', opts: [
      { text: 'Проводить', isCorrect: true },
      { text: 'Показать рукой', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Сказать «ищите сами»', isCorrect: false },
    ] },
    { text: 'Что такое «сервис-чарт»?', cat: 'Стандарты', opts: [
      { text: 'Схема рассадки', isCorrect: true },
      { text: 'Меню', isCorrect: false },
      { text: 'План эвакуации', isCorrect: false },
      { text: 'График смен', isCorrect: false },
    ] },
    { text: 'Что делать, если гость хочет в туалет?', cat: 'Сервис', opts: [
      { text: 'Показать направление', isCorrect: true },
      { text: 'Сказать «нет»', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Отправить к менеджеру', isCorrect: false },
    ] },
    { text: 'Как реагировать на критику от менеджера?', cat: 'Культура', opts: [
      { text: 'Выслушать, спросить как исправить', isCorrect: true },
      { text: 'Спорить', isCorrect: false },
      { text: 'Уйти', isCorrect: false },
      { text: 'Заплакать', isCorrect: false },
    ] },
    { text: 'Что делать, если гость сильно пьян?', cat: 'Безопасность', opts: [
      { text: 'Не подавать алкоголь, сообщить менеджеру', isCorrect: true },
      { text: 'Налить ещё', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Выгнать', isCorrect: false },
    ] },
    { text: 'Что делать, если в зале драка?', cat: 'Безопасность', opts: [
      { text: 'Не вмешиваться, позвать менеджера и охрану', isCorrect: true },
      { text: 'Снимать', isCorrect: false },
      { text: 'Разнимать самому', isCorrect: false },
      { text: 'Убежать', isCorrect: false },
    ] },
    { text: 'Что делать при запахе гари?', cat: 'Безопасность', opts: [
      { text: 'Найти источник, сообщить менеджеру', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Открыть окно', isCorrect: false },
      { text: 'Продолжать работу', isCorrect: false },
    ] },
    { text: 'Что такое «открытие смены»?', cat: 'Стандарты', opts: [
      { text: 'Подготовка зала и кухни к работе', isCorrect: true },
      { text: 'Закрытие', isCorrect: false },
      { text: 'Перерыв', isCorrect: false },
      { text: 'Уборка', isCorrect: false },
    ] },
    { text: 'Что делать, если гость хочет забрать еду с собой?', cat: 'Сервис', opts: [
      { text: 'Упаковать аккуратно', isCorrect: true },
      { text: 'Отказать', isCorrect: false },
      { text: 'Дать в руках', isCorrect: false },
      { text: 'Сказать «нельзя»', isCorrect: false },
    ] },
    { text: 'Что делать при жалобе на качество еды?', cat: 'Сервис', opts: [
      { text: 'Извиниться, заменить, сообщить менеджеру', isCorrect: true },
      { text: 'Сказать «так и должно быть»', isCorrect: false },
      { text: 'Спорить', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
    ] },
    { text: 'Что такое «доп. продажа»?', cat: 'Сервис', opts: [
      { text: 'Предложение к основному заказу', isCorrect: true },
      { text: 'Скидка', isCorrect: false },
      { text: 'Возврат', isCorrect: false },
      { text: 'Жалоба', isCorrect: false },
    ] },
    { text: 'Что делать при большой очереди?', cat: 'Сервис', opts: [
      { text: 'Сообщить менеджеру, извиниться перед гостями', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Уйти', isCorrect: false },
      { text: 'Ускориться без качества', isCorrect: false },
    ] },
    { text: 'Что делать, если гость ругается матом?', cat: 'Безопасность', opts: [
      { text: 'Сохранять спокойствие, позвать менеджера', isCorrect: true },
      { text: 'Ответить матом', isCorrect: false },
      { text: 'Заплакать', isCorrect: false },
      { text: 'Убежать', isCorrect: false },
    ] },
    { text: 'Что важно помнить про улыбку?', cat: 'Сервис', opts: [
      { text: 'Улыбка — часть стандарта', isCorrect: true },
      { text: 'Необязательно', isCorrect: false },
      { text: 'Только для знакомых', isCorrect: false },
      { text: 'Только для VIP', isCorrect: false },
    ] },
    { text: 'Что делать в конце смены?', cat: 'Стандарты', opts: [
      { text: 'Убрать рабочее место, сдать смену', isCorrect: true },
      { text: 'Уйти сразу', isCorrect: false },
      { text: 'Оставить как есть', isCorrect: false },
      { text: 'Ждать, пока попросят', isCorrect: false },
    ] },
    { text: 'Как относиться к новичкам?', cat: 'Культура', opts: [
      { text: 'Помогать и объяснять', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Подшучивать', isCorrect: false },
      { text: 'Не разговаривать', isCorrect: false },
    ] },
    { text: 'Что делать, если гость оставил много еды?', cat: 'Сервис', opts: [
      { text: 'Уточнить, всё ли понравилось', isCorrect: true },
      { text: 'Молча убрать', isCorrect: false },
      { text: 'Сделать замечание', isCorrect: false },
      { text: 'Списать в утиль', isCorrect: false },
    ] },
    { text: 'Что значит «работа в команде»?', cat: 'Культура', opts: [
      { text: 'Помогать друг другу', isCorrect: true },
      { text: 'Каждый сам за себя', isCorrect: false },
      { text: 'Соревноваться', isCorrect: false },
      { text: 'Молчать', isCorrect: false },
    ] },
    { text: 'Как правильно мыть руки?', cat: 'Санитария', opts: [
      { text: 'С мылом, 20–30 секунд', isCorrect: true },
      { text: 'Ополоснуть', isCorrect: false },
      { text: 'Протереть', isCorrect: false },
      { text: 'Никак', isCorrect: false },
    ] },
    { text: 'Что делать при обнаружении крысы?', cat: 'Санитария', opts: [
      { text: 'Сообщить менеджеру и вызвать СЭС', isCorrect: true },
      { text: 'Убить и забыть', isCorrect: false },
      { text: 'Спрятать', isCorrect: false },
      { text: 'Промолчать', isCorrect: false },
    ] },
    { text: 'Что делать, если гость уходит без оплаты?', cat: 'Безопасность', opts: [
      { text: 'Сообщить менеджеру', isCorrect: true },
      { text: 'Догнать и задержать', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
      { text: 'Крикнуть', isCorrect: false },
    ] },
    { text: 'Что делать, если закончился лёд?', cat: 'Бармен', opts: [
      { text: 'Сообщить менеджеру', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Использовать воду', isCorrect: false },
      { text: 'Отказать гостю', isCorrect: false },
    ] },
  ];

  for (const q of general) {
    await addQuestion(q.text, 'general', q.cat, q.opts);
  }

  // ═══════════════ ОФИЦИАНТ (15) ═══════════════
  const waiter = [
    { text: 'С чего начинается обслуживание за столом?', cat: 'Официант', opts: [
      { text: 'С подачи меню и приветствия', isCorrect: true },
      { text: 'Сразу с приёма заказа', isCorrect: false },
      { text: 'С уборки стола', isCorrect: false },
      { text: 'С вопроса о напитках', isCorrect: false },
    ] },
    { text: 'Как правильно нести поднос?', cat: 'Официант', opts: [
      { text: 'На ладони левой руки, на уровне плеча', isCorrect: true },
      { text: 'Двумя руками перед собой', isCorrect: false },
      { text: 'Под мышкой', isCorrect: false },
      { text: 'На голове', isCorrect: false },
    ] },
    { text: 'Когда убирать грязную посуду со стола?', cat: 'Официант', opts: [
      { text: 'Сразу после того, как гость закончил', isCorrect: true },
      { text: 'В конце смены', isCorrect: false },
      { text: 'Когда попросят', isCorrect: false },
      { text: 'Через час', isCorrect: false },
    ] },
    { text: 'Что делать, если блюда нет в наличии?', cat: 'Официант', opts: [
      { text: 'Предложить альтернативу', isCorrect: true },
      { text: 'Сказать «нет» и уйти', isCorrect: false },
      { text: 'Принести что-то другое молча', isCorrect: false },
      { text: 'Сделать вид, что не слышал', isCorrect: false },
    ] },
    { text: 'Как правильно принимать заказ?', cat: 'Официант', opts: [
      { text: 'Записать, повторить гостю, уточнить', isCorrect: true },
      { text: 'Запомнить на слух', isCorrect: false },
      { text: 'Кивнуть и уйти', isCorrect: false },
      { text: 'Попросить повторить дважды', isCorrect: false },
    ] },
    { text: 'Как правильно подавать счёт?', cat: 'Официант', opts: [
      { text: 'В папке или на подносе, не в руках', isCorrect: true },
      { text: 'Назвать сумму вслух', isCorrect: false },
      { text: 'Бросить на стол', isCorrect: false },
      { text: 'Отправить по СМС', isCorrect: false },
    ] },
    { text: 'Как часто проверять стол гостя?', cat: 'Официант', opts: [
      { text: 'Каждые 10–15 минут', isCorrect: true },
      { text: 'Раз в час', isCorrect: false },
      { text: 'Только когда позовут', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
    ] },
    { text: 'Что делать, если гость торопится?', cat: 'Официант', opts: [
      { text: 'Уточнить время и предложить быстрое блюдо', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Сказать, что не успеем', isCorrect: false },
      { text: 'Ускорить без качества', isCorrect: false },
    ] },
    { text: 'Как правильно ставить блюдо гостю?', cat: 'Официант', opts: [
      { text: 'Справа, аккуратно', isCorrect: true },
      { text: 'Слева', isCorrect: false },
      { text: 'Как получится', isCorrect: false },
      { text: 'Через стол', isCorrect: false },
    ] },
    { text: 'Что делать, если гость просит заменить приборы?', cat: 'Официант', opts: [
      { text: 'Принести чистые с улыбкой', isCorrect: true },
      { text: 'Сказать «они чистые»', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Позвать менеджера', isCorrect: false },
    ] },
    { text: 'Как правильно накрывать на стол?', cat: 'Официант', opts: [
      { text: 'Приборы слева и справа от тарелки', isCorrect: true },
      { text: 'Всё в кучу', isCorrect: false },
      { text: 'Только вилку', isCorrect: false },
      { text: 'Только ложку', isCorrect: false },
    ] },
    { text: 'Как реагировать на жалобу гостя на блюдо?', cat: 'Официант', opts: [
      { text: 'Извиниться, предложить замену, позвать менеджера', isCorrect: true },
      { text: 'Спорить', isCorrect: false },
      { text: 'Проигнорировать', isCorrect: false },
      { text: 'Сказать «так и должно быть»', isCorrect: false },
    ] },
    { text: 'Как убирать стол после ухода гостя?', cat: 'Официант', opts: [
      { text: 'Собрать посуду, протереть', isCorrect: true },
      { text: 'Оставить', isCorrect: false },
      { text: 'Ждать уборщицу', isCorrect: false },
      { text: 'Позвать менеджера', isCorrect: false },
    ] },
    { text: 'Как подавать напитки?', cat: 'Официант', opts: [
      { text: 'Справа, за основание стакана', isCorrect: true },
      { text: 'За верх', isCorrect: false },
      { text: 'Слева', isCorrect: false },
      { text: 'На подносе, но без предупреждения', isCorrect: false },
    ] },
    { text: 'Что делать, если гость не может решить, что заказать?', cat: 'Официант', opts: [
      { text: 'Предложить популярные блюда', isCorrect: true },
      { text: 'Уйти и вернуться позже', isCorrect: false },
      { text: 'Настаивать на своём', isCorrect: false },
      { text: 'Принести меню ещё раз', isCorrect: false },
    ] },
  ];
  for (const q of waiter) await addQuestion(q.text, 'официант', q.cat, q.opts);

  // ═══════════════ ПОВАР (15) ═══════════════
  const cook = [
    { text: 'Какая температура в холодильной камере?', cat: 'Повар', opts: [
      { text: '+2…+4 °C', isCorrect: true },
      { text: '+10 °C', isCorrect: false },
      { text: '0 °C', isCorrect: false },
      { text: '−5 °C', isCorrect: false },
    ] },
    { text: 'Что делать при порезе на кухне?', cat: 'Повар', opts: [
      { text: 'Обработать, заклеить, надеть перчатку', isCorrect: true },
      { text: 'Продолжить работу', isCorrect: false },
      { text: 'Замотать тряпкой', isCorrect: false },
      { text: 'Уйти домой', isCorrect: false },
    ] },
    { text: 'Как правильно размораживать мясо?', cat: 'Повар', opts: [
      { text: 'В холодильнике, медленно', isCorrect: true },
      { text: 'В горячей воде', isCorrect: false },
      { text: 'На столе всю ночь', isCorrect: false },
      { text: 'В микроволновке', isCorrect: false },
    ] },
    { text: 'Что такое «товарное соседство»?', cat: 'Повар', opts: [
      { text: 'Сырое и готовое хранятся отдельно', isCorrect: true },
      { text: 'Все продукты вместе', isCorrect: false },
      { text: 'Сортировка по цвету', isCorrect: false },
      { text: 'Сортировка по размеру', isCorrect: false },
    ] },
    { text: 'Через сколько выбрасывать еду с раздачи?', cat: 'Повар', opts: [
      { text: 'Не более 2–3 часов', isCorrect: true },
      { text: 'Через 12 часов', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
      { text: 'Через сутки', isCorrect: false },
    ] },
    { text: 'Как правильно мыть овощи и фрукты?', cat: 'Повар', opts: [
      { text: 'Под проточной водой', isCorrect: true },
      { text: 'Протереть', isCorrect: false },
      { text: 'Не мыть', isCorrect: false },
      { text: 'Облизнуть', isCorrect: false },
    ] },
    { text: 'Как хранить яйца?', cat: 'Повар', opts: [
      { text: 'В холодильнике, отдельно от других', isCorrect: true },
      { text: 'На столе', isCorrect: false },
      { text: 'Рядом с мясом', isCorrect: false },
      { text: 'В морозилке', isCorrect: false },
    ] },
    { text: 'Что делать с испорченным продуктом?', cat: 'Повар', opts: [
      { text: 'Выбросить, сообщить менеджеру', isCorrect: true },
      { text: 'Использовать', isCorrect: false },
      { text: 'Добавить специи', isCorrect: false },
      { text: 'Отдать коллеге', isCorrect: false },
    ] },
    { text: 'Как правильно держать нож?', cat: 'Повар', opts: [
      { text: 'Уверенно, указательный на обухе', isCorrect: true },
      { text: 'За лезвие', isCorrect: false },
      { text: 'Как получится', isCorrect: false },
      { text: 'Двумя руками', isCorrect: false },
    ] },
    { text: 'Что такое «прожарка»?', cat: 'Повар', opts: [
      { text: 'Степень готовности мяса', isCorrect: true },
      { text: 'Тип масла', isCorrect: false },
      { text: 'Способ нарезки', isCorrect: false },
      { text: 'Вид специи', isCorrect: false },
    ] },
    { text: 'Что делать, если еда подгорела?', cat: 'Повар', opts: [
      { text: 'Выбросить и приготовить заново', isCorrect: true },
      { text: 'Подать', isCorrect: false },
      { text: 'Спрятать', isCorrect: false },
      { text: 'Срезать подгоревшее', isCorrect: false },
    ] },
    { text: 'Как проверять готовность мяса?', cat: 'Повар', opts: [
      { text: 'Термометром', isCorrect: true },
      { text: 'На глаз', isCorrect: false },
      { text: 'На вкус сырым', isCorrect: false },
      { text: 'По запаху', isCorrect: false },
    ] },
    { text: 'Как хранить специи?', cat: 'Повар', opts: [
      { text: 'В закрытой таре, в тёмном месте', isCorrect: true },
      { text: 'Открытыми', isCorrect: false },
      { text: 'В холодильнике', isCorrect: false },
      { text: 'В морозилке', isCorrect: false },
    ] },
    { text: 'Что делать с остатками еды?', cat: 'Повар', opts: [
      { text: 'Утилизировать', isCorrect: true },
      { text: 'Оставить на завтра', isCorrect: false },
      { text: 'Отдать гостям', isCorrect: false },
      { text: 'Съесть самому', isCorrect: false },
    ] },
    { text: 'Как правильно нарезать хлеб?', cat: 'Повар', opts: [
      { text: 'Ровными ломтями, острым ножом', isCorrect: true },
      { text: 'Как получится', isCorrect: false },
      { text: 'Руками', isCorrect: false },
      { text: 'Заранее', isCorrect: false },
    ] },
  ];
  for (const q of cook) await addQuestion(q.text, 'повар', q.cat, q.opts);

  // ═══════════════ БАРМЕН (15) ═══════════════
  const bartender = [
    { text: 'Что проверить перед началом смены?', cat: 'Бармен', opts: [
      { text: 'Лёд, ингредиенты, чистоту оборудования', isCorrect: true },
      { text: 'Только лёд', isCorrect: false },
      { text: 'Ничего', isCorrect: false },
      { text: 'Только кассу', isCorrect: false },
    ] },
    { text: 'Как правильно подавать напитки?', cat: 'Бармен', opts: [
      { text: 'Аккуратно, со стороны гостя, с улыбкой', isCorrect: true },
      { text: 'Через барную стойку', isCorrect: false },
      { text: 'Молча поставить', isCorrect: false },
      { text: 'Бросить', isCorrect: false },
    ] },
    { text: 'Что делать с сильно пьяным гостем?', cat: 'Бармен', opts: [
      { text: 'Не подавать алкоголь, позвать менеджера', isCorrect: true },
      { text: 'Налить ещё', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Выгнать', isCorrect: false },
    ] },
    { text: 'Как хранить открытые бутылки?', cat: 'Бармен', opts: [
      { text: 'Закрытыми, в холодильнике, с датой', isCorrect: true },
      { text: 'Как попало', isCorrect: false },
      { text: 'Открытыми на баре', isCorrect: false },
      { text: 'В морозилке', isCorrect: false },
    ] },
    { text: 'Что такое «фрифлоу»?', cat: 'Бармен', opts: [
      { text: 'Бесплатная подача напитков', isCorrect: true },
      { text: 'Быстрая подача', isCorrect: false },
      { text: 'Скидка', isCorrect: false },
      { text: 'Возврат', isCorrect: false },
    ] },
    { text: 'Как проверять возраст гостя?', cat: 'Бармен', opts: [
      { text: 'Попросить документ', isCorrect: true },
      { text: 'На глаз', isCorrect: false },
      { text: 'Не проверять', isCorrect: false },
      { text: 'Спросить возраст', isCorrect: false },
    ] },
    { text: 'Как использовать мерный стакан?', cat: 'Бармен', opts: [
      { text: 'Для точной дозировки', isCorrect: true },
      { text: 'Не нужен', isCorrect: false },
      { text: 'Для украшения', isCorrect: false },
      { text: 'Для смешивания', isCorrect: false },
    ] },
    { text: 'Как мыть шейкер?', cat: 'Бармен', opts: [
      { text: 'После каждого напитка', isCorrect: true },
      { text: 'Раз в день', isCorrect: false },
      { text: 'Раз в неделю', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
    ] },
    { text: 'Что делать, если закончился лёд?', cat: 'Бармен', opts: [
      { text: 'Сообщить менеджеру', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Использовать воду', isCorrect: false },
      { text: 'Отказать гостю', isCorrect: false },
    ] },
    { text: 'Как украшать коктейли?', cat: 'Бармен', opts: [
      { text: 'Съедобными элементами', isCorrect: true },
      { text: 'Чем угодно', isCorrect: false },
      { text: 'Бумагой', isCorrect: false },
      { text: 'Пластиком', isCorrect: false },
    ] },
    { text: 'Как хранить лёд?', cat: 'Бармен', opts: [
      { text: 'В чистом контейнере, отдельно от еды', isCorrect: true },
      { text: 'В раковине', isCorrect: false },
      { text: 'На столе', isCorrect: false },
      { text: 'В морозилке с мясом', isCorrect: false },
    ] },
    { text: 'Что делать, если гость просит коктейль вне меню?', cat: 'Бармен', opts: [
      { text: 'Предложить альтернативу', isCorrect: true },
      { text: 'Отказать', isCorrect: false },
      { text: 'Сделать из чего попало', isCorrect: false },
      { text: 'Позвать менеджера', isCorrect: false },
    ] },
    { text: 'Как правильно наливать пиво?', cat: 'Бармен', opts: [
      { text: 'По стенке стакана, с пеной', isCorrect: true },
      { text: 'Как получится', isCorrect: false },
      { text: 'Без пены', isCorrect: false },
      { text: 'Быстро', isCorrect: false },
    ] },
    { text: 'Что делать с разбитым стеклом?', cat: 'Бармен', opts: [
      { text: 'Убрать, выбросить в спецконтейнер', isCorrect: true },
      { text: 'Оставить', isCorrect: false },
      { text: 'Смести в раковину', isCorrect: false },
      { text: 'Убрать руками', isCorrect: false },
    ] },
    { text: 'Как общаться с гостем за баром?', cat: 'Бармен', opts: [
      { text: 'Вежливо, ненавязчиво', isCorrect: true },
      { text: 'Грубо', isCorrect: false },
      { text: 'Молча', isCorrect: false },
      { text: 'Только по делу', isCorrect: false },
    ] },
  ];
  for (const q of bartender) await addQuestion(q.text, 'бармен', q.cat, q.opts);

  // ═══════════════ ХОСТЕС (15) ═══════════════
  const hostess = [
    { text: 'Что делает хостес при входе гостя?', cat: 'Хостес', opts: [
      { text: 'Приветствует и провожает за стол', isCorrect: true },
      { text: 'Сразу принимает заказ', isCorrect: false },
      { text: 'Ждёт, пока гость сам подойдёт', isCorrect: false },
      { text: 'Молча кивает', isCorrect: false },
    ] },
    { text: 'Как рассаживать гостей?', cat: 'Хостес', opts: [
      { text: 'С учётом зон и пожеланий', isCorrect: true },
      { text: 'Как получится', isCorrect: false },
      { text: 'Только у окна', isCorrect: false },
      { text: 'Только в углу', isCorrect: false },
    ] },
    { text: 'Что делать, если нет свободных столов?', cat: 'Хостес', opts: [
      { text: 'Предложить подождать, записать в лист', isCorrect: true },
      { text: 'Сказать «мест нет» и уйти', isCorrect: false },
      { text: 'Посадить к другим гостям', isCorrect: false },
      { text: 'Отправить в другое кафе', isCorrect: false },
    ] },
    { text: 'Как отвечать на звонки по брони?', cat: 'Хостес', opts: [
      { text: 'Вежливо, уточнить все детали', isCorrect: true },
      { text: 'Коротко да/нет', isCorrect: false },
      { text: 'Не отвечать', isCorrect: false },
      { text: 'Сказать «перезвоните»', isCorrect: false },
    ] },
    { text: 'Что делать при жалобе в зоне хостес?', cat: 'Хостес', opts: [
      { text: 'Выслушать и позвать менеджера', isCorrect: true },
      { text: 'Спорить', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Уйти', isCorrect: false },
    ] },
    { text: 'Как приветствовать по телефону?', cat: 'Хостес', opts: [
      { text: '«Здравствуйте, [название]!»', isCorrect: true },
      { text: '«Алло»', isCorrect: false },
      { text: '«Да»', isCorrect: false },
      { text: '«Слушаю»', isCorrect: false },
    ] },
    { text: 'Что делать, если гость с ребёнком?', cat: 'Хостес', opts: [
      { text: 'Предложить детский стул и меню', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Отказать', isCorrect: false },
      { text: 'Посадить отдельно', isCorrect: false },
    ] },
    { text: 'Как распределять гостей по зонам?', cat: 'Хостес', opts: [
      { text: 'Равномерно, по загрузке официантов', isCorrect: true },
      { text: 'Всё в одну зону', isCorrect: false },
      { text: 'Как получится', isCorrect: false },
      { text: 'По внешности', isCorrect: false },
    ] },
    { text: 'Что делать, если гость опоздал на бронь?', cat: 'Хостес', opts: [
      { text: 'Держать стол 15 минут', isCorrect: true },
      { text: 'Отдать сразу', isCorrect: false },
      { text: 'Отменить', isCorrect: false },
      { text: 'Оставить на весь вечер', isCorrect: false },
    ] },
    { text: 'Как провожать гостя к столу?', cat: 'Хостес', opts: [
      { text: 'Идти впереди, показывать рукой', isCorrect: true },
      { text: 'Идти сзади', isCorrect: false },
      { text: 'Не провожать', isCorrect: false },
      { text: 'Отправить по карте', isCorrect: false },
    ] },
    { text: 'Что делать с VIP-гостями?', cat: 'Хостес', opts: [
      { text: 'Особое внимание, лучший стол', isCorrect: true },
      { text: 'Как обычно', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Посадить в углу', isCorrect: false },
    ] },
    { text: 'Как вести журнал брони?', cat: 'Хостес', opts: [
      { text: 'Записывать всех, точно', isCorrect: true },
      { text: 'На память', isCorrect: false },
      { text: 'Не вести', isCorrect: false },
      { text: 'Только VIP', isCorrect: false },
    ] },
    { text: 'Что делать при большом потоке гостей?', cat: 'Хостес', opts: [
      { text: 'Сообщить менеджеру, извиниться, вести лист', isCorrect: true },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Уйти', isCorrect: false },
      { text: 'Говорить быстрее', isCorrect: false },
    ] },
    { text: 'Как прощаться с гостем?', cat: 'Хостес', opts: [
      { text: '«Спасибо, приходите снова!»', isCorrect: true },
      { text: 'Молча', isCorrect: false },
      { text: '«Пока»', isCorrect: false },
      { text: 'Кивнуть', isCorrect: false },
    ] },
    { text: 'Что делать, если гость недоволен местом?', cat: 'Хостес', opts: [
      { text: 'Предложить другой стол', isCorrect: true },
      { text: 'Спорить', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Отправить к менеджеру', isCorrect: false },
    ] },
  ];
  for (const q of hostess) await addQuestion(q.text, 'хостес', q.cat, q.opts);

  // ═══════════════ КУРЬЕР (15) ═══════════════
  const courier = [
    { text: 'Что проверить перед выездом?', cat: 'Курьер', opts: [
      { text: 'Адрес, состав заказа, терминал и сумку', isCorrect: true },
      { text: 'Только адрес', isCorrect: false },
      { text: 'Ничего', isCorrect: false },
      { text: 'Только телефон', isCorrect: false },
    ] },
    { text: 'Как правильно перевозить пиццу?', cat: 'Курьер', opts: [
      { text: 'В термосумке, горизонтально', isCorrect: true },
      { text: 'Как угодно', isCorrect: false },
      { text: 'В руках', isCorrect: false },
      { text: 'Вертикально', isCorrect: false },
    ] },
    { text: 'Что делать, если гость не открывает дверь?', cat: 'Курьер', opts: [
      { text: 'Позвонить по телефону, потом менеджеру', isCorrect: true },
      { text: 'Уехать', isCorrect: false },
      { text: 'Оставить под дверью', isCorrect: false },
      { text: 'Стучать сильнее', isCorrect: false },
    ] },
    { text: 'Как вести себя при доставке?', cat: 'Курьер', opts: [
      { text: 'Вежливо, с улыбкой', isCorrect: true },
      { text: 'Молча', isCorrect: false },
      { text: 'Грубо', isCorrect: false },
      { text: 'Быстро', isCorrect: false },
    ] },
    { text: 'Что делать при поломке транспорта?', cat: 'Курьер', opts: [
      { text: 'Сообщить менеджеру и решить', isCorrect: true },
      { text: 'Бросить заказ', isCorrect: false },
      { text: 'Ничего', isCorrect: false },
      { text: 'Вернуться', isCorrect: false },
    ] },
    { text: 'Как проверять адрес?', cat: 'Курьер', opts: [
      { text: 'Сверить с приложением', isCorrect: true },
      { text: 'По памяти', isCorrect: false },
      { text: 'Спросить у прохожих', isCorrect: false },
      { text: 'Наугад', isCorrect: false },
    ] },
    { text: 'Что делать, если опоздал?', cat: 'Курьер', opts: [
      { text: 'Предупредить менеджера и гостя', isCorrect: true },
      { text: 'Молчать', isCorrect: false },
      { text: 'Не приехать', isCorrect: false },
      { text: 'Сказать, что пробки', isCorrect: false },
    ] },
    { text: 'Как передавать заказ?', cat: 'Курьер', opts: [
      { text: 'Лично в руки, улыбнуться', isCorrect: true },
      { text: 'Оставить под дверью', isCorrect: false },
      { text: 'Отдать соседу', isCorrect: false },
      { text: 'Бросить у подъезда', isCorrect: false },
    ] },
    { text: 'Что делать с деньгами?', cat: 'Курьер', opts: [
      { text: 'Вести учёт, сдавать смену', isCorrect: true },
      { text: 'Оставить себе', isCorrect: false },
      { text: 'Потерять', isCorrect: false },
      { text: 'Отдать коллеге', isCorrect: false },
    ] },
    { text: 'Как ездить на транспорте?', cat: 'Курьер', opts: [
      { text: 'Соблюдать ПДД', isCorrect: true },
      { text: 'Как хочется', isCorrect: false },
      { text: 'Быстро, без правил', isCorrect: false },
      { text: 'По тротуару', isCorrect: false },
    ] },
    { text: 'Что делать при ДТП?', cat: 'Курьер', opts: [
      { text: 'Сообщить менеджеру, вызвать ГИБДД', isCorrect: true },
      { text: 'Уехать', isCorrect: false },
      { text: 'Молчать', isCorrect: false },
      { text: 'Решить на месте', isCorrect: false },
    ] },
    { text: 'Как относиться к заказу?', cat: 'Курьер', opts: [
      { text: 'Бережно, как к своему', isCorrect: true },
      { text: 'Как получится', isCorrect: false },
      { text: 'Не важно', isCorrect: false },
      { text: 'Быстро и всё', isCorrect: false },
    ] },
    { text: 'Что делать, если гость недоволен?', cat: 'Курьер', opts: [
      { text: 'Извиниться, сообщить менеджеру', isCorrect: true },
      { text: 'Спорить', isCorrect: false },
      { text: 'Уехать', isCorrect: false },
      { text: 'Молчать', isCorrect: false },
    ] },
    { text: 'Как прощаться с гостем?', cat: 'Курьер', opts: [
      { text: 'Приятного аппетита, до свидания!', isCorrect: true },
      { text: 'Молча', isCorrect: false },
      { text: '«Пока»', isCorrect: false },
      { text: 'Кивнуть', isCorrect: false },
    ] },
    { text: 'Что делать, если потерял заказ?', cat: 'Курьер', opts: [
      { text: 'Сообщить менеджеру', isCorrect: true },
      { text: 'Скрыть', isCorrect: false },
      { text: 'Купить новый', isCorrect: false },
      { text: 'Вернуться в кафе', isCorrect: false },
    ] },
  ];
  for (const q of courier) await addQuestion(q.text, 'курьер', q.cat, q.opts);

  // ═══════════════ УПРАВЛЯЮЩИЙ (15) ═══════════════
  const manager = [
    { text: 'Что важнее всего в работе управляющего?', cat: 'Управляющий', opts: [
      { text: 'Люди, стандарты, результат', isCorrect: true },
      { text: 'Только цифры', isCorrect: false },
      { text: 'Только жалобы', isCorrect: false },
      { text: 'Только отчёты', isCorrect: false },
    ] },
    { text: 'Как проводить разбор смены?', cat: 'Управляющий', opts: [
      { text: 'Спокойно, по фактам, с планом', isCorrect: true },
      { text: 'Кричать', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Публично ругать', isCorrect: false },
    ] },
    { text: 'Что делать при жалобе на сотрудника?', cat: 'Управляющий', opts: [
      { text: 'Выслушать, разобраться, принять меры', isCorrect: true },
      { text: 'Встать на сторону сотрудника', isCorrect: false },
      { text: 'Уволить сразу', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
    ] },
    { text: 'Кто отвечает за санитарию на точке?', cat: 'Управляющий', opts: [
      { text: 'Управляющий и вся смена', isCorrect: true },
      { text: 'Только уборщица', isCorrect: false },
      { text: 'Только повар', isCorrect: false },
      { text: 'Только официант', isCorrect: false },
    ] },
    { text: 'Как часто обучать персонал?', cat: 'Управляющий', opts: [
      { text: 'Регулярно, по плану', isCorrect: true },
      { text: 'Только при приёме', isCorrect: false },
      { text: 'Никогда', isCorrect: false },
      { text: 'Раз в год', isCorrect: false },
    ] },
    { text: 'Как мотивировать команду?', cat: 'Управляющий', opts: [
      { text: 'Хвалить и премировать', isCorrect: true },
      { text: 'Кричать', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Штрафовать', isCorrect: false },
    ] },
    { text: 'Что делать при конфликте сотрудников?', cat: 'Управляющий', opts: [
      { text: 'Разобрать один на один', isCorrect: true },
      { text: 'Публично', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Уволить обоих', isCorrect: false },
    ] },
    { text: 'Как контролировать закупки?', cat: 'Управляющий', opts: [
      { text: 'Проверять накладные и остатки', isCorrect: true },
      { text: 'Не проверять', isCorrect: false },
      { text: 'На глаз', isCorrect: false },
      { text: 'Доверять поставщику', isCorrect: false },
    ] },
    { text: 'Что делать при проверке Роспотребнадзора?', cat: 'Управляющий', opts: [
      { text: 'Спокойно предоставить документы', isCorrect: true },
      { text: 'Спрятать', isCorrect: false },
      { text: 'Не пустить', isCorrect: false },
      { text: 'Сказать, что шеф уехал', isCorrect: false },
    ] },
    { text: 'Как вести отчётность?', cat: 'Управляющий', opts: [
      { text: 'Ежедневно, точно', isCorrect: true },
      { text: 'Раз в год', isCorrect: false },
      { text: 'Никак', isCorrect: false },
      { text: 'По памяти', isCorrect: false },
    ] },
    { text: 'Что делать при кассовом расхождении?', cat: 'Управляющий', opts: [
      { text: 'Разобраться, зафиксировать', isCorrect: true },
      { text: 'Скрыть', isCorrect: false },
      { text: 'Списать', isCorrect: false },
      { text: 'Обвинить кассира', isCorrect: false },
    ] },
    { text: 'Как контролировать время смены?', cat: 'Управляющий', opts: [
      { text: 'Вести учёт прихода и ухода', isCorrect: true },
      { text: 'Не вести', isCorrect: false },
      { text: 'На доверии', isCorrect: false },
      { text: 'По памяти', isCorrect: false },
    ] },
    { text: 'Что делать, если сотрудник опоздал?', cat: 'Управляющий', opts: [
      { text: 'Выяснить причину, принять меры', isCorrect: true },
      { text: 'Уволить', isCorrect: false },
      { text: 'Игнорировать', isCorrect: false },
      { text: 'Оштрафовать без разбора', isCorrect: false },
    ] },
    { text: 'Как оценивать работу смены?', cat: 'Управляющий', opts: [
      { text: 'По стандартам и метрикам', isCorrect: true },
      { text: 'По настроению', isCorrect: false },
      { text: 'Не оценивать', isCorrect: false },
      { text: 'По количеству жалоб', isCorrect: false },
    ] },
    { text: 'Что делать с лучшими сотрудниками?', cat: 'Управляющий', opts: [
      { text: 'Поощрять и продвигать', isCorrect: true },
      { text: 'Не замечать', isCorrect: false },
      { text: 'Увольнять', isCorrect: false },
      { text: 'Нагружать больше', isCorrect: false },
    ] },
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
