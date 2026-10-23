document.documentElement.classList.add('js');

// Dach wird einmal eingedeckt, sobald es ins Bild kommt
(function () {
  var fig = document.getElementById('dachFigur');
  if (!fig) return;
  if (!('IntersectionObserver' in window)) { fig.classList.add('drauf'); return; }
  var io = new IntersectionObserver(function (e) {
    if (e[0].isIntersecting) { fig.classList.add('drauf'); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(fig);
})();

// Kacheln füllen das Thema im Formular vor
document.querySelectorAll('.kachel[data-thema]').forEach(function (k) {
  k.addEventListener('click', function () {
    var v = k.getAttribute('data-thema');
    document.querySelectorAll('input[name="thema"]').forEach(function (c) {
      if (c.value === v) c.checked = true;
    });
  });
});

// Formular: nichts wird versendet, nur Zusammenfassung zeigen
(function () {
  var f = document.getElementById('formular');
  var out = document.getElementById('zusammenfassung');
  if (!f) return;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = new FormData(f);
    var themen = d.getAll('thema');
    var fotos = f.foto.files ? f.foto.files.length : 0;
    var html = '<h4>So käme Ihre Anfrage an</h4><ul>' +
      '<li><b>Thema:</b> ' + (themen.length ? esc(themen.join(', ')) : 'noch nicht gewählt') + '</li>' +
      '<li><b>Ort:</b> ' + esc(d.get('ort') || '–') + '</li>' +
      '<li><b>Start:</b> ' + esc(d.get('zeit')) + '</li>' +
      '<li><b>Fotos:</b> ' + fotos + '</li>' +
      '<li><b>Rückruf an:</b> ' + esc(d.get('name') || '–') + ', ' + esc(d.get('tel') || '–') + '</li>' +
      '</ul><p>Entwurf: Die Anfrage wurde <b>nicht</b> versendet.</p>';
    out.innerHTML = html;
    out.hidden = false;
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
