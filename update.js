(() => {
  const csvInput = document.getElementById("csvInput");
  const appInput = document.getElementById("appInput");
  const csvName = document.getElementById("csvName");
  const appName = document.getElementById("appName");
  const previewMeta = document.getElementById("previewMeta");
  const previewList = document.getElementById("previewList");
  const updateButton = document.getElementById("updateButton");
  const downloadCsvButton = document.getElementById("downloadCsvButton");
  const status = document.getElementById("status");

  let csvText = "";
  let appText = "";
  let appHandle = null;

  const EMBED_BLOCK_RE =
    /\/\/ CSV_EMBED_START\r?\n[\s\S]*?\/\/ CSV_EMBED_END/;

  function setStatus(message, type = "") {
    status.textContent = message;
    status.classList.remove("is-ok", "is-err");
    if (type) status.classList.add(type);
  }

  function normalizeCsv(text) {
    return text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trimEnd() + "\n";
  }

  function escapeForTemplateLiteral(text) {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");
  }

  function parsePreviewRows(text) {
    const lines = text.trim().split("\n");
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

      if (cells[0]) {
        rows.push({
          quote: cells[0],
          description: cells[1] || "",
        });
      }
    }
    return rows;
  }

  function renderPreview() {
    previewList.innerHTML = "";
    if (!csvText) {
      previewMeta.textContent = "CSVを選択すると内容を確認できます。";
      return;
    }

    const rows = parsePreviewRows(csvText);
    previewMeta.textContent = `${rows.length} 件の名言を読み込みました。`;
    rows.forEach((row) => {
      const li = document.createElement("li");
      li.textContent = row.quote;
      if (row.description) {
        const span = document.createElement("span");
        span.textContent = row.description;
        li.appendChild(span);
      }
      previewList.appendChild(li);
    });
  }

  function refreshButtons() {
    const ready = Boolean(csvText && appText);
    updateButton.disabled = !ready;
    downloadCsvButton.disabled = !csvText;
  }

  function buildEmbedBlock(normalizedCsv) {
    const body = escapeForTemplateLiteral(normalizedCsv);
    return [
      "// CSV_EMBED_START",
      "  const CSV_TEXT = `" + body + "`;",
      "  // CSV_EMBED_END",
    ].join("\n");
  }

  function buildUpdatedAppJs(currentAppText, normalizedCsv) {
    if (!EMBED_BLOCK_RE.test(currentAppText)) {
      throw new Error("app.js 内に // CSV_EMBED_START ～ // CSV_EMBED_END が見つかりません。");
    }
    return currentAppText.replace(EMBED_BLOCK_RE, buildEmbedBlock(normalizedCsv));
  }

  function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function writeWithHandle(handle, text) {
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();
  }

  csvInput.addEventListener("change", async () => {
    const file = csvInput.files?.[0];
    if (!file) return;

    csvText = normalizeCsv(await file.text());
    csvName.textContent = file.name;
    renderPreview();
    refreshButtons();
    setStatus("");
  });

  appInput.addEventListener("change", async () => {
    const file = appInput.files?.[0];
    if (!file) return;

    appText = await file.text();
    appName.textContent = file.name;
    appHandle = null;
    refreshButtons();
    setStatus("");
  });

  updateButton.addEventListener("click", async () => {
    try {
      if (!csvText || !appText) {
        throw new Error("CSV と app.js の両方を選択してください。");
      }

      const rows = parsePreviewRows(csvText);
      if (rows.length === 0) {
        throw new Error("CSVに有効な名言行がありません。");
      }

      const updated = buildUpdatedAppJs(appText, csvText);

      if (window.showSaveFilePicker) {
        const handle =
          appHandle ||
          (await window.showSaveFilePicker({
            suggestedName: "app.js",
            types: [
              {
                description: "JavaScript",
                accept: { "text/javascript": [".js"] },
              },
            ],
          }));
        await writeWithHandle(handle, updated);
        appHandle = handle;
        appText = updated;
        setStatus(`app.js を更新しました（${rows.length} 件）。`, "is-ok");
      } else {
        downloadText("app.js", updated, "text/javascript;charset=utf-8");
        appText = updated;
        setStatus(`app.js をダウンロードしました（${rows.length} 件）。元ファイルと置き換えてください。`, "is-ok");
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        setStatus("保存がキャンセルされました。");
        return;
      }
      console.error(error);
      setStatus(error.message || "更新に失敗しました。", "is-err");
    }
  });

  downloadCsvButton.addEventListener("click", () => {
    if (!csvText) return;
    downloadText("quotes.csv", csvText, "text/csv;charset=utf-8");
    setStatus("quotes.csv をダウンロードしました。", "is-ok");
  });
})();
