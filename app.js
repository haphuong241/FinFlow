/* ============================================
   FINFLOW — app.js  (Interactive Edition)
   ============================================ */
'use strict';

/* ===================================================
   DATA STORES
   =================================================== */
const MONTHS      = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
const MONTHS_FULL = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6'];

const CHART_COLORS = {
  navy:'#1E3A8A', blue:'#3B82F6', emerald:'#10B981',
  orange:'#F59E0B', red:'#EF4444', purple:'#8B5CF6', teal:'#06B6D4', pink:'#EC4899'
};

/* ---- Chart base data ---- */
const revenueData  = [3420,3780,4100,4350,4650,4823].map(v=>v*1e6);
const expenseData  = [2680,2820,2950,3050,3120,3156].map(v=>v*1e6);
const cashFlowData = [740,960,1150,1300,1530,1667].map(v=>v*1e6);
const trendRevenue = [3100,3250,3420,3600,3780,4100,4350,4500,4650,4750,4820,4920].map(v=>v*1e6);
const trendExpense = [2500,2600,2680,2750,2820,2950,3050,3100,3120,3150,3160,3180].map(v=>v*1e6);
const trendProfit  = trendRevenue.map((r,i)=>r-trendExpense[i]);
const expenseCats  = {
  labels:['Nhân sự','Vận hành','Marketing','Logistics','Công nghệ','Mặt bằng','Khác'],
  values:[1248,624,412,298,186,85,303],
  colors:['#1E3A8A','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#EC4899']
};
const deptLabels   = ['Nhân sự','Marketing','Vận hành','Logistics','Công nghệ','Mặt bằng'];
const budgetPlan   = [1400,358,1000,660,224,500];
const budgetActual = [1248,412,624,298,186,360];
const sparkData    = [[32,38,35,42,40,48],[28,30,29,31,33,32],[10,12,11,14,13,17],[8,9,8,10,9,9],[14,13,15,14,13,12],[92,93,93,94,94,95]];

/* ---- Mutable stores ---- */
let transactions = [
  {id:'TXN-001',date:'06/06/2026',type:'income', cat:'Dịch vụ',   desc:'Hợp đồng dịch vụ ABC Corp',      amount:285000000, owner:'Trần Minh',  dept:'Sales',   note:'Q2 2026'},
  {id:'TXN-002',date:'05/06/2026',type:'expense',cat:'Marketing', desc:'Chi phí Marketing Q2',            amount:142500000, owner:'Lê Hoa',     dept:'MKT',     note:'Campaign tháng 6'},
  {id:'TXN-003',date:'05/06/2026',type:'income', cat:'Bán hàng',  desc:'Bán hàng sản phẩm X',            amount:198000000, owner:'Nguyễn Anh', dept:'Sales',   note:''},
  {id:'TXN-004',date:'04/06/2026',type:'expense',cat:'Mặt bằng',  desc:'Thuê mặt bằng VP HCM',           amount:85000000,  owner:'Admin',      dept:'Admin',   note:'Tháng 6'},
  {id:'TXN-005',date:'04/06/2026',type:'expense',cat:'Công nghệ', desc:'Phần mềm & Hạ tầng Cloud',       amount:56200000,  owner:'IT Dept',    dept:'IT',      note:'AWS, Slack, Notion'},
  {id:'TXN-006',date:'03/06/2026',type:'income', cat:'Đầu tư',    desc:'Lợi nhuận danh mục đầu tư',      amount:125000000, owner:'CFO',        dept:'Finance', note:'Portfolio Q2'},
  {id:'TXN-007',date:'03/06/2026',type:'expense',cat:'Nhân sự',   desc:'Lương tháng 6 - Toàn công ty',   amount:620000000, owner:'HR Dept',    dept:'HR',      note:'240 nhân viên'},
  {id:'TXN-008',date:'02/06/2026',type:'expense',cat:'Logistics',  desc:'Chi phí vận chuyển tháng 6',    amount:98000000,  owner:'Log Dept',   dept:'Log',     note:'Bắc-Nam'},
  {id:'TXN-009',date:'02/06/2026',type:'income', cat:'Bán hàng',  desc:'Đơn hàng XYZ Enterprise',        amount:340000000, owner:'Sales Dept', dept:'Sales',   note:'Contract #456'},
  {id:'TXN-010',date:'01/06/2026',type:'expense',cat:'Vận hành',  desc:'Chi phí điện nước, văn phòng',   amount:42000000,  owner:'Ops Dept',   dept:'Ops',     note:''},
];

let budgets = [
  {id:'BUD-001',name:'Ngân sách Nhân sự T6/2026',    period:'Tháng',dept:'HR',       cat:'Nhân sự',   amount:1400000000, used:1248000000, note:'Lương + phúc lợi'},
  {id:'BUD-002',name:'Ngân sách Marketing T6/2026',  period:'Tháng',dept:'Marketing',cat:'Marketing', amount:358000000,  used:412000000,  note:'Quảng cáo online + offline'},
  {id:'BUD-003',name:'Ngân sách Vận hành T6/2026',   period:'Tháng',dept:'Ops',      cat:'Vận hành',  amount:1000000000, used:624000000,  note:'Chi phí hoạt động'},
  {id:'BUD-004',name:'Ngân sách Logistics T6/2026',  period:'Tháng',dept:'Logistics',cat:'Logistics', amount:660000000,  used:298000000,  note:'Vận chuyển hàng hóa'},
  {id:'BUD-005',name:'Ngân sách Công nghệ T6/2026',  period:'Tháng',dept:'IT',       cat:'Công nghệ', amount:224000000,  used:186400000,  note:'Hạ tầng & phần mềm'},
  {id:'BUD-006',name:'Ngân sách Mặt bằng T6/2026',   period:'Tháng',dept:'Admin',    cat:'Mặt bằng',  amount:500000000,  used:360000000,  note:'Thuê văn phòng'},
];

let alerts = [
  {id:1, type:'danger',  icon:'⚠️', title:'Vượt ngân sách Marketing',        desc:'Chi phí Marketing tháng 6 đã đạt 412,000,000 ₫, vượt 15.1% so với kế hoạch 358,000,000 ₫.',  dept:'Phòng Marketing', time:'06/06/2026 09:30', badge:'Chưa xử lý',   badgeClass:'danger', status:'open'},
  {id:2, type:'warning', icon:'📉', title:'Dòng tiền nguy cơ âm tháng 8',    desc:'AI dự báo dòng tiền tháng 8/2026 có 62% xác suất xuống dưới ngưỡng an toàn 500 triệu.',       dept:'Dự báo AI',       time:'06/06/2026 08:15', badge:'Cần chú ý',    badgeClass:'warning',status:'open'},
  {id:3, type:'danger',  icon:'🔴', title:'Tỷ suất lợi nhuận thấp hơn target',desc:'Profit margin tháng 5 đạt 18.2%, thấp hơn mục tiêu 22%. Cần rà soát lại cơ cấu chi phí.',   dept:'Ban Giám đốc',    time:'01/06/2026 14:00', badge:'Ưu tiên cao',  badgeClass:'danger', status:'open'},
  {id:4, type:'warning', icon:'💡', title:'Chi phí Logistics bất thường',     desc:'Chi phí Logistics tháng 6 tăng 30% so với tháng 5. AI phát hiện pattern bất thường.',        dept:'Phòng Logistics', time:'05/06/2026 11:20', badge:'Đang xem xét', badgeClass:'warning',status:'open'},
  {id:5, type:'info',    icon:'🤖', title:'AI Dự báo Q3/2026 hoàn thành',     desc:'Mô hình AI đã hoàn thành phân tích và tạo báo cáo dự báo Q3/2026. Accuracy score: 94.7%.',  dept:'Hệ thống AI',     time:'06/06/2026 07:00', badge:'Thông tin',    badgeClass:'info',   status:'open'},
];

