/* ==================================================================== */
/* Import Charadex
/* ==================================================================== */
import { charadex } from './list.js';

/* ==================================================================== */
/* Initialize
/* ==================================================================== */
/* This is where the real magic happens
/* ==================================================================== */
charadex.initialize = {};


/* ==================================================================== */
/* Page
/* ==================================================================== */
charadex.initialize.page = async (dataArr, config, dataCallback, listCallback, customPageUrl = false) => {

  if (!config) return console.error('No configuration added.');

  // Set up
  let selector = config.dexSelector;
  let pageUrl = customPageUrl || charadex.url.getPageUrl(config.sitePage);

  // Add folders, filters & search
  let folders = config.fauxFolder?.toggle ?? false ? charadex.listFeatures.fauxFolders(pageUrl, config.fauxFolder.parameters, selector) : false;
  let filters = config.filters?.toggle ?? false ? charadex.listFeatures.filters(config.filters.parameters, selector) : false;
  let search = config.search?.toggle ?? false ? charadex.listFeatures.search(config.search.parameters, config.search.filterToggle, selector) : false;

  // Get our data
  let charadexData = dataArr || await charadex.importSheet(config.sheetPage);

  // Add profile information
  for (let entry of charadexData) {
    charadex.tools.addProfileLinks(entry, pageUrl, config.profileProperty); // Go ahead and add profile keys just in case
    if (folders) folders(entry, config.fauxFolder.folderProperty); // If folders, add folder info
    if (entry.등급) entry.raritybadge = `<span class="badge badge-${charadex.tools.scrub(entry.등급)}">${entry.등급}</span>`; // Adds a rarity badge
  }

  // If there's related data, add it
  if (config.relatedData) {
    for (let page in config.relatedData) {
      await charadex.manageData.relateData(
        charadexData, 
        config.relatedData[page].primaryProperty, 
        page, 
        config.relatedData[page].relatedProperty
      );
    }
  }

  // Initialize the list
  let list = charadex.buildList(selector);

  // Let us manipulate the data before it gets to the list
  if (typeof dataCallback === 'function') {
    await dataCallback(charadexData);
  }

  /* Sort the Dex */
  if (config.sort?.toggle ?? false) {
    charadexData = charadex.manageData.sortArray(
      charadexData, 
      config.sort.sortProperty, 
      config.sort.order,
      config.sort.parametersKey,
      config.sort.parameters,
    );
  }

  // Create Profile
  const createProfile = async () => {

    // If they dont need to render a profile, don't
    if (config.profileToggle !== undefined && !config.profileToggle) return false;

    let profileArr = list.getProfile(charadexData);
    if (!profileArr) return false;

    if (config.prevNext?.toggle ?? false) {
      charadex.listFeatures.prevNextLink(pageUrl, charadexData, profileArr, selector);
    }
    
    /* Create Profile */
    let profileList = list.initializeProfile(profileArr);

    // Return those values on Callback
    if (typeof listCallback === 'function') {
      await listCallback({
        type: 'profile',
        pageUrl: pageUrl,
        array: charadexData,
        profileArray: profileArr,
        list: profileList
      })
    }

    return true;

  }

  // If there's a profile, nyoom
  if (await createProfile()) return;

  // Create Gallery
  const createGallery = async () => {

    // Add additional list junk
    let additionalListConfigs = {};

    // Filter by parameters
    charadexData = charadex.manageData.filterByPageParameters(charadexData);

    // Add Pagination
    if (config.pagination?.toggle ?? false) {
      let pagination = charadex.listFeatures.pagination(charadexData.length, config.pagination.amount, config.pagination.bottomToggle, selector);
      if (pagination) additionalListConfigs = { ...additionalListConfigs, ...pagination };
    }

    // Initialize Gallery
    let galleryList = list.initializeGallery(charadexData, additionalListConfigs);

    // Initialize filters and search
    if ((config.filters?.toggle ?? false) && filters) filters.initializeFilters(galleryList);
    if ((config.search?.toggle ?? false) && search) search.initializeSearch(galleryList);

    // Return those values on Callback
    if (typeof listCallback === 'function') {
      await listCallback({
        type: 'gallery',
        pageUrl: pageUrl,
        array: charadexData,
        list: galleryList,
      })
    }

    return true;

  }

  // Else the gallery nyooms instead
  return await createGallery();

}


