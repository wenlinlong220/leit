/**
 * 听力笔记播放器 - 核心逻辑
 * 功能：
 * 1. Markdown 渲染（支持 ==高亮== 语法）
 * 2. [点击听](url) 在页面内嵌入iframe播放新东方页面，无需跳转
 * 3. [老师解析](url) 播放老师解析音频（本地上传）
 * 4. 支持上传本地音频绑定到按钮
 */

// ========== 状态管理 ==========
const state = {
    audioMap: {},        // 存储音频 btnId -> blob URL 的映射
    currentBtn: null,    // 当前正在播放的按钮元素
    audioCounter: 0,     // 音频计数器
    teacherCounter: 0,   // 老师解析计数器
};

// ========== DOM 元素 ==========
const dom = {
    markdownContent: document.getElementById('markdownContent'),
    mdFile: document.getElementById('mdFile'),
    fileName: document.getElementById('fileName'),
    globalPlayer: document.getElementById('globalPlayer'),
    globalAudio: document.getElementById('globalAudio'),
    playerLabel: document.getElementById('playerLabel'),
    closePlayer: document.getElementById('closePlayer'),
    showEditor: document.getElementById('showEditor'),
    editorPanel: document.getElementById('editorPanel'),
    mdEditor: document.getElementById('mdEditor'),
    renderBtn: document.getElementById('renderBtn'),
    hideEditor: document.getElementById('hideEditor'),
};

// ========== Marked.js 配置 ==========
function setupMarked() {
    const renderer = new marked.Renderer();

    // 自定义链接渲染
    renderer.link = function (token) {
        const href = token.href || '';
        const text = token.text || '';

        // 【点击听】→ 内嵌iframe弹窗，直接在页面内加载新东方页面
        if (text === '点击听') {
            state.audioCounter++;
            const id = 'audio-btn-' + state.audioCounter;
            return `<button class="audio-play-btn" id="${id}" data-src="${href}" data-type="listen" onclick="openListenPanel(this)">
                <span class="icon">🔊</span> 点击听
            </button>`;
        }

        // 【老师解析】→ 本地音频播放
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
function preprocessMarkdown(md) {
    // 处理 ==高亮== 语法 → <mark>高亮</mark>
    md = md.replace(/==(.*?)==/g, '<mark>$1</mark>');
    return md;
}

// ========== 渲染 Markdown ==========
function renderMarkdown(mdText) {
    state.audioCounter = 0;
    state.teacherCounter = 0;
    const processed = preprocessMarkdown(mdText);
    const html = marked.parse(processed);
    dom.markdownContent.innerHTML = html;
}

// ========== 点击听 → 打开内嵌面板（iframe加载新东方页面） ==========
function openListenPanel(btn) {
    const src = btn.dataset.src;

    if (!src || src === '#') {
        alert('没有提供有效的音频链接');
        return;
    }

    // 如果已经有打开的面板，先关闭
    const existing = document.getElementById('listen-panel');
    if (existing) {
        existing.remove();
    }

    // 创建内嵌播放面板
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

    // 插入到按钮后面
    btn.closest('li')?.after(panel) || btn.parentElement.after(panel);

    // 滚动到面板位置
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 高亮当前按钮
    document.querySelectorAll('.audio-play-btn').forEach(b => b.classList.remove('active-btn'));
    btn.classList.add('active-btn');
}

// ========== 关闭听力面板 ==========
function closeListenPanel() {
    const panel = document.getElementById('listen-panel');
    if (panel) {
        panel.remove();
    }
    document.querySelectorAll('.audio-play-btn').forEach(b => b.classList.remove('active-btn'));
}

// ========== 老师解析 - 播放音频 ==========
function playTeacherAudio(btn) {
    const src = btn.dataset.src;
    const label = '👨‍🏫 老师解析';

    // 如果点击的是当前正在播放的按钮，暂停
    if (state.currentBtn === btn && !dom.globalAudio.paused) {
        dom.globalAudio.pause();
        btn.classList.remove('playing');
        dom.playerLabel.textContent = '已暂停';
        return;
    }

    // 如果有其他按钮在播放，先停止
    if (state.currentBtn && state.currentBtn !== btn) {
        state.currentBtn.classList.remove('playing');
    }

    state.currentBtn = btn;

    // 检查是否有本地绑定的音频
    const localSrc = state.audioMap[btn.id];
    const audioSrc = localSrc || src;

    if (!audioSrc || audioSrc === '#') {
        alert('请先点击旁边的"上传解析音频"按钮，上传老师的解析音频文件');
        return;
    }

    // 设置播放器
    dom.globalAudio.src = audioSrc;
    dom.playerLabel.textContent = label;
    dom.globalPlayer.classList.add('active');

    // 播放
    dom.globalAudio.play().then(() => {
        btn.classList.add('playing');
    }).catch(err => {
        console.error('播放失败:', err);
        alert('音频播放失败。请上传本地音频文件。');
    });
}

// ========== 音频播放结束事件 ==========
dom.globalAudio.addEventListener('ended', () => {
    if (state.currentBtn) {
        state.currentBtn.classList.remove('playing');
    }
    dom.playerLabel.textContent = '播放完毕';
});

// ========== 关闭播放器 ==========
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

// ========== 绑定本地音频到按钮 ==========
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
    console.log(`音频已绑定: ${btnId} -> ${file.name}`);
}

// ========== 文件导入 ==========
dom.mdFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dom.fileName.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (event) => {
        const mdText = event.target.result;
        dom.mdEditor.value = mdText;
        renderMarkdown(mdText);
    };
    reader.readAsText(file, 'UTF-8');
});

// ========== 编辑器相关 ==========
dom.showEditor.addEventListener('click', () => {
    dom.editorPanel.style.display = 'block';
});

dom.hideEditor.addEventListener('click', () => {
    dom.editorPanel.style.display = 'none';
});

dom.renderBtn.addEventListener('click', () => {
    const mdText = dom.mdEditor.value;
    if (mdText.trim()) {
        renderMarkdown(mdText);
    }
});

// ========== 初始化 ==========
function init() {
    setupMarked();

    // 加载示例内容（使用用户的剑16听力笔记格式）
    const sampleMd = `
---
-  I wanted ==some== information about the workshops in the ==school holidays==.
\t*不熟悉词组*：只注意到holidays，应该连着school一起
---
- our ==Tiny== Engineers workshop is for four to five-year-olds.
\t*单词不熟悉*：tiny下意识想成了tidy
---
-  For example, they work together to design a special ==cover== that goes round an egg, so that when it's inside they can drop it from a height and it doesn't break.
\t*意思不理解*：that goes round an egg，goes around是环绕，此处相当于就是有一个壳子包围蛋
\t*单词不熟悉*：cover的盖子的意思
---
-  it does break but that's part of the fun
- [点击听](https://ieltscat.xdf.cn/intensive/intensive/1758/1/9)
\t*听混了*：fun和phone感觉很像
- [老师解析](#)
---
`;

    dom.mdEditor.value = sampleMd;
    renderMarkdown(sampleMd);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
