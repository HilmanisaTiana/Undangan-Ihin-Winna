// ── AMBIL NAMA TAMU DARI URL ──
document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get('to');
  
  if(nama) {
    // Mengganti teks dengan nama dari URL (dan mengganti tanda + atau %20 menjadi spasi)
    document.getElementById('nama-tamu').innerText = nama;
  }
});
// ── PETAL ANIMATION ──
var canvas = document.getElementById('petalCanvas');
var ctx = canvas.getContext('2d');

function resize() { 
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight; 
}
resize();
window.addEventListener('resize', resize);

var PC = ['rgba(196,150,60,', 'rgba(180,148,100,', 'rgba(220,195,140,', 'rgba(160,130,90,', 'rgba(210,175,120,'];

function rnd(a, b) { return Math.random() * (b - a) + a; }

function makePetal(spread) {
  return {
    x: rnd(0, canvas.width),
    y: spread ? rnd(-50, canvas.height) : rnd(-160, -10),
    size: rnd(5, 13), vy: rnd(.4, 1.2), vx: rnd(-.32, .32),
    rot: rnd(0, Math.PI * 2), drot: rnd(-.02, .02),
    wb: rnd(0, Math.PI * 2), wbA: rnd(.2, .6), wbS: rnd(.009, .022),
    alpha: rnd(.18, .5),
    color: PC[Math.floor(Math.random() * PC.length)],
    shape: Math.random() < .55 ? 0 : (Math.random() < .5 ? 1 : 2),
    sx: rnd(.35, .62)
  };
}

function resetPetal(p) {
  var n = makePetal(false);
  p.x = n.x; p.y = n.y; p.size = n.size; p.vy = n.vy; p.vx = n.vx;
  p.rot = n.rot; p.drot = n.drot; p.wb = n.wb; p.wbA = n.wbA; p.wbS = n.wbS;
  p.alpha = n.alpha; p.color = n.color; p.shape = n.shape; p.sx = n.sx;
}

function updatePetal(p) {
  p.wb += p.wbS;
  p.x += p.vx + Math.sin(p.wb) * p.wbA;
  p.y += p.vy;
  p.rot += p.drot;
  if(p.y > canvas.height + 26) resetPetal(p);
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha;
  var f = p.color + p.alpha + ')';
  
  if(p.shape === 0) {
    ctx.scale(p.sx, 1); ctx.beginPath(); ctx.ellipse(0, 0, p.size * .5, p.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = f; ctx.fill();
  } else if(p.shape === 1) {
    ctx.beginPath(); ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * .5, -p.size * .35, p.size * .5, p.size * .35, 0, p.size * .22);
    ctx.bezierCurveTo(-p.size * .5, p.size * .35, -p.size * .5, -p.size * .35, 0, -p.size);
    ctx.fillStyle = f; ctx.fill();
  } else {
    ctx.beginPath(); ctx.arc(0, 0, p.size * .35, 0, Math.PI * 2);
    ctx.fillStyle = p.color + (p.alpha * .6) + ')'; ctx.fill();
  }
  ctx.restore();
}

var petals = [];
var animOn = false;
for(var i = 0; i < 28; i++) petals.push(makePetal(true));

function animLoop() {
  if(!animOn) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < petals.length; i++) { updatePetal(petals[i]); drawPetal(petals[i]); }
  requestAnimationFrame(animLoop);
}

// ── NAVIGATION ──
function showCover() {
  document.getElementById('pre-cover').classList.add('hidden');
  document.getElementById('cover').classList.add('active');
}

function openInvitation() {
  var cov = document.getElementById('cover');
  cov.classList.add('hidden');
  setTimeout(function() {
    cov.classList.remove('active');
    document.getElementById('main-content').classList.add('visible');
    document.getElementById('music-toggle').classList.add('visible');
    animOn = true;
    animLoop();
    startCountdown();
    initReveal();
    loadComments();
    document.getElementById('bg-music').play().catch(function(){});
  }, 850);
}

// ── MUSIC ──
var musicOn = true;
document.getElementById('music-toggle').addEventListener('click', function() {
  var m = document.getElementById('bg-music');
  if(musicOn) { m.pause(); } else { m.play(); }
  musicOn = !musicOn;
  
  var icon = musicOn
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
    
  this.innerHTML = '<span class="pulse-ring"></span>' + icon;
});

