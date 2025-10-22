// CSV-first (no Google Sheets)
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'))}
const mulaBtn=document.getElementById('mula'),hentiBtn=document.getElementById('henti'),simpanBtn=document.getElementById('simpan');
const eksportBtn=document.getElementById('eksport'),kosongBtn=document.getElementById('kosong');
const peratusEl=document.getElementById('peratus'),progressRing=document.getElementById('progressRing');
const penguasaanEl=document.getElementById('penguasaan'),tpSelect=document.getElementById('tpSelect'),penyataTP=document.getElementById('penyataTP');
const peratusSlider=document.getElementById('peratusSlider'),peratusInput=document.getElementById('peratusInput');
const namaEl=document.getElementById('nama'),kelasEl=document.getElementById('kelas'),tahunEl=document.getElementById('tahun');
const toast=document.getElementById('toast');
let interval=null;let peratus=Number(peratusSlider.value);let tp=Number(tpSelect.value);
const TP_COLORS={1:'#fecaca',2:'#fed7aa',3:'#fde68a',4:'#bbf7d0',5:'#bfdbfe',6:'#e9d5ff'};
const TP_DESC_T3={1:"Membaca dengan sebutan yang betul... pada tahap sangat terhad.",2:"Membaca dengan sebutan yang betul... pada tahap terhad.",3:"Membaca dengan sebutan yang betul... pada tahap memuaskan.",4:"Membaca dengan sebutan yang betul... pada tahap kukuh.",5:"Membaca dengan sebutan yang betul... pada tahap terperinci.",6:"Membaca dengan sebutan yang betul... pada tahap sangat terperinci, konsisten, dan menjadi model teladan."};
const TP_DESC_T6={1:"Membaca, memahami dan menaakul... pada tahap sangat terhad.",2:"Membaca, memahami dan menaakul... pada tahap terhad.",3:"Membaca, memahami dan menaakul serta mentafsir... pada tahap memuaskan.",4:"Membaca, memahami dan menaakul serta mentafsir... pada tahap kukuh.",5:"Membaca, memahami dan menaakul serta mentafsir... pada tahap terperinci.",6:"Membaca, memahami dan menaakul serta mentafsir... pada tahap sangat terperinci, konsisten, dan menjadi model teladan."};
function tpText(){return (tahunEl.value==='3'?TP_DESC_T3:TP_DESC_T6)[tp]||''}
function updateRing(p){const c=2*Math.PI*52;const off=c-(p/100)*c;progressRing.setAttribute('stroke-dashoffset',off);peratusEl.textContent=`${p}%`}
function syncPeratus(v){peratus=Math.min(100,Math.max(1,Number(v)||1));peratusSlider.value=peratus;peratusInput.value=peratus;updateRing(peratus)}
peratusSlider.addEventListener('input',e=>syncPeratus(e.target.value));peratusInput.addEventListener('input',e=>syncPeratus(e.target.value));
function updateTP(val){tp=Number(val);penguasaanEl.textContent=tp;penguasaanEl.style.background=TP_COLORS[tp]||'#e2e8f0';penyataTP.textContent=tpText();}
tpSelect.addEventListener('change',e=>updateTP(e.target.value));tahunEl.addEventListener('change',()=>updateTP(tp));
mulaBtn.addEventListener('click',()=>{clearInterval(interval);interval=setInterval(()=>syncPeratus(Math.floor(Math.random()*100)+1),1000)});
hentiBtn.addEventListener('click',()=>clearInterval(interval));
const KEY='aplikasi_baca_csv_v4';
function showToast(m){toast.textContent=m;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1500)}
function getData(){return JSON.parse(localStorage.getItem(KEY)||'[]')}
function setData(rows){localStorage.setItem(KEY,JSON.stringify(rows))}
simpanBtn.addEventListener('click',()=>{const rows=getData();rows.push({timestamp:new Date().toISOString(),nama:namaEl.value||'',kelas:kelasEl.value||'',tahun:tahunEl.value,peratus:peratus,tp:tp,kenyataan:tpText()});setData(rows);showToast('Disimpan (lokal)')});
eksportBtn.addEventListener('click',()=>{const rows=getData();const headers=['Timestamp','Nama','Kelas','Tahun','Peratus','TP','Kenyataan'];let csv=headers.join(',')+'\n';for(const r of rows){const vals=[r.timestamp,r.nama,r.kelas,r.tahun,r.peratus,r.tp,(r.kenyataan||'').replaceAll('\n',' ').replaceAll('"','""')];csv+=vals.map(v=>`"${String(v)}"`).join(',')+'\n';}const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='aplikasi_baca_log.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);});
kosongBtn.addEventListener('click',()=>{setData([]);showToast('Data dikosongkan')});
// init
syncPeratus(peratus);updateTP(tp);