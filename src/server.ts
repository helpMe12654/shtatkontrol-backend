import fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const app = fastify({ logger: true });
const prisma = new PrismaClient();

const MANAGER_PASSWORD = '11111';

async function start() {
  await app.register(cors, { origin: true });

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

    const withShuffledOptions = picked.map(q => ({
      ...q,
      options: q.options.sort(() => Math.random() - 0.5),
    }));

    return withShuffledOptions;
  });

  // ─── Пароль руководителя ───
  app.post('/api/login-manager', async (request: any, reply: any) => {
    const { password } = request.body as { password?: string };

    if (!password) {
      return reply.code(400).send({ error: 'Пароль не указан' });
    }

    if (password === MANAGER_PASSWORD) {
      return { ok: true };
    }

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

    if (!hash) {
      return reply.code(401).send({ ok: false, error: 'Нет подписи' });
    }

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
        username: username,
      },
    };
  });

  // ─── Сохранить попытку ───
  app.post('/api/attempts', async (request: any, reply: any) => {
    const { score, total, profession, employeeName } = request.body as {
      score?: number;
      total?: number;
      profession?: string;
      employeeName?: string;
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
      },
    });

    return { ok: true, attemptId: attempt.id, percent, passed };
  });

  // ─── Статистика (с фильтрами: profession + employeeName) ───
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

  // ─── Все попытки (фильтры + лимит) ───
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
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  });

  // ─── Уникальные имена сотрудников (для выпадающего списка) ───
  app.get('/api/employees', async () => {
    const attempts = await prisma.attempt.findMany({
      select: { employeeName: true },
      distinct: ['employeeName'],
      orderBy: { employeeName: 'asc' },
    });

    return attempts.map(a => a.employeeName);
  });

  // ─── Рейтинг: топ-10 сотрудников по среднему проценту ───
  app.get('/api/rating', async () => {
    const attempts = await prisma.attempt.findMany({
      select: {
        employeeName: true,
        score: true,
        total: true,
        passed: true,
      },
    });

    // Группируем по имени
    const byName: Record<
      string,
      { attempts: number; passed: number; totalPercent: number }
    > = {};

    for (const a of attempts) {
      if (!byName[a.employeeName]) {
        byName[a.employeeName] = { attempts: 0, passed: 0, totalPercent: 0 };
      }
      const percent = a.total === 0 ? 0 : (a.score / a.total) * 100;
      byName[a.employeeName].attempts += 1;
      byName[a.employeeName].totalPercent += percent;
      if (a.passed) byName[a.employeeName].passed += 1;
    }

    const rating = Object.entries(byName).map(([name, data]) => ({
      name,
      attempts: data.attempts,
      passed: data.passed,
      avgPercent: Math.round(data.totalPercent / data.attempts),
    }));

    // Сортируем по среднему проценту
    rating.sort((a, b) => b.avgPercent - a.avgPercent);

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