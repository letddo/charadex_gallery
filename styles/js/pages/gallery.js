/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {

  let dex = await charadex.initialize.page(
    null,
    charadex.page.gallery,
    null, 
    async (listData) => {

      if (listData.type == 'gallery') {

        // Create the log dex
        if (charadex.tools.checkArray(listData.galleryArray[0]['갤러리내역'])) {
          let logs = await charadex.initialize.page(
            listData.galleryArray[0]['갤러리내역'],
            charadex.page.gallery.relatedData['갤러리 내역']
          );
        }

      }

    }
  );
  
  charadex.tools.loadPage('.softload', 500);
  
});
