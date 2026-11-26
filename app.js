const $=id=>document.getElementById(id);const KEY='runcoach_pro_v1';let state=JSON.parse(localStorage.getItem(KEY)||'{"runs":[],"profile":{"name":"","target":"5K","pbTarget":"21:15","customDistance":"","weeklyGoal":20}}');let deferredPrompt=null;
function save(){localStorage.setItem(KEY,JSON.stringify(state));render()};function dateISO(d=new Date()){return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)}function pace(r){if(!r.distance||!r.duration)return'—';let sec=Math.round(r.duration*60/r.distance);return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`}function fmtDate(s){return new Date(s+'T12:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}function weekStart(){let d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return dateISO(d)}function weekRuns(){return state.runs.filter(r=>r.date>=weekStart()&&r.date<=dateISO())}function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200)}function typeIcon(t){return ({'Easy Run':'◉','Recovery Run':'↘','Long Run':'↗','Tempo':'⌁','Interval':'ϟ','Race / Time Trial':'★'})[t]||'•'}
function activityHTML(r){return `<div class="activity"><div class="activity-icon">${typeIcon(r.type)}</div><div class="activity-main"><b>${r.type}</b><small>${fmtDate(r.date)} · ${pace(r)} /km${r.heartRate?' · '+r.heartRate+' bpm':''}</small></div><div class="activity-distance">${Number(r.distance).toFixed(2)}<small>km</small></div></div>`}
function coach(){
 const all=[...state.runs].sort((a,b)=>a.date.localeCompare(b.date));
 const runs=weekRuns(),km=runs.reduce((a,r)=>a+Number(r.distance||0),0);
 const hard=runs.filter(r=>['Tempo','Interval','Race / Time Trial'].includes(r.type)).length;
 const last=all[all.length-1];
 const profile=state.profile||{};
 const target=profile.target||'5K';
 const advice=[]; let headline='Belum cukup data untuk evaluasi';
 let detail='Catat beberapa sesi dengan jarak, durasi, RPE, tidur, dan kondisi kaki agar analisis lokal lebih berguna.';
 let evaluation='Data latihan masih terbatas.';
 if(last){
  const paceText=pace(last);
  headline=`${last.type} · ${Number(last.distance).toFixed(2)} km`;
  evaluation=`Sesi terakhir: ${last.type}, ${Number(last.distance).toFixed(2)} km dengan pace ${paceText}/km${last.rpe?`, RPE ${last.rpe}/10`:''}${last.heartRate?`, HR rata-rata ${last.heartRate} bpm`:''}.`;
  detail=evaluation;
  if(last.legs==='pain') advice.push('Kamu mencatat nyeri. Jangan lakukan sesi cepat atau long run saat nyeri masih ada. Hentikan lari bila nyeri memburuk atau mengubah langkah, dan bicarakan dengan orang dewasa tepercaya serta tenaga kesehatan bila menetap.');
  else if(last.legs==='tired') advice.push('Kaki terasa lelah. Prioritaskan istirahat atau aktivitas ringan; lanjutkan lari hanya saat langkah terasa normal dan tubuh pulih.');
  else advice.push('Jika tubuh terasa normal, pilih easy run yang nyaman atau istirahat sesuai pemulihan. Jangan menambah intensitas hanya karena satu sesi terasa mudah.');
  if(last.sleep!==''&&last.sleep!==null&&Number(last.sleep)<7) advice.push('Tidur tercatat kurang dari 7 jam. Utamakan tidur yang cukup dan hindari latihan intensitas saat mengantuk atau belum pulih.');
  if(Number(last.rpe)>=8) advice.push('RPE sesi terakhir tinggi. Beri ruang pemulihan sebelum mempertimbangkan sesi berat berikutnya.');
 }
 if(hard>=2) advice.push('Sudah ada dua atau lebih sesi intensitas minggu ini. Jangan menambah sesi keras; sisakan hari ringan atau istirahat.');
 if(runs.length>=1) advice.push(`Volume minggu ini ${km.toFixed(1)} km dari ${runs.length} sesi. Bandingkan dengan minggu-minggu sebelumnya dan hindari lonjakan jarak mendadak.`);
 if(runs.length===0) advice.push('Belum ada sesi minggu ini. Mulai kembali dengan latihan ringan yang sudah biasa kamu toleransi.');
 const targetAdvice={
  '800m':'Untuk target 800 m, dasar aerobik, teknik, dan kecepatan perlu dikembangkan bertahap; jangan menumpuk interval cepat.',
  '1500m':'Untuk target 1500 m, bangun konsistensi easy run dan teknik sebelum menambah sesi kualitas.',
  '3000m':'Untuk target 3000 m, kombinasikan dasar aerobik dan latihan terstruktur secara bertahap.',
  '5K':'Untuk target 5K, prioritaskan konsistensi easy running; sesi tempo/interval hanya saat sudah pulih dan siap.',
  '10K':'Untuk target 10K, kembangkan dasar aerobik dan long run secara bertahap sebelum menambah volume.',
  'Half Marathon':'Untuk half marathon, fondasi aerobik dan peningkatan long run bertahap lebih penting daripada mengejar pace setiap hari.',
  'Marathon':'Untuk marathon, perlu persiapan panjang, pemulihan cukup, dan peningkatan volume bertahap; jangan mulai long run jauh di atas kebiasaan saat ini.',
  'Ultra Marathon':'Untuk ultra, prioritaskan fondasi jangka panjang, ketahanan, pemulihan, dan pendampingan pelatih berpengalaman.',
  'Custom':'Untuk jarak custom, tingkatkan fondasi dan volume secara bertahap sesuai jarak sasaran.',
  'General Fitness':'Untuk kebugaran umum, utamakan konsistensi, variasi ringan, dan pemulihan.'
 };
 advice.push(targetAdvice[target]||targetAdvice['5K']);
 if(all.length>=4){
  const recent=all.slice(-4); const avg=recent.reduce((a,r)=>a+Number(r.distance||0),0)/recent.length;
  detail+=` Rata-rata jarak pada ${recent.length} sesi terakhir ${avg.toFixed(1)} km per sesi.`;
 }
 return {headline,detail,advice,km,hard,runs:runs.length,evaluation,target};
}
function render(){let runs=[...state.runs].sort((a,b)=>b.date.localeCompare(a.date)),wr=weekRuns(),km=wr.reduce((a,r)=>a+r.distance,0),dur=wr.reduce((a,r)=>a+r.duration,0),pct=Math.min(100,Math.round(km/(Number(state.profile.weeklyGoal)||20)*100));$('weekKm').textContent=km.toFixed(1);$('weekRuns').textContent=wr.length;$('avgPace').textContent=dur&&km?(()=>{let s=Math.round(dur*60/km);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')})():'—';$('totalKm').textContent=km.toFixed(1);$('goalPct').textContent=pct+'%';$('goalBar').style.width=pct+'%';$('goalText').textContent=(state.profile.weeklyGoal||20)+' km';$('recentList').className='activity-list'+(runs.length?'':' empty-state');$('recentList').innerHTML=runs.length? runs.slice(0,3).map(activityHTML).join(''):'Belum ada latihan. Catat sesi pertamamu.';$('historyList').className='activity-list'+(runs.length?'':' empty-state');$('historyList').innerHTML=runs.length?runs.map(activityHTML).join(''):'Belum ada aktivitas.';let c=coach();$('overviewAdvice').innerHTML=`<div class="coach-icon">✦</div><div><b>${c.advice[0]}</b><p>${c.detail}</p></div>`;$('coachAnalysis').innerHTML=`<b>${c.headline}</b><p>${c.detail} Minggu ini: ${c.runs} sesi, ${c.km.toFixed(1)} km.</p>`;$('nextAdvice').innerHTML='<ul>'+c.advice.map(a=>`<li>${a}</li>`).join('')+'</ul>';$('athleteName').value=state.profile.name||'';$('target').value=state.profile.target||'5K';$('pbTarget').value=state.profile.pbTarget||state.profile.pb5k||'';$('customDistance').value=state.profile.customDistance||'';$('weeklyGoal').value=state.profile.weeklyGoal||20}
function openModal(){$('runDate').value=dateISO();$('runModal').classList.add('open')}function closeModal(){$('runModal').classList.remove('open')}
$('addRun').onclick=openModal;$('addRun2').onclick=openModal;$('closeModal').onclick=closeModal;$('runModal').addEventListener('click',e=>{if(e.target===$('runModal'))closeModal()});$('runForm').addEventListener('submit',e=>{e.preventDefault();let r={id:crypto.randomUUID(),date:$('runDate').value,type:$('runType').value,distance:Number($('distance').value),duration:Number($('duration').value),heartRate:$('heartRate').value?Number($('heartRate').value):null,rpe:$('rpe').value?Number($('rpe').value):null,sleep:$('sleep').value?Number($('sleep').value):null,legs:$('legs').value,notes:$('notes').value.trim()};if(!r.date||r.distance<=0||r.duration<=0)return toast('Periksa tanggal, jarak, dan durasi.');state.runs.push(r);save();e.target.reset();closeModal();toast('Latihan berhasil disimpan')});
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active')});document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>document.querySelector(`[data-tab="${b.dataset.goto}"]`).click());$('saveProfile').onclick=()=>{state.profile={name:$('athleteName').value.trim(),target:$('target').value,pbTarget:$('pbTarget').value.trim(),customDistance:$('customDistance').value,weeklyGoal:Math.max(1,Number($('weeklyGoal').value)||20)};save();toast('Profil disimpan')};$('exportBtn').onclick=()=>{let cols=['date','type','distance','duration','heartRate','rpe','sleep','legs','notes'];let csv=[cols.join(','),...state.runs.map(r=>cols.map(k=>'"'+String(r[k]??'').replaceAll('"','""')+'"').join(','))].join('\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='runcoach-pro-training.csv';a.click();URL.revokeObjectURL(a.href)};$('clearData').onclick=()=>{if(confirm('Hapus semua riwayat latihan dan profil? Tindakan ini tidak dapat dibatalkan.')){state={runs:[],profile:{name:'',target:'5K',pbTarget:'21:15',customDistance:'',weeklyGoal:20}};save();toast('Data lokal dihapus')}};$('stravaInfo').onclick=()=>alert('Integrasi Strava belum aktif. Untuk mengaktifkannya, developer perlu membuat aplikasi di Strava API, menyiapkan OAuth redirect dan backend token exchange. Token rahasia tidak boleh disimpan di APK.');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e});$('installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();deferredPrompt=null}else toast('Gunakan menu browser → Tambahkan ke layar utama')};if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));render();
