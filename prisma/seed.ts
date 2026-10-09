import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────
// ХЕЛПЕР: удобное создание вопроса
// ─────────────────────────────────────────
async function addQuestion(
  text: string,
  profession: string,
  category: string,
  options: { text: string; isCorrect: boolean }[]
) {
  await prisma.question.create({
    data: {
      text,
      profession,
      category,
      options: { create: options },
    },
  });
}

async function main() {
  // Чистим базу от старых вопросов, чтобы не было дублей
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();

  await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: { email: 'test@test.com', name: 'Тестовый Сотрудник' },
  });

  // ─────────────────────────────────────────
  // ОБЩИЕ ВОПРОСЫ (30 штук, для всех профессий)
  // ─────────────────────────────────────────
  const general = [
    {
      text: 'Что нужно сказать гостю при входе?',
      cat: 'Сервис',
      opts: [
        { text: 'Привет', isCorrect: false },
        { text: 'Здравствуйте! Добро пожаловать!', isCorrect: true },
        { text: 'Че надо?', isCorrect: false },
        { text: 'Молча кивнуть', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если гость недоволен заказом?',
      cat: 'Сервис',
      opts: [
        { text: 'Спорить с гостем', isCorrect: false },
        { text: 'Извиниться и предложить решение', isCorrect: true },
        { text: 'Позвать охрану', isCorrect: false },
        { text: 'Уйти в подсобку', isCorrect: false },
      ],
    },
    {
      text: 'Как часто нужно мыть руки на кухне?',
      cat: 'Санитария',
      opts: [
        { text: 'Один раз в смену', isCorrect: false },
        { text: 'Каждый час или после каждой смены задачи', isCorrect: true },
        { text: 'Когда вспомнишь', isCorrect: false },
        { text: 'Перед уходом домой', isCorrect: false },
      ],
    },
    {
      text: 'Что такое «Додо-стиль» в обслуживании?',
      cat: 'Культура',
      opts: [
        { text: 'Быстро, вежливо, с улыбкой', isCorrect: true },
        { text: 'Дорого и пафосно', isCorrect: false },
        { text: 'Как получится', isCorrect: false },
        { text: 'Строго по инструкции без эмоций', isCorrect: false },
      ],
    },
    {
      text: 'Сколько времени должно пройти до подачи заказа гостю?',
      cat: 'Стандарты',
      opts: [
        { text: 'Не более 10 минут', isCorrect: false },
        { text: 'Не более 15 минут', isCorrect: true },
        { text: 'Не более 30 минут', isCorrect: false },
        { text: 'Как получится', isCorrect: false },
      ],
    },
    {
      text: 'Что делать при обнаружении просроченного продукта?',
      cat: 'Санитария',
      opts: [
        { text: 'Использовать, если пахнет нормально', isCorrect: false },
        { text: 'Сразу утилизировать и сообщить менеджеру', isCorrect: true },
        { text: 'Отдать коллеге', isCorrect: false },
        { text: 'Спрятать в дальний угол', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно общаться с коллегами на смене?',
      cat: 'Культура',
      opts: [
        { text: 'Вежливо и уважительно', isCorrect: true },
        { text: 'Кричать, если что-то не так', isCorrect: false },
        { text: 'Игнорировать', isCorrect: false },
        { text: 'Обсуждать за спиной', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если не знаешь ответ на вопрос гостя?',
      cat: 'Сервис',
      opts: [
        { text: 'Придумать что-нибудь', isCorrect: false },
        { text: 'Уточнить у менеджера и вернуться с ответом', isCorrect: true },
        { text: 'Сказать «не знаю» и уйти', isCorrect: false },
        { text: 'Перевести тему', isCorrect: false },
      ],
    },
    {
      text: 'Как часто нужно менять перчатки на кухне?',
      cat: 'Санитария',
      opts: [
        { text: 'Раз в день', isCorrect: false },
        { text: 'После каждой смены задачи или загрязнения', isCorrect: true },
        { text: 'Когда порвутся', isCorrect: false },
        { text: 'Никогда', isCorrect: false },
      ],
    },
    {
      text: 'Что такое «гость всегда прав»?',
      cat: 'Культура',
      opts: [
        { text: 'Гость всегда получает то, что хочет, даже в ущерб правилам', isCorrect: false },
        { text: 'Мы уважаем гостя и решаем его проблему в рамках правил', isCorrect: true },
        { text: 'Гость может делать что угодно', isCorrect: false },
        { text: 'Это просто слоган', isCorrect: false },
      ],
    },
    {
      text: 'Что делать при пожаре в заведении?',
      cat: 'Безопасность',
      opts: [
        { text: 'Спокойно вывести гостей по эвакуационным выходам', isCorrect: true },
        { text: 'Продолжить работу', isCorrect: false },
        { text: 'Снимать на телефон', isCorrect: false },
        { text: 'Бежать первым', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно хранить продукты в холодильнике?',
      cat: 'Санитария',
      opts: [
        { text: 'Всё в одном месте', isCorrect: false },
        { text: 'По категориям, с соблюдением товарного соседства', isCorrect: true },
        { text: 'Как влезет', isCorrect: false },
        { text: 'Только на верхней полке', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если гость оставил вещи?',
      cat: 'Сервис',
      opts: [
        { text: 'Забрать себе', isCorrect: false },
        { text: 'Сдать менеджеру и записать в журнал находок', isCorrect: true },
        { text: 'Выкинуть', isCorrect: false },
        { text: 'Оставить на столе', isCorrect: false },
      ],
    },
    {
      text: 'Как часто нужно проходить медосмотр?',
      cat: 'Санитария',
      opts: [
        { text: 'Раз в год', isCorrect: true },
        { text: 'Раз в 5 лет', isCorrect: false },
        { text: 'Никогда', isCorrect: false },
        { text: 'Только при приёме на работу', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если посетитель ведёт себя агрессивно?',
      cat: 'Безопасность',
      opts: [
        { text: 'Ответить агрессией', isCorrect: false },
        { text: 'Сохранять спокойствие и позвать менеджера', isCorrect: true },
        { text: 'Убежать', isCorrect: false },
        { text: 'Снять на видео', isCorrect: false },
      ],
    },
    {
      text: 'Что такое «апсейл»?',
      cat: 'Сервис',
      opts: [
        { text: 'Предложение гостю доп. товара или услуги', isCorrect: true },
        { text: 'Скидка', isCorrect: false },
        { text: 'Жалоба', isCorrect: false },
        { text: 'Возврат', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно мыть посуду?',
      cat: 'Санитария',
      opts: [
        { text: 'Ополоснуть водой', isCorrect: false },
        { text: 'Мойка → ополаскивание → сушка', isCorrect: true },
        { text: 'Протереть тряпкой', isCorrect: false },
        { text: 'Замочить на час', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если закончился товар?',
      cat: 'Стандарты',
      opts: [
        { text: 'Сообщить менеджеру и внести в систему', isCorrect: true },
        { text: 'Сказать гостю, что больше нет', isCorrect: false },
        { text: 'Подождать до конца смены', isCorrect: false },
        { text: 'Ничего не делать', isCorrect: false },
      ],
    },
    {
      text: 'Что важно помнить про внешний вид сотрудника?',
      cat: 'Стандарты',
      opts: [
        { text: 'Чистая форма, аккуратная причёска, бейдж', isCorrect: true },
        { text: 'Главное — удобно', isCorrect: false },
        { text: 'Можно в чём угодно', isCorrect: false },
        { text: 'Только для менеджеров', isCorrect: false },
      ],
    },
    {
      text: 'Что делать после окончания смены?',
      cat: 'Стандарты',
      opts: [
        { text: 'Уйти сразу', isCorrect: false },
        { text: 'Убрать рабочее место, сдать смену', isCorrect: true },
        { text: 'Оставить всё как есть', isCorrect: false },
        { text: 'Ждать, пока попросят', isCorrect: false },
      ],
    },
    {
      text: 'Кому подчиняется сотрудник на смене?',
      cat: 'Стандарты',
      opts: [
        { text: 'Менеджеру смены', isCorrect: true },
        { text: 'Самому себе', isCorrect: false },
        { text: 'Старшему гостю', isCorrect: false },
        { text: 'Никому', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если коллега нарушает правила?',
      cat: 'Культура',
      opts: [
        { text: 'Сообщить менеджеру', isCorrect: true },
        { text: 'Промолчать', isCorrect: false },
        { text: 'Сделать вид, что не заметил', isCorrect: false },
        { text: 'Начать ссору', isCorrect: false },
      ],
    },
    {
      text: 'Что такое «стандарт обслуживания»?',
      cat: 'Сервис',
      opts: [
        { text: 'Правила и шаги, по которым мы работаем с гостем', isCorrect: true },
        { text: 'Просто бумажка', isCorrect: false },
        { text: 'Что-то для менеджеров', isCorrect: false },
        { text: 'Совет от коллеги', isCorrect: false },
      ],
    },
    {
      text: 'Сколько раз в день нужно мыть полы в зале?',
      cat: 'Санитария',
      opts: [
        { text: 'По мере загрязнения и по графику', isCorrect: true },
        { text: 'Раз в неделю', isCorrect: false },
        { text: 'Никогда', isCorrect: false },
        { text: 'Только утром', isCorrect: false },
      ],
    },
    {
      text: 'Что делать при обнаружении насекомых на кухне?',
      cat: 'Санитария',
      opts: [
        { text: 'Сразу сообщить менеджеру и обработать зону', isCorrect: true },
        { text: 'Убить и забыть', isCorrect: false },
        { text: 'Спрятать', isCorrect: false },
        { text: 'Никому не говорить', isCorrect: false },
      ],
    },
    {
      text: 'Что делать с жалобой гостя?',
      cat: 'Сервис',
      opts: [
        { text: 'Выслушать, извиниться, решить, зафиксировать', isCorrect: true },
        { text: 'Сказать, что не наша проблема', isCorrect: false },
        { text: 'Перевести на другого', isCorrect: false },
        { text: 'Проигнорировать', isCorrect: false },
      ],
    },
    {
      text: 'Сколько времени можно хранить готовую еду без холодильника?',
      cat: 'Санитария',
      opts: [
        { text: 'Не более 2 часов', isCorrect: true },
        { text: 'Весь день', isCorrect: false },
        { text: 'Неограниченно', isCorrect: false },
        { text: '24 часа', isCorrect: false },
      ],
    },
    {
      text: 'Что такое «тайный гость»?',
      cat: 'Культура',
      opts: [
        { text: 'Проверяющий под видом обычного гостя', isCorrect: true },
        { text: 'VIP-гость', isCorrect: false },
        { text: 'Друг менеджера', isCorrect: false },
        { text: 'Курьер', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если гостю не хватило сдачи?',
      cat: 'Сервис',
      opts: [
        { text: 'Извиниться и предложить решение', isCorrect: true },
        { text: 'Сказать «нет и не будет»', isCorrect: false },
        { text: 'Проигнорировать', isCorrect: false },
        { text: 'Обвинить гостя', isCorrect: false },
      ],
    },
    {
      text: 'Что важнее всего в работе с командой?',
      cat: 'Культура',
      opts: [
        { text: 'Уважение и взаимопомощь', isCorrect: true },
        { text: 'Личная выгода', isCorrect: false },
        { text: 'Конкуренция', isCorrect: false },
        { text: 'Молчание', isCorrect: false },
      ],
    },
  ];

  for (const q of general) {
    await addQuestion(q.text, 'general', q.cat, q.opts);
  }

  // ─────────────────────────────────────────
  // ПО ПРОФЕССИЯМ (по 5 на каждую)
  // ─────────────────────────────────────────

  // ОФИЦИАНТ
  const waiter = [
    {
      text: 'С чего начинается обслуживание гостя за столом?',
      cat: 'Официант',
      opts: [
        { text: 'С подачи меню и приветствия', isCorrect: true },
        { text: 'Сразу с приёма заказа', isCorrect: false },
        { text: 'С уборки стола', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно нести поднос?',
      cat: 'Официант',
      opts: [
        { text: 'На ладони левой руки, на уровне плеча', isCorrect: true },
        { text: 'Двумя руками перед собой', isCorrect: false },
        { text: 'Под мышкой', isCorrect: false },
      ],
    },
    {
      text: 'Когда нужно убирать грязную посуду со стола?',
      cat: 'Официант',
      opts: [
        { text: 'Сразу после того, как гость закончил', isCorrect: true },
        { text: 'В конце смены', isCorrect: false },
        { text: 'Когда попросят', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если гость заказывает блюдо, которого нет?',
      cat: 'Официант',
      opts: [
        { text: 'Предложить альтернативу', isCorrect: true },
        { text: 'Сказать «нет» и уйти', isCorrect: false },
        { text: 'Принести что-то другое молча', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно принимать заказ?',
      cat: 'Официант',
      opts: [
        { text: 'Записать, повторить гостю, уточнить детали', isCorrect: true },
        { text: 'Запомнить на слух', isCorrect: false },
        { text: 'Кивнуть и уйти', isCorrect: false },
      ],
    },
  ];
  for (const q of waiter) await addQuestion(q.text, 'официант', q.cat, q.opts);

  // ПОВАР
  const cook = [
    {
      text: 'Какая температура в холодильной камере должна быть?',
      cat: 'Повар',
      opts: [
        { text: '+2…+4 °C', isCorrect: true },
        { text: '+10 °C', isCorrect: false },
        { text: '0 °C', isCorrect: false },
      ],
    },
    {
      text: 'Что делать при порезе на кухне?',
      cat: 'Повар',
      opts: [
        { text: 'Обработать, заклеить пластырем, надеть перчатку', isCorrect: true },
        { text: 'Продолжить работу', isCorrect: false },
        { text: 'Замотать тряпкой', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно размораживать мясо?',
      cat: 'Повар',
      opts: [
        { text: 'В холодильнике, медленно', isCorrect: true },
        { text: 'В горячей воде', isCorrect: false },
        { text: 'На столе всю ночь', isCorrect: false },
      ],
    },
    {
      text: 'Что такое «товарное соседство»?',
      cat: 'Повар',
      opts: [
        { text: 'Сырое и готовое хранятся отдельно', isCorrect: true },
        { text: 'Все продукты вместе', isCorrect: false },
        { text: 'Сортировка по цвету', isCorrect: false },
      ],
    },
    {
      text: 'Через сколько нужно выбрасывать готовую еду, стоящую на раздаче?',
      cat: 'Повар',
      opts: [
        { text: 'По правилам хранения, обычно не более 2–3 часов', isCorrect: true },
        { text: 'Через 12 часов', isCorrect: false },
        { text: 'Никогда', isCorrect: false },
      ],
    },
  ];
  for (const q of cook) await addQuestion(q.text, 'повар', q.cat, q.opts);

  // БАРМЕН
  const bartender = [
    {
      text: 'Что нужно проверить перед началом смены за баром?',
      cat: 'Бармен',
      opts: [
        { text: 'Наличие льда, ингредиентов и чистоту оборудования', isCorrect: true },
        { text: 'Только наличие льда', isCorrect: false },
        { text: 'Ничего', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно подавать напитки гостю?',
      cat: 'Бармен',
      opts: [
        { text: 'Аккуратно, со стороны гостя, с улыбкой', isCorrect: true },
        { text: 'Через барную стойку, как получится', isCorrect: false },
        { text: 'Молча поставить', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если гость выглядит сильно пьяным?',
      cat: 'Бармен',
      opts: [
        { text: 'Не подавать алкоголь и позвать менеджера', isCorrect: true },
        { text: 'Налить ещё', isCorrect: false },
        { text: 'Игнорировать', isCorrect: false },
      ],
    },
    {
      text: 'Как хранить открытые бутылки?',
      cat: 'Бармен',
      opts: [
        { text: 'Закрытыми, в холодильнике, с датой открытия', isCorrect: true },
        { text: 'Как попало', isCorrect: false },
        { text: 'Оставлять открытыми на баре', isCorrect: false },
      ],
    },
    {
      text: 'Что такое «фрифлоу» на баре?',
      cat: 'Бармен',
      opts: [
        { text: 'Бесплатная подача напитков (обычно по решению менеджера)', isCorrect: true },
        { text: 'Быстрая подача', isCorrect: false },
        { text: 'Льготная цена', isCorrect: false },
      ],
    },
  ];
  for (const q of bartender) await addQuestion(q.text, 'бармен', q.cat, q.opts);

  // ХОСТЕС
  const hostess = [
    {
      text: 'Что делает хостес при входе гостя?',
      cat: 'Хостес',
      opts: [
        { text: 'Приветствует и провожает за стол', isCorrect: true },
        { text: 'Сразу принимает заказ', isCorrect: false },
        { text: 'Ждёт, пока гость сам подойдёт', isCorrect: false },
      ],
    },
    {
      text: 'Как рассаживать гостей?',
      cat: 'Хостес',
      opts: [
        { text: 'С учётом зон, компании и пожеланий', isCorrect: true },
        { text: 'Как получится', isCorrect: false },
        { text: 'Только у окна', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если свободных столов нет?',
      cat: 'Хостес',
      opts: [
        { text: 'Предложить подождать, записать в лист ожидания', isCorrect: true },
        { text: 'Сказать «мест нет» и уйти', isCorrect: false },
        { text: 'Посадить к другим гостям', isCorrect: false },
      ],
    },
    {
      text: 'Как отвечать на звонки по брони?',
      cat: 'Хостес',
      opts: [
        { text: 'Вежливо, уточнить дату, время, количество гостей, имя', isCorrect: true },
        { text: 'Коротко «да» или «нет»', isCorrect: false },
        { text: 'Не отвечать', isCorrect: false },
      ],
    },
    {
      text: 'Что делать при жалобе гостя в зоне хостес?',
      cat: 'Хостес',
      opts: [
        { text: 'Выслушать и позвать менеджера', isCorrect: true },
        { text: 'Спорить', isCorrect: false },
        { text: 'Игнорировать', isCorrect: false },
      ],
    },
  ];
  for (const q of hostess) await addQuestion(q.text, 'хостес', q.cat, q.opts);

  // КУРЬЕР
  const courier = [
    {
      text: 'Что нужно проверить перед выездом на доставку?',
      cat: 'Курьер',
      opts: [
        { text: 'Адрес, состав заказа, терминал и сумку', isCorrect: true },
        { text: 'Только адрес', isCorrect: false },
        { text: 'Ничего', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно перевозить пиццу?',
      cat: 'Курьер',
      opts: [
        { text: 'В термосумке, горизонтально, не переворачивая', isCorrect: true },
        { text: 'Как угодно', isCorrect: false },
        { text: 'В руках', isCorrect: false },
      ],
    },
    {
      text: 'Что делать, если гость не открывает дверь?',
      cat: 'Курьер',
      opts: [
        { text: 'Позвонить по телефону заказа, потом связаться с менеджером', isCorrect: true },
        { text: 'Уехать', isCorrect: false },
        { text: 'Оставить заказ под дверью', isCorrect: false },
      ],
    },
    {
      text: 'Как вести себя с гостем при доставке?',
      cat: 'Курьер',
      opts: [
        { text: 'Вежливо, с улыбкой, пожелать приятного аппетита', isCorrect: true },
        { text: 'Молча отдать заказ', isCorrect: false },
        { text: 'Грубо, если торопишься', isCorrect: false },
      ],
    },
    {
      text: 'Что делать при поломке транспорта в пути?',
      cat: 'Курьер',
      opts: [
        { text: 'Сообщить менеджеру и решить, как доставить заказ', isCorrect: true },
        { text: 'Бросить заказ и уехать', isCorrect: false },
        { text: 'Ничего не делать', isCorrect: false },
      ],
    },
  ];
  for (const q of courier) await addQuestion(q.text, 'курьер', q.cat, q.opts);

  // УПРАВЛЯЮЩИЙ
  const manager = [
    {
      text: 'Что важнее всего в работе управляющего?',
      cat: 'Управляющий',
      opts: [
        { text: 'Люди, стандарты и результат', isCorrect: true },
        { text: 'Только цифры', isCorrect: false },
        { text: 'Только жалобы', isCorrect: false },
      ],
    },
    {
      text: 'Как правильно проводить разбор смены?',
      cat: 'Управляющий',
      opts: [
        { text: 'Спокойно, по фактам, с планом на будущее', isCorrect: true },
        { text: 'Кричать на сотрудников', isCorrect: false },
        { text: 'Игнорировать ошибки', isCorrect: false },
      ],
    },
    {
      text: 'Что делать при жалобе гостя на сотрудника?',
      cat: 'Управляющий',
      opts: [
        { text: 'Выслушать, извиниться, разобраться, принять меры', isCorrect: true },
        { text: 'Встать на сторону сотрудника', isCorrect: false },
        { text: 'Встать на сторону гостя без разбора', isCorrect: false },
      ],
    },
    {
      text: 'Кто отвечает за соблюдение санитарных норм на точке?',
      cat: 'Управляющий',
      opts: [
        { text: 'Управляющий и вся смена', isCorrect: true },
        { text: 'Только уборщица', isCorrect: false },
        { text: 'Только повар', isCorrect: false },
      ],
    },
    {
      text: 'Как часто нужно проводить обучение персонала?',
      cat: 'Управляющий',
      opts: [
        { text: 'Регулярно, по плану и по мере необходимости', isCorrect: true },
        { text: 'Только при приёме на работу', isCorrect: false },
        { text: 'Никогда', isCorrect: false },
      ],
    },
  ];
  for (const q of manager) await addQuestion(q.text, 'управляющий', q.cat, q.opts);

  console.log('✅ База заполнена: 60 вопросов');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });