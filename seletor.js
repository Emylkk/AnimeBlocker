const img = chrome.runtime.getURL("block.svg")
const storageName = "animesonline"
const selectors = {
    title: '.mHeader',
    block: '.block-anime',
    unblock: '.unblock-all',
    firstloadTrigger: 'videos',
    insertBlockButton: '.video-info',
    blockerParentRef: '.video-conteudo',
    findTitleAttr: 'a[itemprop="URL"][title]',
}
const UnBlockButton =
    `<a class='unblock-all' href='#' >
        <img  src="${img}" />
        <b>Resetar Bloqueios</b>
    </a>`
const BlockButton =
    /*html */
    `<a class='block-anime' href='#'>
        <img style='height:20px'  src="${img}" />
    </a>`


$(document).ready(async () => {
    $(selectors.title).append(UnBlockButton);
});

//RESETAR
$(document).on("click", selectors.unblock, function () {
    chrome.storage.sync.remove(storageName)
    document.location.reload(true);
});
//FIM-RESETAR
$(document).ready(async () => {
    inicializar()
});
//BLOQUEAR ANIMES NO CLICK
$(document).on("click", selectors.block, function (event) {
    event.preventDefault();
    let closestLink = $(this).closest(selectors.blockerParentRef).find(selectors.findTitleAttr);
    let anime = closestLink.eq(0).attr('title');
    anime = anime.split(' – ')[0]
    //CHECKAR SE HA SALVOS
    chrome.storage.sync.get(storageName, function (result) {
        var resultado = [];
        let animes = result?.[storageName];
        if (typeof animes == 'object') {
            resultado = [...resultado, ...animes]
            let hasone = false;
            hasone = resultado.findIndex(function (anim) { return anime == anim });
            if (hasone < 0) {
                $(`img[alt*='${anime}']`).closest(selectors.blockerParentRef).css('opacity', '0.01')
                animes.push(anime)
                console.log('blocked', animes);

            } else {
                $(`img[alt*='${anime}']`).closest(selectors.blockerParentRef).css('opacity', '1')
                animes.splice(hasone, 1)
                console.log('un-blocked', animes);

            }
            chrome.storage.sync.set({ [storageName]: animes }, function () { })

        } else {
            //SALVAR caso esteja vazio
            $(`img[alt*='${anime}']`).closest(selectors.blockerParentRef).css('opacity', '0.01')
            chrome.storage.sync.set({ [storageName]: [anime] }, function () { })
            console.log('wooooowa', anime);
        }

    });
})

//FIM BLOQUEIO DE ANIMES

//INICIALIZAR EXTENSÃO NAS PAGINAS
function inicializar(params) {
    let resultado = []
    $(selectors.insertBlockButton).append(BlockButton);
    chrome.storage.sync.get(storageName, function (result) {
        let animes = result?.[storageName]
        if (typeof animes == 'object') {
            resultado = [...resultado, ...animes]

            resultado?.map((val, index) => {
                console.log(val)
                $(`img[alt*='${val}']`)?.closest(selectors.blockerParentRef)?.css('opacity', '0.1')
            })
        }
    });
    chrome.storage.sync.get(storageName, (result) => { console.log(result) })
}