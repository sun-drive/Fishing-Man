// UI 요소
const castButton = document.getElementById('cast-button');
const inventoryButton = document.getElementById('inventory-button');
const shopButton = document.getElementById('shop-button');
const playerLevelEl = document.getElementById('player-level');
const playerXpEl = document.getElementById('player-xp');
const xpToNextLevelEl = document.getElementById('xp-to-next-level');
const playerGoldEl = document.getElementById('player-gold');
const fishingSpotEl = document.getElementById('fishing-spot');
// 1단계: 추적 미니게임 UI
const fishIconEl = document.getElementById('fish-icon');
// 2단계: 막대 미니게임 UI
const barMinigameContainerEl = document.getElementById('bar-minigame-container');
const playerControlBarEl = document.getElementById('player-control-bar');
const barFishIconEl = document.getElementById('bar-fish-icon');
const catchProgressEl = document.getElementById('catch-progress');
// 상점 UI
const shopModalEl = document.getElementById('shop-modal');
const closeShopButtonEl = document.getElementById('close-shop-button');
const goldShopListEl = document.getElementById('gold-shop-list');
const achievementShopListEl = document.getElementById('achievement-shop-list');
const shopTabsContainerEl = document.querySelector('.shop-tabs');
// 인벤토리 UI
const inventoryModalEl = document.getElementById('inventory-modal');
const closeInventoryButtonEl = document.getElementById('close-inventory-button');
const fishListEl = document.getElementById('fish-list');
const equipmentListEl = document.getElementById('equipment-list');
const inventoryTabsContainerEl = document.querySelector('.inventory-tabs');
const regionContainerEl = document.getElementById('region-container'); // 지역 컨테이너 추가
// 도감 UI
const collectionButton = document.getElementById('collection-button');
const collectionModalEl = document.getElementById('collection-modal');
const closeCollectionButtonEl = document.getElementById('close-collection-button');
const collectionListEl = document.getElementById('collection-list');
// 저장/불러오기 버튼
const saveButton = document.getElementById('save-button');
const loadButton = document.getElementById('load-button');
// 초기화 버튼 및 모달
const resetButton = document.getElementById('reset-button');
const resetConfirmationModalEl = document.getElementById('reset-confirmation-modal');
const confirmDeleteButton = document.getElementById('confirm-delete-button');
const cancelDeleteButton = document.getElementById('cancel-delete-button');


// ====================================
// 전역 UI 업데이트
// ====================================

function updatePlayerInfo() {
    playerLevelEl.textContent = gameState.level;
    playerXpEl.textContent = gameState.xp;
    xpToNextLevelEl.textContent = gameState.xpToNextLevel;
    playerGoldEl.textContent = gameState.gold;
}

function updateGameMessage(message) {
    const existingMessage = fishingSpotEl.querySelector('.game-message');
    if (existingMessage) existingMessage.remove();
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.className = 'game-message';
    fishingSpotEl.appendChild(messageEl);
}

function setButtonState(isFishing) {
    castButton.disabled = isFishing;
    castButton.textContent = isFishing ? '낚시 중...' : '낚싯대 던지기';
}

// ====================================
// 1단계: 추적 미니게임 UI
// ====================================

function setFishingSpotCursor(isActive) {
    fishingSpotEl.classList.toggle('minigame-active', isActive);
}

function showFishIcon() {
    fishIconEl.style.display = 'block';
    moveFishIcon();
}

function hideFishIcon() {
    fishIconEl.style.display = 'none';
}

function moveFishIcon() {
    const spotRect = fishingSpotEl.getBoundingClientRect();
    const fishSize = fishIconEl.getBoundingClientRect().width;
    const newTop = Math.random() * (spotRect.height - fishSize);
    const newLeft = Math.random() * (spotRect.width - fishSize);
    fishIconEl.style.top = `${newTop}px`;
    fishIconEl.style.left = `${newLeft}px`;
}

// ====================================
// 2단계: 막대 미니게임 UI
// ====================================

function showBarMinigame() {
    barMinigameContainerEl.classList.remove('hidden');
}

function hideBarMinigame() {
    barMinigameContainerEl.classList.add('hidden');
}

function updateBarMinigameUI() {
    playerControlBarEl.style.top = `${gameState.playerBar.y}px`;
    barFishIconEl.style.top = `${gameState.barFish.y}px`;
    catchProgressEl.style.height = `${gameState.catchProgress}%`;
}

// ====================================
// 지역 UI
// ====================================

function updateRegionUI() {
    regionContainerEl.innerHTML = '';
    for (const regionName in regions) {
        const region = regions[regionName];
        const button = document.createElement('button');
        button.textContent = `${regionName} (Lv.${region.levelRequired})`;
        button.dataset.region = regionName;
        button.classList.add('region-button');

        if (gameState.level < region.levelRequired) {
            button.disabled = true;
        }
        if (gameState.currentRegion === regionName) {
            button.classList.add('active');
        }
        regionContainerEl.appendChild(button);
    }
    // 배경 이미지 업데이트
    fishingSpotEl.style.backgroundImage = `url('${regions[gameState.currentRegion].background}')`;
}

// ====================================
// 상점 UI
// ====================================

function showShop() {
    updateShopUI();
    shopModalEl.classList.remove('hidden');
}

function hideShop() {
    shopModalEl.classList.add('hidden');
}

