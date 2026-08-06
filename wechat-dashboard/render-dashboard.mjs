import fs from "node:fs";

const payload = JSON.parse(fs.readFileSync(new URL("./data.json", import.meta.url), "utf8"));
const articles = Array.isArray(payload.articles) ? payload.articles : [];
const summary = payload.summary || {};
const esc = (value) => String(value ?? "").replaceAll("|", "\\|").replace(/[\r\n]+/g, " ").trim();
const num = (value) => new Intl.NumberFormat("zh-CN").format(Number(value) || 0);
const pct = (value) => `${((Number(value) || 0) * 100).toFixed(1)}%`;
const day = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? esc(value).slice(0, 10) : parsed.toISOString().slice(0, 10);
};
const syncTime = payload.latestSync?.finishedAt
  ? new Date(payload.latestSync.finishedAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false })
  : "等待首次自动同步";

const rows = articles
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  .map((article) => `| ${day(article.publishedAt)} | [${esc(article.title)}](${article.contentUrl}) | ${esc(article.category || "待分类")} | ${esc(article.summary || article.digest || "")} | ${num(article.readUser)} | ${num(article.shareUser)} | ${num(article.zaikanUser)} / ${num(article.likeUser)} | ${article.readFinishRate ? pct(article.readFinishRate) : "—"} | ${esc(article.status || "已发布")} |`)
  .join("\n");

const output = `# 创非凡AI全域服务｜公众号内容动态表

> 公开查看 · 全量回溯 · 最近成功同步（北京时间）：${syncTime}  
> 系统每 5 分钟检查一次；微信接口不可用时会保留上一次已核验数据。刷新浏览器即可查看最新结果。

| 已收录推文 | 累计阅读人数 | 累计分享人数 | 阅读后关注 | 平均读完率 |
| ---: | ---: | ---: | ---: | ---: |
| ${num(summary.articleCount ?? articles.length)} | ${num(summary.readUser)} | ${num(summary.shareUser)} | ${num(summary.readSubscribeUser)} | ${pct(summary.avgFinishRate)} |

## 内容明细

| 发布日期 | 推文标题 | 分类 | 内容总结 | 阅读 | 分享 | 在看 / 点赞 | 读完率 | 状态 |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
${rows || "| — | 暂无内容 | — | — | 0 | 0 | 0 / 0 | — | — |"}

---

数据由自动任务整理。微信官方未开放或尚未结算的传播指标会显示为 0 或“—”。  
页面由 [GitHub Actions](https://github.com/Evelyn-Zzzzzz/feifan-ai-h5/actions) 自动维护。
`;

fs.writeFileSync(new URL("../WECHAT_DASHBOARD.md", import.meta.url), output);