// ── COUNTDOWN ──
function startCountdown() {
  var target = new Date('2026-08-25T08:30:00').getTime();
  function tick() {
    var diff = target - Date.now();
    if(diff <= 0) {
      ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(function(id) { document.getElementById(id).textContent = '00'; });
      return;
    }
    document.getElementById('cd-days').textContent  = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(Math.floor(diff % 86400000 / 3600000)).padStart(2, '0');
    document.getElementById('cd-mins').textContent  = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
    document.getElementById('cd-secs').textContent  = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

// ── SCROLL REVEAL ──
function initReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
}

// ── COPY NUMBERS (Tanpa Spasi Saat Disalin) ──
function copyNum(id, btn) {
  var rawText = document.getElementById(id).textContent;
  var textToCopy = rawText.replace(/\s+/g, ''); 
  
  var fallback = function() {
    var ta = document.createElement('textarea');
    ta.value = textToCopy; 
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  };
  
  var done = function() {
    var originalText = btn.textContent;
    btn.textContent = '\u2713 Tersalin';
    btn.classList.add('copied');
    setTimeout(function() { 
      btn.textContent = originalText; 
      btn.classList.remove('copied'); 
    }, 2500);
  };
  
  if(navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy).then(done).catch(function() { fallback(); done(); });
  } else { fallback(); done(); }
}

// ── COMMENTS / RSVP ──
var SK = 'winna_ihin_v4';

function loadComments() { renderComments(JSON.parse(localStorage.getItem(SK) || '[]')); }
function escH(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function renderComments(list) {
  var c = document.getElementById('comments-list');
  if(!list.length) {
    c.innerHTML = '<div style="text-align:center;font-family:Cormorant Garamond,serif;font-style:italic;color:var(--text-soft);padding:18px;">Jadilah yang pertama memberikan ucapan...</div>';
    return;
  }
  var html = '';
  var rev = list.slice().reverse();
  for(var i = 0; i < rev.length; i++) {
    var x = rev[i];
    var cls = x.hadir === 'hadir' ? 'bh' : x.hadir === 'tidak' ? 'bt' : 'bb';
    var txt = x.hadir === 'hadir' ? 'Hadir' : x.hadir === 'tidak' ? 'Tidak Hadir' : 'Belum Pasti';
    var badge = x.hadir ? '<span class="cbdg ' + cls + '">' + txt + '</span>' : '';
    html += '<div class="cmtcard"><div class="cmthdr"><div class="cmtnm">' + escH(x.name) + '</div>' + badge + '</div><div class="cmttxt">' + escH(x.message) + '</div><div class="cmttm">' + x.time + '</div></div>';
  }
  c.innerHTML = html;
}

function submitComment() {
  var name  = document.getElementById('guest-name').value.trim();
  var hadir = document.getElementById('guest-hadir').value;
  var msg   = document.getElementById('guest-message').value.trim();
  
  if(!name) return alert('Mohon isi nama Anda.');
  if(!msg)  return alert('Mohon tulis ucapan terlebih dahulu.');
  
  var now  = new Date();
  var time = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
           + ' \xb7 ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
           
  var list = JSON.parse(localStorage.getItem(SK) || '[]');
  list.push({ name: name, hadir: hadir, message: msg, time: time });
  localStorage.setItem(SK, JSON.stringify(list));
  
  document.getElementById('guest-name').value    = '';
  document.getElementById('guest-hadir').value   = '';
  document.getElementById('guest-message').value = '';
  
  renderComments(list);
  document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

(function seedComments() {
  if(!localStorage.getItem(SK)) {
    localStorage.setItem(SK, JSON.stringify([
      { name: 'Keluarga Besar Surhana', hadir: 'hadir', message: 'Selamat menempuh hidup baru, Ihin & Winna! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin 🤲', time: '1 Juni 2026 \xb7 08.00' },
      { name: 'Sahabat Winna', hadir: 'hadir', message: 'MashaAllah Winna, akhirnya menemukan pasangan hidupnya. Selamat ya bestie! Bahagia selalu 💛', time: '5 Juni 2026 \xb7 10.15' },
      { name: 'Teman Kampus Ihin', hadir: 'belum', message: 'Selamat Kang Ihin! Alhamdulillah akhirnya... Semoga bahagia selalu! Aamiin 😊', time: '10 Juni 2026 \xb7 19.30' }
    ]));
  }
})();