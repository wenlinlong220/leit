/**
 * 精听笔记播放器 - player.html 专用
 * 功能：
 * 1. 从 URL 参数读取笔记文件路径并加载
 * 2. Markdown 渲染（支持 ==高亮== 语法）
 * 3. [点击听](url) 在页面内嵌入 iframe 播放新东方页面
 * 4. [老师解析](#) 上传本地音频播放老师解析
 */

// ========== 状态管理 ==========
const state = {
    audioMap: {},
    currentBtn: null,
    audioCounter: 0,
    teacherCounter: 0,
};

// ========== DOM 元素 ==========
const dom = {};

function initDom() {
    dom.markdownContent = document.getElementById('markdownContent');
    dom.globalPlayer = document.getElementById('globalPlayer');
    dom.globalAudio = document.getElementById('globalAudio');
    dom.playerLabel = document.getElementById('playerLabel');
    dom.closePlayer = document.getElementById('closePlayer');
    dom.noteTitle = document.getElementById('noteTitle');
    dom.pageTitle = document.getElementById('pageTitle');
}

// ========== Marked.js 配置 ==========
function setupMarked() {
    const renderer = new marked.Renderer();

    renderer.link = function (token) {
        const href = token.href || '';
        const text = token.text || '';

        // [点击听] → 内嵌 iframe 面板
        if (text === '点击听') {
            state.audioCounter++;
            const id = 'audio-btn-' + state.audioCounter;
            return `<button class="audio-play-btn" id="${id}" data-src="${href}" data-type="listen" onclick="openListenPanel(this)">
                <span class="icon">🔊</span> 点击听
            </button>`;
        }

        // [发音](单词) → 调用有道词典API播放单词发音
        if (text === '发音') {
            const word = href;
            const audioUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=1`;
            return `<button class="word-audio-btn" data-word="${word}" data-src="${audioUrl}" onclick="playWordAudio(this)" title="点击听 ${word} 的发音">
                🔈 ${word}
            </button>`;
        }

        // [老师解析] → 本地音频播放
        if (text === '老师解析') {
            state.teacherCounter++;
            const id = 'teacher-btn-' + state.teacherCounter;
            return `<button class="teacher-play-btn" id="${id}" data-src="${href}" data-type="teacher" onclick="playTeacherAudio(this)">
                <span class="icon">👨‍🏫</span> 老师解析
            </button>
            <label class="audio-upload-inline" title="上传老师解析音频">
                📁 上传解析音频
                <input type="file" accept="audio/*" onchange="bindLocalAudio(this, '${id}')">
            </label>`;
        }

        // 普通链接
        return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
    };

    marked.setOptions({
        renderer: renderer,
        breaks: true,
        gfm: true,
    });
}

// ========== Markdown 预处理 ==========
// 用于计数，保证每个输入框ID唯一
let fillCounter = 0;

function preprocessMarkdown(md) {
    // 把列表项中含有 ==词== 的行，转成挖空输入框
    // 策略：先处理整行，再替换 ==词==
    fillCounter = 0;

    // 逐行处理
    const lines = md.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // 如果这一行包含 ==...== 且是列表项（- 开头）
        if (/^(\s*-\s)(.*)==(.*?)==/.test(line)) {
            // 收集这行所有答案，生成 data-answers 属性
            const answers = [];
            const processedLine = line.replace(/==(.*?)==/g, (_, word) => {
                fillCounter++;
                const id = 'fill-' + fillCounter;
                const w = word.trim();
                answers.push({ id, word: w });
                const width = Math.max(w.length * 11 + 16, 60);
                return `<input class="fill-blank" id="${id}" data-answer="${w}" type="text" placeholder="?" style="width:${width}px" oninput="checkFill(this)" autocomplete="off" spellcheck="false">`;
            });

            // 生成答案按钮（data-fills 存所有 id）
            const ids = answers.map(a => a.id).join(',');
            const answerBtn = `<button class="show-answer-btn" onclick="showAnswers('${ids}')" title="显示答案">👁</button>`;

            // 把原行 ==...== 替换掉，末尾加答案按钮
            result.push(processedLine.replace(/^(\s*-\s)/, `$1`) + ' ' + answerBtn);
        } else {
            result.push(line);
        }
    }

    return result.join('\n');
}

// ========== 填空核对 ==========
function checkFill(input) {
    const answer = input.dataset.answer || '';
    if (input.value.trim().toLowerCase() === answer.toLowerCase()) {
        input.classList.add('fill-correct');
        input.classList.remove('fill-wrong');
    } else {
        input.classList.remove('fill-correct');
        input.classList.remove('fill-wrong');
    }
}

// ========== 显示答案 ==========
function showAnswers(ids) {
    ids.split(',').forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.value = input.dataset.answer;
        input.classList.add('fill-correct');
        input.classList.remove('fill-wrong');
    });
}

// ========== 渲染 Markdown ==========
function renderMarkdown(mdText) {
    state.audioCounter = 0;
    state.teacherCounter = 0;
    const processed = preprocessMarkdown(mdText);
    const html = marked.parse(processed);
    dom.markdownContent.innerHTML = html;
}

// ========== 点击听 → 打开 iframe 面板 ==========
function openListenPanel(btn) {
    const src = btn.dataset.src;

    if (!src || src === '#') {
        alert('没有提供有效的音频链接');
        return;
    }

    // 关闭已有面板
    const existing = document.getElementById('listen-panel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'listen-panel';
    panel.className = 'listen-panel';
    panel.innerHTML = `
        <div class="listen-panel-header">
            <span>🔊 句子播放 - 新东方精听</span>
            <div class="listen-panel-actions">
                <a href="${src}" target="_blank" class="listen-open-link" title="在新标签页打开">↗ 新窗口</a>
                <button class="listen-panel-close" onclick="closeListenPanel()">✕ 关闭</button>
            </div>
        </div>
        <div class="listen-panel-body">
            <iframe src="${src}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
        </div>
    `;

    btn.closest('li')?.after(panel) || btn.parentElement.after(panel);
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });

    document.querySelectorAll('.audio-play-btn').forEach(b => b.classList.remove('active-btn'));
    btn.classList.add('active-btn');
}

function closeListenPanel() {
    const panel = document.getElementById('listen-panel');
    if (panel) panel.remove();
    document.querySelectorAll('.audio-play-btn').forEach(b => b.classList.remove('active-btn'));
}

// ========== 老师解析播放 ==========
function playTeacherAudio(btn) {
    const label = '👨‍🏫 老师解析';

    if (state.currentBtn === btn && !dom.globalAudio.paused) {
        dom.globalAudio.pause();
        btn.classList.remove('playing');
        dom.playerLabel.textContent = '已暂停';
        return;
    }

    if (state.currentBtn && state.currentBtn !== btn) {
        state.currentBtn.classList.remove('playing');
    }

    state.currentBtn = btn;

    const localSrc = state.audioMap[btn.id];
    const audioSrc = localSrc || btn.dataset.src;

    if (!audioSrc || audioSrc === '#') {
        alert('请先点击旁边的"上传解析音频"按钮，上传老师的解析音频文件');
        return;
    }

    dom.globalAudio.src = audioSrc;
    dom.playerLabel.textContent = label;
    dom.globalPlayer.classList.add('active');

    dom.globalAudio.play().then(() => {
        btn.classList.add('playing');
    }).catch(err => {
        console.error('播放失败:', err);
        alert('音频播放失败，请上传本地音频文件。');
    });
}

// ========== 单词发音播放（有道API） ==========
function playWordAudio(btn) {
    const src = btn.dataset.src;
    const word = btn.dataset.word;

    // 创建一个临时audio播放
    const audio = new Audio(src);
    btn.classList.add('word-playing');

    audio.play().then(() => {
        audio.addEventListener('ended', () => {
            btn.classList.remove('word-playing');
        });
    }).catch(err => {
        console.error('单词发音播放失败:', err);
        btn.classList.remove('word-playing');
        alert(`单词 "${word}" 发音播放失败，可能是网络问题。`);
    });
}

// ========== 绑定本地音频 ==========
function bindLocalAudio(fileInput, btnId) {
    const file = fileInput.files[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    state.audioMap[btnId] = blobUrl;

    const btn = document.getElementById(btnId);
    if (btn) {
        btn.dataset.src = blobUrl;
        const label = fileInput.closest('.audio-upload-inline');
        if (label) {
            label.innerHTML = `✅ ${file.name}`;
            label.style.borderColor = '#2ec4b6';
            label.style.color = '#2ec4b6';
            label.style.cursor = 'default';
        }
    }
}

// ========== 初始化 ==========
function init() {
    initDom();
    setupMarked();

    // 从 URL 参数获取笔记文件路径
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    const title = params.get('title') || '精听笔记';

    // 设置标题
    dom.noteTitle.textContent = '🎧 ' + title;
    dom.pageTitle.textContent = title;
    document.title = title + ' - 精听听力';

    if (!file) {
        dom.markdownContent.innerHTML = `
            <div class="placeholder">
                <div class="placeholder-icon">❌</div>
                <p>未指定笔记文件</p>
                <a href="listening.html" class="btn btn-primary">返回列表</a>
            </div>`;
        return;
    }

    // 加载笔记文件
    fetch(file)
        .then(r => {
            if (!r.ok) throw new Error('文件不存在: ' + file);
            return r.text();
        })
        .then(md => {
            renderMarkdown(md);
        })
        .catch(err => {
            dom.markdownContent.innerHTML = `
                <div class="placeholder">
                    <div class="placeholder-icon">❌</div>
                    <p>加载失败: ${err.message}</p>
                    <p class="empty-tip">请确认文件 <code>${file}</code> 存在</p>
                    <br>
                    <a href="listening.html" class="btn btn-primary">返回列表</a>
                </div>`;
        });

    // 音频播放器事件
    dom.globalAudio.addEventListener('ended', () => {
        if (state.currentBtn) state.currentBtn.classList.remove('playing');
        dom.playerLabel.textContent = '播放完毕';
    });

    dom.closePlayer.addEventListener('click', () => {
        dom.globalAudio.pause();
        dom.globalAudio.src = '';
        dom.globalPlayer.classList.remove('active');
        if (state.currentBtn) {
            state.currentBtn.classList.remove('playing');
            state.currentBtn = null;
        }
        dom.playerLabel.textContent = '准备就绪';
    });
}

document.addEventListener('DOMContentLoaded', init);
