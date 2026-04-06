/**
 * 笔记配置文件
 * 
 * 每当你新增一个笔记文件，只需在对应的数组中添加一条记录即可。
 * 
 * 文件夹结构：
 *   note/
 *     listening/   ← 精听听力笔记
 *     reading/     ← 阅读笔记
 *     writing/     ← 作文练习
 * 
 * 文件名规则：
 *   精听：camb_C16_T1_S1 → 剑桥雅思16 Test1 Section1
 *   阅读：read_C16_T1_P1 → 剑桥雅思16 Test1 Passage1
 *   写作：write_2026_04_05 → 2026年4月5日写作练习
 */

const NOTES_CONFIG = {
    // ===== 精听听力笔记 =====
    // 文件放在 note/listening/ 文件夹中
    listening: [
        {
            file: "note/listening/camb_C16_T1_S1",
            title: "剑16 Test1 Section1",
            book: "剑桥雅思16",
            test: "Test 1",
            section: "Section 1",
            date: "2026-04-05",
        },
        // 添加更多精听笔记（复制下方模板，修改参数即可）：
        // {
        //     file: "note/listening/camb_C16_T1_S2",
        //     title: "剑16 Test1 Section2",
        //     book: "剑桥雅思16",
        //     test: "Test 1",
        //     section: "Section 2",
        //     date: "2026-04-06",
        // },
    ],

    // ===== 阅读笔记 =====
    // 文件放在 note/reading/ 文件夹中
    reading: [
        {
            file: "note/reading/课堂梳理_4_4.md",
            title: "T/F/NG 判断题方法论",
            book: "课堂讲义梳理",
            test: "第三讲",
            passage: "判断题",
            date: "2026-04-04",
        },
    ],

    // ===== 作文练习 =====
    // 文件放在 note/writing/ 文件夹中
    writing: [
        // {
        //     file: "note/writing/write_2026_04_05",
        //     title: "Task2 - 教育类",
        //     type: "Task 2",
        //     topic: "教育类",
        //     date: "2026-04-05",
        // },
    ],
};
