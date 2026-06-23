// ── AMBIL NAMA TAMU DARI URL ──
document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get('to');
  
  if(nama) {
    // Mengganti teks dengan nama dari URL
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
    loadComments(); // Langsung memuat ucapan dari Google Sheets
    
    // Play music fallback if not already playing
    var m = document.getElementById('musik-latar') || document.getElementById('bg-music');
    if (m) m.play().catch(function(){});
  }, 850);
}

// ── MUSIC ──
var musicOn = true;
document.getElementById('music-toggle').addEventListener('click', function() {
  var m = document.getElementById('musik-latar') || document.getElementById('bg-music');
  if(!m) return;

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

// ── COMMENTS / RSVP (GOOGLE SHEETS) ──

// PASTE URL ANDA DI BAWAH INI (Di dalam tanda kutip tunggal)
const scriptURL = 'https://script.google.com/macros/s/AKfycbw-m1ATlxilFiAfkLNU4r5W1IrL2zLJI_ls8ZgueLhUVvRXng6IKFy9_5ddoUytf4rq4A/exec';

function submitComment() {
  const nama = document.getElementById('guest-name').value.trim();
  const hadir = document.getElementById('guest-hadir').value;
  const ucapan = document.getElementById('guest-message').value.trim();

  if(!nama || !ucapan) {
    alert('Nama dan ucapan harus diisi!');
    return;
  }

  const btn = document.querySelector('.subbtn');
  const teksAsli = btn.innerText;
  btn.innerText = 'Mengirim...';

  const formData = new FormData();
  formData.append('nama', nama);
  formData.append('hadir', hadir);
  formData.append('ucapan', ucapan);

  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => {
      btn.innerText = teksAsli;
      document.getElementById('guest-name').value = '';
      document.getElementById('guest-message').value = '';
      loadComments(); // Memuat ulang daftar ucapan
      document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
    .catch(error => {
      console.error('Error!', error.message);
      btn.innerText = teksAsli;
      alert('Gagal mengirim ucapan, coba lagi nanti.');
    });
}

function loadComments() {
  const list = document.getElementById('comments-list');
  if(!list) return; 
  
  list.innerHTML = '<div style="text-align:center; font-style:italic; color:var(--text-soft); padding:18px;">Memuat ucapan...</div>';

  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
      list.innerHTML = '';
      if(data.length === 0) {
        list.innerHTML = '<div style="text-align:center;font-family:Cormorant Garamond,serif;font-style:italic;color:var(--text-soft);padding:18px;">Jadilah yang pertama memberikan ucapan...</div>';
        return;
      }
      
      // Reverse agar ucapan terbaru ada di urutan teratas
      data.reverse().forEach(item => {
        let cls = item.hadir === 'hadir' ? 'bh' : item.hadir === 'tidak' ? 'bt' : 'bb';
        let txt = item.hadir === 'hadir' ? 'Hadir' : item.hadir === 'tidak' ? 'Tidak Hadir' : 'Belum Pasti';
        let badge = item.hadir ? '<span class="cbdg ' + cls + '">' + txt + '</span>' : '';

        // Menghindari karakter berbahaya (escape HTML)
        let safeNama = item.nama.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        let safeUcapan = item.ucapan.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        list.innerHTML += `
          <div class="cmtcard">
            <div class="cmthdr">
              <div class="cmtnm">${safeNama}</div>
              ${badge}
            </div>
            <div class="cmttxt">${safeUcapan}</div>
            <div class="cmttm">${item.waktu}</div>
          </div>
        `;
      });
    })
    .catch(error => {
      list.innerHTML = '<div style="text-align:center; padding:20px; font-size:0.8rem; color:red;">Gagal memuat ucapan.</div>';
    });
}

// ── TRIGGER MUSIK SAAT TOMBOL DIKLIK ──
document.addEventListener("DOMContentLoaded", function() {
  const tombolBuka = document.querySelector('.btn-light'); 
  const lagu = document.getElementById('musik-latar');

  if (tombolBuka && lagu) {
    tombolBuka.addEventListener('click', function() {
      lagu.play().catch(function(){}); 
    });
  }
});