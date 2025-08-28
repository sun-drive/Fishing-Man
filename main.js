document.addEventListener('DOMContentLoaded', () => {
    const deviceSelectionModal = document.getElementById('device-selection-modal');
    const pcButton = document.getElementById('pc-button');
    const mobileButton = document.getElementById('mobile-button');

    function initializeGame() {
        const upArrowBtn = document.getElementById('up-arrow-btn');
        const downArrowBtn = document.getElementById('down-arrow-btn');

        loadGame();
        updatePlayerInfo();
        updateGameMessage('낚시를 시작해보세요!');
        showDeletedMessage();

        // ====================================
        // 이벤트 리스너
        // ====================================

        castButton.addEventListener('click', startFishing);

        // 1단계: PC 추적 미니게임
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

        // 1단계: 모바일 리듬 게임 (이제 이벤트는 game.js에서 동적으로 생성된 요소에 직접 추가됩니다)

        // 2단계: 막대 미니게임 (PC)
        document.addEventListener('mousedown', (e) => {
            if (gameState.barMinigameActive && e.target.tagName !== 'BUTTON') {
                gameState.isMouseDown = true;
            }
        });
        document.addEventListener('mouseup', () => {
            if (gameState.barMinigameActive) {
                gameState.isMouseDown = false;
            }
        });

        // 2단계: 막대 미니게임 (모바일)
        upArrowBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState.barMinigameActive) gameState.isUpPressed = true;
        });
        upArrowBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            gameState.isUpPressed = false;
        });
        downArrowBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameState.barMinigameActive) gameState.isDownPressed = true;
        });
        downArrowBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            gameState.isDownPressed = false;
        });

        // UI 버튼 리스너
        shopButton.addEventListener('click', showShop);
        closeShopButtonEl.addEventListener('click', hideShop);
        inventoryButton.addEventListener('click', showInventory);
        closeInventoryButtonEl.addEventListener('click', hideInventory);
        collectionButton.addEventListener('click', showCollection);
        closeCollectionButtonEl.addEventListener('click', hideCollection);
        saveButton.addEventListener('click', saveGame);
        loadButton.addEventListener('click', loadGame);
        resetButton.addEventListener('click', showResetConfirmation);
        confirmDeleteButton.addEventListener('click', deleteSaveData);
        cancelDeleteButton.addEventListener('click', hideResetConfirmation);

        // 탭 전환 리스너
        [shopTabsContainerEl, inventoryTabsContainerEl].forEach(container => {
            if (!container) return;
            container.addEventListener('click', (e) => {
                if (!e.target.matches('.tab-link')) return;
                const tabId = e.target.dataset.tab;
                const tabContainer = e.target.closest('.tabs');
                tabContainer.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
                e.target.classList.add('active');
                const contentContainer = tabContainer.parentElement;
                contentContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                contentContainer.querySelector(`#${tabId}`).classList.add('active');
            });
        });

        // 아이템/장비 관련 리스너
        shopModalEl.addEventListener('click', (e) => {
            if (e.target.matches('.buy-button')) purchaseGoldItem(e.target.dataset.itemId);
            else if (e.target.matches('.claim-button')) handleAchievementItem(e.target.dataset.itemId);
            else if (e.target.matches('.craft-bait-button')) craftBait(e.target.dataset.baitId);
        });
        fishListEl.addEventListener('click', (e) => {
            if (e.target.matches('.sell-fish-button')) sellFish(parseInt(e.target.dataset.index));
            else if (e.target.matches('.release-fish-button')) releaseFish(parseInt(e.target.dataset.index));
        });
        baitListEl.addEventListener('click', (e) => {
            if (e.target.matches('.equip-bait-button')) {
                const baitId = e.target.dataset.baitId;
                const baitIndex = gameState.baitInventory.findIndex(b => b.id === baitId);
                if (baitIndex !== -1) {
                    equipBait(baitIndex);
                }
            }
        });
        regionContainerEl.addEventListener('click', (e) => {
            if (e.target.matches('.region-button')) changeRegion(e.target.dataset.region);
        });
    }

    // 모드 선택 리스너
    pcButton.addEventListener('click', () => {
        deviceSelectionModal.classList.add('hidden');
        initializeGame();
    });

    mobileButton.addEventListener('click', () => {
        document.body.classList.add('mobile-mode');
        deviceSelectionModal.classList.add('hidden');
        initializeGame();
    });
});