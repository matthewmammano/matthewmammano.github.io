(function () {
  var bar = document.getElementById("archive-topbar");
  if (!bar) return;

  fetch("./meta.json")
    .then(function (res) { return res.json(); })
    .then(function (meta) {
      bar.innerHTML =
        '<div class="field"><span class="label">Created</span>' + (meta.date || "") + '</div>' +
        '<div class="field"><span class="label">By</span>' + (meta.creator || "") + '</div>' +
        '<div class="field notes">' + (meta.notes ? '<span class="label">Notes</span>' + meta.notes : "") + '</div>';
    })
    .catch(function () {
      bar.textContent = "";
    });
})();
