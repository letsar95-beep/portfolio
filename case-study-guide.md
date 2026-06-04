# Гайд по страницам кейсов

Этот документ + файл `case-study.css` — всё, что нужно, чтобы новые кейсы сразу
были однородны по стилям, отступам, компонентам и адаптиву. Стили НЕ дублируются
в каждом HTML — они живут в `case-study.css`, а страница только подключает их.

---

## 1. Старт новой страницы

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Название кейса — Клиент</title>
<link rel="stylesheet" href="./case-study.css" />
</head>
<body>
<div class="page">
  <!-- содержимое -->
</div>
<!-- нужен только если на странице есть .carousel -->
<script src="./case-study.js"></script>
</body>
</html>
```

Правила:
- НИКОГДА не добавляй `<style>` в страницу и не пиши инлайн-`style="..."`.
  Любая правка отступа/цвета/шрифта делается в `case-study.css` — и применяется
  ко всем кейсам сразу.
- Всё содержимое — внутри `<div class="page">` (центрирование, max-width 1300px, поля).

---

## 2. Каркас страницы (порядок блоков)

```html
<a class="close-btn" href="./index.html">✕</a>

<header class="case-header">
  <h1>Заголовок кейса</h1>
  <p class="case-year">2024</p>
  <div class="case-meta-row">
    <span class="tag">Тег 1</span>
    <span class="tag">Тег 2</span>
    <a class="case-link" href="URL" target="_blank" rel="noopener">
      Лендинг <span class="arrow">↗</span>
    </a>
  </div>
</header>

<div class="hero">
  <img src="..." alt="..." />
</div>

<div class="info-row">
  <div class="info-col"><strong>Моя роль:</strong> …</div>
  <div class="info-col"><strong>Результат:</strong> …</div>
  <div class="info-col"><strong>Команда:</strong> …</div>
</div>

<hr class="divider" />

<div class="cards-row">
  <div class="card"><p class="card-label">Проблема</p><p class="card-body">…</p></div>
  <div class="card"><p class="card-label">Цель</p><p class="card-body">…</p></div>
</div>

<main>
  <section class="section">
    <h2>Заголовок секции</h2>
    <p class="body-text">…</p>
    <!-- галереи, подзаголовки, списки -->
  </section>
  <!-- ещё секции -->
</main>

<footer class="footer">
  <nav class="nav"> … ссылки … </nav>
</footer>
```

---

## 3. Компоненты и когда что использовать

| Класс | Назначение |
|---|---|
| `.close-btn` | Крестик закрытия. Прибит к верху (`position: fixed`), серый. |
| `.case-header` + `h1` | Заголовок кейса, 48px / Medium. |
| `.case-year` | Год, серый, 20px. |
| `.case-meta-row` + `.tag` | Бейджи категорий. Высота 41px, фон light-blue. |
| `.case-link` + `.arrow` | Ссылка на проект, прижата вправо (`margin-left:auto`), стрелка ↗. |
| `.hero` | Главное изображение под шапкой. |
| `.info-row` / `.info-col` | Три факта (роль / результат / команда). Заголовок — `<strong>`. |
| `.divider` | Линия-разделитель. |
| `.cards-row` + `.card` | Карточки «Проблема» (3fr) и «Цель» (2fr). |
| `.section` + `h2` | Смысловой раздел. Заголовок 30px / Medium. |
| `.body-text` | Основной абзац. 18px, цвет text-2, max-width 798px. |
| `.body-text.wide` | То же (зарезервировано), max-width 798px. |
| `.sub-heading` | Подзаголовок внутри секции, 24px. |
| `.styled-list` | Маркированный список (disc), max-width 798px. |
| `.url-link` | Ссылка-URL под заголовком, синяя, без подчёркивания (подчёркивается? нет — opacity на hover). |
| `.gallery.full` | Картинка/блок на всю ширину. |
| `.gallery.cols-2` | Две колонки на десктопе, схлопываются на планшете. |
| `.media` + `img` | Контейнер изображения со скруглением. |
| `.research-block` / `.research-img` | Большое исследование, ширина 770px. |
| `.footer` + `.nav` | Низ страницы со ссылками. |

Ссылки внутри текста: `<a>` внутри `.body-text` — синие, подчёркивание на hover.

---

## 4. Отступы (вертикальный ритм) — НЕ менять руками на странице

Отступы заданы как `margin-top` и через соседние селекторы (`A + B`). Главное:
не ставь свои `margin`/`<br>` — если ритм не тот, правь `case-study.css`.

Десктоп (база):
- `.case-header` сверху `76px`
- `h1 → .case-year` `24px`
- `.case-year → .case-meta-row` `28px`
- `.hero` сверху `34px`
- `.info-row` сверху `40px`
- `.divider` сверху `48px`
- `.cards-row` / `.section` сверху `80px`
- `h2 → .body-text` `24px`
- `.body-text → .body-text` `16px`
- `.body-text → .gallery` `40px`  •  `.gallery → .body-text` `80px`
- `.section h4` / `.sub-heading` сверху `40px`  •  `.sub-heading → .body-text` `16px`
- `.styled-list` сверху `16px`
- `.footer` сверху `120px`

---

## 5. Адаптив (брейкпоинты уже в CSS)

- **1100px** — поля страницы 48px.
- **900px (планшет)** — поля 32px; h1 40px; info-row → 2 колонки;
  cards-row → 2 колонки; h2 28px; `h2 → body-text` сжимается до 16px;
  `.gallery.cols-2` → одна колонка.
- **640px (мобилка)** — поля 16px; nav 14px; шапка сверху 36px; крестик `top:32px / right:16px`;
  h1 28px; бейджи 33px; info-row и cards-row → одна колонка;
  `.section` сверху 40px; h2 24px; `h2 → body-text` 8px; sub-heading/h4 20px;
  `body-text → gallery` 24px; `gallery → body-text` 72px; весь body-текст 16px;
  карточки padding 24px; галерея сверху 32px, gap 12px.

Все три ширины проверяй перед сдачей: desktop 1280, tablet 768, mobile 375.

---

## 5b. Гибкий слой — сборка под разную структуру

Структура внутри кейсов разная (две колонки с телефонами, сетки карточек,
центрированные секции, цветные подложки, карусели). Для этого есть набор
лейаут-примитивов — комбинируй их, **не пиши CSS под отдельную страницу**.

### Сетки — `.cols-2 / .cols-3 / .cols-4 / .cols-auto`
```html
<div class="cols cols-3">
  <div class="card">…</div>
  <div class="card">…</div>
  <div class="card">…</div>
