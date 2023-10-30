const img = chrome.runtime.getURL("block.svg");
const storageName = "animesonline";
const selectors = {
  title: ".mHeader",
  block: ".block-anime",
  unblock: ".unblock-all",
  firstloadTrigger: "videos",
  insertBlockButton: ".video-info",
  blockerParentRef: ".video-conteudo",
  findTitleAttr: "a[itemprop='URL'][title]",
};

const UnBlockButton = /*html */ `
  <a class='unblock-all' href='#'>
    <img src="${img}" />
    <b>Resetar Bloqueios</b>
  </a>
`;

const BlockButton = /*html */ `
  <a class='block-anime' href='#'>
    <img style='height:20px' src="${img}" />
  </a>
`;

$(document).ready(async () => {
  $(selectors.title).append(UnBlockButton);
  inicializar();
});

//RESETAR
$(document).on("click", selectors.unblock, function () {
  chrome.storage.sync.remove(storageName);
  document.location.reload(true);
});

//BLOQUEAR ANIMES NO CLICK
$(document).on("click", selectors.block, function (event) {
  event.preventDefault();
  event.stopPropagation();

  const closestLink = $(this).closest(selectors.blockerParentRef).find(selectors.findTitleAttr);
  const anime = closestLink.eq(0).attr("title").split(" – ")[0];

  // CHECKAR SE HA SALVOS
  chrome.storage.sync.get(storageName, function (result) {
    let animes = result?.[storageName] || [];

    if (!animes.includes(anime)) {
      $(`img[alt*='${anime}']`).closest(selectors.blockerParentRef).css("opacity", "0.01");
      animes.push(anime);
      console.log("blocked", animes);
    } else {
      $(`img[alt*='${anime}']`).closest(selectors.blockerParentRef).css("opacity", "1");
      animes.splice(animes.indexOf(anime), 1);
      console.log("un-blocked", animes);
    }

    chrome.storage.sync.set({ [storageName]: animes }, function () {});
  });
});

//INICIALIZAR EXTENSÃO NAS PAGINAS
function inicializar(params) {
  $(selectors.insertBlockButton).append(BlockButton);

  chrome.storage.sync.get(storageName, function (result) {
    let animes = result?.[storageName] || [];

    animes.map((val, index) => {
      $(`img[alt*='${val}']`).closest(selectors.blockerParentRef).css("opacity", "0.01");
    });
  });
}