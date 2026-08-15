(() => {
  const WEEKDAYS = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const STORAGE_KEY = "dailyQuotes.v1";
  const HISTORY_LIMIT = 100;
  const MASTER_URL = "data/202608_01.csv";
  const CATEGORY_IDS = ["cheer", "calm", "forward", "accept"];

  const CATEGORIES = {
    cheer: { label: "元気がほしい", tone: "warm" },
    calm: { label: "落ち着きたい", tone: "teal" },
    forward: { label: "前を向きたい", tone: "amber" },
    accept: { label: "自分を認めたい", tone: "violet" },
  };

  // data/202608_01.csv と同じ内容（file:// でも動作）
  // CSV_EMBED_START
  const CSV_TEXT = `id,quote,description,category,source
202608_01,今日の自分に、もう一度声をかけてみよう。,元気が出ない朝でも、小さな声かけが一日の温度を変えます。自分を応援する言葉は、誰より先に自分へ向けてよいのです。,cheer,オリジナル
202608_02,急がなくていい。呼吸はまだここにある。,焦りで頭がいっぱいのときは、今の呼吸に戻ると心が静まります。速さより、ここにいる感覚を先に取り戻しましょう。,calm,オリジナル
202608_03,最初の一歩は、完走より勇敢だ。,始める前がいちばん勇気が要ります。小さく踏み出せば、道はあとから見えてきます。,forward,オリジナル
202608_04,足りないところも、今日の自分の一部だ。,欠けていると感じる部分を消さなくても、あなたはここにいてよいのです。受け入れたところから、やさしい気持ちが戻ってきます。,accept,オリジナル
202608_05,小さな元気は、積み重ねても壊れない。,大きな活力がなくても、短い散歩や一杯の温かい飲み物で十分です。小さな元気を重ねることが、回復の近道になります。,cheer,オリジナル
202608_06,考えすぎた頭は、肩の力を抜けば静まる。,不安は肩や顎に残りやすいものです。一度力を抜くと、思考の音も小さくなります。,calm,オリジナル
202608_07,未完成のままで、扉を開けてよい。,準備がすべて揃うのを待つと、始め時を逃します。未完成でも進むことが、次の自分を連れてきます。,forward,オリジナル
202608_08,うまくやれなかった日を、否定しなくていい。,成果が出ない日も、あなたの価値は減りません。その日を責めるより、まず「今日も来た」と認めてあげましょう。,accept,オリジナル
202608_09,立ち止まった足も、まだ前を向いている。,休めている自分を、後退だと決めつけないでください。向きが前なら、また歩き出せます。,cheer,オリジナル
202608_10,今この部屋の音だけを、数えてみる。,頭の中の会話を止める必要はありません。外の音を数えるだけで、心は一段やわらかくなります。,calm,オリジナル
202608_11,昨日の続きではなく、今日の一ページを書く。,昨日の失敗を引きずらなくても、今日は新しいページです。一行だけでよいので、自分の手で書いてみましょう。,forward,オリジナル
202608_12,比べる相手を、自分の昨日に戻す。,他人の速さは、あなたの道しるべではありません。昨日の自分より少し楽なら、それは前進です。,accept,オリジナル
202608_13,笑顔は、先に作ってもいい。,気分が追いつく前に、口角を上げても構いません。小さな笑顔が、元気の入口になることがあります。,cheer,オリジナル
202608_14,答えは、焦ると遠ざかる。,急いで結論を出すほど、本当に欲しい答えは見えにくくなります。一拍おくことが、近道になる夜もあります。,calm,オリジナル
202608_15,遠回りも、地図の一部になる。,まっすぐ行けなかった道も、あとから見ると必要な線です。寄り道を、無駄だと切り捨てないでください。,forward,オリジナル
202608_16,休むことは、諦めることではない。,立ち止まることは、終わりの合図ではありません。力を戻すための、いちばん誠実な選択です。,accept,オリジナル
202608_17,疲れた日ほど、温かい一杯を自分に。,頑張りの続きより、まず体を労わることが元気の土台です。自分への一杯は、立派な回復です。,cheer,オリジナル
202608_18,波は引く。今日のざわめきも同じ。,強い感情は、ずっと岸に居座りません。今のざわめきも、時間とともに形を変えていきます。,calm,オリジナル
202608_19,勇気は、準備が揃ってから来ない。,揃ってから動こうとすると、勇気は後回しになります。先に一歩出すと、準備はあとからついてきます。,forward,オリジナル
202608_20,弱さを隠さなくても、あなたはここにいていい。,強い自分だけを見せる必要はありません。弱い夜も、あなたの一部としてここに置いておけます。,accept,オリジナル
202608_21,うまくいかない朝も、夜には別の自分でいられる。,朝の不調が一日を決めつける必要はありません。夜の自分は、朝と違っていてよいのです。,cheer,オリジナル
202608_22,一拍おく勇気が、いちばんの速さになることもある。,止まると遅れそうで怖いときほど、一呼吸が進路を整えます。速さは、焦りとは別のものです。,calm,オリジナル
202608_23,小さく始めて、大きく続く。,壮大な計画より、今日できる一手が続きを作ります。小さな開始が、大きな持続になります。,forward,オリジナル
202608_24,できたことより、ここにいることを先に認める。,成果の前に、今日まで来た自分を認めてください。存在を認めることが、次の行動の土台です。,accept,オリジナル
202608_25,応援は、自分から始めてよい。,誰かの声を待つ前に、自分の肩を叩いてあげましょう。自分への応援は、遠慮しなくて大丈夫です。,cheer,オリジナル
202608_26,夜の暗さは、休みの合図。,暗さを敵にしないでください。休むタイミングを知らせる、やさしい合図です。,calm,オリジナル
202608_27,次の自分は、今日の選択の隣にいる。,未来の自分は遠い場所にはいません。今日選んだ一歩のすぐ隣に、もう立っています。,forward,オリジナル
202608_28,完璧でない朝も、あなたの朝だ。,整わない朝を失敗だと思わなくてよいのです。不完全なまま始まる一日も、ちゃんとあなたの一日です。,accept,オリジナル
202608_29,光は、窓を開けた側から入る。,閉じたまま待つのではなく、少しだけ窓を開けてみましょう。元気は、開いた隙間から入ってきます。,cheer,オリジナル
202608_30,整えなくていい。まず座って、息を吐く。,部屋も予定も、今すぐ完璧にしなくて大丈夫です。座って息を吐くことが、いちばん最初の整頓です。,calm,オリジナル
`;
  // CSV_EMBED_END

  const els = {
    dailyView: document.getElementById("dailyView"),
    monthlyView: document.getElementById("monthlyView"),
    likedView: document.getElementById("likedView"),
    dateLabel: document.getElementById("dateLabel"),
    weekdayLabel: document.getElementById("weekdayLabel"),
    categoryChip: document.getElementById("categoryChip"),
    quoteText: document.getElementById("quoteText"),
    descriptionText: document.getElementById("descriptionText"),
    likeButton: document.getElementById("likeButton"),
    backToTodayButton: document.getElementById("backToTodayButton"),
    monthlyOpenButton: document.getElementById("monthlyOpenButton"),
    likedOpenButton: document.getElementById("likedOpenButton"),
    monthLabel: document.getElementById("monthLabel"),
    monthGrid: document.getElementById("monthGrid"),
    legend: document.getElementById("legend"),
    prevMonthButton: document.getElementById("prevMonthButton"),
    nextMonthButton: document.getElementById("nextMonthButton"),
    monthlyToDailyButton: document.getElementById("monthlyToDailyButton"),
    likedBackButton: document.getElementById("likedBackButton"),
    likedEmpty: document.getElementById("likedEmpty"),
    likedList: document.getElementById("likedList"),
  };

  /** @type {{ id: string, quote: string, description: string, category: string, source: string }[]} */
  let master = [];
  let state = emptyState();
  let view = "daily";
  let previousView = "daily";
  let selectedDate = todayKey();
  let monthCursor = monthStart(new Date());

  function emptyState() {
    return {
      version: 1,
      historyLimit: HISTORY_LIMIT,
      quoteState: {},
      days: {},
    };
  }

  function todayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function parseDateKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function monthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function formatDateLabel(key) {
    const date = parseDateKey(key);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
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

      const [id, quote, description, category, source = ""] = cells;
      if (id && quote && description && CATEGORY_IDS.includes(category)) {
        rows.push({ id, quote, description, category, source });
      }
    }
    return rows;
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return emptyState();
      return {
        version: 1,
        historyLimit: Number(parsed.historyLimit) || HISTORY_LIMIT,
        quoteState: parsed.quoteState && typeof parsed.quoteState === "object" ? parsed.quoteState : {},
        days: parsed.days && typeof parsed.days === "object" ? parsed.days : {},
      };
    } catch {
      return emptyState();
    }
  }

  function saveState() {
    evictOldDays();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function evictOldDays() {
    const limit = state.historyLimit || HISTORY_LIMIT;
    const keys = Object.keys(state.days).sort();
    while (keys.length > limit) {
      const oldest = keys.shift();
      delete state.days[oldest];
    }
  }

  function isUsed(id) {
    return Boolean(state.quoteState[id]?.used);
  }

  function markUsed(id) {
    state.quoteState[id] = { used: true };
  }

  function resetUsedExcept(keepId) {
    state.quoteState = {};
    if (keepId) markUsed(keepId);
  }

  function pickUnusedQuote() {
    const availableIds = new Set(master.map((item) => item.id));
    let pool = master.filter((item) => !isUsed(item.id));

    if (pool.length === 0) {
      resetUsedExcept(null);
      pool = master.slice();
    }

    pool = pool.filter((item) => availableIds.has(item.id));
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function assignTodayIfNeeded() {
    const today = todayKey();
    if (state.days[today]) return;

    const picked = pickUnusedQuote();
    if (!picked) return;

    state.days[today] = {
      quoteId: picked.id,
      quote: picked.quote,
      description: picked.description,
      category: picked.category,
      source: picked.source || "",
      liked: false,
    };
    markUsed(picked.id);
    saveState();
  }

  function getRecord(dateKey) {
    return state.days[dateKey] || null;
  }

  function likedCards() {
    /** @type {Map<string, { quoteId: string, quote: string, description: string, category: string, date: string }>} */
    const latest = new Map();
    Object.keys(state.days)
      .sort()
      .forEach((date) => {
        const rec = state.days[date];
        if (!rec?.liked) return;
        latest.set(rec.quoteId, {
          quoteId: rec.quoteId,
          quote: rec.quote,
          description: rec.description,
          category: rec.category,
          date,
        });
      });
    return [...latest.values()].sort((a, b) => b.date.localeCompare(a.date));
  }

  function showView(name) {
    view = name;
    els.dailyView.hidden = name !== "daily";
    els.monthlyView.hidden = name !== "monthly";
    els.likedView.hidden = name !== "liked";
    els.likedOpenButton.hidden = name === "liked";
  }

  function renderDaily() {
    const today = todayKey();
    const isToday = selectedDate === today;
    const rec = getRecord(selectedDate);
    const date = parseDateKey(selectedDate);

    els.dateLabel.textContent = formatDateLabel(selectedDate);
    els.weekdayLabel.textContent = WEEKDAYS[date.getDay()];
    els.backToTodayButton.hidden = isToday;
    els.likeButton.hidden = !isToday || !rec;

    if (!rec) {
      els.quoteText.textContent = "この日の記録はありません";
      els.descriptionText.textContent = "";
      els.categoryChip.hidden = true;
      return;
    }

    const meta = CATEGORIES[rec.category];
    els.categoryChip.hidden = false;
    els.categoryChip.textContent = meta ? meta.label : rec.category;
    els.categoryChip.dataset.category = rec.category;
    els.quoteText.textContent = rec.quote;
    els.descriptionText.textContent = rec.description;
    els.likeButton.textContent = rec.liked ? "響いた" : "心に響いた";
    els.likeButton.classList.toggle("is-on", Boolean(rec.liked));
    els.likeButton.setAttribute("aria-pressed", rec.liked ? "true" : "false");
  }

  function renderLegend() {
    els.legend.innerHTML = "";
    const seen = document.createElement("li");
    seen.textContent = "見た";
    seen.className = "legend-item is-seen";
    const liked = document.createElement("li");
    liked.textContent = "響いた";
    liked.className = "legend-item is-liked";
    els.legend.append(seen, liked);

    CATEGORY_IDS.forEach((id) => {
      const li = document.createElement("li");
      li.className = `legend-item cat-${id}`;
      li.textContent = CATEGORIES[id].label;
      els.legend.appendChild(li);
    });
  }

  function renderMonthly() {
    const today = todayKey();
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    els.monthLabel.textContent = `${year}年${month + 1}月`;

    const todayDate = parseDateKey(today);
    const canGoNext =
      year < todayDate.getFullYear() ||
      (year === todayDate.getFullYear() && month < todayDate.getMonth());
    els.nextMonthButton.disabled = !canGoNext;

    els.monthGrid.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i += 1) {
      const empty = document.createElement("div");
      empty.className = "day-cell is-empty";
      empty.setAttribute("aria-hidden", "true");
      els.monthGrid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = todayKey(new Date(year, month, day));
      const rec = getRecord(key);
      const isFuture = key > today;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "day-cell";
      button.textContent = String(day);
      button.disabled = isFuture;

      if (key === today) button.classList.add("is-today");
      if (rec) {
        button.classList.add(`cat-${rec.category}`);
        button.classList.add(rec.liked ? "is-liked" : "is-seen");
      }
      if (!isFuture) {
        button.addEventListener("click", () => {
          selectedDate = key;
          showView("daily");
          renderDaily();
        });
      }
      els.monthGrid.appendChild(button);
    }
  }

  function renderLiked() {
    const cards = likedCards();
    els.likedEmpty.hidden = cards.length > 0;
    els.likedList.innerHTML = "";

    cards.forEach((card) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `liked-card cat-${card.category}`;
      const label = CATEGORIES[card.category]?.label || card.category;
      button.innerHTML = "";
      const cat = document.createElement("span");
      cat.className = "liked-card-cat";
      cat.textContent = label;
      const quote = document.createElement("span");
      quote.className = "liked-card-quote";
      quote.textContent = card.quote;
      const date = document.createElement("span");
      date.className = "liked-card-date";
      date.textContent = formatDateLabel(card.date);
      button.append(cat, quote, date);
      button.addEventListener("click", () => {
        selectedDate = card.date;
        showView("daily");
        renderDaily();
      });
      els.likedList.appendChild(button);
    });
  }

  function render() {
    if (view === "daily") renderDaily();
    if (view === "monthly") renderMonthly();
    if (view === "liked") renderLiked();
  }

  function syncToday() {
    const today = todayKey();
    assignTodayIfNeeded();
    if (view === "daily" && selectedDate !== today && !getRecord(selectedDate)) {
      selectedDate = today;
    }
    if (selectedDate > today) selectedDate = today;
    render();
  }

  els.likeButton.addEventListener("click", () => {
    const today = todayKey();
    const rec = getRecord(today);
    if (!rec || selectedDate !== today) return;
    rec.liked = !rec.liked;
    saveState();
    renderDaily();
  });

  els.monthlyOpenButton.addEventListener("click", () => {
    monthCursor = monthStart(parseDateKey(todayKey()));
    showView("monthly");
    renderMonthly();
  });

  els.monthlyToDailyButton.addEventListener("click", () => {
    selectedDate = todayKey();
    showView("daily");
    renderDaily();
  });

  els.backToTodayButton.addEventListener("click", () => {
    selectedDate = todayKey();
    renderDaily();
  });

  els.likedOpenButton.addEventListener("click", () => {
    previousView = view;
    showView("liked");
    renderLiked();
  });

  els.likedBackButton.addEventListener("click", () => {
    showView(previousView === "liked" ? "daily" : previousView);
    render();
  });

  els.prevMonthButton.addEventListener("click", () => {
    monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1);
    renderMonthly();
  });

  els.nextMonthButton.addEventListener("click", () => {
    const today = parseDateKey(todayKey());
    const next = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
    if (next > new Date(today.getFullYear(), today.getMonth(), 1)) return;
    monthCursor = next;
    renderMonthly();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") syncToday();
  });
  window.addEventListener("focus", syncToday);

  async function loadMaster() {
    try {
      const response = await fetch(MASTER_URL);
      if (response.ok) {
        const text = await response.text();
        const rows = parseCsv(text);
        if (rows.length) return rows;
      }
    } catch {
      // file:// などでは埋め込みを使う
    }
    return parseCsv(CSV_TEXT);
  }

  async function start() {
    master = await loadMaster();
    state = loadState();
    if (!state.historyLimit) state.historyLimit = HISTORY_LIMIT;
    renderLegend();
    assignTodayIfNeeded();
    selectedDate = todayKey();
    showView("daily");
    renderDaily();

    if (!master.length) {
      els.quoteText.textContent = "名言を読み込めませんでした。";
      els.descriptionText.textContent = "data フォルダのマスタCSVを確認してください。";
    }
  }

  start();
})();
