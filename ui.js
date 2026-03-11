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
const baitCraftingListEl = document.getElementById('bait-crafting-list');
const shopTabsContainerEl = document.querySelector('.shop-tabs');
// 인벤토리 UI
const inventoryModalEl = document.getElementById('inventory-modal');
const closeInventoryButtonEl = document.getElementById('close-inventory-button');
const fishListEl = document.getElementById('fish-list');
const equipmentListEl = document.getElementById('equipment-list');
const baitListEl = document.getElementById('bait-list');
const activeBaitDisplayEl = document.getElementById('active-bait-display');
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
    if (playerLevelEl) playerLevelEl.textContent = gameState.level;
    if (playerXpEl) playerXpEl.textContent = gameState.xp;
    if (xpToNextLevelEl) xpToNextLevelEl.textContent = gameState.xpToNextLevel;
    if (playerGoldEl) playerGoldEl.textContent = gameState.gold;
}

function updateGameMessage(message) {
    if (!fishingSpotEl) return null;
    const existingMessage = fishingSpotEl.querySelector('.game-message');
    if (existingMessage) existingMessage.remove();
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.className = 'game-message';
    fishingSpotEl.appendChild(messageEl);
    return messageEl;
}

function setButtonState(isFishing) {
    if (!castButton) return;
    castButton.disabled = isFishing;
    castButton.textContent = isFishing ? '낚시 중...' : '낚싯대 던지기';
}

function showSecretAppearanceMessage() {
    const secretMessageEl = document.getElementById('secret-message');
    if (secretMessageEl) {
        secretMessageEl.textContent = '시크릿 출현!!';
        secretMessageEl.classList.remove('hidden');
        // Hide the message after a few seconds
        setTimeout(() => {
            secretMessageEl.classList.add('hidden');
        }, 3000);
    }
}

// ====================================
// 1단계: 추적 미니게임 UI
// ====================================

function setFishingSpotCursor(isActive) {
    if (fishingSpotEl) fishingSpotEl.classList.toggle('minigame-active', isActive);
}

function showFishIcon() {
    if (fishIconEl) {
        fishIconEl.style.display = 'block';
        moveFishIcon();
    }
}

function hideFishIcon() {
    if (fishIconEl) fishIconEl.style.display = 'none';
}

