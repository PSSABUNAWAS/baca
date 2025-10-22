
// ====== PWA INSTALL ======
let deferredPrompt = null;
const btnInstall = document.getElementById('btnInstall');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.style.display = 'inline-block';
});
btnInstall.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btnInstall.style.display = 'none';
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}

// ====== ELEMENTS ======
const elNama = document.getElementById('nama');
const elKelas = document.getElementById('kelas');
const elTranskrip = document.getElementById('transkrip');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnSave = document.getElementById('btnSave');
const btnExport = document.getElementById('btnExport');
const elTimer = document.getElementById('timer');
const elHasil = document.getElementById('hasil');
const elRekodBody = document.getElementById('rekodBody');
const audioLink = document.getElementById('audioLink');

// ====== GLOBAL STATE ======
let mediaRecorder, chunks = [];
let recognition, recognizing = false;
let startTime, timerInterval;
let lastResult = null; // {peratus, tp, label, tempoh, nama, kelas, audioUrl, audioBlob, wpm}
let liveFinal = ''; // final transcript built up

// ====== UTIL ======
const pad = n => String(n).padStart(2, '0');

function secondsElapsed() {
  return Math.max(1, Math.floor((Date.now() - startTime) / 1000));
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const s = secondsElapsed();
    const mm = pad(Math.floor(s/60));
    const ss = pad(s%60);
    elTimer.textContent = `${mm}:${ss}`;
  }, 250);
}
function stopTimer() {
  clearInterval(timerInterval);
  return secondsElapsed();
}

function clean(str){
  return (str||'').toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu,'')
    .replace(/\s+/g,' ')
    .trim();
}

function kiraWPM(transkrip, seconds){
  const words = clean(transkrip).split(' ').filter(Boolean).length;
  const minutes = Math.max(1/60, seconds/60);
  return Math.round(words / minutes);
}

// Peta TP berasaskan WPM (umum)
function tpFromWPM(wpm){
  if (wpm <= 40) return {tp:1, label:'Sangat Lemah', cls:'tp1'};
  if (wpm <= 60) return {tp:2, label:'Lemah', cls:'tp2'};
  if (wpm <= 80) return {tp:3, label:'Sederhana', cls:'tp3'};
  if (wpm <= 100) return {tp:4, label:'Baik', cls:'tp4'};
  if (wpm <= 120) return {tp:5, label:'Sangat Baik', cls:'tp5'};
  return {tp:6, label:'Cemerlang', cls:'tp6'};
}

// Peratus Penguasaan dari WPM relatif ke sasaran 120 WPM (0–100)
function peratusFromWPM(wpm){
  const p = Math.round((wpm / 120) * 100);
  return Math.max(0, Math.min(100, p));
}

function renderHasil(wpm, peratus, tpObj){
  elHasil.innerHTML = `Kepantasan: <b>${wpm} WPM</b> • Penguasaan <b>${peratus}%</b> <span class="tp ${tpObj.cls}">TP${tpObj.tp}</span> – <b>${tpObj.label}</b>.`;
}

// ====== AUDIO (MediaRecorder) ======
async function initMedia(){
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  chunks = [];
  mediaRecorder.ondataavailable = e => { if (e.data.size>0) chunks.push(e.data); };
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    audioLink.href = url;
    audioLink.download = `rakaman_${Date.now()}.webm`;
    audioLink.style.display = 'inline-block';
    if (lastResult) {
      lastResult.audioUrl = url;
      lastResult.audioBlob = blob;
    }
  };
}

// ====== SPEECH RECOGNITION (BM) ======
function initSpeech(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    alert('Peranti/Browser tidak menyokong Web Speech API. Sila guna Microsoft Edge atau Chrome.');
    return null;
  }
  const rec = new SR();
  rec.lang = 'ms-MY'; // Bahasa Melayu
  rec.interimResults = true;
  rec.continuous = true;
  return rec;
}

