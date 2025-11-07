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
    charadex.page.masterlist,
    null, 
    async (listData) => {
      if (listData.type == 'profile') {
        // Create the log dex
        if (charadex.tools.checkArray(listData.profileArray[0]['마스터리스트내역'])) {
          let logs = await charadex.initialize.page(
            listData.profileArray[0]['마스터리스트내역'],
            charadex.page.masterlist.relatedData['마스터리스트 내역']
          );
        }

      }

    }
  );
  
  charadex.tools.loadPage('.softload', 500);
  
});