function moveFishIcon() {
    if (!fishingSpotEl || !fishIconEl) return;
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

window.showBarMinigame = function() {
    if (barMinigameContainerEl) barMinigameContainerEl.classList.remove('hidden');
}

window.hideBarMinigame = function() {
    if (barMinigameContainerEl) barMinigameContainerEl.classList.add('hidden');
}

function hideRhythmGame() {
    const rhythmGameContainer = document.getElementById('rhythm-game-container');
    if (rhythmGameContainer) {
        rhythmGameContainer.classList.add('hidden');
    }
    const rhythmBarContainer = document.getElementById('rhythm-bar-container');
    if (rhythmBarContainer) {
        rhythmBarContainer.innerHTML = '';
    }
}

window.showRhythmGame = function() {
    const rhythmGameContainer = document.getElementById('rhythm-game-container');
    if (rhythmGameContainer) {
        rhythmGameContainer.classList.remove('hidden');
    }
}

function updateBarMinigameUI() {
    if (playerControlBarEl) playerControlBarEl.style.top = `${gameState.playerBar.y}px`;
    if (barFishIconEl) barFishIconEl.style.top = `${gameState.barFish.y}px`;
    if (catchProgressEl) catchProgressEl.style.height = `${gameState.catchProgress}%`;
}

// ====================================
// 지역 UI
// ====================================

function updateRegionUI() {
    if (!regionContainerEl) return;
    regionContainerEl.innerHTML = '';
    regionOrder.forEach(regionName => {
        const region = regions[regionName];
        if (!region) return;

        const button = document.createElement('button');
        button.textContent = `${regionName} (Lv.${region.levelRequired})`
        button.dataset.region = regionName;
        button.classList.add('region-button');

        if (gameState.level < region.levelRequired) {
            button.disabled = true;
        }
        if (gameState.currentRegion === regionName) {
            button.classList.add('active');
        }
        regionContainerEl.appendChild(button);
    });
    
    if (!fishingSpotEl) return;
    const currentRegionData = regions[gameState.currentRegion];
    if (currentRegionData && currentRegionData.background) {
        fishingSpotEl.style.backgroundImage = `url('/${currentRegionData.background}')`;
        fishingSpotEl.style.backgroundColor = '';
    } else {
        fishingSpotEl.style.backgroundImage = 'none';
        switch (gameState.currentRegion) {
            case '늪지대':
                fishingSpotEl.style.backgroundColor = '#556B2F';
                break;
            case '아마존 강':
                fishingSpotEl.style.backgroundColor = '#006400';
                break;
            default:
                fishingSpotEl.style.backgroundColor = '#add8e6';
        }
    }
}

// ====================================
// 상점 UI
// ====================================

function showShop() {
    if (shopModalEl) {
        updateShopUI();
        shopModalEl.classList.remove('hidden');
    }
}

function hideShop() {
    if (shopModalEl) shopModalEl.classList.add('hidden');
}

function updateShopUI() {
    if (!goldShopListEl || !achievementShopListEl || !baitCraftingListEl) return;
    goldShopListEl.innerHTML = '';
    gameState.shopItems.gold.forEach(item => {
        const li = document.createElement('li');
        const isEquipped = gameState.currentRod.id === item.id;
        let statsText = `(막대길이: ${item.stats.barHeightBonus > 0 ? '+' : ''}${item.stats.barHeightBonus}, 트래킹+${item.stats.trackingBonus}s, 입질-${item.stats.biteTimeReduction/1000}s)`;
        li.innerHTML = `${item.name} ${statsText} <br> ${item.cost} 골드 <button class="buy-button" data-item-id="${item.id}" ${gameState.gold < item.cost || item.owned ? 'disabled' : ''}>${isEquipped ? '장착중' : (item.owned ? '보유중' : '구매')}</button>`;
        if (isEquipped) li.classList.add('equipped');
        goldShopListEl.appendChild(li);
    });

    achievementShopListEl.innerHTML = '';
    gameState.shopItems.achievement.forEach(item => {
        const isUnlocked = item.condition();
        const isEquipped = gameState.currentRod.id === item.id;
        const li = document.createElement('li');
        let buttonText = '';
        let buttonDisabled = false;
        if (item.cost) {
            const canAfford = gameState.gold >= item.cost;
            buttonText = isEquipped ? '장착중' : (item.owned ? '보유중' : `구매 (${item.cost}G)`);
            buttonDisabled = !isUnlocked || item.owned || !canAfford;
        } else {
            buttonText = isEquipped ? '장착중' : (item.owned ? '보유중' : '획득');
            buttonDisabled = !isUnlocked || item.owned;
        }
        li.innerHTML = `${item.name} <span class="item-desc">(${item.desc})</span> <button class="claim-button" data-item-id="${item.id}" ${buttonDisabled ? 'disabled' : ''}>${buttonText}</button>`;
        if (isEquipped) li.classList.add('equipped');
        achievementShopListEl.appendChild(li);
    });

    baitCraftingListEl.innerHTML = '';
    gameState.shopItems.bait.forEach(bait => {
        const li = document.createElement('li');
        const materialsText = bait.materials.map(mat => {
            if (mat.anyOf) {
                return mat.anyOf.map(opt => `${opt.rarity} ${opt.count}개`).join(' 또는 ');
            }
            return `${mat.name || (mat.rarity + (mat.orHigher ? ' 이상' : ''))} ${mat.count}개`;
        }).join(', ');
        
        li.innerHTML = `
            ${bait.name} - ${bait.desc}<br>
            재료: ${materialsText} + ${bait.cost}골드
            <button class="craft-bait-button" data-bait-id="${bait.id}">제작</button>
        `;
        baitCraftingListEl.appendChild(li);
    });
}

// ====================================
// 인벤토리 UI
// ====================================

function showInventory() {
    if (inventoryModalEl) {
        updateInventoryUI();
        inventoryModalEl.classList.remove('hidden');
    }
}

function hideInventory() {
    if (inventoryModalEl) inventoryModalEl.classList.add('hidden');
}

function updateInventoryUI() {
    if (!fishListEl || !equipmentListEl || !baitListEl || !activeBaitDisplayEl) return;
    fishListEl.innerHTML = '';
    gameState.inventory.forEach((fish, index) => {
        const li = document.createElement('li');
        const fishName = fish.isGolden ? `황금 ${fish.name}` : fish.name;
        li.innerHTML = `
            ${fishName} (${fish.size}cm) - ${fish.price}골드
            <div class="fish-actions">
                <button class="sell-fish-button" data-index="${index}">판매</button>
                <button class="release-fish-button" data-index="${index}">방생</button>
            </div>
        `;
        li.classList.add(`rarity-${fish.rarity}`);
        if (fish.isGolden) {
            li.classList.add('golden-fish');
        }
        fishListEl.appendChild(li);
    });

    equipmentListEl.innerHTML = '';
    const allRods = getAllRods();
    const ownedRods = allRods.filter(rod => rod.owned);
    ownedRods.forEach(rod => {
        const li = document.createElement('li');
        const isEquipped = gameState.currentRod.id === rod.id;
        let statsText = `(막대길이: ${rod.stats.barHeightBonus > 0 ? '+' : ''}${rod.stats.barHeightBonus}, 트래킹+${rod.stats.trackingBonus}s, 입질-${rod.stats.biteTimeReduction / 1000}s)`;
        if (isEquipped) {
            li.innerHTML = `${rod.name} (장착중) <br> ${statsText}`;
            li.classList.add('equipped');
        } else {
            li.innerHTML = `${rod.name} <br> ${statsText} <button class="equip-button" data-item-id="${rod.id}">장착하기</button>`;
        }
        equipmentListEl.appendChild(li);
    });

    activeBaitDisplayEl.textContent = gameState.activeBait ? gameState.activeBait.name : '없음';
    baitListEl.innerHTML = '';
    const baitCounts = gameState.baitInventory.reduce((acc, bait) => {
        acc[bait.id] = (acc[bait.id] || 0) + 1;
        return acc;
    }, {});

    Object.keys(baitCounts).forEach(baitId => {
        const bait = gameState.baitInventory.find(b => b.id === baitId);
        const count = baitCounts[baitId];
        const li = document.createElement('li');
        const isEquipped = gameState.activeBait && gameState.activeBait.id === bait.id;
        li.innerHTML = `
            ${bait.name} (x${count}) - ${bait.desc}
            <button class="equip-bait-button" data-bait-id="${bait.id}">${isEquipped ? '해제' : '장착'}</button>
        `;
        if (isEquipped) {
            li.classList.add('equipped');
        }
        baitListEl.appendChild(li);
    });
}

// ====================================
// 도감 UI
// ====================================

function showCollection() {
    if (collectionModalEl) {
        updateCollectionUI();
        collectionModalEl.classList.remove('hidden');
    }
}

function hideCollection() {
    if (collectionModalEl) collectionModalEl.classList.add('hidden');
}

function updateCollectionUI() {
    if (!collectionListEl) return;
    collectionListEl.innerHTML = '';
    regionOrder.forEach(regionName => {
        const regionTitle = document.createElement('h3');
        regionTitle.textContent = regionName;
        collectionListEl.appendChild(regionTitle);
        const fishGrid = document.createElement('div');
        fishGrid.className = 'collection-grid';
        const fishInRegion = fishTypesByRegion[regionName];
        const normalFish = fishInRegion.filter(f => f.rarity !== 'secret');
        const secretFish = fishInRegion.find(f => f.rarity === 'secret');
        normalFish.forEach(fish => {
            const isCaught = gameState.caughtFish.includes(fish.name);
            const isRevealed = gameState.revealedFish.includes(fish.name);
            const fishCard = document.createElement('div');
            fishCard.className = 'collection-card';
            const fishNameSpan = document.createElement('span');
            if (isCaught) {
                fishNameSpan.textContent = fish.name;
                fishCard.classList.add(`rarity-${fish.rarity}`);
            } else if (isRevealed) {
                fishNameSpan.textContent = fish.name;
                fishCard.classList.add('revealed');
            } else {
                fishNameSpan.textContent = '???';
                fishCard.classList.add('not-caught');
            }
            fishCard.appendChild(fishNameSpan);
            fishGrid.appendChild(fishCard);
        });
        if (secretFish) {
            const caughtInRegion = fishInRegion.filter(f => gameState.caughtFish.includes(f.name) && f.rarity !== 'secret');
            const isSecretUnlocked = caughtInRegion.length >= 4;
            const isCaught = gameState.caughtFish.includes(secretFish.name);
            const fishCard = document.createElement('div');
            fishCard.className = 'collection-card';
            const fishNameSpan = document.createElement('span');
            if (isSecretUnlocked) {
                if (isCaught) {
                    fishNameSpan.textContent = secretFish.name;
                    fishCard.classList.add(`rarity-${secretFish.rarity}`);
                } else {
                    fishNameSpan.textContent = '???';
                    fishCard.classList.add('not-caught', 'rarity-secret');
                }
                 fishCard.appendChild(fishNameSpan);
                 fishGrid.appendChild(fishCard);
            } 
        }
        collectionListEl.appendChild(fishGrid);
    });
}

// ====================================
// 초기화 UI
// ====================================

function showResetConfirmation() {
    if (resetConfirmationModalEl) resetConfirmationModalEl.classList.remove('hidden');
}

function hideResetConfirmation() {
    if (resetConfirmationModalEl) resetConfirmationModalEl.classList.add('hidden');
}

function showDeletedMessage() {
    if (sessionStorage.getItem('showDeleteMessage') === 'true') {
        const messageEl = document.createElement('div');
        messageEl.className = 'account-deleted-message';
        messageEl.textContent = '계정이 삭제 되었습니다';
        document.body.appendChild(messageEl);
        sessionStorage.removeItem('showDeleteMessage');
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 탭 기능 초기화
    function initializeTabs(containerEl) {
        if (!containerEl) return;
        const tabLinks = containerEl.querySelectorAll('.tab-link');
        const tabContents = containerEl.nextElementSibling.querySelectorAll('.tab-content');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.dataset.tab;
                tabLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                tabContents.forEach(content => {
                    if (content.id === tabId) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }

    initializeTabs(shopTabsContainerEl);
    initializeTabs(inventoryTabsContainerEl);
    showDeletedMessage();

    if (equipmentListEl) {
        equipmentListEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('equip-button')) {
                const itemId = e.target.dataset.itemId;
                const itemToEquip = getAllRods().find(r => r.id === itemId);
                if (itemToEquip) {
                    equipRod(itemToEquip);
                    updateInventoryUI();
                    updateShopUI();
                }
            }
        });
    }

    // 초기 UI 업데이트
    updatePlayerInfo();
    updateGameMessage('낚시를 시작해보세요!');
    updateShopUI();
    updateInventoryUI();
    updateRegionUI();
    showDeletedMessage();

    // 초기 탭 설정
    const initialShopTab = document.querySelector('.shop-tabs .tab-link[data-tab="gold-shop"]');
    if (initialShopTab) initialShopTab.classList.add('active');
    const initialShopContent = document.getElementById('gold-shop');
    if (initialShopContent) initialShopContent.classList.add('active');

    const initialInventoryTab = document.querySelector('.inventory-tabs .tab-link[data-tab="fish-inventory"]');
    if(initialInventoryTab) initialInventoryTab.classList.add('active');
    const initialInventoryContent = document.getElementById('fish-inventory');
    if(initialInventoryContent) initialInventoryContent.classList.add('active');
});