/* ==================================================================== */
/* Charadex
=======================================================================  /

  The charadex namespace. You can use it if you like, but this should
  prevent charadex from messing with any other imported code.
    
======================================================================= */
let charadex = {};

/* ==================================================================== */
/* Site
/* If you don't want to hard code your site information, you
/* can fill this out instead
/* Any preview links will still show Charadex's information
/* ==================================================================== */
charadex.site = {
  title: "Test",
  url: "https://m4ch1n4097.github.io/charadex_gallery",
  description: `A tool for organizing small ARPGs and species.`
}

/* ==================================================================== */
/* Sheet Config
/* Your sheet configuration
/* ==================================================================== */
charadex.sheet = {

  id: "1YjbqDdOLMETABHY9u3e5FdKkQuP3uN6JAdrY1AhZs2c",

  pages: {
    masterlist:    "마스터리스트",
    masterlistLog: "마스터리스트 내역",
    inventory:     "유저 인벤토리",
    inventoryLog:  "인벤토리 내역",
    items:         "아이템",
    traits:        "특성",
    prompts:       "프롬프트",
    loggallery:    "갤러리",
    faq:           "FAQ",
    staff:         "관리자",
  },

  options: {

    designTypes: ['전체', '공식 디자인 개체', '게스트 디자인 개체', '미사용 디자인권', '디자인권 개체'],
    statuses: ['전체', '귀속됨', '선물 가능', '재분양 가능', '재판매 가능', '무효화', '판매중'],
    rarity: ['전체', 'Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'],
    species: ['전체', 'Dog', 'Cat', 'Bunny'],
    itemTypes: ['전체', 'Currency', 'MYO Slot', 'Pet', 'Trait', 'Misc'],
    traitTypes: ['전체', 'Ears', 'Eyes', 'Body', 'Limbs', 'Tails', 'Misc', 'Mutations'],
    loggalleryTypes: ['전체', '일반', '프롬프트']

  }

}


/* ==================================================================== */
/* Page configuration
/* ==================================================================== */
charadex.page = {};


/* Item Catalogue
/* --------------------------------------------------------------- */
charadex.page.items = {

  sheetPage: charadex.sheet.pages.items,
  sitePage: 'items',
  dexSelector: 'charadex',
  profileProperty: '아이템',

  sort: {
    toggle: true,
    key: "id",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: true,
    parameters: {
      '타입': charadex.sheet.options.itemTypes,
      '등급': charadex.sheet.options.rarity,
    }
  },

  fauxFolder: {
    toggle: true,
    folderProperty: '타입',
    parameters: charadex.sheet.options.itemTypes,
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['전체', '타입', '등급']
  },

  prevNext: {
    toggle: true,
  },

};


/* Traits
/* --------------------------------------------------------------- */
charadex.page.traits = {

  sheetPage: charadex.sheet.pages.traits,
  sitePage: 'traits',
  dexSelector: 'charadex',
  profileProperty: '특성',

  sort: {
    toggle: true,
    key: "id",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: true,
    parameters: {
      '타입': charadex.sheet.options.traitTypes,
      '등급': charadex.sheet.options.rarity,
    }
  },

  fauxFolder: {
    toggle: true,
    folderProperty: '타입',
    parameters: charadex.sheet.options.traitTypes,
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['전체', '특성', '등급']
  },

  prevNext: {
    toggle: true,
  },

};


