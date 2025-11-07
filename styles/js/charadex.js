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

/* 글/그림 분리 - 시트 값 기준 강제 토글 (지연 렌더/템플릿 대응) */
document.addEventListener('DOMContentLoaded', () => {
  const toEmbedded = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url, location.origin);
      if (u.hostname.includes('docs.google.com')) u.searchParams.set('embedded','true');
      return u.toString();
    } catch { return url || ''; }
  };

  const applyMode = () => {
    const workType  = (charadex?.sheet?.options?.['data-type'] || '').trim();     // 작품유형
    const textlink0 = (charadex?.sheet?.options?.Textlink    || '').trim();       // 글 문서 링크
    const textlink  = toEmbedded(textlink0);

    document.querySelectorAll('.cd-loggallery-image-container').forEach(el => {
      // 숨겨진 템플릿(Repeat Items) 내부는 건너뜀
      if (el.closest('[style*="display:none"]')) return;

      const iframe = el.querySelector('iframe');
      const img    = el.querySelector('img');

      // 기본 숨김
      if (iframe) { iframe.style.display = 'none'; }
      if (img)    { img.style.display    = 'none'; }

      if (workType === '글') {
        // 글: iframe만 (Textlink 주입, 80%/80%)
        if (iframe) {
          iframe.src = textlink || '';
          iframe.style.display = textlink ? 'block' : 'none';
          iframe.setAttribute('width','80%');
          iframe.setAttribute('height','80%');
          iframe.style.border = '0';
        }
        if (img) {
          // 썸네일은 프로필 뷰에서 노출 금지
          img.style.display = 'none';
          // 필요시 완전 차단: img.src = '';
        }
      } else {
        // 글 이외: 이미지만 (iframe 확실히 차단)
        if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
        if (img && img.src && img.src.trim() !== '') {
          img.style.display = 'block';
        }
      }
    });
  };

  // 초기/지연 렌더 대응: 여러 번 적용 + 변화 감지
  applyMode();
  setTimeout(applyMode, 0);
  setTimeout(applyMode, 600);

  const watchRoot =
    document.getElementById('charadex-profile')?.parentElement ||
    document.getElementById('charadex-gallery') ||
    document.body;

  new MutationObserver(applyMode).observe(watchRoot, { childList: true, subtree: true });
});

export { charadex };

