## 如何上传新笔记

上传笔记分两步：**创建笔记文件** + **注册到配置文件**。

---

### 第1步：创建笔记文件

在 `note/` 文件夹中新建一个文件，命名规则：
- **精听听力**：`camb_C16_T1_S2`（剑16 Test1 Section2）
- **阅读笔记**：`read_C16_T1_P1`（剑16 Test1 Passage1）
- **作文练习**：`write_2026_04_05`（日期命名）

文件内容用 Markdown 格式编写，例如：
```markdown
# 剑桥雅思 C16_T1_S2
---
- 这里写你听到的句子，==高亮==重点词
	*错误类型*：这里写你的笔记
- [点击听](https://ieltscat.xdf.cn/intensive/intensive/1758/1/10)
- [老师解析](#)
---
```

### 第2步：在 `notes-config.js` 中注册

打开 `notes-config.js` 文件，在对应分类的数组中添加一条记录：

```javascript
// 精听听力 → listening 数组
{
    file: "note/camb_C16_T1_S2",
    title: "剑16 Test1 Section2",
    book: "剑桥雅思16",
    test: "Test 1",
    section: "Section 2",
    date: "2026-04-06",
},
```

### 第3步：推送到线上

在终端（VS Code 底部）执行以下命令：
```
git add -A
git commit -m "添加新笔记"
git push origin main
```

等1-2分钟后，线上版本就会自动更新。

---

如果你想让我帮你实际操作上传一篇新笔记，请切换到 **Act 模式**（点击下方的 Plan/Act 切换按钮），然后告诉我笔记内容即可。