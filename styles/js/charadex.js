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


window.addEventListener('load', () => {
  const data = charadex?.sheet?.pages?.loggallery;
  if (!data) return;

  const iframe = document.querySelector('#charadex-profile iframe');
  if (!iframe) return;

  iframe.src = data['Textlink']; // ← 글 주소 자동 연결
});


// 글이면 이미지+iframe, 그림이면 이미지만 (DOM 기반)
window.addEventListener('load', () => {
  const profile = document.querySelector('#charadex-profile');
  if (!profile) return;

  // 렌더 완료된 프로필의 "작품 유형" 값을 그대로 읽음
  const typeTxt = (profile.querySelector('.data-type')?.textContent || '').trim();
  if (!typeTxt) return;                      // 아직 렌더 전이면 패스
  profile.setAttribute('data-type', typeTxt); // CSS 조건용

  const iframe = profile.querySelector('iframe');
  const img    = profile.querySelector('img.image');

  if (typeTxt === '글') {
    // 가능한 링크 후보를 간단히 확보: (이미 들어있으면 그대로 사용)
    let link = (iframe?.getAttribute('src') || '').trim();
    // window.charadexCurrentData에 Textlink가 있으면 우선 사용
    if (window.charadexCurrentData?.Textlink) link = window.charadexCurrentData.Textlink.trim();

    // Google Docs는 임베드형으로 보정
    if (link.includes('docs.google.com') && link.includes('/edit')) {
      link = link.replace('/edit', '/preview');
      if (!link.includes('embedded=true')) link += (link.includes('?') ? '&' : '?') + 'embedded=true';
    }

    if (iframe && link) {
      iframe.src = link;
      iframe.style.display = 'block';
    }
    if (img) img.style.display = '';   // 글일 땐 이미지도 함께 보이게 (요구사항)
  } else {
    // 글이 아니면 iframe은 확실히 숨김
    if (iframe) { iframe.removeAttribute('src'); iframe.style.display = 'none'; }
    // 이미지는 그대로
  }
});

export { charadex };

