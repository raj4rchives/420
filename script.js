let chapters=[];

const themes={
default:['#eef2f7','#fff','#111827','#667085','#111827','#d0d5dd','#f8fafc'],
midnight:['#0b1020','#111827','#f8fafc','#aab4c5','#7c9cff','#344054','#182033'],
ocean:['#eaf6ff','#fff','#082f49','#466b82','#0369a1','#a7d8f5','#f3faff'],
royal:['#f2efff','#fff','#25135e','#665b88','#5b21b6','#c9bdf2','#faf8ff'],
violet:['#f7f0ff','#fff','#321052','#756182','#7e22ce','#dcc5f5','#fcf8ff'],
plum:['#fff0fa','#fff','#4a1038','#806078','#a21caf','#efc1e3','#fff8fc'],
rose:['#fff1f2','#fff','#4c0519','#7f5664','#be123c','#f6b8c5','#fff8f9'],
coral:['#fff4f0','#fff','#431407','#7c6258','#c2410c','#f2c4b3','#fffaf8'],
sunset:['#fff5ed','#fff','#431407','#765e52','#ea580c','#f2c39e','#fffaf7'],
amber:['#fffbeb','#fff','#451a03','#796b57','#b45309','#ead7a6','#fffdf5'],
forest:['#edf8f1','#fff','#052e16','#557361','#166534','#b8d9c1','#f6fcf8'],
emerald:['#ecfdf5','#fff','#064e3b','#52756b','#047857','#a8d9c7','#f6fffb'],
teal:['#ecfeff','#fff','#083344','#55777c','#0f766e','#a9d9dc','#f5ffff'],
cyan:['#ecfeff','#fff','#083344','#55777c','#0891b2','#a7dce5','#f7ffff'],
sky:['#eff8ff','#fff','#082f49','#58728a','#0284c7','#afd6ef','#f7fbff'],
indigo:['#eef2ff','#fff','#1e1b4b','#626987','#4338ca','#c2c7ef','#f7f8ff'],
slate:['#f1f5f9','#fff','#0f172a','#64748b','#334155','#c5ced8','#f8fafc'],
graphite:['#e9eaec','#fff','#171717','#666','#303030','#bfc1c5','#f5f5f5'],
coffee:['#f7f1eb','#fff','#3b2115','#76645a','#6b3f25','#d9c4b3','#fcfaf8'],
mint:['#effcf7','#fff','#12372a','#5d766c','#15803d','#b9dfce','#f7fffb'],
lavender:['#f5f3ff','#fff','#2e1065','#70668a','#6d28d9','#d1c9ee','#fbfaff'],
cherry:['#fff1f2','#fff','#450a0a','#795a5a','#991b1b','#efb4b4','#fff8f8'],
neon:['#f2fce9','#fff','#17220d','#62705a','#4d7c0f','#c4e39b','#f8fff1'],
mono:['#e5e5e5','#fff','#000','#555','#000','#999','#f7f7f7']
};
function applyTheme(){
 const t=themes[document.getElementById('theme').value]||themes.default;
 document.documentElement.style.setProperty('--bg',t[0]);
 document.documentElement.style.setProperty('--card',t[1]);
 document.documentElement.style.setProperty('--text',t[2]);
 document.documentElement.style.setProperty('--muted',t[3]);
 document.documentElement.style.setProperty('--primary',t[4]);
 document.documentElement.style.setProperty('--border',t[5]);
 document.documentElement.style.setProperty('--soft',t[6]);
 localStorage.setItem('jeeTheme',document.getElementById('theme').value);
}
(function(){
 const saved=localStorage.getItem('jeeTheme')||'default';
 const s=document.getElementById('theme'); if(s) s.value=saved;
 applyTheme();
})();

function checkedItems(){
  return [...document.querySelectorAll('.options input:checked')].map(x=>x.value);
}

function addChapter(){
  const subject=document.getElementById('subject').value;
  const chapter=document.getElementById('chapter').value.trim();
  const lectures=parseInt(document.getElementById('lectures').value);
  if(!chapter || !lectures || lectures<1){alert('Enter chapter name and number of lectures.');return;}
  chapters.push({
    subject,chapter,lectures,
    mains:document.getElementById('mains').value,
    adv:document.getElementById('adv').value,
    items:checkedItems()
  });
  document.getElementById('chapter').value='';
  renderList();
  generatePreview();
}

