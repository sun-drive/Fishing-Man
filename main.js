document.addEventListener('DOMContentLoaded', () => {
    const deviceSelectionModal = document.getElementById('device-selection-modal');
    const pcButton = document.getElementById('pc-button');
    const mobileButton = document.getElementById('mobile-button');

    // 게임 초기화 로직을 별도 함수로 분리
    function initializeGame() {
        // 모바일 컨트롤 버튼
        const upArrowBtn = document.getElementById('up-arrow-btn');
        const downArrowBtn = document.getElementById('down-arrow-btn');

        // 기존의 모든 이벤트 리스너와 초기화 코드를 여기에 넣습니다.
        loadGame(); // 게임 시작 시 자동으로 데이터 불러오기
        updatePlayerInfo();
        updateGameMessage('낚시를 시작해보세요!');
        showDeletedMessage(); // 삭제 메시지 확인 및 표시

        // ====================================
        // 이벤트 리스너
        // ====================================

        // 낚시 시작 버튼
        castButton.addEventListener('click', startFishing);

        // 1단계: PC 추적 미니게임 리스너
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

        // 1단계: 모바일 진동 미니게임 리스너
        fishingSpotEl.addEventListener('touchstart', (e) => {
            if (gameState.mobilePattern1Active && gameState.canTap) {
                e.preventDefault();
                gameState.successCount++;
                gameState.canTap = false; // 중복 탭 방지
                gameState.tapRegisteredThisTurn = true; // 성공 탭 등록
                
                // 메시지를 업데이트하고 시각적 피드백을 적용합니다.
                const messageEl = updateGameMessage(`성공: ${gameState.successCount} / 14`);
                if (messageEl) {
                    messageEl.style.transition = 'none';
                    messageEl.style.color = 'lightgreen';
                    messageEl.style.transform = 'translateX(-50%) scale(1.2)';
                    setTimeout(() => {
                        messageEl.style.transition = 'color 0.2s, transform 0.2s';
                        messageEl.style.color = 'white';
                        messageEl.style.transform = 'translateX(-50%) scale(1)';
                    }, 100);
                }
            }
        });

        // 2단계: 막대 미니게임 리스너 (PC)
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

        // 2단계: 막대 미니게임 리스너 (모바일)
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


        // 상점 열기/닫기 버튼
        shopButton.addEventListener('click', showShop);
        closeShopButtonEl.addEventListener('click', hideShop);

        // 상점 탭 전환 리스너
        shopTabsContainerEl.addEventListener('click', (e) => {
            if (!e.target.matches('.tab-link')) return;

            const tabId = e.target.dataset.tab;
            const tabContainer = e.target.closest('.tabs');

            tabContainer.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');

            const contentContainer = tabContainer.parentElement.querySelector(`#${tabId}`);
            tabContainer.parentElement.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            contentContainer.classList.add('active');
        });

        // 상점 아이템 구매/획득 리스너
        shopModalEl.addEventListener('click', (e) => {
            if (e.target.matches('.buy-button')) {
                purchaseGoldItem(e.target.dataset.itemId);
            } else if (e.target.matches('.claim-button')) {
                handleAchievementItem(e.target.dataset.itemId);
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

            const tabId = e.target.dataset.tab;
            const tabContainer = e.target.closest('.tabs');

            tabContainer.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');

            const contentContainer = tabContainer.parentElement.querySelector(`#${tabId}`);
            tabContainer.parentElement.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            contentContainer.classList.add('active');
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
    }

    // PC 버튼 클릭 시
    pcButton.addEventListener('click', () => {
        deviceSelectionModal.classList.add('hidden');
        initializeGame();
    });

    // 모바일 버튼 클릭 시
    mobileButton.addEventListener('click', () => {
        document.body.classList.add('mobile-mode');
        deviceSelectionModal.classList.add('hidden');
        initializeGame();
    });
});
