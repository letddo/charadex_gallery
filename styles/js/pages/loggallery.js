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

    }
  );
  
  charadex.tools.loadPage('.softload', 500);
  
});