function updateShopUI() {
    // 골드 상점 목록 생성
    goldShopListEl.innerHTML = '';
    gameState.shopItems.gold.forEach(item => {
        const li = document.createElement('li');
        const isEquipped = gameState.currentRod.id === item.id;
        let statsText = `(막대길이: ${item.stats.barHeightBonus > 0 ? '+' : ''}${item.stats.barHeightBonus}, 트래킹+${item.stats.trackingBonus}s, 입질-${item.stats.biteTimeReduction/1000}s)`;
        li.innerHTML = `${item.name} ${statsText} <br> ${item.cost} 골드 <button class="buy-button" data-item-id="${item.id}" ${gameState.gold < item.cost || item.owned ? 'disabled' : ''}>${isEquipped ? '장착중' : (item.owned ? '보유중' : '구매')}</button>`;
        if (isEquipped) li.classList.add('equipped');
        goldShopListEl.appendChild(li);
    });

    // 도전과제 상점 목록 생성
    achievementShopListEl.innerHTML = '';
    gameState.shopItems.achievement.forEach(item => {
        const isUnlocked = item.condition();
        const isEquipped = gameState.currentRod.id === item.id;
        const li = document.createElement('li');
        
        let buttonText = '';
        let buttonDisabled = false;

        if (item.cost) { // 비용이 있는 아이템
            const canAfford = gameState.gold >= item.cost;
            buttonText = isEquipped ? '장착중' : (item.owned ? '보유중' : `구매 (${item.cost}G)`);
            buttonDisabled = !isUnlocked || item.owned || !canAfford;
        } else { // 비용이 없는 아이템
            buttonText = isEquipped ? '장착중' : (item.owned ? '보유중' : '획득');
            buttonDisabled = !isUnlocked || item.owned;
        }

        li.innerHTML = `${item.name} <span class="item-desc">(${item.desc})</span> <button class="claim-button" data-item-id="${item.id}" ${buttonDisabled ? 'disabled' : ''}>${buttonText}</button>`;
        if (isEquipped) li.classList.add('equipped');
        achievementShopListEl.appendChild(li);
    });
}

// ====================================
// 인벤토리 UI
// ====================================

function showInventory() {
    updateInventoryUI();
    inventoryModalEl.classList.remove('hidden');
}

function hideInventory() {
    inventoryModalEl.classList.add('hidden');
}

function updateInventoryUI() {
    // 물고기 목록 업데이트
    fishListEl.innerHTML = '';
    gameState.inventory.forEach((fish, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${fish.name} (${fish.size}cm) - ${fish.price}골드
            <div class="fish-actions">
                <button class="sell-fish-button" data-index="${index}">판매</button>
                <button class="release-fish-button" data-index="${index}">방생</button>
            </div>
        `;
        li.classList.add(`rarity-${fish.rarity}`); // 희귀도별 배경색
        fishListEl.appendChild(li);
    });

    // 장비 목록 업데이트 (현재는 기본 낚싯대만)
    equipmentListEl.innerHTML = '';
    const li = document.createElement('li');
    let statsText = `(막대길이: ${gameState.currentRod.stats.barHeightBonus > 0 ? '+' : ''}${gameState.currentRod.stats.barHeightBonus}, 트래킹+${gameState.currentRod.stats.trackingBonus}s, 입질-${gameState.currentRod.stats.biteTimeReduction / 1000}s)`;
    li.innerHTML = `${gameState.currentRod.name} (장착중) <br> ${statsText}`;
    equipmentListEl.appendChild(li);
}

// ====================================
// 도감 UI
// ====================================

function showCollection() {
    updateCollectionUI();
    collectionModalEl.classList.remove('hidden');
}

function hideCollection() {
    collectionModalEl.classList.add('hidden');
}

function updateCollectionUI() {
    collectionListEl.innerHTML = '';
    for (const regionName in fishTypesByRegion) {
        const regionTitle = document.createElement('h3');
        regionTitle.textContent = regionName;
        collectionListEl.appendChild(regionTitle);

        const fishGrid = document.createElement('div');
        fishGrid.className = 'collection-grid';

        const fishInRegion = fishTypesByRegion[regionName];
        fishInRegion.forEach(fish => {
            const isCaught = gameState.caughtFish.includes(fish.name);
            const fishCard = document.createElement('div');
            fishCard.className = 'collection-card';

            const fishNameSpan = document.createElement('span');

            if (isCaught) {
                fishNameSpan.textContent = fish.name;
                fishCard.classList.add(`rarity-${fish.rarity}`);
            } else {
                fishNameSpan.textContent = '???';
                fishCard.classList.add('not-caught');
            }
            fishCard.appendChild(fishNameSpan);
            fishGrid.appendChild(fishCard);
        });
        collectionListEl.appendChild(fishGrid);
    }
}

// ====================================
// 초기화 UI
// ====================================

function showResetConfirmation() {
    resetConfirmationModalEl.classList.remove('hidden');
}

function hideResetConfirmation() {
    resetConfirmationModalEl.classList.add('hidden');
}

function showDeletedMessage() {
    if (sessionStorage.getItem('showDeleteMessage') === 'true') {
        const messageEl = document.createElement('div');
        messageEl.className = 'account-deleted-message';
        messageEl.textContent = '계정이 삭제 되었습니다';
        document.body.appendChild(messageEl);

        sessionStorage.removeItem('showDeleteMessage');

        // 메시지 띄운 후 3초 뒤 사라지도록
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}


// 초기 UI 업데이트
updatePlayerInfo();
updateGameMessage('낚시를 시작해보세요!');
updateShopUI();
updateInventoryUI();
updateRegionUI();