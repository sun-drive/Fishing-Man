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

        // 1단계: 모바일 리듬 게임
        fishingSpotEl.addEventListener('touchstart', (e) => {
            if (!gameState.rhythmGameActive) return;
            e.preventDefault();

            const targetBox = document.getElementById('rhythm-target').getBoundingClientRect();
            const bars = document.querySelectorAll('.rhythm-bar');
            let success = false;

            bars.forEach(bar => {
                const barBox = bar.getBoundingClientRect();
                // 막대가 타겟 영역에 겹치는지 확인
                if (barBox.left < targetBox.right && barBox.right > targetBox.left) {
                    gameState.rhythmSuccessCount++;
                    updateGameMessage(`성공: ${gameState.rhythmSuccessCount} / 10`);
                    bar.remove(); // 성공한 막대는 즉시 제거
                    success = true;
                }
            });

            if (success) {
                const messageEl = updateGameMessage(`성공: ${gameState.rhythmSuccessCount} / 10`);
                if (messageEl) {
                    messageEl.style.color = 'lightgreen';
                    setTimeout(() => { messageEl.style.color = 'white'; }, 200);
                }
            }
        });

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
        });
        fishListEl.addEventListener('click', (e) => {
            if (e.target.matches('.sell-fish-button')) sellFish(parseInt(e.target.dataset.index));
            else if (e.target.matches('.release-fish-button')) releaseFish(parseInt(e.target.dataset.index));
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