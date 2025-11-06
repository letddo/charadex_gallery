/* ==================================================================== */
/* Import (필요 시) - 이미 번들에서 import되면 이 줄은 생략하세요
/* ==================================================================== */
// import { charadex } from '../charadex.js';

/* ==================================================================== */
/* Page boot
/* ==================================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  // 0) 방어적: 전역 설정값(설치 위치 따라 필요 없을 수도 있음)
  const PAGE_KEY = (window.CHARADEX_PAGE || 'loggallery');
  const SHEET    = (window.MASTERLIST_SHEET || '갤러리');

  // 1) 페이지 초기화 (charadex가 있는 경우)
  try {
    if (window.charadex && charadex.initialize && charadex.page) {
      // 페이지 정의가 이미 있다면 그대로 사용
      const pageDef = (charadex.page.loggallery || charadex.page.masterlist || {});
      // 첫 번째 인자/세 번째 인자는 프로젝트에 따라 null 유지
      await charadex.initialize.page(null, pageDef, null, async (listData) => {
        // 필요 시: listData를 사용한 추가 처리 가능
      });

      // 추가: 데이터 소스 시트를 강제 지정해야 하는 구조라면,
      // 프로젝트의 "시트 선택" API가 무엇인지에 따라 아래처럼 조정하세요.
      // (이미 내부에서 시트 결정하면 이 부분은 생략해도 됨)
      if (charadex.tools && typeof charadex.tools.setSheet === 'function') {
        charadex.tools.setSheet(SHEET); // 예시 API (프로젝트에 맞게 수정/삭제)
      }
    }
  } catch(e) {
    console.warn('loggallery initialize skipped or failed:', e);
  }

  // 2) 프로필 탭 라벨/바인딩 매핑 (HTML 수정 없이 DOM만 교체)
  applyProfileLabelMapping();

  // 3) 로그 탭(버튼/패널) 방어적 제거 (복사본에서 이미 지웠어도 안전 차원)
  removeLogsTabIfExists();
});

/* ==================================================================== */
/* 프로필 라벨 매핑 & 가치행 삭제
/* ==================================================================== */
function applyProfileLabelMapping() {
  const map = {
    '종족': '카테고리',
    '등급': '작품 유형',
    '디자인 타입': '프롬프트',
    '특성': '설명',
    '소유자': '작성자',
    // '그림'은 유지
    '디자인': '협업자',
    '상태': '업로드 날짜',
    '정보': '등장 캐릭터',
  };
  const removeLabel = '가치';

  const labels = document.querySelectorAll('#profile b.text-muted');
  labels.forEach(b => {
    const t = (b.textContent || '').replace(/\s+/g, ' ').trim();

    // 삭제: 가치
    if (t === removeLabel) {
      const row = b.closest('.d-flex') || b.parentElement;
      if (row) row.remove();
      return;
    }

    // 교체: 라벨 텍스트만 바꿔도 화면은 바뀜 (데이터 바인딩 클래스는 그대로 둬도 무방)
    if (map[t]) {
      b.textContent = map[t];
    }
  });
}

/* ==================================================================== */
/* 로그 탭 제거(남아있을 경우)
/* ==================================================================== */
function removeLogsTabIfExists() {
  // 탭 버튼
  const logsTabBtn = document.getElementById('logs-tab');
  if (logsTabBtn) {
    const li = logsTabBtn.closest('li') || logsTabBtn.parentElement;
    if (li) li.remove();
  }
  // 탭 패널
  const logsPane = document.getElementById('logs');
  if (logsPane) logsPane.remove();
}
