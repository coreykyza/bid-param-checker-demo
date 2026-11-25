/* ============================================================
   硬件型号参数库（内置）
   —— 用于把型号名展开成具体参数，再与招标要求逐项比较。

   字段说明：
     cores   物理核心数        threads 逻辑线程数
     base    基础频率 GHz      boost   最大睿频 GHz
     tdp     整包功耗 W        vram    显存 GB
     size    屏幕/面板尺寸 英寸

   用途举例：
     招标「不少于6核12线程，TDP≤35W（性能不低于 i5-10500T）」
     投标「i5-14500」
     → 展开：14500 = 14核/20线程/2.5GHz/4.9GHz/65W
     → 10500T = 6核/12线程/2.9GHz/4.3GHz/35W
     → 核心数与线程数达标且睿频更高 → 判正偏离（而不是"低于要求"）

   数据说明：按厂商公开规格整理，可能存在个别偏差。
   用户可在界面「型号参数库」中自行增删改，改动存 localStorage。
   ============================================================ */
const HW_SPECS_BUILTIN = {
  /* ---------------- Intel 桌面 14代 ---------------- */
  "i9-14900k": { cores: 24, threads: 32, base: 3.2, boost: 6.0, tdp: 125 },
  "i9-14900kf": { cores: 24, threads: 32, base: 3.2, boost: 6.0, tdp: 125 },
  "i7-14700k": { cores: 20, threads: 28, base: 3.4, boost: 5.6, tdp: 125 },
  "i7-14700kf": { cores: 20, threads: 28, base: 3.4, boost: 5.6, tdp: 125 },
  "i5-14600k": { cores: 14, threads: 20, base: 3.5, boost: 5.3, tdp: 125 },
  "i5-14600kf": { cores: 14, threads: 20, base: 3.5, boost: 5.3, tdp: 125 },
  "i5-14500": { cores: 14, threads: 20, base: 2.5, boost: 4.9, tdp: 65 },
  "i5-14400": { cores: 6, threads: 12, base: 2.5, boost: 4.7, tdp: 65 },
  "i5-13400": { cores: 10, threads: 16, base: 2.5, boost: 4.6, tdp: 65 },
  "i5-13400f": { cores: 10, threads: 16, base: 2.5, boost: 4.6, tdp: 65 },
  "i5-13420": { cores: 10, threads: 16, base: 2.5, boost: 4.6, tdp: 65 },
  "i5-13500": { cores: 14, threads: 20, base: 2.5, boost: 4.9, tdp: 65 },
  "i5-13600k": { cores: 14, threads: 20, base: 3.5, boost: 5.3, tdp: 125 },

  /* ---------------- Intel 桌面 13代 ---------------- */
  "i9-13900k": { cores: 24, threads: 32, base: 3.0, boost: 5.8, tdp: 125 },
  "i9-13900kf": { cores: 24, threads: 32, base: 3.0, boost: 5.8, tdp: 125 },
  "i9-13900": { cores: 24, threads: 32, base: 2.0, boost: 5.2, tdp: 65 },
  "i7-13700k": { cores: 16, threads: 24, base: 3.5, boost: 5.4, tdp: 125 },
  "i7-13700kf": { cores: 16, threads: 24, base: 3.5, boost: 5.4, tdp: 125 },
  "i7-13700": { cores: 16, threads: 24, base: 2.1, boost: 5.4, tdp: 65 },
  "i5-13600k": { cores: 14, threads: 20, base: 3.5, boost: 5.1, tdp: 125 },
  "i5-13400f": { cores: 10, threads: 16, base: 2.5, boost: 4.6, tdp: 65 },
  "i5-13620": { cores: 10, threads: 16, base: 2.5, boost: 4.9, tdp: 65 },

  /* ---------------- Intel 桌面 12代 ---------------- */
  "i9-12900k": { cores: 16, threads: 24, base: 3.2, boost: 5.8, tdp: 125 },
  "i9-12900": { cores: 16, threads: 24, base: 2.2, boost: 5.1, tdp: 65 },
  "i7-12700k": { cores: 12, threads: 20, base: 3.6, boost: 5.0, tdp: 125 },
  "i7-12700": { cores: 12, threads: 20, base: 2.1, boost: 4.9, tdp: 65 },
  "i7-12700t": { cores: 12, threads: 20, base: 1.4, boost: 4.4, tdp: 35 },
  "i5-12600k": { cores: 10, threads: 16, base: 3.6, boost: 4.9, tdp: 125 },
  "i5-12400f": { cores: 6, threads: 12, base: 2.5, boost: 4.4, tdp: 65 },
  "i5-12400": { cores: 6, threads: 12, base: 2.5, boost: 4.4, tdp: 65 },
  "i5-12400t": { cores: 6, threads: 12, base: 1.7, boost: 4.4, tdp: 35 },
  "i5-12500t": { cores: 6, threads: 12, base: 1.8, boost: 4.4, tdp: 35 },

  /* ---------------- Intel 桌面 11代 ---------------- */
  "i9-11900k": { cores: 8, threads: 16, base: 3.5, boost: 5.3, tdp: 125 },
  "i7-11700": { cores: 8, threads: 16, base: 2.5, boost: 4.9, tdp: 65 },
  "i7-11700t": { cores: 8, threads: 16, base: 1.4, boost: 4.4, tdp: 35 },
  "i5-11600k": { cores: 6, threads: 12, base: 3.6, boost: 4.9, tdp: 125 },
  "i5-11500": { cores: 6, threads: 12, base: 2.7, boost: 4.4, tdp: 65 },
  "i5-11400": { cores: 6, threads: 12, base: 2.6, boost: 4.4, tdp: 65 },
  "i5-11400t": { cores: 6, threads: 12, base: 1.3, boost: 4.3, tdp: 35 },

  /* ---------------- Intel 桌面 10代 ---------------- */
  "i9-10900k": { cores: 10, threads: 20, base: 3.7, boost: 5.3, tdp: 125 },
  "i7-10700": { cores: 8, threads: 16, base: 2.9, boost: 5.0, tdp: 65 },
  "i7-10700t": { cores: 8, threads: 16, base: 1.3, boost: 4.4, tdp: 35 },
  "i5-10600k": { cores: 6, threads: 12, base: 4.1, boost: 4.8, tdp: 125 },
  "i5-10600": { cores: 6, threads: 12, base: 3.3, boost: 4.8, tdp: 65 },
  "i5-10500t": { cores: 6, threads: 12, base: 2.9, boost: 4.3, tdp: 35 },
  "i5-10500": { cores: 6, threads: 12, base: 3.1, boost: 4.5, tdp: 65 },
  "i5-10400": { cores: 6, threads: 12, base: 2.9, boost: 4.3, tdp: 65 },
  "i5-10400t": { cores: 6, threads: 12, base: 2.9, boost: 4.3, tdp: 35 },

  /* ---------------- Intel 桌面 8/9代 ---------------- */
  "i9-9900k": { cores: 8, threads: 16, base: 3.6, boost: 5.0, tdp: 95 },
  "i7-9700k": { cores: 8, threads: 8, base: 3.6, boost: 4.9, tdp: 95 },
  "i7-8700": { cores: 6, threads: 12, base: 3.2, boost: 4.6, tdp: 65 },
  "i5-8500": { cores: 6, threads: 6, base: 3.0, boost: 4.0, tdp: 65 },
  "i5-8400": { cores: 6, threads: 6, base: 2.8, boost: 4.0, tdp: 65 },
  "i3-8100": { cores: 4, threads: 4, base: 3.6, boost: 3.6, tdp: 65 },
  "i3-12100": { cores: 4, threads: 8, base: 3.3, boost: 4.3, tdp: 65 },
  "i5-12400f ": { cores: 6, threads: 12, base: 2.5, boost: 4.4, tdp: 65 },

  /* ---------------- Intel 移动 ---------------- */
  "i5-13500u": { cores: 12, threads: 16, base: 1.9, boost: 4.9, tdp: 15 },
  "i5-1235u": { cores: 12, threads: 16, base: 1.6, boost: 4.9, tdp: 15 },
  "i5-11500u": { cores: 6, threads: 12, base: 2.5, boost: 4.9, tdp: 15 },
  "i7-1165g7": { cores: 4, threads: 8, base: 2.8, boost: 4.7, tdp: 15 },
  "i7-1260p": { cores: 12, threads: 16, base: 2.1, boost: 5.0, tdp: 28 },
  "i5-13420h": { cores: 12, threads: 16, base: 2.2, boost: 4.8, tdp: 45 },

  /* ---------------- AMD ---------------- */
  "r9 7950x": { cores: 16, threads: 32, base: 4.5, boost: 5.7, tdp: 170 },
  "r9 7900x": { cores: 12, threads: 24, base: 4.7, boost: 5.6, tdp: 170 },
  "r9 5950x": { cores: 16, threads: 32, base: 3.4, boost: 4.9, tdp: 105 },
  "r7 7700x": { cores: 8, threads: 16, base: 4.5, boost: 5.4, tdp: 105 },
  "r7 5800x": { cores: 8, threads: 16, base: 3.8, boost: 4.4, tdp: 105 },
  "r7 5700x": { cores: 8, threads: 16, base: 3.2, boost: 4.6, tdp: 65 },
  "r5 5600x": { cores: 6, threads: 12, base: 3.7, boost: 4.9, tdp: 95 },
  "r5 5600": { cores: 6, threads: 12, base: 3.5, boost: 4.4, tdp: 65 },
  "r5 7500f": { cores: 6, threads: 12, base: 3.7, boost: 5.0, tdp: 65 },
  "r5 5500": { cores: 6, threads: 12, base: 3.6, boost: 4.5, tdp: 65 },
  "r3 3200g": { cores: 4, threads: 4, base: 3.3, boost: 4.0, tdp: 65 },

  /* ---------------- GPU 独显 ---------------- */
  "rtx 3090": { vram: 24, memType: "GDDR6X", tdp: 350 },
  "rtx 3080": { vram: 10, memType: "GDDR6X", tdp: 320 },
  "rtx 3070": { vram: 8, memType: "GDDR6", tdp: 220 },
  "rtx 3060": { vram: 12, memType: "GDDR6", tdp: 170 },
  "rtx 2080": { vram: 8, memType: "GDDR6", tdp: 250 },
  "rtx 2060": { vram: 6, memType: "GDDR6", tdp: 160 },
  "rtx 4060": { vram: 8, memType: "GDDR6", tdp: 115 },
  "rtx 4060ti": { vram: 8, memType: "GDDR6", tdp: 160 },
  "rtx 4070": { vram: 12, memType: "GDDR6X", tdp: 200 },
  "rtx 4080": { vram: 16, memType: "GDDR6X", tdp: 320 },
  "rtx 4090": { vram: 24, memType: "GDDR6X", tdp: 450 },
  "rtx 2000": { vram: 16, memType: "GDDR6", tdp: 70 },
  "rtx 2000 ada": { vram: 16, memType: "GDDR6", tdp: 70 },
  "rtx 4000 sff ada": { vram: 20, memType: "GDDR6", tdp: 70 },
  "a2000": { vram: 6, memType: "GDDR6", tdp: 70 },
  "gtx 1660 super": { vram: 6, memType: "GDDR6", tdp: 125 },
  "gtx 1660 ti": { vram: 6, memType: "GDDR6", tdp: 120 },
  "gtx 1660": { vram: 6, memType: "GDDR6", tdp: 120 },
  "gtx 1080 ti": { vram: 11, memType: "GDDR5X", tdp: 200 },
  "gtx 1080": { vram: 8, memType: "GDDR5X", tdp: 180 },
  "gtx 1650": { vram: 4, memType: "GDDR6", tdp: 75 },
  "gtx 750ti": { vram: 2, memType: "GDDR5", tdp: 60 },
  "rx 580": { vram: 8, memType: "GDDR5", tdp: 185 },
  "rx 6600": { vram: 8, memType: "GDDR6", tdp: 132 },
  "a5000": { vram: 24, memType: "GDDR6", tdp: 230 },
  "a4000": { vram: 16, memType: "GDDR6", tdp: 140 },

  /* ---------------- 嵌入式 / 单板 ---------------- */
  "raspberry pi 4": { cores: 4, threads: 4, base: 1.5, boost: 1.5, tdp: 5 },
  "树莓派4": { cores: 4, threads: 4, base: 1.5, boost: 1.5, tdp: 5 },
  "jetson nano": { cores: 4, threads: 4, base: 1.3, boost: 1.3, tdp: 10 },
  "jetson orin nano": { cores: 8, threads: 8, base: 1.5, boost: 1.5, tdp: 15 }
};
