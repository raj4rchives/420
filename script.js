

// ===== 370R Theme System — 29 themes =====
const THEME_KEY = "jee370rThemeV1";
const THEMES = [
  ["sakura","Sakura Notebook","#f6f3ff","#fffdfb","#ff91ae","#cbb5ff"],
  ["lavender","Lavender Dream","#f2efff","#ffffff","#b99cff","#e4b8ff"],
  ["peach","Peach Paper","#fff5ef","#fffdfb","#ffad87","#ffd08a"],
  ["mint","Mint Breeze","#effcf8","#ffffff","#80d8b4","#a8e7c8"],
  ["sky","Sky Blue","#eef8ff","#ffffff","#82c9ff","#a9e1ff"],
  ["lemon","Lemon Pop","#fffdf0","#fffef8","#ffd94a","#fff09a"],
  ["matcha","Matcha","#f3f9ec","#ffffff","#a9cf73","#d0e69c"],
  ["ocean","Ocean Calm","#edf8fa","#ffffff","#63c9c5","#8ddde0"],
  ["sunset","Soft Sunset","#fff3ef","#fffdfb","#ff9b83","#ffcc83"],
  ["rose","Rose Garden","#fff0f5","#ffffff","#f58db3","#ffb9cf"],
  ["bubblegum","Bubblegum","#fff0fa","#ffffff","#ff91d1","#c7a3ff"],
  ["lilac","Lilac","#f7f1ff","#ffffff","#c29bff","#e0b5ff"],
  ["cream","Vanilla Cream","#fbf7ea","#fffdf6","#e9bd66","#f2d795"],
  ["mocha","Mocha","#f8f1ec","#fffaf6","#c99878","#e0b295"],
  ["forest","Forest","#eef7ef","#ffffff","#78bd85","#a8d59d"],
  ["midnight","Midnight","#0d1220","#161d2f","#9ba9ff","#d0a8ff"],
  ["cyber","Cyber Mint","#080d14","#101925","#00e5c2","#8d7cff"],
  ["amoled","AMOLED","#000000","#0b0b0b","#ffffff","#aaaaaa"],
  ["slate","Slate","#edf1f5","#ffffff","#7188a0","#a8b9c8"],
  ["emerald","Emerald","#ecfbf4","#ffffff","#5bc99a","#8be0ba"],
  ["ruby","Ruby","#fff0f1","#ffffff","#e96d79","#ffabb3"],
  ["sapphire","Sapphire","#edf4ff","#ffffff","#6fa5ff","#9ac3ff"],
  ["gold","Gold","#fffaf0","#fffdf8","#e4b83e","#f2d476"],
  ["mono","Monochrome","#f3f3f3","#ffffff","#222222","#777777"],
  ["arctic","Arctic","#eefbff","#ffffff","#74d4e8","#a7e8f2"],
  ["grape","Grape","#f6f0ff","#ffffff","#a77be8","#d2adff"],
  ["coral","Coral","#fff4f0","#ffffff","#ff8d7b","#ffbd9c"],
  ["cotton","Cotton Candy","#f4f0ff","#ffffff","#ff9fca","#a7d7ff"],
  ["notebook","Classic Notebook","#f8f4e8","#fffefa","#ff9c9c","#8ec5ff"]
];

function renderThemePicker(){
  const grid=document.getElementById('themeGrid');
  if(!grid) return;
  const active=document.body.dataset.theme || localStorage.getItem(THEME_KEY) || 'sakura';
  grid.innerHTML=THEMES.map(t=>`<button class="theme-option ${t[0]===active?'active':''}" data-theme="${t[0]}" type="button"><span class="swatches"><i style="background:${t[2]}"></i><i style="background:${t[3]}"></i><i style="background:${t[4]}"></i><i style="background:${t[5]}"></i></span><span class="theme-name">${t[1]}</span></button>`).join('');
  grid.querySelectorAll('.theme-option').forEach(btn=>btn.addEventListener('click',()=>applyTheme(btn.dataset.theme)));
}
function applyTheme(name){
  const found=THEMES.find(t=>t[0]===name) || THEMES[0];
  document.body.dataset.theme=found[0];
  localStorage.setItem(THEME_KEY,found[0]);
  const meta=document.getElementById('metaThemeColor');
  if(meta) meta.setAttribute('content',found[4]);
  renderThemePicker();
}
function initThemeSystem(){
  applyTheme(localStorage.getItem(THEME_KEY) || 'sakura');
  const toggle=document.getElementById('themeToggle');
  const menu=document.getElementById('themeMenu');
  const close=document.getElementById('themeClose');
  if(!toggle || !menu) return;
  const open=()=>{menu.hidden=false;toggle.setAttribute('aria-expanded','true');};
  const shut=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');};
  toggle.addEventListener('click',e=>{e.stopPropagation(); menu.hidden ? open() : shut();});
  if(close) close.addEventListener('click',shut);
  document.addEventListener('click',e=>{if(!menu.hidden && !menu.contains(e.target) && e.target!==toggle) shut();});
}