let txEditIndex = null;
let forecastMonths = 3;
const chartInstances = {};

/* ===================================================
   UTILITIES
   =================================================== */
function fmtVND(v) {
  if (v >= 1e9) return (v/1e9).toFixed(2)+' tỷ';
  if (v >= 1e6) return (v/1e6).toFixed(0)+' tr';
  return v.toLocaleString('vi-VN');
}

function today() {
  const d = new Date(2026,5,6);
  return d.toLocaleDateString('vi-VN');
}

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

function applyChartDefaults() {
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  Chart.defaults.color = dark ? '#94A3B8' : '#6B7280';
  Chart.defaults.borderColor = dark ? '#334155' : '#E5E7EB';
  Chart.defaults.font.family = 'Inter';
  Chart.defaults.font.size = 12;
}

/* ===================================================
   TOAST
   =================================================== */
function showToast(msg, type='success') {
  // Remove old toasts
  document.querySelectorAll('.ff-toast').forEach(t=>t.remove());
  const colors = {success:'#10B981', error:'#EF4444', info:'#1E3A8A', warning:'#F59E0B'};
  const t = document.createElement('div');
  t.className = 'ff-toast';
  t.innerHTML = `<span style="color:${colors[type]||colors.success};font-size:16px">${
    type==='success'?'✓':type==='error'?'✕':type==='warning'?'⚠':'ℹ'
  }</span> <span>${msg}</span>`;
  t.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:99999;
    background:var(--card);color:var(--text);
    border:1px solid var(--border);border-left:4px solid ${colors[type]||colors.success};
    border-radius:10px;padding:13px 20px;font-size:13px;font-weight:500;
    box-shadow:0 8px 28px rgba(0,0,0,.18);display:flex;align-items:center;gap:10px;
    animation:ffSlideUp .25s ease;min-width:260px;max-width:380px;`;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transition='all .3s'; },3000);
  setTimeout(()=>t.remove(),3400);
}

const toastStyle = document.createElement('style');
toastStyle.textContent = `@keyframes ffSlideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(toastStyle);

/* ===================================================
   MODAL SYSTEM
   =================================================== */
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.style.display = 'flex';
  // Force reflow then add class for opacity transition
  void m.offsetWidth;
  m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('open');
  setTimeout(()=>{ m.style.display='none'; },200);
}
function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

/* ===================================================
   PAGE NAVIGATION
   =================================================== */
function switchPage(name) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const page = document.getElementById('page-'+name);
  if (page) page.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-page="${name}"]`);
  if (nav) nav.classList.add('active');
  const titles = {home:'Giới Thiệu', dashboard:'Dashboard',analytics:'Analytics',budget:'Ngân Sách',
    transactions:'Thu Chi',forecast:'Dự Báo AI',reports:'Báo Cáo',alerts:'Cảnh Báo',settings:'Cài Đặt'};
  const el = document.getElementById('pageTitle');
  if (el) el.textContent = titles[name]||name;
  document.getElementById('sidebar').classList.remove('mobile-open');
  // Render page-specific content
  setTimeout(()=>{
    if (name==='dashboard')    { initDashboardCharts(); initSparklines(); }
    if (name==='analytics')      initAnalyticsCharts();
    if (name==='forecast')       initForecastChart(forecastMonths);
    if (name==='transactions') { renderTransactions(transactions); }
    if (name==='budget')         renderBudgets();
    if (name==='alerts')         renderAlerts();
  },50);
}

/* ===================================================
   DARK MODE
   =================================================== */
function toggleDark() {
  const html = document.documentElement;
  const dark = html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme', dark?'light':'dark');
  document.querySelector('.sun-icon').style.display  = dark?'block':'none';
  document.querySelector('.moon-icon').style.display = dark?'none':'block';
  const dt2 = document.getElementById('darkToggle2');
  if (dt2) dt2.checked = !dark;
  setTimeout(()=>{
    const act = document.querySelector('.page.active')?.id;
    if (act==='page-dashboard')  { initDashboardCharts(); initSparklines(); }
    if (act==='page-analytics')    initAnalyticsCharts();
    if (act==='page-forecast')     initForecastChart(forecastMonths);
  },50);
}

/* ===================================================
   KPI COUNTER ANIMATION
   =================================================== */
function animateCounters() {
  document.querySelectorAll('.kpi-value[data-target]').forEach(el=>{
    const target  = parseFloat(el.dataset.target);
    if (!target) return;
    const isPct   = el.classList.contains('percent');
    const dur=1800, steps=60;
    let step=0;
    // Show final immediately if already animated
    el.textContent = isPct ? '0%' : '0 ₫';
    const timer=setInterval(()=>{
      step++;
      const v = target * Math.min(step/steps, 1);
      if (isPct) el.textContent = v.toFixed(1)+'%';
      else el.textContent = v>=1e9 ? (v/1e9).toFixed(2)+' tỷ ₫' : (v/1e6).toFixed(0)+' tr ₫';
      if (step>=steps) {
        clearInterval(timer);
        if (isPct) el.textContent = target.toFixed(1)+'%';
        else el.textContent = target>=1e9 ? (target/1e9).toFixed(2)+' tỷ ₫' : (target/1e6).toFixed(0)+' tr ₫';
      }
    }, dur/steps);
  });
}

/* ===================================================
   SPARKLINES
   =================================================== */
function initSparklines() {
  const cols = [CHART_COLORS.navy,CHART_COLORS.red,CHART_COLORS.emerald,
                CHART_COLORS.orange,CHART_COLORS.purple,CHART_COLORS.teal];
  sparkData.forEach((data,i)=>{
    const c = document.getElementById('spark'+(i+1));
    if (!c) return;
    destroyChart('spark'+(i+1));
    chartInstances['spark'+(i+1)] = new Chart(c,{
      type:'line',
      data:{ labels:data.map((_,j)=>j), datasets:[{ data, borderColor:cols[i], borderWidth:2, pointRadius:0, fill:true, backgroundColor:cols[i]+'18', tension:0.4 }] },
      options:{ responsive:false, maintainAspectRatio:false, plugins:{legend:{display:false},tooltip:{enabled:false}}, scales:{x:{display:false},y:{display:false}}, animation:{duration:1200} }
    });
  });
}

/* ===================================================
   DASHBOARD CHARTS
   =================================================== */
function initDashboardCharts() {
  applyChartDefaults();
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  const gc   = dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.04)';

  // Revenue & Expense
  destroyChart('revenueChart');
  chartInstances['revenueChart'] = new Chart(document.getElementById('revenueChart'),{
    type:'bar',
    data:{ labels:MONTHS_FULL, datasets:[
      { label:'Doanh thu', data:revenueData, backgroundColor:'rgba(30,58,138,.75)', borderRadius:6, order:2 },
      { label:'Chi phí',   data:expenseData, backgroundColor:'rgba(239,68,68,.6)',  borderRadius:6, order:3 },
      { label:'Lợi nhuận', data:cashFlowData, type:'line', borderColor:CHART_COLORS.emerald,
        backgroundColor:'rgba(16,185,129,.1)', borderWidth:2.5, pointRadius:4,
        pointBackgroundColor:CHART_COLORS.emerald, fill:false, tension:0.4, order:1 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      interaction:{intersect:false,mode:'index'},
      plugins:{ legend:{position:'top',labels:{boxWidth:10,padding:14,usePointStyle:true}},
        tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${fmtVND(ctx.raw)} ₫`}} },
      scales:{ x:{grid:{color:gc},ticks:{font:{size:11}}}, y:{grid:{color:gc},ticks:{callback:v=>fmtVND(v)+' ₫',font:{size:11}}} },
      animation:{duration:900,easing:'easeInOutQuart'}
    }
  });

  // Cash Flow
  destroyChart('cashFlowChart');
  const cg = document.getElementById('cashFlowChart').getContext('2d').createLinearGradient(0,0,0,200);
  cg.addColorStop(0,'rgba(16,185,129,.3)'); cg.addColorStop(1,'rgba(16,185,129,.02)');
  chartInstances['cashFlowChart'] = new Chart(document.getElementById('cashFlowChart'),{
    type:'line',
    data:{ labels:MONTHS_FULL, datasets:[{ label:'Dòng tiền', data:cashFlowData, borderColor:CHART_COLORS.emerald,
      backgroundColor:cg, borderWidth:2.5, pointRadius:5, pointBackgroundColor:'#fff',
      pointBorderColor:CHART_COLORS.emerald, pointBorderWidth:2, fill:true, tension:0.4 }] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` Dòng tiền: ${fmtVND(ctx.raw)} ₫`}}},
      scales:{x:{grid:{color:gc},ticks:{font:{size:11}}},y:{grid:{color:gc},ticks:{callback:v=>fmtVND(v),font:{size:11}}}},
      animation:{duration:1000}
    }
  });

  // Donut
  destroyChart('expenseChart');
  chartInstances['expenseChart'] = new Chart(document.getElementById('expenseChart'),{
    type:'doughnut',
    data:{ labels:expenseCats.labels, datasets:[{ data:expenseCats.values, backgroundColor:expenseCats.colors,
      borderWidth:2, borderColor:dark?'#1E293B':'#fff', hoverOffset:8 }] },
    options:{ responsive:true, maintainAspectRatio:false, cutout:'68%',
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${ctx.label}: ${ctx.raw.toLocaleString()} tr ₫`}}},
      animation:{animateRotate:true,duration:1200}
    }
  });
  const leg = document.getElementById('expenseLegend');
  if (leg) leg.innerHTML = expenseCats.labels.map((l,i)=>`<div class="legend-item"><div class="legend-dot" style="background:${expenseCats.colors[i]}"></div><span>${l}</span></div>`).join('');

  // Budget Performance
  destroyChart('budgetPerformChart');
  chartInstances['budgetPerformChart'] = new Chart(document.getElementById('budgetPerformChart'),{
    type:'bar',
    data:{ labels:deptLabels, datasets:[
      { label:'Kế hoạch', data:budgetPlan, backgroundColor:'rgba(30,58,138,.25)', borderColor:CHART_COLORS.navy, borderWidth:1.5, borderRadius:4 },
      { label:'Thực tế',  data:budgetActual, backgroundColor:budgetActual.map((v,i)=>v>budgetPlan[i]?'rgba(239,68,68,.7)':'rgba(16,185,129,.7)'), borderRadius:4 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{position:'top',labels:{boxWidth:10,padding:14,usePointStyle:true}},
        tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.raw.toLocaleString()} tr ₫`}}},
      scales:{x:{grid:{color:gc}},y:{grid:{color:gc},ticks:{callback:v=>v+' tr'}}},
      animation:{duration:900}
    }
  });
}

