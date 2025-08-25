document.addEventListener('DOMContentLoaded', () => {
    // 초기 UI 업데이트 및 게임 불러오기
    loadGame(); // 게임 시작 시 자동으로 데이터 불러오기
    updatePlayerInfo();
    updateGameMessage('낚시를 시작해보세요!');
    showDeletedMessage(); // 삭제 메시지 확인 및 표시

    // ====================================
    // 이벤트 리스너
    // ====================================

    // 낚시 시작 버튼
    castButton.addEventListener('click', startFishing);

    // 1단계: 추적 미니게임 리스너
    fishIconEl.addEventListener('mouseover', () => {
        if (!gameState.trackingMinigameActive) return;
        gameState.trackingInterval = setInterval(() => {
            gameState.trackingTime += 100;
        }, 100);
    });

    fishIconEl.addEventListener('mouseout', () => {
        if (!gameState.trackingMinigameActive) return;
        clearInterval(gameState.trackingInterval);
    });

    // 2단계: 막대 미니게임 리스너 (마우스 클릭으로 조종)
    document.addEventListener('mousedown', () => {
        if (gameState.barMinigameActive) {
            gameState.isMouseDown = true;
        }
    });
    document.addEventListener('mouseup', () => {
        if (gameState.barMinigameActive) {
            gameState.isMouseDown = false;
        }
    });

    // 상점 열기/닫기 버튼
    shopButton.addEventListener('click', showShop);
    closeShopButtonEl.addEventListener('click', hideShop);

    // 상점 탭 전환 리스너
    shopTabsContainerEl.addEventListener('click', (e) => {
        if (!e.target.matches('.tab-link')) return;

        // 모든 탭과 컨텐츠에서 active 클래스 제거
        document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // 클릭된 탭과 그에 맞는 컨텐츠에 active 클래스 추가
        e.target.classList.add('active');
        document.getElementById(e.target.dataset.tab).classList.add('active');
    });

    // 상점 아이템 구매/획득 리스너
    shopModalEl.addEventListener('click', (e) => {
        if (e.target.matches('.buy-button')) {
            purchaseGoldItem(e.target.dataset.itemId);
        } else if (e.target.matches('.claim-button')) {
            handleAchievementItem(e.target.dataset.itemId); // 함수 이름 변경
        }
    });

    // 기타 UI 버튼
    inventoryButton.addEventListener('click', showInventory);
    closeInventoryButtonEl.addEventListener('click', hideInventory);

    // 도감 열기/닫기 버튼
    collectionButton.addEventListener('click', showCollection);
    closeCollectionButtonEl.addEventListener('click', hideCollection);

    // 인벤토리 탭 전환 리스너
    inventoryTabsContainerEl.addEventListener('click', (e) => {
        if (!e.target.matches('.tab-link')) return;

        document.querySelectorAll('.inventory-tabs .tab-link').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('#inventory-modal .tab-content').forEach(content => content.classList.remove('active'));

        e.target.classList.add('active');
        document.getElementById(e.target.dataset.tab).classList.add('active');
    });

    // 인벤토리 물고기 판매/방생 리스너
    fishListEl.addEventListener('click', (e) => {
        if (e.target.matches('.sell-fish-button')) {
            const index = parseInt(e.target.dataset.index);
            sellFish(index);
        } else if (e.target.matches('.release-fish-button')) {
            const index = parseInt(e.target.dataset.index);
            releaseFish(index);
        }
    });

    // 지역 변경 리스너
    regionContainerEl.addEventListener('click', (e) => {
        if (e.target.matches('.region-button')) {
            changeRegion(e.target.dataset.region);
        }
    });

    // 저장/불러오기 리스너
    saveButton.addEventListener('click', saveGame);
    loadButton.addEventListener('click', loadGame);

    // 초기화 리스너
    resetButton.addEventListener('click', showResetConfirmation);
    confirmDeleteButton.addEventListener('click', deleteSaveData);
    cancelDeleteButton.addEventListener('click', hideResetConfirmation);
});