/**
 * Loaded once from the church site footer.
 * Reads sibling live.json and updates the homepage watch image link + caption.
 */
(function () {
  var script = document.currentScript;
  if (!script || !script.src) return;

  var dataUrl = new URL("live.json", script.src);
  dataUrl.searchParams.set("t", String(Date.now()));

  function apply(live) {
    if (!live || !live.watchUrl || !live.title) return false;
    var img = document.querySelector('img[alt="Click here to watch live!"]');
    if (!img) return false;

    var link = img.closest("a");
    if (link) {
      link.href = live.watchUrl;
      link.target = "_blank";
      if (!link.getAttribute("rel")) link.setAttribute("rel", "noopener noreferrer");
    }

    var figure = img.closest("figure") || img.parentElement;
    var caption = figure && figure.querySelector("figcaption p, .image-caption p");
    if (caption) caption.textContent = live.title;
    return Boolean(link && caption);
  }

  fetch(dataUrl.href, { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("live.json " + res.status);
      return res.json();
    })
    .then(function (live) {
      if (apply(live)) return;
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        if (apply(live) || tries > 20) clearInterval(timer);
      }, 250);
    })
    .catch(function () {});
})();
