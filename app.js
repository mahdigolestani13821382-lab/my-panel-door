const $=s=>document.querySelector(s);
const navs=document.querySelectorAll('.nav');
const sections=document.querySelectorAll('.section');
navs.forEach(btn=>btn.onclick=()=>{
  navs.forEach(x=>x.classList.remove('active')); btn.classList.add('active');
  sections.forEach(x=>x.classList.remove('active')); $('#'+btn.dataset.section).classList.add('active');
  $('#title').textContent=btn.textContent;
  if(btn.dataset.section==='notes') loadNotes();
  if(btn.dataset.section==='system') loadHealth();
});
async function loadHealth(){
  try{
    const r=await fetch('/api/health'); const d=await r.json();
    $('#health').textContent=JSON.stringify(d,null,2);
    $('#dbStatus').textContent=d.d1?'OK':'Unavailable';
    $('#kvStatus').textContent=d.kv?'OK':'Unavailable';
  }catch(e){$('#health').textContent='خطا: '+e.message}
}
async function loadNotes(){
  const r=await fetch('/api/notes'); const d=await r.json();
  $('#noteCount').textContent=d.notes?.length??0;
  $('#notesList').innerHTML=(d.notes||[]).map(n=>`<div class="note"><span>${escapeHtml(n.text)}</span><button class="delete" onclick="removeNote(${n.id})">حذف</button></div>`).join('');
}
async function addNote(){
  const text=$('#noteInput').value.trim(); if(!text)return;
  await fetch('/api/notes',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text})});
  $('#noteInput').value=''; loadNotes(); loadHealth();
}
async function removeNote(id){await fetch('/api/notes?id='+encodeURIComponent(id),{method:'DELETE'});loadNotes();}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
$('#addNote').onclick=addNote;
loadHealth(); loadNotes();