const KEY = "jee370rTrackerV3";
const LEGACY_V2 = "jee370rTrackerV2";
const LEGACY_V1 = "jee370rTrackerV1";

// Tere naye HTML <thead> order ke exact same mapping:
const fields = [
  "date",      // 1. DATE
  "lec",       // 2. LEC TOTAL
  "phyWork",   // 3. PHY HW / CLASS ILLU
  "chemWork",  // 4. CHEM HW / CLASS ILLU
  "mathWork",  // 5. MATH HW / CLASS ILLU
  "phyDpp",    // 6. PHY DPP (Naya order)
  "chemDpp",   // 7. CHEM DPP
  "mathDpp",   // 8. MATH DPP
  "phyPyq",    // 9. PHY PYQ
  "chemPyq",   // 10. CHEM PYQ
  "mathPyq"    // 11. MATH PYQ
];


const tbody = document.querySelector("#tracker tbody");

// 1. Helper Functions
function num(v) {
  const m = String(v || "").match(/\d+/);
  return m ? Number(m[0]) : 0;
}

function sumField(data, field) {
  return data.reduce((s, r) => s + num(r[field]), 0);
}

function put(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function combine(a, b) {
  const x = String(a || "").trim(), y = String(b || "").trim();
  if (x && y) return `${x} + ${y}`;
  return x || y;
}

// 2. Table Rows Manager
function makeRows() {
  if (!tbody) return;
  tbody.innerHTML = "";
  addRows(15);
}

function addRows(count = 15) {
  if (!tbody) return;
  const start = tbody.children.length;
  for (let i = 0; i < count; i++) {
    const tr = document.createElement("tr");
    tr.dataset.i = start + i;
    tr.innerHTML = fields.map((f, j) => 
      `<td><input data-f="${f}" ${j === 0 ? 'type="date"' : ''} inputmode="numeric"></td>`
    ).join("");
    tbody.appendChild(tr);
    
    tr.querySelectorAll("input").forEach(x => {
      x.addEventListener("input", () => {
        updateStats();
        autoExtendRows();
      });
    });
  }
}

function rowsData() {
  if (!tbody) return [];
  return [...tbody.querySelectorAll("tr")].map(tr => {
    const o = {};
    tr.querySelectorAll("input").forEach(i => o[i.dataset.f] = i.value);
    return o;
  });
}

function setData(data) {
  makeRows();
  (data || []).forEach((o, i) => {
    while (i >= tbody.children.length) addRows(15);
    const tr = tbody.children[i];
    fields.forEach(f => {
      if (o[f] != null) {
        const input = tr.querySelector(`[data-f="${f}"]`);
        if (input) input.value = o[f];
      }
    });
  });
  updateStats();
}

function autoExtendRows() {
  if (!tbody) return;
  const rows = [...tbody.children];
  const last = rows.slice(-3);
  if (last.some(tr => [...tr.querySelectorAll("input")].some(i => i.value.trim() !== ""))) {
    addRows(15);
  }
}

// 3. Migration & LocalStorage Logic
function migrateData() {
  const v3 = JSON.parse(localStorage.getItem(KEY) || "null");
  if (v3 && Array.isArray(v3.rows)) return v3;

  const v2 = JSON.parse(localStorage.getItem(LEGACY_V2) || "null");
  if (v2 && Array.isArray(v2.rows)) {
    return {
      startDate: v2.startDate || "",
      examDate: v2.examDate || "",
      rows: v2.rows.map(r => ({
        date: r.date || "", lec: r.lec || "",
        phyWork: combine(r.phyHw, r.phyIllu),
        chemWork: combine(r.chemHw, r.chemIllu),
        mathWork: combine(r.mathHw, r.mathIllu),
        chemDpp: r.chemDpp || "", mathDpp: r.mathDpp || "",
        phyPyq: r.phyPyq || "", chemPyq: r.chemPyq || "", mathPyq: r.mathPyq || ""
      }))
    };
  }

  const v1 = JSON.parse(localStorage.getItem(LEGACY_V1) || "null");
  if (v1 && Array.isArray(v1.rows)) {
    return {
      startDate: v1.startDate || "",
      examDate: v1.examDate || "",
      rows: v1.rows.map(r => ({
        date: r.date || "", lec: r.lec || "",
        phyWork: r.phy || "", chemWork: r.chem || "", mathWork: r.math || "",
        chemDpp: r.chemDpp || "", mathDpp: r.mathDpp || "",
        phyPyq: r.pyq || "", chemPyq: "", mathPyq: ""
      }))
    };
  }
  return null;
}

function save() {
  const startEl = document.querySelector("#startDate");
  const examEl = document.querySelector("#examDate");
  localStorage.setItem(KEY, JSON.stringify({
    startDate: startEl ? startEl.value : "",
    examDate: examEl ? examEl.value : "",
    rows: rowsData()
  }));
  alert("Progress saved on this device.");
}

function load() {
  const x = migrateData();
  if (!x) { alert("No saved tracker found."); return; }
  const startEl = document.querySelector("#startDate");
  const examEl = document.querySelector("#examDate");
  if (startEl) startEl.value = x.startDate || "";
  if (examEl) examEl.value = x.examDate || examEl.value;
  setData(x.rows);
  save();
}

function clearAll() {
  if (!confirm("Clear all study data?")) return;
  localStorage.removeItem(KEY);
  const startEl = document.querySelector("#startDate");
  if (startEl) startEl.value = "";
  setData([]);
}

function fillDates() {
  const startEl = document.querySelector("#startDate");
  const s = startEl ? startEl.value : "";
  if (!s) { alert("Select a start date first."); return; }
  const d = new Date(s + "T00:00:00");
  [...tbody.children].forEach((tr, i) => {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    const dateInput = tr.querySelector('[data-f="date"]');
    if (dateInput) dateInput.value = x.toISOString().slice(0, 10);
  });
  updateStats();
}

// 4. Statistics Calculation
function updateStats() {
  const data = rowsData();
  const done = data.filter(r => Object.values(r).some(v => String(v || "").trim() !== "")).length;
  const lec = sumField(data, "lec");

  const phyWork = sumField(data, "phyWork");
  const chemWork = sumField(data, "chemWork");
  const mathWork = sumField(data, "mathWork");
  const chemDpp = sumField(data, "chemDpp");
  const mathDpp = sumField(data, "mathDpp");
  const phyPyq = sumField(data, "phyPyq");
  const chemPyq = sumField(data, "chemPyq");
  const mathPyq = sumField(data, "mathPyq");

  const phy = phyWork + phyPyq;
  const chem = chemWork + chemDpp + chemPyq;
  const math = mathWork + mathDpp + mathPyq;
  const overall = phy + chem + math;
  const pyq = phyPyq + chemPyq + mathPyq;
  const dpp = chemDpp + mathDpp;
  const avg = done ? Math.round(overall / done) : 0;
  const target = done ? Math.min(100, Math.round(overall / (done * 70) * 100)) : 0;

  put("daysDone", done);
  put("lecSum", lec);
  put("questionSum", overall);
  put("pyqSum", pyq);
  put("avgQ", avg);
  put("qTarget", target + "%");

  put("phyWorkSum", phyWork); put("chemWorkSum", chemWork); put("mathWorkSum", mathWork); put("workSum", phyWork + chemWork + mathWork);
  put("phyDppSum", 0); put("chemDppSum", chemDpp); put("mathDppSum", mathDpp); put("dppSum", dpp);
  put("phyPyqSum", phyPyq); put("chemPyqSum", chemPyq); put("mathPyqSum", mathPyq); put("pyqDetailSum", pyq);
  put("phyTotal", phy); put("chemTotal", chem); put("mathTotal", math); put("overallTotal", overall);
}

// 5. Monthly Reporting Helpers
function monthKey(date) { return String(date || '').slice(0, 7); }
function getMonths() { return [...new Set(rowsData().map(r => monthKey(r.date)).filter(Boolean))].sort(); }
function phaseNumber(key) { const keys = getMonths(); const i = keys.indexOf(key); return i < 0 ? '—' : i + 1; }
function monthRows(key) { return rowsData().filter(r => monthKey(r.date) === key); }

function monthSummary(key) {
  const d = monthRows(key);
  const done = d.filter(r => Object.values(r).some(v => String(v || '').trim() !== '')).length;
  const sum = f => d.reduce((a, r) => a + num(r[f]), 0);
  const phyWork = sum('phyWork'), chemWork = sum('chemWork'), mathWork = sum('mathWork');
  const chemDpp = sum('chemDpp'), mathDpp = sum('mathDpp');
  const phyPyq = sum('phyPyq'), chemPyq = sum('chemPyq'), mathPyq = sum('mathPyq');
  const phy = phyWork + phyPyq, chem = chemWork + chemDpp + chemPyq, math = mathWork + mathDpp + mathPyq;
  return { days: done, lec: sum('lec'), phyWork, chemWork, mathWork, chemDpp, mathDpp, phyPyq, chemPyq, mathPyq, phy, chem, math, total: phy + chem + math, pyq: phyPyq + chemPyq + mathPyq };
}

function updateCountdown() {
  const input = document.querySelector('#examDate');
  const out = document.querySelector('#countdown');
  const label = document.querySelector('#examDateLabel');
  if (!input || !out) return;
  const v = input.value;
  if (!v) { out.textContent = '—'; if (label) label.textContent = 'Set your target exam date above'; return; }
  const target = new Date(v + 'T00:00:00');
  const now = new Date();
  target.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
  const days = Math.ceil((target - now) / 86400000);
  out.textContent = days > 0 ? `${days} DAYS LEFT` : days === 0 ? 'EXAM DAY' : 'DATE PASSED';
  if (label) label.textContent = target.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

// 6. Exports & Import
function exportJSON() {
  const startEl = document.querySelector('#startDate');
  const examEl = document.querySelector('#examDate');
  const payload = {
    version: 5,
    exportedAt: new Date().toISOString(),
    startDate: startEl ? startEl.value : "",
    examDate: examEl ? examEl.value : "",
    rows: rowsData()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'jee-tracker-backup.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJSON(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const x = JSON.parse(r.result);
      if (!Array.isArray(x.rows)) throw new Error('Invalid backup');
      const startEl = document.querySelector('#startDate');
      const examEl = document.querySelector('#examDate');
      if (startEl) startEl.value = x.startDate || '';
      if (examEl && x.examDate) examEl.value = x.examDate;
      setData(x.rows);
      save();
      alert('JSON imported successfully.');
    } catch (e) {
      alert('Invalid JSON backup.');
    }
  };
  r.readAsText(file);
}

async function makeMonthlyPDF() {
  const reportEl = document.querySelector('#reportMonth');
  const key = reportEl ? reportEl.value : "";
  if (!key) { alert('Select a report month first.'); return; }
  const rows = monthRows(key);
  if (!rows.length) { alert('No study data found for this month.'); return; }
  
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const m = monthSummary(key);
  const [y, mo] = key.split('-');
  const name = new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  
  pdf.setFont('helvetica', 'bold'); pdf.setFontSize(18);
  pdf.text(`370R JEE Tracker — Phase ${phaseNumber(key)} — ${name}`, 14, 16);
  pdf.setFontSize(10);
  pdf.text(`Study days: ${m.days}   Lectures: ${m.lec}   Total Questions: ${m.total}   PYQs: ${m.pyq}   Avg Q/day: ${m.days ? Math.round(m.total / m.days) : 0}`, 14, 24);
  pdf.setFontSize(11);
  pdf.text('Subject summary', 14, 34);
  
  const rowsSummary = [
    ['HW / CLASS ILLU', m.phyWork, m.chemWork, m.mathWork, m.phyWork + m.chemWork + m.mathWork],
    ['DPP', 0, m.chemDpp, m.mathDpp, m.chemDpp + m.mathDpp],
    ['PYQ', m.phyPyq, m.chemPyq, m.mathPyq, m.pyq],
    ['TOTAL', m.phy, m.chem, m.math, m.total]
  ];
  
  if (pdf.autoTable) pdf.autoTable({ startY: 38, head: [['TYPE', 'PHYSICS', 'CHEMISTRY', 'MATHEMATICS', 'TOTAL']], body: rowsSummary, theme: 'grid' });
  let yy = pdf.lastAutoTable ? pdf.lastAutoTable.finalY + 10 : 45;
  pdf.setFontSize(10); pdf.text('Daily log', 14, yy); yy += 5;
  
  const body = rows.map(r => [r.date, r.lec, r.phyWork, r.chemWork, r.mathWork, r.chemDpp, r.mathDpp, r.phyPyq, r.chemPyq, r.mathPyq]);
  if (pdf.autoTable) pdf.autoTable({ startY: yy, head: [['DATE', 'LEC', 'PHY HW/ILLU', 'CHEM HW/ILLU', 'MATH HW/ILLU', 'CHEM DPP', 'MATH DPP', 'PHY PYQ', 'CHEM PYQ', 'MATH PYQ']], body, theme: 'grid', styles: { fontSize: 7 } });
  
  pdf.save(`JEE-Tracker-Phase-${phaseNumber(key)}-${key}.pdf`);
}

async function makePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  
  const img = new Image();
  img.src = "tracker-template.png";
  
  try {
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
  } catch (e) {
    console.warn("Template image not found or blocked. Generating standard PDF layout instead.");
  }

  const sx = 210 / 1086, sy = 297 / 1536;
  const cols = [20, 126, 232, 338, 444, 550, 656, 762, 868, 974, 1080];
  const centers = cols.slice(0, -1).map((x, i) => ((x + cols[i + 1]) / 2) * sx);
  const tableTop = 264, rowH = (1398 - 264) / 15;
  const data = rowsData();

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(20, 20, 20);
  pdf.setFontSize(12);

  data.forEach((r, i) => {
    if (i >= 15) return;
    const y = (tableTop + (i + .5) * rowH) * sy + 1.7;
    const vals = [r.date, r.lec, r.phyWork, r.chemWork, r.mathWork, r.chemDpp, r.mathDpp, r.phyPyq, r.chemPyq, r.mathPyq];
    
    vals.forEach((v, j) => {
      if (v === "" || v == null) return;
      let text = String(v);
      if (j === 0 && /^\d{4}-\d{2}-\d{2}$/.test(text)) {
        const [yy, mm, dd] = text.split("-"); text = `${dd}/${mm}`;
      }
      const maxChars = j === 0 ? 10 : 6;
      if (text.length > maxChars) text = text.slice(0, maxChars - 1) + "…";
      pdf.text(text, centers[j], y, { align: "center", maxWidth: (cols[j + 1] - cols[j]) * sx - 1 });
    });
  });

  pdf.save("370R-JEE-Advanced-Tracker-Filled.pdf");
}