/* ===================================================
   ANALYTICS CHARTS
   =================================================== */
function initAnalyticsCharts() {
  applyChartDefaults();
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  const gc   = dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.04)';

  destroyChart('trendChart');
  chartInstances['trendChart'] = new Chart(document.getElementById('trendChart'),{
    type:'line',
    data:{ labels:MONTHS, datasets:[{ label:'Doanh thu', data:trendRevenue, borderColor:CHART_COLORS.navy,
      backgroundColor:'rgba(30,58,138,.08)', fill:true, tension:0.4, borderWidth:2.5, pointRadius:4, pointBackgroundColor:CHART_COLORS.navy }] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${fmtVND(ctx.raw)} ₫`}}},
      scales:{x:{grid:{color:gc}},y:{grid:{color:gc},ticks:{callback:v=>fmtVND(v)}}}
    }
  });

  destroyChart('expBarChart');
  chartInstances['expBarChart'] = new Chart(document.getElementById('expBarChart'),{
    type:'bar',
    data:{ labels:expenseCats.labels, datasets:[{ label:'Chi phí', data:expenseCats.values, backgroundColor:expenseCats.colors, borderRadius:6 }] },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${ctx.raw.toLocaleString()} tr ₫`}}},
      scales:{x:{grid:{display:false}},y:{grid:{color:gc},ticks:{callback:v=>v+' tr'}}}
    }
  });

  destroyChart('areaChart');
  const ac = document.getElementById('areaChart').getContext('2d');
  const mk = (r,g,b,a0,a1)=>{ const g_=ac.createLinearGradient(0,0,0,280); g_.addColorStop(0,`rgba(${r},${g},${b},${a0})`); g_.addColorStop(1,`rgba(${r},${g},${b},${a1})`); return g_; };
  chartInstances['areaChart'] = new Chart(ac,{
    type:'line',
    data:{ labels:MONTHS, datasets:[
      { label:'Doanh thu', data:trendRevenue, borderColor:CHART_COLORS.navy,    backgroundColor:mk(30,58,138,.25,.02),  fill:true, tension:.4, borderWidth:2, pointRadius:3 },
      { label:'Chi phí',   data:trendExpense, borderColor:CHART_COLORS.red,     backgroundColor:mk(239,68,68,.2,.02),   fill:true, tension:.4, borderWidth:2, pointRadius:3 },
      { label:'Lợi nhuận', data:trendProfit,  borderColor:CHART_COLORS.emerald, backgroundColor:mk(16,185,129,.25,.02), fill:true, tension:.4, borderWidth:2, pointRadius:3 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      interaction:{intersect:false,mode:'index'},
      plugins:{legend:{position:'top',labels:{boxWidth:10,padding:16,usePointStyle:true}},
        tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${fmtVND(ctx.raw)} ₫`}}},
      scales:{x:{grid:{color:gc}},y:{grid:{color:gc},ticks:{callback:v=>fmtVND(v)}}}
    }
  });
}

/* ===================================================
   FORECAST CHART
   =================================================== */
function initForecastChart(months) {
  applyChartDefaults();
  const dark = document.documentElement.getAttribute('data-theme')==='dark';
  const gc   = dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.04)';
  const now  = new Date(2026,5);
  const labels = Array.from({length:months},(_,i)=>{
    const d = new Date(now.getFullYear(), now.getMonth()+i+1);
    return `T${d.getMonth()+1}/${String(d.getFullYear()).slice(2)}`;
  });
  const base = 4823, bexp = 3156;
  const fRev = labels.map((_,i)=>(base*(1+0.08*(i+1)+(Math.random()-.4)*.02))*1e6);
  const fExp = labels.map((_,i)=>(bexp*(1+0.05*(i+1)+(Math.random()-.4)*.015))*1e6);
  const fCF  = fRev.map((r,i)=>r-fExp[i]);

  destroyChart('forecastChart');
  const ctx = document.getElementById('forecastChart').getContext('2d');
  const grad = ctx.createLinearGradient(0,0,0,300);
  grad.addColorStop(0,'rgba(30,58,138,.18)'); grad.addColorStop(1,'rgba(30,58,138,.01)');
  chartInstances['forecastChart'] = new Chart(ctx,{
    type:'line',
    data:{ labels, datasets:[
      { label:'Forecast Revenue', data:fRev, borderColor:CHART_COLORS.navy, backgroundColor:grad, fill:true, tension:.4, borderWidth:2.5, pointRadius:5, pointBackgroundColor:'#fff', pointBorderColor:CHART_COLORS.navy, pointBorderWidth:2, order:2 },
      { label:'Forecast Expense', data:fExp, borderColor:CHART_COLORS.red,  backgroundColor:'transparent', fill:false, tension:.4, borderWidth:2, pointRadius:4, pointBackgroundColor:CHART_COLORS.red, borderDash:[5,3], order:3 },
      { label:'Projected Cash Flow', data:fCF, borderColor:CHART_COLORS.emerald, backgroundColor:'transparent', fill:false, tension:.4, borderWidth:2, pointRadius:4, pointBackgroundColor:CHART_COLORS.emerald, order:1 },
      { label:'Upper (95%)', data:fRev.map(v=>v*1.08), borderColor:'rgba(30,58,138,.2)', backgroundColor:'rgba(30,58,138,.05)', fill:'+1', tension:.4, borderWidth:1, pointRadius:0, borderDash:[3,3], order:4 },
      { label:'Lower (95%)', data:fRev.map(v=>v*0.92), borderColor:'rgba(30,58,138,.2)', fill:false, tension:.4, borderWidth:1, pointRadius:0, borderDash:[3,3], order:5 }
    ]},
    options:{ responsive:true, maintainAspectRatio:false,
      interaction:{intersect:false,mode:'index'},
      plugins:{
        legend:{position:'top',labels:{boxWidth:10,padding:14,usePointStyle:true,filter:i=>!i.text.includes('(95%)')}},
        tooltip:{callbacks:{label:ctx=>` ${ctx.dataset.label}: ${fmtVND(ctx.raw)} ₫`}}
      },
      scales:{x:{grid:{color:gc}},y:{grid:{color:gc},ticks:{callback:v=>fmtVND(v)+' ₫'}}},
      animation:{duration:900}
    }
  });
}

function switchForecast(months, btn) {
  forecastMonths = months;
  document.querySelectorAll('#page-forecast .tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  initForecastChart(months);
}

/* ===================================================
   FORECAST LOADER
   =================================================== */
function runForecast() {
  const overlay = document.getElementById('forecastLoading');
  if (!overlay) return;
  overlay.style.display = 'flex';
  const fill = document.getElementById('loaderFill');
  const pct  = document.getElementById('loaderPct');
  let p=0;
  const iv = setInterval(()=>{
    p += Math.random()*12+3;
    if (p>100) p=100;
    if (fill) fill.style.width = p+'%';
    if (pct)  pct.textContent  = Math.round(p)+'%';
    if (p>=100) {
      clearInterval(iv);
      setTimeout(()=>{
        overlay.style.display='none';
        initForecastChart(forecastMonths);
        showToast('🤖 AI Forecast hoàn thành! Accuracy: 94.7%','info');
      },400);
    }
  },160);
}

/* ===================================================
   BUDGET MODULE — render + CRUD
   =================================================== */
function renderBudgets() {
  const container = document.getElementById('budgetDeptList');
  if (!container) return;
  container.innerHTML = budgets.map(b=>{
    const pct    = Math.round((b.used/b.amount)*100);
    const over   = pct>100;
    const warn   = pct>=80 && pct<=100;
    const barPct = Math.min(pct,100);
    const status = over ? '<span class="budget-status danger">Vượt ngân sách</span>'
                        : warn ? '<span class="budget-status warn">Cần chú ý</span>'
                               : '<span class="budget-status ok">Bình thường</span>';
    const icons  = {'Nhân sự':'👥','Marketing':'📢','Vận hành':'⚙','Mặt bằng':'🏢','Công nghệ':'💻','Logistics':'🚚'};
    return `
    <div class="budget-dept-item" id="bud-row-${b.id}">
      <div class="dept-info">
        <span class="dept-name">${icons[b.cat]||'📁'} ${b.name}</span>
        <span class="dept-meta">${b.dept} · ${b.period}</span>
      </div>
      <div class="dept-bar-wrap">
        <div class="dept-bar"><div class="dept-bar-fill ${over?'over':warn?'warn':''}" style="width:${barPct}%"></div></div>
        <span class="dept-pct ${over?'danger':warn?'warn':''}">${pct}%</span>
      </div>
      <div class="dept-amounts">
        <span class="dept-used ${over?'danger':''}">${b.used.toLocaleString('vi-VN')}</span>
        <span class="dept-total">/ ${b.amount.toLocaleString('vi-VN')} ₫</span>
      </div>
      ${status}
      <div class="action-btns" style="justify-self:end">
        <button class="act-btn" onclick="openEditBudget('${b.id}')" title="Chỉnh sửa">✏️</button>
        <button class="act-btn delete" onclick="deleteBudget('${b.id}')" title="Xóa">🗑️</button>
      </div>
    </div>`;
  }).join('');

  // Update summary numbers
  const total = budgets.reduce((s,b)=>s+b.amount,0);
  const used  = budgets.reduce((s,b)=>s+b.used,0);
  const remain= total-used;
  const pctUsed = ((used/total)*100).toFixed(1);
  const els = document.querySelectorAll('.bs-value');
  if (els[0]) els[0].textContent = total.toLocaleString('vi-VN')+' ₫';
  if (els[1]) els[1].textContent = used.toLocaleString('vi-VN')+' ₫';
  if (els[2]) els[2].textContent = remain.toLocaleString('vi-VN')+' ₫';
  if (els[3]) els[3].textContent = pctUsed+'%';
}

/* ---- Create Budget ---- */
function saveBudget() {
  const name   = document.getElementById('bName')?.value.trim();
  const period = document.getElementById('bPeriod')?.value;
  const dept   = document.getElementById('bDept')?.value.trim();
  const cat    = document.getElementById('bCat')?.value;
  const amount = parseFloat(document.getElementById('bAmount')?.value)||0;
  const note   = document.getElementById('bNote')?.value.trim();

  if (!name) { showToast('Vui lòng nhập tên ngân sách','error'); return; }
  if (amount<=0) { showToast('Vui lòng nhập số tiền hợp lệ','error'); return; }

  const editId = document.getElementById('budgetModal').dataset.editId;
  if (editId) {
    const idx = budgets.findIndex(b=>b.id===editId);
    if (idx>=0) {
      budgets[idx] = { ...budgets[idx], name, period, dept, cat, amount, note };
      showToast('✅ Đã cập nhật ngân sách!','success');
    }
    delete document.getElementById('budgetModal').dataset.editId;
    document.querySelector('#budgetModal .modal-header h3').textContent = 'Tạo Ngân Sách Mới';
  } else {
    budgets.push({
      id: 'BUD-'+String(budgets.length+1).padStart(3,'0'),
      name, period, dept, cat, amount, used:0, note
    });
    showToast('✅ Đã tạo ngân sách mới!','success');
  }

  closeModal('budgetModal');
  renderBudgets();
  clearBudgetForm();
}

function clearBudgetForm() {
  ['bName','bDept','bAmount','bNote'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
}

function openEditBudget(id) {
  const b = budgets.find(x=>x.id===id);
  if (!b) return;
  document.getElementById('bName').value   = b.name;
  document.getElementById('bPeriod').value = b.period;
  document.getElementById('bDept').value   = b.dept;
  document.getElementById('bCat').value    = b.cat;
  document.getElementById('bAmount').value = b.amount;
  document.getElementById('bNote').value   = b.note||'';
  document.getElementById('budgetModal').dataset.editId = id;
  document.querySelector('#budgetModal .modal-header h3').textContent = 'Chỉnh Sửa Ngân Sách';
  openModal('budgetModal');
}

function deleteBudget(id) {
  if (!confirm('Xóa ngân sách này?')) return;
  budgets = budgets.filter(b=>b.id!==id);
  renderBudgets();
  showToast('🗑️ Đã xóa ngân sách!','warning');
}

/* ===================================================
   SYNC: Thu Chi → Dashboard KPI + Charts
   Tính lại tổng doanh thu, chi phí, lợi nhuận,
   dòng tiền từ mảng transactions và cập nhật UI
   =================================================== */
function syncDashboardFromTransactions() {
  // Tính tổng từ toàn bộ giao dịch
  const totalRevenue = transactions
    .filter(tx => tx.type === 'income')
    .reduce((s, tx) => s + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0);

  const netProfit  = totalRevenue - totalExpense;
  const cashFlow   = netProfit * 0.535; // proxy: cash ≈ 53.5% lợi nhuận tích lũy

  // Cập nhật 4 KPI cards trên Dashboard nếu đang active
  const onDash = document.querySelector('#page-dashboard.active');
  if (onDash) {
    const fmt = v => v >= 1e9
      ? (v/1e9).toFixed(2)+' tỷ ₫'
      : (v/1e6).toFixed(0)+' tr ₫';

    const cards = document.querySelectorAll('.kpi-value[data-target]');
    // card 0=revenue, 1=expense, 2=profit, 3=cashflow
    if (cards[0]) cards[0].textContent = fmt(totalRevenue);
    if (cards[1]) cards[1].textContent = fmt(totalExpense);
    if (cards[2]) cards[2].textContent = fmt(netProfit);
    if (cards[3]) cards[3].textContent = fmt(cashFlow);

    // Cập nhật badge % thay đổi doanh thu (so với tháng trước giả định)
    const revChange = document.querySelector('.kpi-card[data-color="blue"] .kpi-change');
    if (revChange && totalRevenue > 0) {
      const pct = ((totalRevenue - 4650e6) / 4650e6 * 100).toFixed(1);
      revChange.textContent = (pct >= 0 ? '▲ ' : '▼ ') + Math.abs(pct) + '%';
      revChange.className = 'kpi-change ' + (pct >= 0 ? 'positive' : 'negative');
    }

    // Profit margin %
    const marginEl = document.querySelector('.kpi-card[data-color="green"] .kpi-change');
    if (marginEl && totalRevenue > 0) {
      const margin = ((netProfit / totalRevenue) * 100).toFixed(1);
      marginEl.textContent = '▲ ' + margin + '%';
    }

    // Redraw revenue chart với dữ liệu mới nhất
    updateRevenueChart(totalRevenue, totalExpense, netProfit);
  }

  // Cập nhật analytics nếu đang mở
  if (document.querySelector('#page-analytics.active')) {
    initAnalyticsCharts();
  }
}

/* Cập nhật chart tháng hiện tại (T6) với số mới */
function updateRevenueChart(rev, exp, profit) {
  const c = chartInstances['revenueChart'];
  if (!c) return;
  // Cập nhật điểm cuối (T6 = index 5) với giá trị thực tế
  c.data.datasets[0].data[5] = rev;
  c.data.datasets[1].data[5] = exp;
  c.data.datasets[2].data[5] = profit;
  c.update('active');
}

/* ===================================================
   SYNC: Thu Chi → Ngân sách
   Khi thêm/sửa/xóa giao dịch expense, tự cập nhật
   số "used" của ngân sách tương ứng theo danh mục
   =================================================== */
function syncBudgetFromTransactions() {
  // Reset tất cả used về 0, rồi tính lại từ transactions
  budgets.forEach(b => { b.used = 0; });

  transactions.forEach(tx => {
    if (tx.type !== 'expense') return;
    const match = budgets.find(b => b.cat === tx.cat);
    if (match) match.used += tx.amount;
  });

  // Nếu đang ở trang budget thì re-render ngay
  if (document.querySelector('#page-budget.active')) {
    renderBudgets();
  }

  // Cập nhật KPI "Ngân sách còn lại" trên Dashboard nếu đang ở đó
  if (document.querySelector('#page-dashboard.active')) {
    const totalBudget = budgets.reduce((s,b) => s + b.amount, 0);
    const totalUsed   = budgets.reduce((s,b) => s + b.used,   0);
    const remain      = totalBudget - totalUsed;
    const pctUsed     = Math.round((totalUsed / totalBudget) * 100);

    const kpiRemain = document.querySelector('.kpi-card[data-color="purple"] .kpi-value');
    if (kpiRemain) kpiRemain.textContent = remain >= 1e9
      ? (remain/1e9).toFixed(2)+' tỷ ₫'
      : (remain/1e6).toFixed(0)+' tr ₫';

    const progressFill = document.querySelector('.kpi-card[data-color="purple"] .progress-fill');
    if (progressFill) progressFill.style.width = Math.min(pctUsed, 100)+'%';

    const progressLabel = document.querySelector('.kpi-card[data-color="purple"] .kpi-sub span:last-child');
    if (progressLabel) progressLabel.textContent = pctUsed+'% đã sử dụng';

    checkBudgetAlerts();
  }
}
/* ===================================================
   AUTO ALERT: kiểm tra vượt ngân sách
   =================================================== */
function checkBudgetAlerts() {
  budgets.forEach(b => {
    const pct = b.amount > 0 ? (b.used / b.amount) * 100 : 0;
    if (pct > 100) {
      const existing = alerts.find(a => a.status === 'open' && a.title.includes(b.cat));
      if (!existing) {
        alerts.unshift({
          id: Date.now(),
          type: 'danger',
          icon: '⚠️',
          title: 'Vượt ngân sách: ' + b.cat,
          desc: 'Ngân sách "' + b.name + '" đã sử dụng ' + b.used.toLocaleString('vi-VN') + ' ₫, vượt ' + (pct-100).toFixed(1) + '% so với kế hoạch ' + b.amount.toLocaleString('vi-VN') + ' ₫.',
          dept: b.dept,
          time: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'}),
          badge: 'Mới · Vượt ngân sách',
          badgeClass: 'danger',
          status: 'open'
        });
        const dot      = document.querySelector('.notif-dot');
        const navBadge = document.querySelector('.nav-item[data-page="alerts"] .nav-badge');
        const openCount = alerts.filter(a => a.status === 'open').length;
        if (dot)      { dot.textContent = openCount; dot.style.display = ''; }
        if (navBadge)   navBadge.textContent = openCount;
      }
    }
  });
}

function renderTransactions(list) {
  const tbody = document.getElementById('txBody');
  if (!tbody) return;
  if (list.length===0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-muted)">Không có giao dịch nào</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map((tx,i)=>{
    const realIdx = transactions.indexOf(tx);
    return `
    <tr>
      <td><span class="tx-code">${tx.id}</span></td>
      <td>${tx.date}</td>
      <td><span class="type-badge ${tx.type}">${tx.type==='income'?'Thu':'Chi'}</span></td>
      <td>${tx.cat}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${tx.desc}">${tx.desc}</td>
      <td><span class="amount-cell ${tx.type}">${tx.type==='income'?'+':'-'}${tx.amount.toLocaleString('vi-VN')}</span></td>
      <td>${tx.owner}</td>
      <td style="color:var(--text-muted);font-size:12px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${tx.note||'—'}</td>
      <td>
        <div class="action-btns">
          <button class="act-btn" onclick="openEditTx(${realIdx})" title="Chỉnh sửa">✏️</button>
          <button class="act-btn delete" onclick="deleteTx(${realIdx})" title="Xóa">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('');
  const cnt = document.getElementById('txCount');
  if (cnt) cnt.textContent = `Hiển thị ${list.length} / ${transactions.length} giao dịch`;
}

function filterTransactions() {
  const type = document.getElementById('typeFilter')?.value||'';
  const cat  = document.getElementById('catFilter')?.value||'';
  const q    = (document.getElementById('txSearch')?.value||'').toLowerCase();
  const list = transactions.filter(tx=>{
    if (type && tx.type!==type) return false;
    if (cat  && tx.cat!==cat)   return false;
    if (q && !tx.desc.toLowerCase().includes(q) && !tx.id.toLowerCase().includes(q) && !tx.owner.toLowerCase().includes(q)) return false;
    return true;
  });
  renderTransactions(list);
}

/* ---- Save transaction (add/edit) ---- */
function saveTx() {
  const dateRaw = document.getElementById('txDate')?.value;
  const type    = document.getElementById('txType')?.value;
  const cat     = document.getElementById('txCat')?.value;
  const amount  = parseFloat((document.getElementById('txAmount')?.value||'0').replace(/,/g,''));
  const desc    = document.getElementById('txDesc')?.value.trim();
  const owner   = document.getElementById('txOwner')?.value.trim();
  const dept    = document.getElementById('txDept')?.value;
  const note    = document.getElementById('txNote')?.value.trim();

  if (!desc) { showToast('Vui lòng nhập mô tả giao dịch','error'); return; }
  if (!amount||amount<=0) { showToast('Vui lòng nhập số tiền hợp lệ','error'); return; }

  // Format date
  let dateStr = today();
  if (dateRaw) {
    const d = new Date(dateRaw);
    dateStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  }

  if (txEditIndex!==null && txEditIndex>=0) {
    transactions[txEditIndex] = { ...transactions[txEditIndex], date:dateStr, type, cat, amount, desc, owner, dept, note };
    showToast('✅ Đã cập nhật giao dịch!','success');
    txEditIndex = null;
    document.querySelector('#txModal .modal-header h3').textContent = 'Thêm Giao Dịch Mới';
  } else {
    transactions.unshift({
      id: 'TXN-'+String(transactions.length+1).padStart(3,'0'),
      date:dateStr, type, cat, amount, desc, owner, dept, note
    });
    showToast('✅ Đã thêm giao dịch thành công!','success');
  }

  closeModal('txModal');
  clearTxForm();
  renderTransactions(transactions);
  syncBudgetFromTransactions();      // cập nhật Ngân sách
  syncDashboardFromTransactions();   // cập nhật Dashboard & Analytics
}

function clearTxForm() {
  ['txDate','txAmount','txDesc','txOwner','txNote'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
}

function openEditTx(i) {
  const tx = transactions[i];
  if (!tx) return;
  txEditIndex = i;
  // Set date field
  const dp = document.getElementById('txDate');
  if (dp && tx.date) {
    const parts = tx.date.split('/');
    if (parts.length===3) dp.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  document.getElementById('txType').value  = tx.type;
  document.getElementById('txCat').value   = tx.cat;
  document.getElementById('txAmount').value= tx.amount;
  document.getElementById('txDesc').value  = tx.desc;
  document.getElementById('txOwner').value = tx.owner;
  document.getElementById('txDept').value  = tx.dept;
  document.getElementById('txNote').value  = tx.note||'';
  document.querySelector('#txModal .modal-header h3').textContent = 'Chỉnh Sửa Giao Dịch';
  openModal('txModal');
}

function deleteTx(i) {
  if (!confirm(`Xóa giao dịch "${transactions[i]?.desc}"?`)) return;
  transactions.splice(i,1);
  renderTransactions(transactions);
  syncBudgetFromTransactions();      // cập nhật Ngân sách
  syncDashboardFromTransactions();   // cập nhật Dashboard & Analytics
  showToast('🗑️ Đã xóa giao dịch!','warning');
}

/* ===================================================
   ALERTS MODULE — render + actions
   =================================================== */
function renderAlerts() {
  const container = document.getElementById('alertsList');
  if (!container) return;
  const open = alerts.filter(a=>a.status==='open');
  if (open.length===0) {
    container.innerHTML = `<div style="text-align:center;padding:48px;color:var(--text-muted)">
      <div style="font-size:48px;margin-bottom:12px">✅</div>
      <strong>Không có cảnh báo nào!</strong>
      <p style="margin-top:6px;font-size:13px">Tất cả cảnh báo đã được xử lý.</p>
    </div>`;
    return;
  }
  container.innerHTML = open.map(a=>{
    const btns = a.type==='info'
      ? `<button class="btn-info-sm" onclick="handleAlert(${a.id},'view')">Xem báo cáo</button>`
      : a.type==='danger'
        ? `<button class="btn-danger-sm"  onclick="handleAlert(${a.id},'resolve')">Xử lý</button>
           <button class="btn-outline-sm" onclick="handleAlert(${a.id},'dismiss')">Bỏ qua</button>`
        : `<button class="btn-warning-sm" onclick="handleAlert(${a.id},'resolve')">Điều tra</button>
           <button class="btn-outline-sm" onclick="handleAlert(${a.id},'dismiss')">Đã xử lý</button>`;
    return `
    <div class="alert-card ${a.type}" id="alert-${a.id}">
      <div class="alert-card-icon">${a.icon}</div>
      <div class="alert-card-body">
        <div class="alert-card-title">${a.title}</div>
        <div class="alert-card-desc">${a.desc}</div>
        <div class="alert-card-meta">
          <span>${a.dept}</span><span>·</span><span>${a.time}</span>
          <span class="badge ${a.badgeClass}">${a.badge}</span>
        </div>
      </div>
      <div class="alert-card-actions">${btns}</div>
    </div>`;
  }).join('');

  // Update badge count
  const dot = document.querySelector('.notif-dot');
  const navBadge = document.querySelector('.nav-item[data-page="alerts"] .nav-badge');
  const count = open.length;
  if (dot) dot.textContent = count||'';
  if (navBadge) navBadge.textContent = count;
  if (dot) dot.style.display = count ? '' : 'none';
}

function handleAlert(id, action) {
  const a = alerts.find(x=>x.id===id);
  if (!a) return;
  if (action==='view') {
    switchPage('forecast');
    showToast('📊 Mở trang Dự Báo AI','info');
    return;
  }
  if (action==='resolve') {
    a.status   = 'resolved';
    a.badge    = 'Đã xử lý';
    a.badgeClass = 'info';
    showToast('✅ Đã đánh dấu xử lý: '+a.title,'success');
  }
  if (action==='dismiss') {
    a.status   = 'dismissed';
    showToast('🙈 Đã bỏ qua cảnh báo','warning');
  }
  // Animate out
  const el = document.getElementById('alert-'+id);
  if (el) {
    el.style.transition = 'all .3s';
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(20px)';
    setTimeout(()=>renderAlerts(), 320);
  }
}

function markAllRead() {
  alerts.forEach(a=>{ a.status='dismissed'; });
  renderAlerts();
  showToast('✅ Đã đánh dấu tất cả đã đọc!','success');
}

/* ===================================================
   EXPORT PDF — dùng window.print() với CSS @media print
   =================================================== */
function exportPDF() {
  // Xác định trang đang active
  const activePage = document.querySelector('.page.active');
  const pageId     = activePage?.id || 'page-dashboard';
  const pageTitles = {
    'page-dashboard':    'Báo Cáo Dashboard Tổng Hợp',
    'page-analytics':    'Báo Cáo Analytics',
    'page-budget':       'Báo Cáo Ngân Sách',
    'page-transactions': 'Báo Cáo Thu Chi',
    'page-forecast':     'Báo Cáo Dự Báo AI',
    'page-reports':      'Danh Mục Báo Cáo',
    'page-alerts':       'Báo Cáo Cảnh Báo',
  };

  const title    = pageTitles[pageId] || 'Báo Cáo FinFlow';
  const now      = new Date(2026, 5, 6);
  const dateStr  = now.toLocaleDateString('vi-VN', {day:'2-digit', month:'long', year:'numeric'});

  // Tính số liệu tổng hợp từ transactions
  const totalRev = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const totalExp = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const netProfit= totalRev - totalExp;
  const margin   = totalRev > 0 ? ((netProfit/totalRev)*100).toFixed(1) : '0';
  const fmt      = v => v.toLocaleString('vi-VN') + ' ₫';

  // Tạo bảng giao dịch gần nhất (10 dòng)
  const txRows = transactions.slice(0,10).map(tx=>`
    <tr>
      <td>${tx.id}</td>
      <td>${tx.date}</td>
      <td style="color:${tx.type==='income'?'#065F46':'#991B1B'};font-weight:600">
        ${tx.type==='income'?'Thu':'Chi'}
      </td>
      <td>${tx.cat}</td>
      <td>${tx.desc}</td>
      <td style="font-family:monospace;text-align:right;color:${tx.type==='income'?'#065F46':'#991B1B'}">
        ${tx.type==='income'?'+':'-'}${tx.amount.toLocaleString('vi-VN')}
      </td>
      <td>${tx.owner}</td>
    </tr>`).join('');

  // Tạo bảng ngân sách
  const budgetRows = budgets.map(b=>{
    const pct  = b.amount>0 ? Math.round((b.used/b.amount)*100) : 0;
    const over = pct>100;
    return `
    <tr>
      <td>${b.name}</td>
      <td>${b.dept}</td>
      <td style="text-align:right">${b.amount.toLocaleString('vi-VN')}</td>
      <td style="text-align:right;color:${over?'#991B1B':'#111827'}">${b.used.toLocaleString('vi-VN')}</td>
      <td style="text-align:right;color:${over?'#991B1B':'#065F46'}">${(b.amount-b.used).toLocaleString('vi-VN')}</td>
      <td style="text-align:center;color:${over?'#991B1B':pct>=80?'#92400E':'#065F46'};font-weight:700">${pct}%</td>
      <td style="text-align:center"><span style="background:${over?'#fee2e2':pct>=80?'#fef3c7':'#d1fae5'};color:${over?'#991B1B':pct>=80?'#92400E':'#065F46'};padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600">${over?'Vượt NS':pct>=80?'Cần chú ý':'Bình thường'}</span></td>
    </tr>`;
  }).join('');

  // Tạo cửa sổ in
  const printWin = window.open('', '_blank', 'width=900,height=700');
  printWin.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"/>
  <title>${title} — FinFlow</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;font-size:13px;color:#111827;background:#fff;padding:32px}
    /* Header */
    .pdf-header{display:flex;justify-content:space-between;align-items:flex-start;
      padding-bottom:20px;border-bottom:3px solid #1E3A8A;margin-bottom:24px}
    .pdf-logo{display:flex;align-items:center;gap:10px}
    .pdf-logo-icon{width:38px;height:38px;background:#1E3A8A;border-radius:8px;
      display:flex;align-items:center;justify-content:center}
    .pdf-logo-icon svg{width:22px;height:22px}
    .pdf-brand{font-size:22px;font-weight:700;color:#1E3A8A}
    .pdf-brand small{display:block;font-size:11px;font-weight:400;color:#6B7280}
    .pdf-meta{text-align:right;font-size:12px;color:#6B7280}
    .pdf-meta strong{display:block;font-size:16px;color:#111827;font-weight:700;margin-bottom:4px}
    /* KPI summary */
    .kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
    .kpi-box{padding:14px 16px;border-radius:10px;border:1px solid #E5E7EB}
    .kpi-box.blue{background:#EFF6FF;border-color:#BFDBFE}
    .kpi-box.red{background:#FEF2F2;border-color:#FECACA}
    .kpi-box.green{background:#ECFDF5;border-color:#A7F3D0}
    .kpi-box.orange{background:#FFFBEB;border-color:#FDE68A}
    .kpi-box label{display:block;font-size:11px;font-weight:600;color:#6B7280;
      text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
    .kpi-box .val{font-family:'Roboto Mono',monospace;font-size:17px;font-weight:700}
    .kpi-box.blue .val{color:#1E3A8A}
    .kpi-box.red .val{color:#DC2626}
    .kpi-box.green .val{color:#059669}
    .kpi-box.orange .val{color:#D97706}
    /* Section */
    .section{margin-bottom:28px}
    .section-title{font-size:14px;font-weight:700;color:#1E3A8A;
      padding-bottom:8px;border-bottom:2px solid #E5E7EB;margin-bottom:14px;
      display:flex;justify-content:space-between;align-items:center}
    .section-title span{font-size:11px;font-weight:500;color:#6B7280}
    /* Tables */
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#F8FAFC;color:#6B7280;font-size:10px;font-weight:600;
      text-transform:uppercase;letter-spacing:.05em;padding:9px 10px;
      text-align:left;border-bottom:2px solid #E5E7EB}
    td{padding:9px 10px;border-bottom:1px solid #F3F4F6;vertical-align:middle}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:#F9FAFB}
    /* Footer */
    .pdf-footer{margin-top:32px;padding-top:16px;border-top:1px solid #E5E7EB;
      display:flex;justify-content:space-between;font-size:11px;color:#9CA3AF}
    /* Print */
    @media print{
      body{padding:20px}
      @page{margin:15mm;size:A4}
      .no-print{display:none}
      tr{page-break-inside:avoid}
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="pdf-header">
    <div class="pdf-logo">
      <div class="pdf-logo-icon">
        <svg viewBox="0 0 28 28" fill="none">
          <path d="M7 18L11 13L15 15L21 9" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="21" cy="9" r="2" fill="#F59E0B"/>
        </svg>
      </div>
      <div>
        <div class="pdf-brand">FinFlow</div>
        <div style="font-size:11px;color:#6B7280">Financial Budget Management</div>
      </div>
    </div>
    <div class="pdf-meta">
      <strong>${title}</strong>
      <div>Ngày xuất: ${dateStr}</div>
      <div>FinFlow Technology JSC · MST: 0123456789</div>
    </div>
  </div>

  <!-- KPI Summary -->
  <div class="kpi-row">
    <div class="kpi-box blue">
      <label>Tổng Doanh Thu</label>
      <div class="val">${fmt(totalRev)}</div>
    </div>
    <div class="kpi-box red">
      <label>Tổng Chi Phí</label>
      <div class="val">${fmt(totalExp)}</div>
    </div>
    <div class="kpi-box green">
      <label>Lợi Nhuận Ròng</label>
      <div class="val">${fmt(netProfit)}</div>
    </div>
    <div class="kpi-box orange">
      <label>Profit Margin</label>
      <div class="val">${margin}%</div>
    </div>
  </div>

  <!-- Bảng giao dịch -->
  <div class="section">
    <div class="section-title">
      Giao Dịch Gần Nhất
      <span>Hiển thị ${Math.min(transactions.length,10)} / ${transactions.length} giao dịch</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Mã GD</th><th>Ngày</th><th>Loại</th><th>Danh mục</th>
          <th>Mô tả</th><th style="text-align:right">Số tiền (VNĐ)</th><th>Phụ trách</th>
        </tr>
      </thead>
      <tbody>${txRows}</tbody>
    </table>
  </div>

  <!-- Bảng ngân sách -->
  <div class="section">
    <div class="section-title">
      Tình Trạng Ngân Sách
      <span>Kỳ Tháng 6/2026</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Tên ngân sách</th><th>Phòng ban</th>
          <th style="text-align:right">Kế hoạch (₫)</th>
          <th style="text-align:right">Thực tế (₫)</th>
          <th style="text-align:right">Còn lại (₫)</th>
          <th style="text-align:center">%</th>
          <th style="text-align:center">Trạng thái</th>
        </tr>
      </thead>
      <tbody>${budgetRows}</tbody>
    </table>
  </div>

  <!-- Footer -->
  <div class="pdf-footer">
    <span>© 2026 FinFlow Technology JSC · Báo cáo được tạo tự động</span>
    <span>FinFlow Platform v2.4 · AI Forecast Accuracy: 94.7%</span>
  </div>

  <!-- Nút in (ẩn khi print) -->
  <div class="no-print" style="margin-top:24px;text-align:center">
    <button onclick="window.print()" style="background:#1E3A8A;color:#fff;border:none;padding:12px 32px;
      border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit">
      🖨️ In / Lưu PDF
    </button>
    <button onclick="window.close()" style="background:#F3F4F6;color:#374151;border:1px solid #E5E7EB;
      padding:12px 24px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;
      font-family:inherit;margin-left:10px">
      ✕ Đóng
    </button>
  </div>

</body>
</html>`);
  printWin.document.close();
  printWin.focus();
  showToast('📄 Đã mở cửa sổ xuất PDF!', 'success');
}

/* ===================================================
   SIDEBAR
   =================================================== */
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const wrapper  = document.getElementById('mainWrapper');
  const toggle   = document.getElementById('sidebarToggle');
  const mobileBtn= document.getElementById('mobileMenuBtn');

  toggle?.addEventListener('click',()=>{
    sidebar.classList.toggle('collapsed');
    wrapper.classList.toggle('sidebar-collapsed');
  });
  mobileBtn?.addEventListener('click',()=>sidebar.classList.toggle('mobile-open'));
  document.addEventListener('click',e=>{
    if (window.innerWidth<=768 && !sidebar.contains(e.target) && e.target!==mobileBtn)
      sidebar.classList.remove('mobile-open');
  });
}

/* ===================================================
   INIT
   =================================================== */
document.addEventListener('DOMContentLoaded',()=>{

  /* ---- Sidebar ---- */
  initSidebar();

  /* ---- Nav ---- */
  document.querySelectorAll('.nav-item[data-page]').forEach(item=>{
    item.addEventListener('click',e=>{ e.preventDefault(); switchPage(item.dataset.page); });
  });

  /* ---- Dark mode ---- */
  document.getElementById('darkToggle')?.addEventListener('click', toggleDark);
  document.getElementById('darkToggle2')?.addEventListener('change', toggleDark);

  /* ---- Notifications ---- */
  const notifBtn   = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  notifBtn?.addEventListener('click',e=>{ e.stopPropagation(); notifPanel?.classList.toggle('open'); });
  document.addEventListener('click',e=>{ if (!notifPanel?.contains(e.target) && e.target!==notifBtn) notifPanel?.classList.remove('open'); });

  /* ---- Chip buttons (chart type) ---- */
  document.querySelectorAll('.chart-actions').forEach(wrap=>{
    wrap.querySelectorAll('.chip').forEach(chip=>{
      chip.addEventListener('click',function(){ wrap.querySelectorAll('.chip').forEach(c=>c.classList.remove('active')); this.classList.add('active'); });
    });
  });

  /* ---- Tab buttons ---- */
  document.querySelectorAll('.tab-group').forEach(group=>{
    group.querySelectorAll('.tab').forEach(tab=>{
      tab.addEventListener('click',function(){ group.querySelectorAll('.tab').forEach(t=>t.classList.remove('active')); this.classList.add('active'); });
    });
  });

  /* ---- Transaction live search ---- */
  document.getElementById('txSearch')?.addEventListener('input', filterTransactions);
  document.getElementById('typeFilter')?.addEventListener('change', filterTransactions);
  document.getElementById('catFilter')?.addEventListener('change', filterTransactions);

  /* ---- Settings save ---- */
  document.querySelectorAll('.settings-section .btn-primary').forEach(btn=>{
    btn.addEventListener('click',function(){ showToast('✅ Đã lưu thay đổi!','success'); });
  });
  document.querySelectorAll('.settings-section .btn-outline').forEach(btn=>{
    btn.addEventListener('click',function(){ showToast('🔐 Đã đổi mật khẩu thành công!','success'); });
  });

  /* ---- Budget page: open fresh modal ---- */
  document.querySelector('#page-budget .btn-primary[onclick*="budgetModal"]')?.addEventListener('click',()=>{
    clearBudgetForm();
    delete document.getElementById('budgetModal').dataset.editId;
    document.querySelector('#budgetModal .modal-header h3').textContent = 'Tạo Ngân Sách Mới';
  });

  /* ---- Init default page ---- */
  function tryInit() {
    if (typeof Chart === 'undefined') {
      setTimeout(tryInit, 100);
      return;
    }
    applyChartDefaults();
    syncBudgetFromTransactions(); // tính ngân sách từ data ban đầu
    initDashboardCharts();
    initSparklines();
    animateCounters();
  }
  setTimeout(tryInit, 150);
});
