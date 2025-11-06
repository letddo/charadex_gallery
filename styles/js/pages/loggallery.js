
let dex = await charadex.initialize.page(
null,
    charadex.page.gallery,
    charadex.page.loggallery,
null, 
async (listData) => {

      if (listData.type == 'gallery') {
      if (listData.type == 'loggallery') {

// Create the log dex
        if (charadex.tools.checkArray(listData.galleryArray[0]['갤러리내역'])) {
        if (charadex.tools.checkArray(listData.loggalleryArray[0]['갤러리내역'])) {
let logs = await charadex.initialize.page(
            listData.galleryArray[0]['갤러리내역'],
            charadex.page.gallery.relatedData['갤러리 내역']
            listData.loggalleryArray[0]['갤러리내역'],
            charadex.page.loggallery.relatedData['갤러리 내역']
);
}
