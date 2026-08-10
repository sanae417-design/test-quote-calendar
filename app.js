(() => {
  const WEEKDAYS = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

  // quotes.csv と同じ内容を埋め込み、起動時にメモリへ展開する（file:// でも動作）
  // CSV_EMBED_START
  const CSV_TEXT = `名言,説明文
今日という日は、二度とやってこない。,一日一日を大切に過ごすことの大切さを伝える言葉です。小さな一歩でも、今日踏み出せば未来が変わります。
失敗は成功のもと。,うまくいかなかった経験も、次につながる学びになります。恐れずに挑戦する気持ちを後押ししてくれます。
千里の道も一歩から。,どんな大きな目標も、最初の一歩から始まります。焦らず、着実に進むことの大切さを思い出させてくれます。
笑う門には福来たる。,明るい気持ちでいると、良いことが集まりやすいという意味です。笑顔は自分も周りも温かくしてくれます。
継続は力なり。,毎日少しずつ続けることが、やがて大きな力になります。習慣の積み重ねが自信と成果を育てます。
運動をしよう,運動をするといいことがあるよ
料理をしよう,料理をするといいことがあるかも？
掃除をしよう,掃除をすると気分が明るくなります。
`;
  // CSV_EMBED_END

  const dateLabel = document.getElementById("dateLabel");
  const weekdayLabel = document.getElementById("weekdayLabel");
  const quoteText = document.getElementById("quoteText");
  const descriptionText = document.getElementById("descriptionText");
  const quoteButton = document.getElementById("quoteButton");

  /** @type {{ quote: string, description: string }[]} */
  let quotes = [];
  let lastIndex = -1;

  function formatToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    dateLabel.textContent = `${year}年${month}月${day}日`;
    weekdayLabel.textContent = WEEKDAYS[now.getDay()];
  }

  function parseCsv(text) {
    const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const rows = [];
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;

      const cells = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j += 1) {
        const char = line[j];
        if (char === '"') {
          if (inQuotes && line[j + 1] === '"') {
            current += '"';
            j += 1;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          cells.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      cells.push(current.trim());

      if (cells.length >= 2 && cells[0] && cells[1]) {
        rows.push({ quote: cells[0], description: cells[1] });
      }
    }
    return rows;
  }

  function loadQuotesIntoMemory() {
    quotes = parseCsv(CSV_TEXT);
  }

  function pickRandomIndex() {
    if (quotes.length === 0) return -1;
    if (quotes.length === 1) return 0;

    let next = Math.floor(Math.random() * quotes.length);
    while (next === lastIndex) {
      next = Math.floor(Math.random() * quotes.length);
    }
    return next;
  }

  function showQuote(animate = false) {
    const index = pickRandomIndex();
    if (index < 0) {
      quoteText.textContent = "名言を読み込めませんでした。";
      descriptionText.textContent = "埋め込みCSVデータを確認してください。";
      return;
    }

    const apply = () => {
      lastIndex = index;
      quoteText.textContent = quotes[index].quote;
      descriptionText.textContent = quotes[index].description;
      quoteText.classList.remove("is-updating");
      descriptionText.classList.remove("is-updating");
    };

    if (!animate) {
      apply();
      return;
    }

    quoteText.classList.add("is-updating");
    descriptionText.classList.add("is-updating");
    window.setTimeout(apply, 220);
  }

  quoteButton.addEventListener("click", () => {
    showQuote(true);
  });

  formatToday();
  loadQuotesIntoMemory();
  showQuote(false);
})();
