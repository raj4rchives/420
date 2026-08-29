const $ = id => document.getElementById(id);
let receiptLogoData = localStorage.getItem("cartyWebReceiptLogo") || "";

function formatMoney(v){
  const n = Number(v || 0);
  return n.toLocaleString("en-IN", {maximumFractionDigits:2});
}
function receiptNumber(){ return "CW-" + Date.now().toString().slice(-9); }
function escapeHtml(s){ return String(s ?? "").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function prettyDate(value){
  if(!value) return "—";
  return new Date(value + "T00:00:00").toLocaleDateString("en-IN", {day:"numeric",month:"long",year:"numeric"});
}
function prettyMonth(value){
  if(!value) return "Rent period not selected";
  return new Date(value + "-01T00:00:00").toLocaleDateString("en-IN", {month:"long",year:"numeric"});
}

const presets = {
  reminder: () => `Hello ${$("customerName").value.trim() || ""}, please pay the rent of ₹${formatMoney($("rentAmount").value)}${$("dueDate").value ? ` by ${prettyDate($("dueDate").value)}` : " before the due date"}. Thank you.`,
  thankyou: () => `Thank you for your payment! Your rent for ${prettyMonth($("rentMonth").value)} has been received successfully.`,
  received: () => `Payment received successfully. Thank you for paying your rent on time.`
};

function renderPreview(){
  const property = $("businessName").value.trim() || "CARTYWEB RENT RECEIPT";
  const propertyInfo = $("propertyInfo").value.trim();
  const owner = $("ownerName").value.trim() || "Property Owner";
  const contact = $("businessInfo").value.trim();
  const tenant = $("customerName").value.trim() || "Tenant Name";
  const status = $("paymentStatus").value;
  const amount = $("rentAmount").value;
  const rentMonth = prettyMonth($("rentMonth").value);
  const paymentDate = prettyDate($("receiptDate").value);
  const dueDate = prettyDate($("dueDate").value);
  const method = $("paymentMethod").value;
  const account = $("paymentAccount").value.trim();
  const id = $("receiptId").value.trim() || receiptNumber();
  const message = $("customMessage").value.trim();
  const statusText = status === "PAID" ? "PAYMENT RECEIVED" : status === "PENDING" ? "PAYMENT PENDING" : "PARTIAL PAYMENT";
  const statusIcon = status === "PAID" ? "✓" : status === "PENDING" ? "!" : "◐";

  const logoMarkup = receiptLogoData ? `<img class="receipt-logo-image" src="${receiptLogoData}" alt="Receipt logo">` : `<span>C</span>`;
  $("receiptPreview").innerHTML = `
    <div class="receipt-top">
      <div class="receipt-logo">${logoMarkup}<div><b>Carty</b><b>Web</b></div></div>
      <div class="status-box status-${status.toLowerCase()}"><span>${statusIcon}</span><small>${statusText}</small></div>
    </div>
    <div class="r-property">${escapeHtml(property)}</div>
    ${propertyInfo ? `<div class="r-info">${escapeHtml(propertyInfo)}</div>` : ""}
    <div class="rent-period">Rent for ${escapeHtml(rentMonth)}</div>
    <div class="r-amount">₹${formatMoney(amount)}</div>
    <div class="r-dates"><span>${status === "PAID" ? "Paid on" : "Receipt date"}: <b>${escapeHtml(paymentDate)}</b></span>${$("dueDate").value ? `<span>Due: <b>${escapeHtml(dueDate)}</b></span>` : ""}</div>

    <div class="r-dash"></div>
    <div class="detail-block"><strong>TO: ${escapeHtml(tenant)}</strong><div class="detail-sub">Tenant / Rent payer</div></div>
    <div class="detail-block"><strong>PROPERTY</strong><div class="detail-sub">${escapeHtml(propertyInfo || property)}</div></div>
    <div class="r-dash"></div>
    <div class="detail-block"><strong>FROM: ${escapeHtml(owner)}</strong>${contact ? `<div class="detail-sub">${escapeHtml(contact)}</div>` : ""}</div>
    <div class="detail-block"><strong>PAYMENT</strong><div class="detail-sub">${escapeHtml(method)}${account ? ` • ${escapeHtml(account)}` : ""}</div></div>
    <div class="r-dash"></div>
    <div class="reference-row"><span>Reference ID</span><b>${escapeHtml(id)}</b></div>
    ${message ? `<div class="message-card"><div class="message-label">MESSAGE</div><div>${escapeHtml(message)}</div></div>` : ""}
    <div class="receipt-footer">CARTYWEB • RENT PAYMENT RECORD</div>
  `;
}

$("receiptForm").addEventListener("input", renderPreview);
$("receiptForm").addEventListener("change", renderPreview);

$("clearMessage").onclick = () => { $("customMessage").value = ""; renderPreview(); };
document.querySelectorAll("[data-preset]").forEach(btn => {
  btn.onclick = () => { $("customMessage").value = presets[btn.dataset.preset](); renderPreview(); };
});

$("saveDraft").onclick = () => {
  const ids = ["businessName","propertyInfo","ownerName","businessInfo","customerName","rentMonth","rentAmount","paymentStatus","receiptDate","dueDate","paymentMethod","receiptId","paymentAccount","customMessage"];
  const draft = Object.fromEntries(ids.map(id => [id, $(id).value]));
  localStorage.setItem("cartyWebRentReceiptDraft", JSON.stringify(draft));
  localStorage.setItem("cartyWebReceiptLogo", receiptLogoData);
  alert("Details saved in this browser.");
};
function loadDraft(){
  const d = JSON.parse(localStorage.getItem("cartyWebRentReceiptDraft") || "null");
  if(!d) return;
  Object.keys(d).forEach(id => { if($(id)) $(id).value = d[id]; });
}

function printReceipt(){
  renderPreview();
  const content = $("receiptPreview").innerHTML;
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>CartyWeb Rent Receipt</title><link href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>
    @page{size:A5;margin:12mm}*{box-sizing:border-box}body{margin:0;background:#fff;font-family:"Teko",Arial,sans-serif;color:#172033}.receipt{max-width:170mm;margin:auto}.receipt-top{display:flex;justify-content:space-between;align-items:center}.receipt-logo{display:flex;align-items:center;gap:8px;font-size:20px}.receipt-logo-image{width:44px;height:44px;object-fit:contain;border-radius:9px;border:1px solid #e1e3ea;padding:3px}.receipt-logo>span{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:#5146d9;color:#fff;font-weight:900}.receipt-logo div{display:flex;flex-direction:column;line-height:.8}.receipt-logo b:last-child{font-weight:700}.status-box{padding:8px 10px;border:1px solid #ccc;border-radius:8px;font-size:9px;text-align:center}.status-box span{font-size:18px;display:block}.r-property{font-size:12px;margin-top:20px;font-weight:800;letter-spacing:.08em}.r-info,.rent-period,.detail-sub{font-size:10px;color:#667085;margin-top:4px}.r-amount{font-size:38px;font-weight:900;margin:10px 0}.r-dates{display:flex;justify-content:space-between;gap:8px;font-size:9px;color:#667085}.r-dash{border-top:1px dashed #b8bfcc;margin:16px 0}.detail-block{margin:10px 0;font-size:11px}.reference-row{display:flex;justify-content:space-between;font-size:10px}.message-card{margin-top:18px;padding:12px;background:#f3f4f8;border-radius:8px;font-size:10px;line-height:1.5}.message-label{font-size:8px;font-weight:900;letter-spacing:.12em;color:#5146d9;margin-bottom:5px}.receipt-footer{text-align:center;margin-top:18px;font-size:8px;color:#98a2b3}.status-paid{border-color:#54c878}.status-pending{border-color:#e4a43a}.status-partial{border-color:#756ee6}
  </style></head><body><div class="receipt">${content}</div><script>window.onload=()=>setTimeout(()=>window.print(),200)<\/script></body></html>`);
  w.document.close();
}

$("logoInput").addEventListener("change", e => {
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  if(file.type !== "image/png"){ alert("Please select a PNG logo."); e.target.value = ""; return; }
  const reader = new FileReader();
  reader.onload = () => {
    receiptLogoData = reader.result;
    localStorage.setItem("cartyWebReceiptLogo", receiptLogoData);
    $("logoFileName").textContent = file.name;
    renderPreview();
  };
  reader.readAsDataURL(file);
});

$("removeLogo").onclick = () => {
  receiptLogoData = "";
  $("logoInput").value = "";
  $("logoFileName").textContent = "No logo selected";
  localStorage.removeItem("cartyWebReceiptLogo");
  renderPreview();
};

$("downloadPdf").onclick = printReceipt;
$("printPreview").onclick = printReceipt;

$("receiptDate").value = new Date().toISOString().slice(0,10);
loadDraft();
if(receiptLogoData) $("logoFileName").textContent = "Saved logo ready";
renderPreview();