</div>
```
`.gallery` тоже понимает `cols-2/3/4`. На планшете 3–4 колонки → 2, на мобилке → 1.
`.cols-auto` — «сколько влезет» (мин. 260px на элемент).

### Ряд в строку — `.row` (например, два телефона рядом)
```html
<div class="row middle">
  <div class="media"><img src="phone-1.png" /></div>
  <div class="media"><img src="phone-2.png" /></div>
</div>
```
Модификаторы: `.top` / `.middle` (выравнивание). На мобилке ряд → колонка.

### Центрированная секция — `.section.center`
Заголовок, интро и подзаголовки внутри секции выравниваются по центру
(как в кейсе «Маруся»).
```html
<section class="section center">
  <h2>Работа с диалогами</h2>
  <p class="body-text">…</p>
</section>
```

### Цветная/градиентная подложка — `.panel`
Фон задаётся **на странице** через переменную `--panel-bg`, чтобы у каждого
кейса был свой акцент (общий файл цвета не хардкодит):
```html
<!-- нейтральная серая подложка -->
<div class="panel"> … </div>

<!-- лёгкая голубая (готовый модификатор) -->
<div class="panel tint"> … </div>

<!-- кастомный градиент конкретного кейса -->
<div class="panel" style="--panel-bg: linear-gradient(135deg,#eef2ff,#e0e7ff)"> … </div>
```

### Карусель со стрелками — `.carousel` (+ `case-study.js`)
Подключи скрипт один раз в конце `<body>`: `<script src="./case-study.js"></script>`.
Стрелки оживают автоматически, размечать JS вручную не нужно.
```html
<div class="carousel">
  <button class="carousel-arrow prev" aria-label="Назад">‹</button>
  <div class="carousel-track">
    <div class="media"><img src="slide-1.png" /></div>
    <div class="media"><img src="slide-2.png" /></div>
  </div>
  <button class="carousel-arrow next" aria-label="Вперёд">›</button>
</div>
```
Стрелка автоматически прячется на краю (нет смысла листать дальше).

### Тонкая подстройка отступов — утилиты `.mt-*`
Если у конкретного кейса нестандартный ритм, не пиши инлайн-`style` и не правь
ядро — повесь утилиту: `.mt-0 .mt-8 .mt-16 .mt-24 .mt-40 .mt-56 .mt-80 .mt-120`.
```html
<div class="gallery full mt-40"> … </div>
```
Это «аварийный» инструмент: сначала проверь, не покрывает ли нужный отступ
обычный ритм из §4.

---

## 6. Контент-правила (то, что CSS не покрывает)

**Изображения — обязательно 2× (Retina).**
Экран Retina (devicePixelRatio = 2) требует исходник вдвое шире, чем место отображения,
иначе картинка выглядит размытой:
- блок во всю ширину контента (~1100px CSS) → экспорт ~2200px и больше;
- `.research-img` (770px CSS) → экспорт **1540px**.
Никаким CSS размытие низкого разрешения не лечится — только пересохранить из Figma в 2×.

**Не обрезай изображения по высоте.**
У `.media img` стоит `height: auto` и НЕ ставится `object-fit: cover` / `aspect-ratio`.
Картинка показывается целиком в своих пропорциях.

**Висячие предлоги.**
Короткие слова (предлоги, союзы, «я», «и», «но», «к», «с», «во») не должны висеть
в конце строки — связывай со следующим словом неразрывным пробелом `&nbsp;`.
Пример: `на&nbsp;сайте`, `во&nbsp;франшизу`, `с&nbsp;командой`.
> Важно: при правке такого текста через скрипты учитывай, что `&nbsp;` в файле
> хранится как символ U+00A0 (`\xa0`), а не как обычный пробел — обычный `replace`
> по пробелу его не найдёт.

**Тире и пунктуация.**
Единый стиль по всему кейсу (как в существующем франшиза-кейсе).

**Тексты внутри картинок.**
Если на макетах есть текст-аннотации (например «Гипотеза…») — проверяй, что картинка
лежит в правильном слоте: сопоставляй подпись на изображении с абзацем рядом.

---

## 7. Чек-лист перед сдачей кейса

- [ ] Подключён `case-study.css`, нет инлайн-`<style>`/`style="..."`.
- [ ] Порядок блоков как в каркасе (§2).
- [ ] Все картинки экспортированы в 2×, не размыты, не обрезаны.
- [ ] Висячие предлоги убраны (`&nbsp;`).
- [ ] Проверено на 1280 / 768 / 375 px.
- [ ] Крестик прибит к верху и не наезжает на контент.
- [ ] `alt` заполнен у всех изображений.
