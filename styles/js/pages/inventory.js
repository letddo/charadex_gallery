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
    charadex.page.inventory,
    null, 
    async (listData) => {

      if (listData.type == 'profile') {

        let profile = listData.profileArray[0];

        // Inventory
        charadex.initialize.groupGallery(
          charadex.page.inventory.inventoryConfig,
          await charadex.manageData.inventoryFix(profile),
          'type',
          charadex.url.getPageUrl('items')
        )

        // Designs
        if (charadex.tools.checkArray(profile['마스터리스트'])) {
          let designs = await charadex.initialize.page(
            profile['마스터리스트'],
            charadex.page.inventory.relatedData['마스터리스트'],
          );
        }

        // Logs
        if (charadex.tools.checkArray(profile['인벤토리내역'])) {
          let logs = await charadex.initialize.page(
            profile['인벤토리내역'],
            charadex.page.inventory.relatedData['인벤토리 내역'],
          );
        }


      }
    }
  );
  
  charadex.tools.loadPage('.softload', 500);
  
});
