import fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const app = fastify({ logger: true });
const prisma = new PrismaClient();

const MANAGER_PASSWORD = '11111';

async function start() {
  await app.register(cors, { origin: true });

  // Отдать вопросы (с isCorrect для подсветки на клиенте)
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
    return shuffled.slice(0, limit);
  });

  // Проверка пароля руководителя
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

  // Сохранить попытку
  app.post('/api/attempts', async (request: any, reply: any) => {
    const { score, total, profession } = request.body as {
      score?: number;
      total?: number;
      profession?: string;
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
      },
    });

    return { ok: true, attemptId: attempt.id, percent, passed };
  });

  // Статистика (с опциональным фильтром по профессии)
  app.get('/api/stats', async (request: any) => {
    const { profession } = request.query as { profession?: string };

    const where = profession && profession !== 'all' ? { profession } : {};

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

  // Все попытки (с фильтром + лимит)
  app.get('/api/attempts', async (request: any) => {
    const { profession, limit } = request.query as {
      profession?: string;
      limit?: string;
    };

    const where = profession && profession !== 'all' ? { profession } : {};
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

  // Health-check (Render использует его для проверки, что сервер жив)
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