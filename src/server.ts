import fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { startBot } from './bot';

const app = fastify({ logger: true });
const prisma = new PrismaClient();

const MANAGER_PASSWORD = '11111';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '22222';

const CATEGORIES = ['Сервис', 'Санитария', 'Безопасность', 'Стандарты', 'Культура'];
const PROFESSIONS = ['general', 'официант', 'повар', 'бармен', 'хостес', 'курьер', 'управляющий'];

async function start() {
  await app.register(cors, { origin: true });

  // Запуск Telegram-бота
  startBot();

  // ─── Вопросы (с перемешиванием) ───
  app.get('/api/questions', async (request: any) => {
    const { profession, count } = request.query as {
      profession?: string;
      count?: string;
    };

    const limit = count ? parseInt(count, 10) : 9;
    const where = profession
      ? { profession: { in: ['general', profession] } }
      : {};

    const all = await prisma.question.findMany({
      where,
      include: {
        options: { select: { id: true, text: true, isCorrect: true } },
      },
    });

    const shuffled = all.sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, limit);

    return picked.map(q => ({
      ...q,
      options: q.options.sort(() => Math.random() - 0.5),
    }));
  });

  // ─── Поиск вопроса по номеру ───
  app.get('/api/questions/number/:number', async (request: any, reply: any) => {
    const { number } = request.params as { number: string };
    const num = parseInt(number, 10);

    if (isNaN(num)) {
      return reply.code(400).send({ error: 'Неверный номер' });
    }

    const question = await prisma.question.findUnique({
      where: { number: num },
      include: { options: true },
    });

    if (!question) {
      return reply.code(404).send({ error: 'Вопрос не найден' });
    }

    return question;
  });

  // ─── ВСЕ вопросы для админки ───
  app.get('/api/admin/questions', async (request: any) => {
    const { profession } = request.query as { profession?: string };

    const where =
      profession && profession !== 'all' ? { profession } : {};

    return prisma.question.findMany({
      where,
      orderBy: { number: 'asc' },
      include: {
        options: {
          select: { id: true, text: true, isCorrect: true },
        },
      },
    });
  });

  // ─── Пароль руководителя ───
  app.post('/api/login-manager', async (request: any, reply: any) => {
    const { password } = request.body as { password?: string };

    if (!password) return reply.code(400).send({ error: 'Пароль не указан' });
    if (password === MANAGER_PASSWORD) return { ok: true };
    return reply.code(401).send({ ok: false, error: 'Неверный пароль' });
  });

  // ─── Пароль админа ───
  app.post('/api/login-admin', async (request: any, reply: any) => {
    const { password } = request.body as { password?: string };

    if (!password) return reply.code(400).send({ error: 'Пароль не указан' });
    if (password === ADMIN_PASSWORD) return { ok: true };
    return reply.code(401).send({ ok: false, error: 'Неверный пароль' });
  });

  // ─── Telegram initData ───
  app.post('/api/telegram-auth', async (request: any, reply: any) => {
    const { initData } = request.body as { initData?: string };

    if (!initData) {
      return reply.code(400).send({ ok: false, error: 'initData не передан' });
    }

    const BOT_TOKEN = process.env.BOT_TOKEN;
    if (!BOT_TOKEN) {
      return reply.code(500).send({ ok: false, error: 'BOT_TOKEN не настроен' });
    }

    const params = new URLSearchParams(initData);
    const hash = params.get('hash');

    if (!hash) return reply.code(401).send({ ok: false, error: 'Нет подписи' });
    if (!/^[0-9a-f]{64}$/i.test(hash)) {
      return reply.code(401).send({ ok: false, error: 'Неверный формат подписи' });
    }

    params.delete('hash');

    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    const computedBuf = Buffer.from(computedHash, 'hex');
    const hashBuf = Buffer.from(hash, 'hex');

    if (
      computedBuf.length !== hashBuf.length ||
      !crypto.timingSafeEqual(computedBuf, hashBuf)
    ) {
      return reply.code(401).send({ ok: false, error: 'Подпись неверна' });
    }

    const userJson = params.get('user');
    if (!userJson) {
      return reply.code(400).send({ ok: false, error: 'Нет данных пользователя' });
    }

    let user: any;
    try {
      user = JSON.parse(userJson);
    } catch {
      return reply.code(400).send({ ok: false, error: 'Ошибка парсинга user' });
    }

    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const username = user.username || '';
    const fullName = (firstName + ' ' + lastName).trim() || username || 'Сотрудник';

    return {
      ok: true,
      user: {
        id: user.id,
        name: fullName,
        username,
      },
    };
  });

  // ─── Создать вопрос ───
  app.post('/api/questions', async (request: any, reply: any) => {
    const { text, profession, category, options } = request.body as {
      text?: string;
      profession?: string;
      category?: string;
      options?: { text: string; isCorrect: boolean }[];
    };

    if (!text || !profession || !category || !options || options.length < 3) {
      return reply.code(400).send({ error: 'Заполнены не все поля' });
    }
    if (!PROFESSIONS.includes(profession)) {
      return reply.code(400).send({ error: 'Неверная профессия' });
    }
    if (!CATEGORIES.includes(category)) {
      return reply.code(400).send({ error: 'Неверная категория' });
    }
    if (options.filter(o => o.isCorrect).length !== 1) {
      return reply.code(400).send({ error: 'Должен быть ровно 1 правильный ответ' });
    }

    // Ищем максимальный номер
    const maxQ = await prisma.question.findFirst({
      orderBy: { number: 'desc' },
      select: { number: true },
    });
    const nextNumber = (maxQ?.number || 0) + 1;

    const question = await prisma.question.create({
      data: {
        number: nextNumber,
        text,
        profession,
        category,
        options: { create: options },
      },
      include: {
        options: { select: { id: true, text: true, isCorrect: true } },
      },
    });

    return question;
  });

  // ─── Обновить вопрос ───
  app.put('/api/questions/:id', async (request: any, reply: any) => {
    const { id } = request.params as { id: string };
    const { text, profession, category, options } = request.body as {
      text?: string;
      profession?: string;
      category?: string;
      options?: { text: string; isCorrect: boolean }[];
    };

    if (!text || !profession || !category || !options || options.length < 3) {
      return reply.code(400).send({ error: 'Заполнены не все поля' });
    }
    if (!PROFESSIONS.includes(profession)) {
      return reply.code(400).send({ error: 'Неверная профессия' });
    }
    if (!CATEGORIES.includes(category)) {
      return reply.code(400).send({ error: 'Неверная категория' });
    }
    if (options.filter(o => o.isCorrect).length !== 1) {
      return reply.code(400).send({ error: 'Должен быть ровно 1 правильный ответ' });
    }

    await prisma.option.deleteMany({ where: { questionId: id } });

    const question = await prisma.question.update({
      where: { id },
      data: {
        text,
        profession,
        category,
        options: { create: options },
      },
      include: {
        options: { select: { id: true, text: true, isCorrect: true } },
      },
    });

    return question;
  });

  // ─── Смена правильного ответа ───
  app.patch('/api/questions/:id/correct', async (request: any, reply: any) => {
    const { id } = request.params as { id: string };
    const { optionId } = request.body as { optionId?: string };

    if (!optionId) return reply.code(400).send({ error: 'optionId обязателен' });

    const option = await prisma.option.findUnique({ where: { id: optionId } });
    if (!option || option.questionId !== id) {
      return reply.code(400).send({ error: 'Неверный вариант' });
    }

    await prisma.option.updateMany({
      where: { questionId: id },
      data: { isCorrect: false },
    });
    await prisma.option.update({
      where: { id: optionId },
      data: { isCorrect: true },
    });

    return { ok: true };
  });

  // ─── Удалить вопрос ───
  app.delete('/api/questions/:id', async (request: any) => {
    const { id } = request.params as { id: string };
    await prisma.question.delete({ where: { id } });
    return { ok: true };
  });

  // ─── Сохранить попытку (с ответами и telegramId) ───
  app.post('/api/attempts', async (request: any, reply: any) => {
    const { score, total, profession, employeeName, telegramId, answers } = request.body as {
      score?: number;
      total?: number;
      profession?: string;
      employeeName?: string;
      telegramId?: string;
      answers?: {
        questionId: string;
        selectedOptionId: string | null;
        selectedText: string | null;
        correctOptionId: string | null;
        correctText: string | null;
        isCorrect: boolean;
      }[];
    };

    if (typeof score !== 'number' || typeof total !== 'number') {
      return reply.code(400).send({ error: 'score и total обязательны' });
    }

    const user = await prisma.user.upsert({
      where: { email: 'test@test.com' },
      update: {},
      create: { email: 'test@test.com', name: 'Тестовый Сотрудник' },
    });

    const percent = total === 0 ? 0 : Math.round((score / total) * 100);
    const passed = percent >= 66;

    const attempt = await prisma.attempt.create({
      data: {
        userId: user.id,
        score,
        total,
        passed,
        profession: profession || 'general',
        employeeName: employeeName || 'Сотрудник',
        telegramId: telegramId || null,
      },
    });

    // Сохраняем ответы (если пришли)
    if (answers && Array.isArray(answers)) {
      for (let i = 0; i < answers.length; i++) {
        const a = answers[i];
        // Достаём номер и текст вопроса
        const question = await prisma.question.findUnique({
          where: { id: a.questionId },
          select: { number: true, text: true },
        });

        await prisma.attemptAnswer.create({
          data: {
            attemptId: attempt.id,
            questionId: a.questionId,
            questionNumber: question?.number || 0,
            questionText: question?.text || '',
            selectedOptionId: a.selectedOptionId,
            selectedText: a.selectedText,
            correctOptionId: a.correctOptionId,
            correctText: a.correctText,
            isCorrect: a.isCorrect,
            order: i + 1,
          },
        });
      }
    }

    return { ok: true, attemptId: attempt.id, percent, passed };
  });

  // ─── Статистика ───
  app.get('/api/stats', async (request: any) => {
    const { profession, employeeName } = request.query as {
      profession?: string;
      employeeName?: string;
    };

    const where: any = {};
    if (profession && profession !== 'all') where.profession = profession;
    if (employeeName && employeeName !== 'all') where.employeeName = employeeName;

    const total = await prisma.attempt.count({ where });
    const passed = await prisma.attempt.count({
      where: { ...where, passed: true },
    });

    return {
      total,
      passed,
      failed: total - passed,
      passRate: total === 0 ? 0 : Math.round((passed / total) * 100),
    };
  });

  // ─── Все попытки ───
  app.get('/api/attempts', async (request: any) => {
    const { profession, employeeName, limit } = request.query as {
      profession?: string;
      employeeName?: string;
      limit?: string;
    };

    const where: any = {};
    if (profession && profession !== 'all') where.profession = profession;
    if (employeeName && employeeName !== 'all') where.employeeName = employeeName;

    const take = limit ? parseInt(limit, 10) : 50;

    return prisma.attempt.findMany({
      where,
      take,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
  });

  // ─── Детали попытки (с ответами) ───
  app.get('/api/attempts/:id', async (request: any, reply: any) => {
    const { id } = request.params as { id: string };

    const attempt = await prisma.attempt.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        answers: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!attempt) {
      return reply.code(404).send({ error: 'Попытка не найдена' });
    }

    return attempt;
  });

  // ─── Мои попытки (по Telegram ID) ───
  app.get('/api/attempts/my/:telegramId', async (request: any) => {
    const { telegramId } = request.params as { telegramId: string };

    return prisma.attempt.findMany({
      where: { telegramId },
      orderBy: { createdAt: 'desc' },
    });
  });

  // ─── Удалить одну попытку ───
  app.delete('/api/attempts/:id', async (request: any) => {
    const { id } = request.params as { id: string };
    await prisma.attempt.delete({ where: { id } });
    return { ok: true };
  });

  // ─── Удалить ВСЕ попытки ───
  app.delete('/api/attempts', async () => {
    await prisma.attempt.deleteMany();
    return { ok: true };
  });

  // ─── Уникальные сотрудники ───
  app.get('/api/employees', async () => {
    const attempts = await prisma.attempt.findMany({
      select: { employeeName: true },
      distinct: ['employeeName'],
      orderBy: { employeeName: 'asc' },
    });

    return attempts
      .map(a => a.employeeName)
      .filter(name => name && name !== 'Сотрудник');
  });

  // ─── Рейтинг ───
  app.get('/api/rating', async () => {
    const attempts = await prisma.attempt.findMany({
      select: { employeeName: true, passed: true },
    });

    const byName: Record<string, { attempts: number; passed: number }> = {};

    for (const a of attempts) {
      if (!a.employeeName || a.employeeName === 'Сотрудник') continue;
      if (!byName[a.employeeName]) byName[a.employeeName] = { attempts: 0, passed: 0 };
      byName[a.employeeName].attempts += 1;
      if (a.passed) byName[a.employeeName].passed += 1;
    }

    const rating = Object.entries(byName).map(([name, data]) => ({
      name,
      attempts: data.attempts,
      passed: data.passed,
      successRate: Math.round((data.passed / data.attempts) * 100),
    }));

    rating.sort((a, b) => {
      if (b.successRate !== a.successRate) return b.successRate - a.successRate;
      return b.attempts - a.attempts;
    });

    return rating.slice(0, 10);
  });

  // ─── Health-check ───
  app.get('/', async () => {
    return { ok: true, service: 'shtatkontrol-backend' };
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  try {
    await app.listen(port, '0.0.0.0');
    console.log(`🍳 Кухня: http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();