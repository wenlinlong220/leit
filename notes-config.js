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
        {
            file: "note/listening/camb_C16_T2_S2",
            title: "剑16 Test2 Section2",
            book: "剑桥雅思16",
            test: "Test 2",
            section: "Section 2",
            date: "2026-04-07",
        },
        {
            file: "note/listening/camb_C16_T3_S1",
            title: "剑16 Test3 Section1",
            book: "剑桥雅思16",
            test: "Test 3",
            section: "Section 1",
            date: "2026-04-10",
        }
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
        {
            file: "note/reading/slow_food_解析.md",
            title: "The Slow Food Organization 全题解析",
            book: "阅读练习",
            test: "P1",
            passage: "Slow Food",
            date: "2026-04-06",
        },
        {
            file: "note/reading/investing_in_the_future_解析.md",
            title: "Investing in the Future 全题解析",
            book: "阅读练习",
            test: "P1",
            passage: "Investing in the Future",
            date: "2026-04-07",
        },
        {
            file: "note/reading/The Constant Evolution of the Humble Tomato.md",
            title: "The Constant Evolution of the Humble Tomato 全题解析",
            book: "阅读练习",
            test: "P2",
            passage: "The Humble Tomato",
            date: "2026-04-08",
        },
        {
            file: "note/reading/cuneiform_解析.md",
            title: "An Important Language Development 全题解析",
            book: "阅读练习",
            test: "P1",
            passage: "Cuneiform 楔形文字",
            date: "2026-04-09",
        },
        {
            file: "note/reading/tasmanian_tiger_解析.md",
            title: "The Tasmanian Tiger 全题解析",
            book: "阅读练习",
            test: "P2",
            passage: "Tasmanian Tiger 袋狼",
            date: "2026-04-10",
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
