# Frozen Jackpot — структура

Тази директория съдържа цялата игра Frozen Jackpot в удобна поддиректория FrozenJackpotGame.

Структура:

- FrozenJackpotGame/
  - index.html — стартиращ файл
  - css/style.css — стилове
  - js/main.js — UI bootstrap и свързване
  - js/game.js — основна логика на играта
  - js/reel.js — модул за рил (spin logic)
  - js/storage.js — wrapper за localStorage
  - js/sound.js — WebAudio звуци

Как да пуснете:
- Сървирайте папката (python -m http.server) и отворете FrozenJackpotGame/index.html.

Ако желаете, мога да:
- преместя проекта в корена (ако предпочитате),
- добавя assets/ папка със спрайтове и изображения,
- добавя build скрипт или package.json.