// ====== FLOW ======
btnStart.addEventListener('click', async ()=>{
  btnStart.disabled = true;
  btnStop.disabled = false;
  btnSave.disabled = true;
  elHasil.textContent = 'Mendengar & merakam... sila mula membaca buku.';
  elTranskrip.value = '';
  liveFinal = '';

  // Start timer
  startTimer();

  // Audio
  if (!mediaRecorder) await initMedia();
  chunks = [];
  mediaRecorder.start(1000);

  // Speech
  recognition = initSpeech();
  if (!recognition) return;
  recognizing = true;
  recognition.onresult = (ev)=>{
    let interim = '';
    for (let i = ev.resultIndex; i < ev.results.length; i++){
      const res = ev.results[i];
      if (res.isFinal) liveFinal += res[0].transcript + ' ';
      else interim += res[0].transcript;
    }
    const combined = (liveFinal + ' ' + interim).trim();
    elTranskrip.value = combined;

    const secs = secondsElapsed();
    const wpm = kiraWPM(combined, secs);
    const peratus = peratusFromWPM(wpm);
    const tpObj = tpFromWPM(wpm);
    renderHasil(wpm, peratus, tpObj);
  };
  recognition.onerror = (e)=>{
    console.warn('Speech error:', e.error);
  };
  recognition.onend = ()=>{
    recognizing = false;
  };
  recognition.start();
});

btnStop.addEventListener('click', ()=>{
  btnStart.disabled = false;
  btnStop.disabled = true;

  const tempoh = stopTimer();
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  if (recognition && recognizing) recognition.stop();

  const combined = elTranskrip.value || '';
  const wpm = kiraWPM(combined, tempoh);
  const peratus = peratusFromWPM(wpm);
  const tpObj = tpFromWPM(wpm);
  renderHasil(wpm, peratus, tpObj);
  btnSave.disabled = false;

  lastResult = {
    peratus, tp: tpObj.tp, label: tpObj.label, tempoh,
    nama: elNama.value.trim() || '(Tanpa Nama)',
    kelas: elKelas.value.trim(),
    audioUrl: null, audioBlob: null,
    tarikh: new Date(),
    wpm
  };
});

btnSave.addEventListener('click', ()=>{
  if (!lastResult) return;
  const d = lastResult.tarikh;
  const pad2 = n => String(n).padStart(2,'0');
  const tarikh = `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;
  const masa = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  const tr = document.createElement('tr');
  tr.className = 'data-row';
  const td = (html)=>{ const x=document.createElement('td'); x.innerHTML=html; return x; };

  const audioCell = lastResult.audioUrl ? `<a href="${lastResult.audioUrl}" download="rakaman_${+d}.webm">Muat turun</a>` : '-';
  tr.appendChild(td(tarikh));
  tr.appendChild(td(masa));
  tr.appendChild(td(escapeHtml(lastResult.nama)));
  tr.appendChild(td(escapeHtml(lastResult.kelas || '-')));
  tr.appendChild(td(String(lastResult.tempoh)));
  tr.appendChild(td(String(lastResult.wpm)));
  tr.appendChild(td(String(lastResult.peratus)+'%'));
  tr.appendChild(td(`<span class="tp tp${lastResult.tp}">TP${lastResult.tp}</span>`));
  tr.appendChild(td(audioCell));
  elRekodBody.prepend(tr);
  btnSave.disabled = true;
});

btnExport.addEventListener('click', ()=>{
  const rows = [['Tarikh','Masa','Nama','Kelas','Tempoh(s)','WPM','Peratus','TP','Pautan Rakaman']];
  elRekodBody.querySelectorAll('tr').forEach(tr=>{
    const tds = [...tr.querySelectorAll('td')].map(td=>td.textContent.trim());
    rows.push(tds);
  });
  const csv = rows.map(r => r.map(v => `"${(v||'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `LIBA_v6_data_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

function escapeHtml(str){
  return (str||'').replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]));
}
