# 名言マスタ

- ファイル名: `{YYYYMM}_{通番}.csv`（例: `202608_01.csv` = 2026年8月の1本目）
- 各行の `id`: `{YYYYMM}_{01からの通番}`。マスタ全件で一意。端末の `quoteId` も同じ値を使う
- 列: `id,quote,description,category,source`
- `category`: `cheer` / `calm` / `forward` / `accept`
