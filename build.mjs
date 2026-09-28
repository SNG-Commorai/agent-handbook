import fs from 'node:fs';
import crypto from 'node:crypto';
import MarkdownIt from 'markdown-it';

const sourceUrl = 'https://fcnj6tle53ti.feishu.cn/wiki/E198wVOmOiodK0ko4gPcL592nef';
const repoUrl = 'https://github.com/SNG-Commorai/agent-handbook';
const raw = fs.readFileSync('tutorial.md', 'utf8');
const config = JSON.parse(fs.readFileSync('site-config.json','utf8'));
// Repair Feishu's Markdown formatting escapes without editing the source prose or fenced prompts.
const prepared = raw.split(/(```[\s\S]*?```)/g).map((part,i)=>i%2 ? part : part
  .replaceAll('**subscription link **','**subscription link** ')
  .replaceAll(' ****填写以后 ****',' 填写以后 ')
  .replace(/https:\/\/justmysocks6\\\.net\/members\//g,'[https://justmysocks6.net/members/](https://justmysocks6.net/members/)')).join('');
const md = new MarkdownIt({html:false, linkify:true, typographer:false});
const esc = md.utils.escapeHtml;
const originalTokens = md.parse(prepared, {});
const headings = [];
const hierarchy = [];
for (let i = 0; i < originalTokens.length; i++) {
  const t = originalTokens[i];
  if (t.type !== 'heading_open') continue;
  const level = Number(t.tag.slice(1));
  const title = originalTokens[i+1].children.filter(x=>x.type==='text'||x.type==='code_inline').map(x=>x.content).join('');
  hierarchy.length = level - 1;
  hierarchy[level-1] = title;
  const id = level === 1 ? 'overview' : 's-' + crypto.createHash('sha1').update(hierarchy.join('/')).digest('hex').slice(0,10);
  t.attrSet('id',id);
  headings.push({id,title,level});
}
const attachmentBase = repoUrl + '/releases/download/tutorial-assets-20260928/';
const normalizeUrl = (href) => {
  return href;
};
for (const token of originalTokens) {
  for (const child of token.children || []) {
    if(child.type === 'image') {
      child.attrSet('src',normalizeUrl(child.attrGet('src')));
      child.attrSet('loading','lazy');
      child.attrSet('decoding','async');
      if(child.attrGet('src')==='./model-settings.jpg'){child.attrSet('width','1409');child.attrSet('height','841')}
      child.attrSet('alt','原文配图：模型与思考程度设置');
      child.children=[{type:'text',content:'原文配图：模型与思考程度设置'}];
    }
    if(child.type === 'link_open') child.attrSet('href',normalizeUrl(child.attrGet('href')));
  }
}
const codeFence = md.renderer.rules.fence;
md.renderer.rules.fence = (tokens, i, options, env, renderer) => {
  const lang = tokens[i].info.trim() || 'Text';
  return `<div class="code-panel"><div class="code-toolbar"><span>${esc(lang)}</span><button class="copy-code" type="button" aria-label="复制此段提示词或代码">复制</button></div>${codeFence(tokens,i,options,env,renderer)}</div>`;
};
// Keep the original introduction verbatim; move the original H1 to the page hero.
const h2Index = originalTokens.findIndex(t=>t.type==='heading_open'&&t.tag==='h2');
const intro = md.renderer.render(originalTokens.slice(3,h2Index),md.options,{});
const body = md.renderer.render(originalTokens.slice(h2Index),md.options,{});
const nav = headings.filter(h=>h.level===2||h.level===3).map(h=>h.level===2 ? `<div class="nav-group">${esc(h.title)}</div>` : `<a class="nav-link" href="#${h.id}">${esc(h.title)}</a>`).join('\n');
const chapters = headings.filter(h=>h.level===2);
const icon = (name) => {
 const paths={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',theme:'<path d="M20.9 13a9 9 0 0 1-9.9-9.9A9 9 0 1 0 20.9 13Z"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',external:'<path d="M14 4h6v6M20 4l-9 9M10 4H4v16h16v-6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',github:'<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.9c0-1 .1-1.4-.5-2 3.3-.4 6.8-1.6 6.8-7.3a5.6 5.6 0 0 0-1.5-3.9A5.2 5.2 0 0 0 19.7 1S18.4.6 15 2.5a13.4 13.4 0 0 0-7 0C4.6.6 3.3 1 3.3 1a5.2 5.2 0 0 0-.1 3.9 5.6 5.6 0 0 0-1.5 3.9c0 5.7 3.5 6.9 6.8 7.3-.5.5-.6 1-.5 2V22"/>'};
 return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};
const html = `<!doctype html>
<html lang="zh-CN" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark light"><meta name="description" content="Agent手册、提示词模板及后话。关于 AI 基础概念、Agent 工作区、技能配置与日常实践的持续更新教程。"><meta name="theme-color" content="#101214"><title>Agent手册、提示词模板及后话</title><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./style.css"><script>try{document.documentElement.dataset.theme=localStorage.getItem('agent-handbook-theme')||'dark'}catch{}</script><script src="./app.js" defer></script></head>
<body><a class="skip-link" href="#main">跳到正文</a><div class="reading-progress" aria-hidden="true"></div>
<header class="site-header"><a class="brand" href="#overview" aria-label="Agent Handbook 首页"><span class="brand-mark" aria-hidden="true">a<span>_</span></span><span>AGENT<span class="brand-light"> HANDBOOK</span></span></a><span class="header-caption">学习 · 实践 · 持续更新</span><div class="header-actions"><button type="button" class="search-trigger" aria-label="搜索教程">${icon('search')}<span>搜索教程</span><kbd>⌘ K</kbd></button><button type="button" class="icon-button" id="theme-toggle" aria-label="切换为浅色主题">${icon('theme')}</button><a class="icon-button github-link" href="${repoUrl}" aria-label="查看 GitHub 仓库">${icon('github')}</a><button type="button" class="icon-button mobile-menu" aria-label="展开章节目录" aria-expanded="false" aria-controls="sidebar">${icon('menu')}</button></div></header>
<aside class="sidebar" id="sidebar" aria-label="章节目录"><div class="sidebar-top"><span class="overline">THE HANDBOOK</span><span class="version-dot" aria-label="持续更新"></span></div><nav><a class="nav-link overview-link active" href="#overview">教程概览</a>${nav}</nav><div class="sidebar-bottom"><span class="status-label"><i></i> 持续撰写中</span><p>从一个概念开始，<br>到真正用起来。</p><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">飞书原稿 ${icon('external')}</a></div></aside><button type="button" class="menu-scrim" aria-label="关闭章节目录" hidden></button>
<div class="page-shell"><main id="main" tabindex="-1"><section class="hero" id="overview"><div class="hero-label"><span class="overline">NOTES ON WORKING WITH AI</span><span class="draft-badge">持续更新</span></div><h1>Agent手册、<br><span>提示词模板及后话</span></h1><div class="hero-line" aria-hidden="true"><span></span><i></i></div><div class="intro">${intro}</div><div class="quick-links">${chapters.map((h,i)=>`<a href="#${h.id}"><span class="chapter-index">0${i}</span><span>${esc(h.title.replace(/^\d+\./,''))}</span>${icon('arrow')}</a>`).join('')}</div><div class="hero-meta"><span>原文同步 <time datetime="2026-09-28">2026.09.28</time></span><a href="./tutorial.md" download>下载 Markdown ↓</a></div></section><article class="prose" aria-label="教程正文">${body}</article><footer class="article-footer"><div class="footer-rule"></div><span class="overline">TO BE CONTINUED</span><h2>未完，待续。</h2><p>这份手册仍在撰写中，后续内容将继续更新。</p><a href="#overview">回到开头 ↑</a></footer></main><aside class="page-outline" aria-label="当前章节导航"><div class="outline-inner"><span class="overline">本节目录</span><nav id="outline-nav"></nav><a class="source-link" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">查看飞书原稿 ${icon('external')}</a></div></aside></div>
<dialog id="search-dialog" aria-label="搜索教程"><div class="search-input-row">${icon('search')}<label class="sr-only" for="search-input">搜索关键词</label><input id="search-input" placeholder="搜索概念、提示词或章节…" autocomplete="off"><button type="button" class="icon-button" id="close-search" aria-label="关闭搜索">${icon('close')}</button></div><div id="search-status" role="status" aria-live="polite">输入关键词，搜索整份教程</div><div id="search-results"></div><div class="search-footer"><span>搜索正文及提示词</span><kbd>Esc 关闭</kbd></div></dialog><div id="announcement" class="sr-only" role="status" aria-live="polite"></div>
<script id="heading-data" type="application/json">${JSON.stringify(headings).replaceAll('<','\\u003c')}</script></body></html>`;
fs.writeFileSync('index.html',html.replace('datetime="2026-09-28">2026.09.28',`datetime="${esc(config.syncedAt)}">${esc(config.syncedAt.replaceAll('-','.'))}`));
fs.writeFileSync('content-manifest.json',JSON.stringify({source:sourceUrl,syncedAt:config.syncedAt,markdownSha256:crypto.createHash('sha256').update(raw).digest('hex'),headings,attachments:[{file:'model-settings.jpg',type:'image'},{file:'jamjams-0.2.1-installer.exe',url:attachmentBase+'jamjams-0.2.1-installer.exe'},{file:'Jamjams-2.4.4.dmg',url:attachmentBase+'Jamjams-2.4.4.dmg'}]},null,2)+'\n');
fs.writeFileSync('.nojekyll','');
console.log(`Built index.html: ${headings.length} headings, ${originalTokens.filter(x=>x.type==='fence').length} code blocks.`);