/* ==================================================================== */
/* Grouped Gallery (Mostly for inventory items)
/* ==================================================================== */
charadex.initialize.groupGallery = async function (config, dataArray, groupBy, customPageUrl = false) {

  /* Check the Configs */
  if (!config) return console.error(`No config added.`);
  
  /* Get some stuff we'll need */
  let selector = config.dexSelector;
  const pageUrl = customPageUrl || charadex.url.getPageUrl(config.sitePage);

  // Add filters & Search
  let filters = config.filters?.toggle ?? false ? charadex.listFeatures.filters(config.filters.parameters, selector) : false;
  let search = config.search?.toggle ?? false ? charadex.listFeatures.search(config.search.parameters, config.search.filterToggle, selector) : false;

  /* Attempt to Fetch the data */
  let charadexData = dataArray;

  // Add profile information
  for (let entry of charadexData) {
    charadex.tools.addProfileLinks(entry, pageUrl, config.profileProperty);
  }

  /* Sort the Dex */
  if (config.sort?.toggle ?? false) {
    charadexData = charadex.manageData.sortArray(
      charadexData, 
      config.sort.sortProperty, 
      config.sort.order,
      config.sort.parametersKey,
      config.sort.parameters,
    );
  }

  /* Attempt deal with gallery
  ======================================================================= */
  const handleGallery = () => {

    if (!charadex.tools.checkArray(charadexData)) return false;

    // Filter by parameters
    charadexData = charadex.manageData.filterByPageParameters(charadexData);

    // Group data
    let groupArray = Object.groupBy(charadexData, obj => obj[groupBy]);

    // Create base selectors
    let itemSelector =  { item: `${selector}-gallery-item` };
    let containerSelector =  `${selector}-gallery`;

    for (let group in groupArray) {

      //Create the list selector
      let groupListSelector = charadex.tools.scrub(group);
      
      // Create the DOM elements
      let groupElement = $(`#${selector}-group-list`).clone();
      groupElement.removeAttr('id');
      groupElement.find(`.${selector}-list`).addClass(`${groupListSelector}-list`);
      groupElement.find(`.${selector}-group-title`).text(group);
      $(`#${selector}-group`).append(groupElement);
      
      // Build list based on group
      let groupListManager = charadex.buildList(groupListSelector);
      let groupList = groupListManager.initializeGallery(groupArray[group], itemSelector, containerSelector);

      // Add filters & Search
      if ((config.filters?.toggle ?? false) && filters) filters.initializeFilters(groupList);
      if ((config.search?.toggle ?? false) && search) search.initializeSearch(groupList);

    }

    return true;

  };

  return handleGallery();

};

/* 글/그림 분리 - 갤러리/프로필 표시 규칙 보정 (지연 로딩 대응) */
document.addEventListener('DOMContentLoaded', () => {
  const workType  = (charadex?.sheet?.options?.['data-type'] || '').trim();  // '글' / 기타
  const textlink0 = (charadex?.sheet?.options?.Textlink    || '').trim();

  // Google Docs → embed=true 로 바꿔서 iframe에 넣기
  const toEmbedded = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url, location.origin);
      if (u.hostname.includes('docs.google.com')) {
        if (!u.searchParams.has('embedded')) u.searchParams.set('embedded','true');
      }
      return u.toString();
    } catch {
      return url;
    }
  };

  // img의 src가 나중에 채워질 수도 있으므로, 채워지는 순간 display를 켜준다.
  const showImgWhenReady = (img) => {
    if (!img) return;
    const turnOn = () => { if (img.getAttribute('src')) img.style.display = 'block'; };
    // 즉시 한 번 시도
    turnOn();
    // 이후 src 변화를 감시
    new MutationObserver((muts, obs) => {
      turnOn();
      if (img.style.display === 'block') obs.disconnect();
    }).observe(img, { attributes: true, attributeFilter: ['src'] });
  };

  // 1) 갤러리 아이템: 유형 무관, 항상 이미지 썸네일만 보이기
  //    (iframe은 완전히 숨김)
  const applyGalleryRule = (root = document) => {
    // 갤러리 영역의 iframe은 전부 끈다
    root.querySelectorAll('#charadex-gallery iframe').forEach(f => {
      f.removeAttribute('src');
      f.style.display = 'none';
    });
    // 갤러리 영역의 이미지들은 src가 들어오는 즉시 보이게
    root.querySelectorAll('#charadex-gallery img.image').forEach(img => {
      showImgWhenReady(img);
    });
  };

  // 2) 프로필: 글이면 iframe(Textlink 임베드), 아니면 이미지
  const applyProfileRule = (root = document) => {
    const profile = root.querySelector('#charadex-profile');
    if (!profile) return;

    const iframeBox = profile.querySelector('.cd-loggallery-image-container[data-type="글"]');
    const imageBox  = profile.querySelector('.cd-loggallery-image-container[data-type="그림"]');
    const iframe    = iframeBox?.querySelector('iframe');
    const img       = imageBox?.querySelector('img');

    // 기본은 모두 숨김
    if (iframe) { iframe.style.display = 'none'; }
    if (img)    { img.style.display    = 'none'; }

    if (workType === '글') {
      // 글: iframe만 표시
      if (iframe) {
        const embedded = toEmbedded(textlink0);
        iframe.src = embedded || '';
        iframe.style.display = embedded ? 'block' : 'none';
        // 퍼센트 높이는 부모 높이가 없으면 0이 되니 고정 뷰포트로
        iframe.style.width  = '80%';
        iframe.style.height = '80vh';
        iframe.style.border = '0';
      }
      if (img) { img.style.display = 'none'; img.removeAttribute('src'); }
    } else {
      // 글이 아님: 이미지 표시, iframe은 끄기
      if (iframe) { iframe.removeAttribute('src'); iframe.style.display = 'none'; }
      if (img)    { showImgWhenReady(img); }
    }
  };

  // 최초 적용
  applyGalleryRule(document);
  applyProfileRule(document);

  // 나중에 DOM이 추가/교체되어도 자동으로 다시 적용
  const target = document.body;
  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        // 갤러리 쪽 변경
        if (node.id === 'charadex-gallery' || node.querySelector?.('#charadex-gallery')) {
          applyGalleryRule(node);
        }
        // 프로필 쪽 변경
        if (node.id === 'charadex-profile' || node.querySelector?.('#charadex-profile')) {
          applyProfileRule(node);
        }
        // 개별 카드/이미지가 동적으로 추가되는 경우도 커버
        node.querySelectorAll?.('img.image').forEach(showImgWhenReady);
      });
    }
  });
  obs.observe(target, { childList: true, subtree: true });
});


export { charadex };

