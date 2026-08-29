const $ = id => document.getElementById(id);
let items = [{name:"Monthly Fee / Membership", amount:""}];
let qrData = localStorage.getItem("receiptFlowQR") || "";

function formatMoney(v){
  const n = Number(v || 0);
  return n.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2});
}
function receiptNumber(){
  return "RF-" + Date.now().toString().slice(-7);
}
function renderItems(){
  $("items").innerHTML = items.map((item,i)=>`
    <div class="item-row">
      <input value="${item.name.replace(/"/g,"&quot;")}" placeholder="Item / fee name" oninput="updateItem(${i},'name',this.value)">
      <input type="number" min="0" value="${item.amount}" placeholder="Amount" oninput="updateItem(${i},'amount',this.value)">
      <button type="button" onclick="deleteItem(${i})">×</button>
    </div>`).join("");
}
function updateItem(i,key,value){items[i][key]=value;renderPreview();}
function deleteItem(i){if(items.length>1){items.splice(i,1);renderItems();renderPreview();}}
$("addItem").onclick=()=>{items.push({name:"",amount:""});renderItems();};

function renderPreview(){
  const name=$("businessName").value.trim() || $("businessType").value+" RECEIPT";
  const info=$("businessInfo").value.trim();
  const customer=$("customerName").value.trim() || "Customer";
  const id=$("receiptId").value.trim() || receiptNumber();
  const date=$("receiptDate").value ? new Date($("receiptDate").value+"T00:00:00").toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB");
  const status=$("paymentStatus").value;
  const total=items.reduce((s,x)=>s+(Number(x.amount)||0),0);
  $("receiptPreview").innerHTML=`
    <div class="r-title">${escapeHtml(name)}</div>
    ${info?`<div class="r-info">${escapeHtml(info)}</div>`:""}
    <div class="r-id">RECEIPT ID: ${escapeHtml(id)}</div>
    <div class="r-line"></div>
    ${items.map(x=>`<div class="r-row"><span>${escapeHtml(x.name||"Item")}</span><span>₹ ${formatMoney(x.amount)}</span></div>`).join("")}
    <div class="r-line"></div>
    <div class="r-row r-total"><span>TOTAL</span><span>₹ ${formatMoney(total)}</span></div>
    <div class="r-meta"><span>${escapeHtml(customer)}</span><span>${escapeHtml(date)}</span></div>
    <div class="r-meta"><span>STATUS: ${escapeHtml(status)}</span><span>THANK YOU</span></div>
    <div class="qr-wrap">${qrData?`<img src="${qrData}"><div class="scan">SCAN TO PAY</div>`:`<div class="no-qr">PAYMENT QR NOT ADDED</div>`}</div>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

$("receiptForm").addEventListener("input",renderPreview);
$("receiptDate").value=new Date().toISOString().slice(0,10);

$("qrUpload").onchange=e=>{
 const file=e.target.files[0]; if(!file)return;
 const reader=new FileReader();
 reader.onload=()=>{qrData=reader.result;localStorage.setItem("receiptFlowQR",qrData);$("removeQr").style.display="block";renderPreview();};
 reader.readAsDataURL(file);
};
$("removeQr").onclick=()=>{qrData="";localStorage.removeItem("receiptFlowQR");$("qrUpload").value="";$("removeQr").style.display="none";renderPreview();};

$("saveDraft").onclick=()=>{
 const draft={businessType:$("businessType").value,businessName:$("businessName").value,businessInfo:$("businessInfo").value,customerName:$("customerName").value,receiptId:$("receiptId").value,receiptDate:$("receiptDate").value,paymentStatus:$("paymentStatus").value,items};
 localStorage.setItem("receiptFlowDraft",JSON.stringify(draft)); alert("Details saved in this browser.");
};
function loadDraft(){
 const d=JSON.parse(localStorage.getItem("receiptFlowDraft")||"null"); if(!d)return;
 ["businessType","businessName","businessInfo","customerName","receiptId","receiptDate","paymentStatus"].forEach(k=>{if(d[k]!==undefined)$(k).value=d[k]});
 if(d.items)items=d.items;
}
function printReceipt(){
 renderPreview();
 const content=$("receiptPreview").innerHTML;
 const w=window.open("","_blank");
 w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title><style>
 @page{size:80mm auto;margin:0}*{box-sizing:border-box}body{margin:0;background:#fff;font-family:Arial,sans-serif}.receipt{width:80mm;padding:8mm;color:#111}
 .r-title{text-align:center;font-size:18px;letter-spacing:.08em;font-weight:900}.r-info{text-align:center;font-size:9px;margin:5px}.r-id{border:1px solid #111;text-align:center;padding:6px;margin:12px auto;width:90%;font-size:10px}.r-line{border-top:1px solid #111;margin:12px 0}.r-row{display:flex;justify-content:space-between;gap:8px;padding:5px 0;font-size:10px}.r-total{font-size:12px;font-weight:900}.r-meta{display:flex;justify-content:space-between;font-size:8px;margin-top:7px}.qr-wrap{text-align:center;margin-top:15px}.qr-wrap img{width:32mm;height:32mm;object-fit:contain}.scan{font-size:9px;margin-top:4px}.no-qr{font-size:9px;color:#666}
 </style></head><body><div class="receipt">${content}</div><script>window.onload=()=>setTimeout(()=>window.print(),200)<\/script></body></html>`);
 w.document.close();
}
$("downloadPdf").onclick=printReceipt;
$("printPreview").onclick=printReceipt;

loadDraft(); renderItems(); renderPreview();
if(qrData)$("removeQr").style.display="block";
