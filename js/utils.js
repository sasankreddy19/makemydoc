// ── SHARED UTILITIES ─────────────────────────────────────────────────────────

function openModal(title, sub, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-sub').textContent = sub;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('modal-body').innerHTML = '';
  document.body.style.overflow = '';
}
function closeIfOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function readFileAsDataURL(file) {
  return new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(file); });
}
function readFileAsText(file) {
  return new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsText(file); });
}
function readFileAsArrayBuffer(file) {
  return new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsArrayBuffer(file); });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
function downloadDataURL(dataUrl, filename) {
  const a = document.createElement('a'); a.href = dataUrl; a.download = filename; a.click();
}

function dropZoneHTML(id, accept, label, multiple) {
  return `
    <div class="drop-zone" id="dz-${id}"
         onclick="document.getElementById('fi-${id}').click()"
         ondragover="event.preventDefault();this.classList.add('dragover')"
         ondragleave="this.classList.remove('dragover')"
         ondrop="handleDrop(event,'fi-${id}','dz-${id}')">
      <div class="drop-icon">📂</div>
      <div class="drop-label"><strong>Click to upload</strong> or drag & drop<br/>${label}</div>
    </div>
    <input type="file" id="fi-${id}" accept="${accept}" ${multiple?'multiple':''} onchange="onFileChosen(this,'dz-${id}')" />
  `;
}
function handleDrop(e, inputId, dzId) {
  e.preventDefault();
  document.getElementById(dzId).classList.remove('dragover');
  const input = document.getElementById(inputId);
  if (e.dataTransfer.files.length) {
    Object.defineProperty(input, 'files', { value: e.dataTransfer.files, configurable: true });
    input.dispatchEvent(new Event('change'));
  }
}
function onFileChosen(input, dzId) {
  if (input.files[0]) {
    const dz = document.getElementById(dzId);
    const names = Array.from(input.files).map(f=>f.name).join(', ');
    const size = Array.from(input.files).reduce((a,f)=>a+f.size,0);
    dz.innerHTML = `<div class="drop-icon">✅</div><div class="drop-label"><strong>${names}</strong><br/>${(size/1024).toFixed(1)} KB</div>`;
  }
}

function showProgress(id, val) {
  const w = document.getElementById('pb-'+id); if(!w) return;
  w.style.display='block';
  const f = document.getElementById('pb-'+id+'-fill'); if(f) f.style.width=val+'%';
}
function hideProgress(id) {
  const w = document.getElementById('pb-'+id); if(w) w.style.display='none';
}

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); });
}

// Category filter
function filterCat(cat) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.tool-card').forEach(c => {
    c.dataset.hidden = (cat !== 'all' && c.dataset.cat !== cat) ? 'true' : 'false';
  });
}

// Search
function searchTools(q) {
  const val = q.toLowerCase();
  document.querySelectorAll('.tool-card').forEach(c => {
    const name = c.querySelector('.tool-name')?.textContent.toLowerCase() || '';
    const desc = c.querySelector('.tool-desc')?.textContent.toLowerCase() || '';
    c.dataset.hidden = (val && !name.includes(val) && !desc.includes(val)) ? 'true' : 'false';
  });
}
