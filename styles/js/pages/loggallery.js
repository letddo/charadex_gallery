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
    charadex.page.loggallery,
    null, 
    async (listData) => {

      if (listData.type == 'loggallery') {

        // Create the log dex
        if (charadex.tools.checkArray(listData.loggalleryArray[0]['갤러리내역'])) {
          let logs = await charadex.initialize.page(
            listData.loggalleryArray[0]['갤러리내역'],
            charadex.page.loggallery.relatedData['갤러리 내역']
          );
        }
      }

    }
  );
  
  charadex.tools.loadPage('.softload', 500);
  
});