/* Prompts
/* --------------------------------------------------------------- */
charadex.page.prompts = {

  sheetPage: charadex.sheet.pages.prompts,
  sitePage: 'prompts',
  dexSelector: 'charadex',
  profileProperty: '제목',

  sort: {
    toggle: true,
    key: "enddate",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: false,
    parameters: {
      'TBA': [],
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: false,
    parameters: ['제목']
  },

  prevNext: {
    toggle: true,
  },

};


/* loggallery
/* --------------------------------------------------------------- */
charadex.page.loggallery = {

  sheetPage: charadex.sheet.pages.loggallery,
  sitePage: 'loggallery',
  dexSelector: 'charadex',
  profileProperty: '제목',

  sort: {
    toggle: true,
    key: "id",
    order: "desc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 9,
  },

  fauxFolder: {
    toggle: true,
    folderProperty: 'Category',
    parameters: charadex.sheet.options.Category,
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['전체', '제목', '작품 유형', '프롬프트', '작성자', '그림', '협업자', '등장 캐릭터']
  },

  prevNext: {
    toggle: true,
  },

    };


/* Staff
/* --------------------------------------------------------------- */
charadex.page.staff = {

  sheetPage: charadex.sheet.pages.staff,
  sitePage: 'staff',
  dexSelector: 'charadex',
  profileProperty: '닉네임',

  sort: {
    toggle: false,
    key: "닉네임",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: false,
    bottomToggle: false,
    amount: 12,
  },

  filters: {
    toggle: false,
    parameters: {
      'TBA': [],
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: false,
    parameters: ['Username']
  },

  prevNext: {
    toggle: false,
  },

};


/* FAQ
/* --------------------------------------------------------------- */
charadex.page.faq = {

  sheetPage: charadex.sheet.pages.faq,
  sitePage: 'faq',
  dexSelector: 'charadex',
  profileProperty: 'id',

  sort: {
    toggle: false,
    key: "id",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: false,
    parameters: {
      'TBA': [],
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['전체', '질문', '답변', '태그']
  },

  prevNext: {
    toggle: false,
  },

}



/* Masterlist
/* --------------------------------------------------------------- */
charadex.page.masterlist = {

  sheetPage: charadex.sheet.pages.masterlist,
  sitePage: 'masterlist',
  dexSelector: 'charadex',
  profileProperty: '캐릭터',

  sort: {
    toggle: true,
    key: "id",
    order: "desc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: true,
    parameters: {
      '디자인 타입': charadex.sheet.options.designTypes,
      '상태': charadex.sheet.options.statuses,
      '등급': charadex.sheet.options.rarity,
    }
  },

  fauxFolder: {
    toggle: true,
    folderProperty: 'Species',
    parameters: charadex.sheet.options.species,
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['전체', 'ID', '캐릭터', '소유자', '캐릭터', '그림', '특성']
  },

  prevNext: {
    toggle: true,
  },

  relatedData: {

    [charadex.sheet.pages.masterlistLog]: {

      sheetPage: charadex.sheet.pages.masterlistLog,
      primaryProperty: 'id',
      relatedProperty: 'id',
      dexSelector: 'log',
      profileProperty: '캐릭터',
      profileToggle: false,

      sort: {
        toggle: true,
        key: "타임스태프",
        order: "desc",
        parameters: []
      },

      pagination: {
        toggle: true,
        bottomToggle: false,
        amount: 12,
      },

    }

  }

};

/* Inventory
/* --------------------------------------------------------------- */
charadex.page.inventory = {

  // Dex Set Up
  sheetPage: charadex.sheet.pages.inventory,
  sitePage: 'inventories',
  dexSelector: 'charadex',
  profileProperty: 'username',

  // Dex Options
  sort: {
    toggle: true,
    key: "username",
    order: "asc",
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: false,
    parameters: {}
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: false,
    parameters: ['Username']
  },

  prevNext: {
    toggle: false,
  },


  // Related Data
  relatedData: {

    [charadex.sheet.pages.inventoryLog]: {

      sheetPage: charadex.sheet.pages.inventoryLog,
      sitePage: 'inventories',
      primaryProperty: 'username',
      relatedProperty: 'username',
      dexSelector: 'log',
      profileProperty: 'id',
      profileToggle: false,

      pagination: {
        toggle: true,
        bottomToggle: false,
        amount: 12,
      },

    },
    

    [charadex.sheet.pages.masterlist]: {

      // This imports the config from the masterlist
      // So you dont have to repeat yourself
      ...charadex.page.masterlist, 

      sheetPage: charadex.sheet.pages.masterlist,
      sitePage: 'masterlist',
      primaryProperty: 'username',
      relatedProperty: '소유자',
      dexSelector: 'designs',
      profileProperty: '캐릭터',
      profileToggle: false,

    }

  },

  
  // This is a special config for their inventory
  inventoryConfig: {

    sheetPage: charadex.sheet.pages.items,
    sitePage: 'items',
    dexSelector: 'inventory',
    profileProperty: 'item',
    profileToggle: false,

    sort: {
      toggle: true,
      sortProperty: "item",
      order: "asc",
      parametersKey: 'type', 
      parameters: charadex.sheet.options.itemTypes
    },

    search: {
      toggle: true,
      filterToggle: false,
      parameters: ['Item']
    },

    filters: {
      toggle: true,
      parameters: {
        'Type': charadex.sheet.options.itemTypes,
        'Rarity': charadex.sheet.options.rarity,
      }
    },

  }

};


/* Index
/* --------------------------------------------------------------- */
charadex.page.index = {

  prompts: {
    ... charadex.page.prompts,
    dexSelector: 'prompt',
    amount: 3,
  },

  staff: {
    ... charadex.page.staff,
    dexSelector: 'staff',
    amount: 6,
  },

  designs: {
    ... charadex.page.masterlist,
    dexSelector: 'design',
    amount: 4,
  }

};


export { charadex };