function removeChapter(i){chapters.splice(i,1);renderList();generatePreview()}

function renderList(){
  const el=document.getElementById('chapterList');
  el.innerHTML=chapters.length ? chapters.map((c,i)=>`
    <div class="chapter">
      <div><b>${i+1}. ${escapeHtml(c.chapter)}</b><br>
      <small>${c.subject} • ${c.lectures} Lect • MAINS LEVEL: ${c.mains} • ADV LEVEL: ${c.adv}</small></div>
      <button class="danger" onclick="removeChapter(${i})">REMOVE</button>
    </div>`).join('') : '';
}

function generatePreview(){
  if(!chapters.length){document.getElementById('preview').innerHTML='';return;}
  let html='<table><thead><tr>';
  html+='<th>#</th><th>Chapter Name</th><th>Lecture Tracker</th><th>Total Lec</th><th>Lec Comp</th><th>MAINS LEVEL</th><th>ADV LEVEL</th>';
  const allItems=[...new Set(chapters.flatMap(c=>c.items))];
  allItems.forEach(x=>html+=`<th>${x}</th>`);
  html+='</tr></thead><tbody>';

  chapters.forEach((c,i)=>{
    html+=`<tr><td>${i+1}</td><td class="chapter-name">${escapeHtml(c.chapter)}</td><td>`;
    for(let n=1;n<=c.lectures;n++) html+=`<span class="lecture">□${n}</span> `;
    html+=`</td><td>${c.lectures}</td><td>□</td><td>${c.mains}</td><td>${c.adv}</td>`;
    allItems.forEach(x=>html+=`<td class="check">${c.items.includes(x)?'□':''}</td>`);
    html+='</tr>';
  });
  html+='</tbody></table>';
  document.getElementById('preview').innerHTML=html;
}

function clearAll(){
  if(confirm('Clear all chapters?')){chapters=[];renderList();generatePreview();}
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function downloadPDF(){
  if(!chapters.length){alert('Add at least one chapter first.');return;}
  generatePreview();
  const allItems=[...new Set(chapters.flatMap(c=>c.items))];
  let rows='';
  chapters.forEach((c,i)=>{
    rows+=`<tr><td>${i+1}</td><td class="left">${escapeHtml(c.chapter)}</td><td class="lectures">`;
    for(let n=1;n<=c.lectures;n++) rows+=`□${n} `;
    rows+=`</td><td>${c.lectures}</td><td>□</td><td>${c.mains}</td><td>${c.adv}</td>`;
    allItems.forEach(x=>rows+=`<td>${c.items.includes(x)?'□':''}</td>`);
    rows+='</tr>';
  });
  const title=chapters[0].subject;
  const win=window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html><head><title>JEE Syllabus Tracker</title>
  <style>
  @page{size:A4 landscape;margin:7mm}
  *{box-sizing:border-box}
  body{font-family:Arial,Helvetica,sans-serif;margin:0;color:#000}
  h1{text-align:center;font-size:18px;margin:0 0 2px}
  .subtitle{text-align:center;font-size:9px;margin-bottom:8px}
  h2{font-size:13px;margin:5px 0}
  table{border-collapse:collapse;width:100%;font-size:7.5px}
  th,td{border:1.3px solid #000;padding:3px 2px;text-align:center;height:22px}
  th{background:#000!important;color:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-weight:bold}
  .left{text-align:left;font-weight:bold;min-width:80px}
  .lectures{text-align:left;font-size:7px;line-height:14px}
  .foot{font-size:7px;margin-top:5px}
  </style></head><body>
  <h1>JEE SYLLABUS TRACKER</h1>
  <div class="subtitle">Offline Printable • Tick everything by hand</div>
  <h2>${title}</h2>
  <table><thead><tr>
  <th>#</th><th>Chapter Name</th><th>Lecture Tracker</th><th>Total Lec</th><th>Lec Comp</th><th>MAINS<br>LEVEL</th><th>ADV<br>LEVEL</th>
  ${allItems.map(x=>`<th>${x}</th>`).join('')}
  </tr></thead><tbody>${rows}</tbody></table>
  <div class="foot">JEE SYLLABUS TRACKER • Offline Printable • Tick everything by hand</div>
  <script>window.onload=()=>setTimeout(()=>window.print(),300)<\/script>
  </body></html>`);
  win.document.close();
}
