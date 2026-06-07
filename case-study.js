/* ============================================================
   CASE STUDY — поведение карусели.
   Подключение в конце <body>:  <script src="./case-study.js"></script>
   Размечать ничего вручную не нужно — скрипт сам находит .carousel.

   Разметка:
   <div class="carousel">
     <button class="carousel-arrow prev" aria-label="Назад">‹</button>
     <div class="carousel-track">
       <div class="media"><img ... /></div>
       <div class="media"><img ... /></div>
     </div>
     <button class="carousel-arrow next" aria-label="Вперёд">›</button>
   </div>
   ============================================================ */
(function () {
  function initCarousel(root) {
    var track = root.querySelector('.carousel-track');
    var prev = root.querySelector('.carousel-arrow.prev');
    var next = root.querySelector('.carousel-arrow.next');
    if (!track) return;

    // оборачиваем стрелки + трек в viewport, чтобы стрелки центрировались
    // по высоте картинки, а не по всему блоку (с точками снизу)
    var viewport = document.createElement('div');
    viewport.className = 'carousel-viewport';
    if (prev) viewport.appendChild(prev);
    viewport.appendChild(track);
    if (next) viewport.appendChild(next);
    root.appendChild(viewport);

    function step() {
      // прокручиваем на ширину видимой области (≈ один слайд)
      return track.clientWidth;
    }
    // точки-индикаторы по числу слайдов
    var slides = track.children;
    var dotsWrap = null, dots = [];
    if (slides.length > 1) {
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'carousel-dots';
      for (var s = 0; s < slides.length; s++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.setAttribute('aria-label', 'Слайд ' + (idx + 1));
          dot.addEventListener('click', function () {
            track.scrollTo({ left: idx * (track.clientWidth + 20), behavior: 'smooth' });
          });
          dots.push(dot);
          dotsWrap.appendChild(dot);
        })(s);
      }
      root.appendChild(dotsWrap);
    }

    function update() {
      if (dots.length) {
        var i = Math.round(track.scrollLeft / (track.clientWidth + 20));
        for (var j = 0; j < dots.length; j++) {
          dots[j].classList.toggle('active', j === i);
        }
      }
    }
    // обе стрелки всегда активны, листание по кругу
    function go(dir) {
      var max = track.scrollWidth - track.clientWidth - 1;
      if (dir > 0) {
        if (track.scrollLeft >= max) track.scrollTo({ left: 0, behavior: 'smooth' });
        else track.scrollBy({ left: step(), behavior: 'smooth' });
      } else {
        if (track.scrollLeft <= 0) track.scrollTo({ left: max, behavior: 'smooth' });
        else track.scrollBy({ left: -step(), behavior: 'smooth' });
      }
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // пересчёт после загрузки картинок (иначе scrollWidth ещё не известен)
    var imgs = track.querySelectorAll('img');
    for (var k = 0; k < imgs.length; k++) {
      if (!imgs[k].complete) imgs[k].addEventListener('load', update);
    }
    window.addEventListener('load', update);
    update();
  }

  /* ── Лайтбокс: тап по картинке открывает её увеличенной (мобилка) ── */
  function initLightbox() {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML =
      '<button class="lightbox-close" aria-label="Закрыть">✕</button><img alt="" />';
    var bigImg = box.querySelector('img');
    var prevOverflow = '';
    document.body.appendChild(box);

    /* — зум/панорамирование жестами — */
    var scale = 1, tx = 0, ty = 0;
    var startDist = 0, startScale = 1, startX = 0, startY = 0, startTx = 0, startTy = 0;
    var mode = null, lastTap = 0;

    function applyT() {
      bigImg.style.transform =
        'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    }
    function resetT() { scale = 1; tx = 0; ty = 0; applyT(); }
    function dist(t) {
      var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    bigImg.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        mode = 'pinch';
        startDist = dist(e.touches);
        startScale = scale;
      } else if (e.touches.length === 1) {
        var now = Date.now();
        if (now - lastTap < 300) {          // double tap — переключить зум
          e.preventDefault();
          if (scale > 1) resetT(); else { scale = 2.5; applyT(); }
          lastTap = 0;
          return;
        }
        lastTap = now;
        if (scale > 1) {
          mode = 'pan';
          startX = e.touches[0].clientX; startY = e.touches[0].clientY;
          startTx = tx; startTy = ty;
        }
      }
    }, { passive: false });

    bigImg.addEventListener('touchmove', function (e) {
      if (mode === 'pinch' && e.touches.length === 2) {
        e.preventDefault();
        scale = Math.min(5, Math.max(1, startScale * (dist(e.touches) / startDist)));
        if (scale === 1) { tx = 0; ty = 0; }
        applyT();
      } else if (mode === 'pan' && e.touches.length === 1) {
        e.preventDefault();
        tx = startTx + (e.touches[0].clientX - startX);
        ty = startTy + (e.touches[0].clientY - startY);
        applyT();
      }
    }, { passive: false });

    bigImg.addEventListener('touchend', function (e) {
      if (e.touches.length === 0) mode = null;
      else if (e.touches.length === 1) {
        mode = scale > 1 ? 'pan' : null;
        startX = e.touches[0].clientX; startY = e.touches[0].clientY;
        startTx = tx; startTy = ty;
      }
    });

    function open(src, alt) {
      bigImg.src = src;
      bigImg.alt = alt || '';
      resetT();
      box.classList.add('open');
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    function close() {
      box.classList.remove('open');
      bigImg.removeAttribute('src');
      resetT();
      document.body.style.overflow = prevOverflow;
    }

    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    var imgs = document.querySelectorAll(
      '.hero img, .media img, .figure img, .research-img'
    );
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        img.addEventListener('click', function () {
          // в лайтбоксе — полноразмерная версия (data-full), чтобы при зуме было чётко
          open(img.getAttribute('data-full') || img.currentSrc || img.src, img.alt);
        });
      })(imgs[i]);
    }
  }

  function init() {
    var list = document.querySelectorAll('.carousel');
    for (var i = 0; i < list.length; i++) initCarousel(list[i]);
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
