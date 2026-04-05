/**
 * 笔记配置文件
 * 
 * 每当你新增一个笔记文件，只需在对应的数组中添加一条记录即可。
 * 
 * 文件名规则：
 *   精听：camb_C16_T1_S1 → 剑桥雅思16 Test1 Section1
 *   阅读：read_C16_T1_P1 → 剑桥雅思16 Test1 Passage1
 *   写作：write_2024_01_01 → 2024年1月1日写作练习
 */

const NOTES_CONFIG = {
    // ===== 精听听力笔记 =====
    listening: [
        {
            file: "note/camb_C16_T1_S1",
            title: "剑16 Test1 Section1",
            book: "剑桥雅思16",
            test: "Test 1",
            section: "Section 1",
            date: "2026-04-05",
        },
        // 添加更多精听笔记示例（取消注释即可）：
        // {
        //     file: "note/camb_C16_T1_S2",
        //     title: "剑16 Test1 Section2",
        //     book: "剑桥雅思16",
        //     test: "Test 1",
        //     section: "Section 2",
        //     date: "2026-04-06",
        // },
        // {
        //     file: "note/camb_C17_T1_S1",
        //     title: "剑17 Test1 Section1",
        //     book: "剑桥雅思17",
        //     test: "Test 1",
        //     section: "Section 1",
        //     date: "2026-04-07",
        // },
    ],

    // ===== 阅读笔记 =====
    reading: [
        // {
        //     file: "note/read_C16_T1_P1",
        //     title: "剑16 Test1 Passage1",
        //     book: "剑桥雅思16",
        //     test: "Test 1",
        //     passage: "Passage 1",
        //     date: "2026-04-05",
        // },
    ],

    // ===== 作文练习 =====
    writing: [
        // {
        //     file: "note/write_2026_04_05",
        //     title: "Task2 - 教育类",
        //     type: "Task 2",
        //     topic: "教育类",
        //     date: "2026-04-05",
        // },
    ],
};
