import express from 'express';
import fs from 'fs'; // файлсистем - чтобы писать и читать жсоны
import path from 'path'; // чтобы найти жсоны в папке с утилкой
import { exec } from 'child_process'; //чтобы открыть браузер
import mathExpression from '@emmetio/math-expression'; //библиотека для расчета по формулам
const evaluate = mathExpression.default || mathExpression; //почему-то импортировалась как обьект, развернули


const app = express();
app.use(express.json());

// Жсон-файлы ищем в папке, откуда запущен
const CONFIG_PATH   = path.join(process.cwd(), 'config.json');
const READINGS_PATH = path.join(process.cwd(), 'readings.json');


// Функции работы с жсонами
const readJson  = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2), 'utf8');

// Функция расчёта
function calculate(config, previous, current) {
    const prev = previous ?? {};
    const round2 = n => Math.round(n * 100) / 100;

    const diffs = {};
    const costs = {};
    let total = 0;

    //Проход первый, считаем диффы для всех счётчиков
    for (const [key, service] of Object.entries(config.services)) {
        if (service.type !== 'meter') continue;

        const field = service.field ?? key;
        const curr = current[field] ?? 0;
        const prevVal = prev[field] ?? 0;

        diffs[`diff_${key}`] = curr - prevVal;
    }

    // Проход второй - считаем производные и стоимости|
    for (const [key, service] of Object.entries(config.services)) {
        let diff;

        if (service.type === 'meter') {
            diff = diffs[`diff_${key}`];
        } else if (service.type === 'derived') {
            const filled = service.formula.replace( // Подставляем значения diff_* в строку формулы
                /\bdiff_\w+\b/g,
                (name) => diffs[name] ?? 0
            );
            diff = evaluate(filled);
            diffs[`diff_${key}`] = diff;
        } else {
            continue;
        }

        const cost = round2(diff * service.price);
        costs[`cost_${key}`] = cost;
        total += cost;
    }

    return { diffs, costs, total: round2(total) };
}




// Отдать конфиг + последнее показание + историю
app.get('/api/data', (req, res) => {
  const config   = readJson(CONFIG_PATH);
  const readings = readJson(READINGS_PATH);
  res.json({ config, last: readings.at(-1) ?? null, history: readings });
});

// Предпросмотр расчёта (без сохранения)
app.post('/api/calculate', (req, res) => {
  const config   = readJson(CONFIG_PATH);
  const readings = readJson(READINGS_PATH);
  res.json(calculate(config, readings.at(-1)?.values, req.body));
});

// Сохранить новое показание
app.post('/api/save', (req, res) => {
  const config   = readJson(CONFIG_PATH);
  const readings = readJson(READINGS_PATH);
  const result   = calculate(config, readings.at(-1)?.values, req.body);

  readings.push({
    date: new Date().toISOString().slice(0, 10),
    values: req.body,
    total: result.total
  });
  writeJson(READINGS_PATH, readings);
  res.json({ saved: true, ...result });
});

app.use(express.static('.')); // отдаёт index.html

app.listen(3000, () => {
  const url = 'http://localhost:3000';
  const cmd = process.platform === 'win32'  ? `start ${url}`
            : process.platform === 'darwin' ? `open ${url}` //если не вин
            : `xdg-open ${url}`;
  exec(cmd); // открыть браузер
});