// 7. Event Listeners Setup
document.addEventListener("DOMContentLoaded", () => {
  const bindClick = (id, fn) => { const el = document.querySelector(id); if (el) el.onclick = fn; };
  
  bindClick("#saveBtn", save);
  bindClick("#loadBtn", load);
  bindClick("#clearBtn", clearAll);
  bindClick("#datesBtn", fillDates);
  bindClick("#addBtn", () => addRows(15));
  bindClick("#pdfBtn", makePDF);
  bindClick("#monthPdfBtn", makeMonthlyPDF);
  initThemeSystem();
  bindClick("#jsonExportBtn", exportJSON);
  
  const jsonImport = document.querySelector("#jsonImport");
  if (jsonImport) jsonImport.addEventListener("change", e => { if (e.target.files[0]) importJSON(e.target.files[0]); });
  
  const examDateEl = document.querySelector("#examDate");
  if (examDateEl) examDateEl.addEventListener("change", () => { updateCountdown(); save(); });

  setInterval(updateCountdown, 60000);

  // Initialize
  makeRows();
  const saved = migrateData();
  if (saved) {
    const startEl = document.querySelector("#startDate");
    const examEl = document.querySelector("#examDate");
    if (startEl) startEl.value = saved.startDate || "";
    if (examEl) examEl.value = saved.examDate || examEl.value;
    setData(saved.rows);
  }
  updateCountdown();
  updateStats();
});
    

  async function makePDF() {
  const jsPDFLib = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDFLib) {
    alert("PDF library missing h! Index.html me script tags check kr.");
    return;
  }

  const pdf = new jsPDFLib({ orientation: "portrait", unit: "mm", format: "a4" });

  // 1. Title Block
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("370R JEE ADVANCED TRACKER", 14, 12);
  pdf.setFontSize(8);
  pdf.text("15-DAY QUESTION & LECTURE LOG", 14, 16);

  // 2. Yellow Headers (14 Columns)
  const headers = [[
    "DATE", "LEC",
    "PHY HW", "PHY ILLU",
    "CHEM HW", "CHEM ILLU",
    "MATH HW", "MATH ILLU",
    "PHY DPP", "CHEM DPP", "MATH DPP",
    "PHY PYQ", "CHEM PYQ", "MATH PYQ"
  ]];

  // 3. Extract 15 Rows
  const rows = [...tbody.children].slice(0, 15).map(tr => {
    const getVal = f => {
      const inp = tr.querySelector(`[data-f="${f}"]`);
      return inp ? inp.value : "";
    };

    return [
      getVal("date"),
      getVal("lec"),
      getVal("phyWork"), "",
      getVal("chemWork"), "",
      getVal("mathWork"), "",
      getVal("phyDpp"),
      getVal("chemDpp"),
      getVal("mathDpp"),
      getVal("phyPyq"),
      getVal("chemPyq"),
      getVal("mathPyq")
    ];
  });

  // 4. Totals Calculation
  const data = rowsData().slice(0, 15);
  const totalLec = sumField(data, "lec");
  const pWork = sumField(data, "phyWork"), cWork = sumField(data, "chemWork"), mWork = sumField(data, "mathWork");
  const pDpp = sumField(data, "phyDpp"), cDpp = sumField(data, "chemDpp"), mDpp = sumField(data, "mathDpp");
  const pPyq = sumField(data, "phyPyq"), cPyq = sumField(data, "chemPyq"), mPyq = sumField(data, "mathPyq");

  const totalPyqs = pPyq + cPyq + mPyq;
  const totalQs = pWork + cWork + mWork + pDpp + cDpp + mDpp + totalPyqs;

  // 5. Single AutoTable (Foot option se exact column width lock ho jayegi)
  pdf.autoTable({
    startY: 19,
    head: headers,
    body: rows,
    foot: [[
      "TOTAL",
      totalLec || "",
      pWork || 0, 0,
      cWork || 0, 0,
      mWork || 0, 0,
      pDpp || 0, cDpp || 0, mDpp || 0,
      pPyq || 0, cPyq || 0, mPyq || 0
    ]],
    theme: 'grid',
    styles: {
      fontSize: 6,
      cellPadding: 1.5,
      halign: 'center',
      valign: 'middle',
      textColor: 0,
      lineColor: 150,
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [250, 204, 21], // Yellow Header
      textColor: 0,
      fontStyle: 'bold'
    },
    footStyles: {
      fillColor: [255, 255, 255], // White background for TOTAL row
      textColor: 0,
      fontStyle: 'bold',
      lineColor: 150,
      lineWidth: 0.1
    }
  });

  // 6. Footer Text Summary
  const footerY = pdf.lastAutoTable ? pdf.lastAutoTable.finalY + 6 : 190;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Total questions: ${totalQs}`, 14, footerY);
  pdf.text(`Total lectures: ${totalLec}   |   Total PYQs: ${totalPyqs}`, 14, footerY + 4);

  // Download Output
  pdf.save("15DAY-REPORT-JEE-Advanced.pdf");
  }
function updateDashboard(selectedDateData) {
  let questionsToday = 0;
  let lecturesToday = 0;

  if (selectedDateData) {
    // Sum questions for the selected day
    const hw = Number(selectedDateData.hw) || 0;
    const dpp = Number(selectedDateData.dpp) || 0;
    const pyq = Number(selectedDateData.pyq) || 0;
    
    questionsToday = hw + dpp + pyq;

    // Get lectures for the selected day (change .lectures if your key name is different)
    lecturesToday = Number(selectedDateData.lectures) || 0;
  }

  // Render values to the UI
  document.getElementById('questions-today').textContent = questionsToday;
  document.getElementById('lectures-today').textContent = lecturesToday;
}
