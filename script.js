const ITEMS=["SHORT NOTES","DPP","HW","MODULE","PYQ","TEST","R1","R2","R3"];
const SUBJECTS=["PHYSICS","CHEMISTRY","MATHEMATICS"];
let chapters=JSON.parse(localStorage.getItem("jeeFilledTracker")||"[]");

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function init(){
 $("trackingItems").innerHTML=ITEMS.map(x=>`<label><input type="checkbox" value="${x}" checked>${x}</label>`).join("");
 render();
}
function save(){localStorage.setItem("jeeFilledTracker",JSON.stringify(chapters));}

$("chapterForm").addEventListener("submit",e=>{
 e.preventDefault();
 const name=$("chapterName").value.trim(), total=Number($("totalLectures").value);
 if(!name||!Number.isInteger(total)||total<1)return alert("Enter chapter name and total lectures.");
 chapters.push({
  subject:$("subject").value,name,total,
  mains:$("mainsLevel").value,adv:$("advLevel").value,
  lectures:Array(total).fill(false),
  lecComp:false,
  tracking:Object.fromEntries(ITEMS.map(i=>[i,[...document.querySelectorAll("#trackingItems input:checked")].some(x=>x.value===i)?false:null]))
 });
 save();$("chapterName").value="";render();
});

function update(index,key,value){
 const c=chapters[index];
 if(key==="mains"||key==="adv")c[key]=value;
 else if(key==="lecComp")c.lecComp=value;
 else if(key.startsWith("lecture:"))c.lectures[Number(key.split(":")[1])]=value;
 else if(key.startsWith("track:"))c.tracking[key.split(":")[1]]=value;
 save();render();
}
function removeChapter(i){chapters.splice(i,1);save();render();}

function tableFor(subject, printable=false){
 const rows=chapters.filter(c=>c.subject===subject);
 if(!rows.length)return "";
 const headers=["#","Chapter Name","Lecture Tracker","Total Lec","Lec Comp","MAINS LEVEL","ADV LEVEL",...ITEMS,""];
 return `<section class="subject-block"><h3 class="${printable?"preview-subject":"subject-heading"}">${subject}</h3><div class="table-wrap"><table class="tracker-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${
 rows.map((c,localIndex)=>{
  const i=chapters.indexOf(c);
  const lectures=Array.from({length:c.total},(_,n)=>{
   const checked=c.lectures[n]?"checked":"";
   return printable?`<span>□ ${n+1}</span>`:`<label><input class="status-check" type="checkbox" ${checked} onchange="update(${i},'lecture:${n}',this.checked)"> ${n+1}</label>`;
  }).join("");
  const lecComp=printable?(c.lecComp?"☑":"□"):`<input class="status-check" type="checkbox" ${c.lecComp?"checked":""} onchange="update(${i},'lecComp',this.checked)">`;
  const levels=printable?`<td>${esc(c.mains)}</td><td>${esc(c.adv)}</td>`:`<td><select class="level-select" onchange="update(${i},'mains',this.value)">${["□","Easy","Medium","Hard"].map(v=>`<option ${c.mains===v?"selected":""}>${v}</option>`).join("")}</select></td><td><select class="level-select" onchange="update(${i},'adv',this.value)">${["□","Easy","Medium","Hard"].map(v=>`<option ${c.adv===v?"selected":""}>${v}</option>`).join("")}</select></td>`;
  const tracking=ITEMS.map(item=>{
   if(c.tracking[item]===null)return "<td>—</td>";
   return printable?`<td>${c.tracking[item]?"☑":"□"}</td>`:`<td><input class="track-check" type="checkbox" ${c.tracking[item]?"checked":""} onchange="update(${i},'track:${item}',this.checked)"></td>`;
  }).join("");
  return `<tr><td>${localIndex+1}</td><td class="chapter">${esc(c.name)}</td><td><div class="lecture-check">${lectures}</div></td><td>${c.total}</td><td>${lecComp}</td>${levels}${tracking}<td>${printable?"":`<button class="delete-row" onclick="removeChapter(${i})">REMOVE</button>`}</td></tr>`;
 }).join("")
}</tbody></table></div></section>`;
}

function render(){
 $("trackerContent").innerHTML=chapters.length?SUBJECTS.map(s=>tableFor(s)).join(""):'<div class="empty">No chapters saved yet.</div>';
 renderPreview();
}
function renderPreview(){
 $("previewContent").innerHTML=chapters.length?
 `<div class="print-title">JEE SYLLABUS TRACKER</div><p class="print-sub">Offline Printable • Filled progress report</p>${SUBJECTS.map(s=>tableFor(s,true)).join("")}`:
 '<div class="empty">Your PDF preview will appear here.</div>';
}

$("previewBtn").onclick=()=>{renderPreview();location.hash="preview";};
$("saveNow").onclick=()=>{save();alert("Tracker saved successfully in this browser.");};
$("clearAll").onclick=()=>{if(confirm("Delete all saved chapters and progress?")){chapters=[];save();render();}};
$("themeToggle").onclick=()=>document.body.classList.toggle("dark");

/** Opens a printer-friendly A4 landscape page. Choose 'Save as PDF' to download the filled tracker. */
$("downloadPdf").onclick=()=>{
 if(!chapters.length)return alert("Add at least one chapter first.");
 const printHTML=`<!doctype html><html><head><meta charset="UTF-8"><title>Filled JEE Syllabus Tracker</title>
 <style>@page{size:A4 landscape;margin:7mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#000;margin:0}.print-title{text-align:center;font-size:18px;font-weight:bold;margin:0 0 2px}.print-sub{text-align:center;font-size:9px;margin:0 0 8px}.preview-subject{font-size:12px;margin:7px 0 4px}.tracker-table{width:100%;border-collapse:collapse;font-size:7px}.tracker-table th,.tracker-table td{border:1.3px solid #000;padding:3px 2px;text-align:center;vertical-align:middle}.tracker-table th{background:#000!important;color:#fff!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}.chapter{text-align:left!important;font-weight:bold}.lecture-check{line-height:13px;text-align:left}.lecture-check span{display:inline-block;margin-right:4px}.subject-block{page-break-inside:avoid}.table-wrap{width:100%}</style></head><body>
 <div class="print-title">JEE SYLLABUS TRACKER</div><p class="print-sub">Offline Printable • Filled progress report</p>
 ${SUBJECTS.map(s=>tableFor(s,true)).join("")}
 <script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>`;
 const w=window.open("","_blank");
 w.document.write(printHTML);w.document.close();
};
init();
