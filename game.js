// 지역 및 물고기 데이터
const fishTypesByRegion = {
    '강': [
        { name: '메기', rarity: 'epic', minSize: 20, maxSize: 40, basePrice: 20, barHeight: 28 },
        { name: '잉어', rarity: 'uncommon', minSize: 30, maxSize: 60, basePrice: 10, barHeight: 25 },
        { name: '붕어', rarity: 'common', minSize: 15, maxSize: 30, basePrice: 3, barHeight: 30 },
        { name: '미꾸라지', rarity: 'common', minSize: 10, maxSize: 20, basePrice: 2, barHeight: 40 },
        { name: '가물치', rarity: 'rare', minSize: 40, maxSize: 80, basePrice: 25, barHeight: 20 },
        { name: '연어', rarity: 'rare', minSize: 50, maxSize: 90, basePrice: 30, barHeight: 18 },
        { name: '이끼', rarity: 'common', minSize: 1, maxSize: 1, basePrice: 0.1, barHeight: 50 },
    ],
    '바다': [
        { name: '대구', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 8, barHeight: 32 },
        { name: '명태', rarity: 'common', minSize: 30, maxSize: 60, basePrice: 7, barHeight: 35 },
        { name: '쏘가리', rarity: 'common', minSize: 25, maxSize: 45, basePrice: 5, barHeight: 33 },
        { name: '황어', rarity: 'common', minSize: 20, maxSize: 40, basePrice: 6, barHeight: 36 },
        { name: '참가자미', rarity: 'rare', minSize: 20, maxSize: 35, basePrice: 40, barHeight: 24 },
        { name: '정어리', rarity: 'common', minSize: 10, maxSize: 20, basePrice: 1, barHeight: 45 },
        { name: '청어', rarity: 'common', minSize: 20, maxSize: 30, basePrice: 4, barHeight: 42 },
        { name: '말미잘', rarity: 'epic', minSize: 5, maxSize: 15, basePrice: 50, barHeight: 15 },
        { name: '딱총새우', rarity: 'legendary', minSize: 3, maxSize: 5, basePrice: 700, barHeight: 8 },
        { name: '상어', rarity: 'epic', minSize: 150, maxSize: 300, basePrice: 250, barHeight: 10 },
        { name: '만타 가오리', rarity: 'legendary', minSize: 200, maxSize: 400, basePrice: 1000, barHeight: 5 },
        { name: '복어', rarity: 'epic', minSize: 15, maxSize: 30, basePrice: 60, barHeight: 14 },
        { name: '성게', rarity: 'common', minSize: 5, maxSize: 10, basePrice: 0.5, barHeight: 48 },
        { name: '해초', rarity: 'common', minSize: 1, maxSize: 1, basePrice: 0.1, barHeight: 50 },
    ],
    '심해': [
        { name: '아귀', rarity: 'epic', minSize: 50, maxSize: 100, basePrice: 150, barHeight: 12 },
        { name: '블랙스왈로우', rarity: 'rare', minSize: 10, maxSize: 25, basePrice: 80, barHeight: 19 },
        { name: '블랍피쉬', rarity: 'epic', minSize: 20, maxSize: 30, basePrice: 120, barHeight: 16 },
        { name: '거대 바다 거미', rarity: 'rare', minSize: 30, maxSize: 50, basePrice: 90, barHeight: 18 },
        { name: '심해털게', rarity: 'legendary', minSize: 40, maxSize: 60, basePrice: 800, barHeight: 7 },
    ],
    '전설의 호수': []
};

const regions = {
    '강': { levelRequired: 1, background: 'assets/river.jpg' },
    '바다': { levelRequired: 5, background: 'assets/sea.jpg' },
    '심해': { levelRequired: 10, background: 'assets/deep_sea.jpg' },
    '전설의 호수': { levelRequired: 20, background: 'assets/legendary_lake.jpg' }
};

// 게임 상태
const gameState = {
    level: 1,
    xp: 0,
    xpToNextLevel: 10,
    gold: 10,
    inventory: [],
    currentRegion: '강', // 현재 지역
    caughtFish: [], // 도감용으로 잡은 물고기 이름 저장
    releasedRareFishCount: 0, // 희귀 물고기 방생 횟수
    rareFishBonusGiven: false, // 희귀 물고기 보너스 지급 여부
    // 낚시 프로세스 상태
    fishing: false,
    // 1단계: 추적 미니게임
    trackingMinigameActive: false,
    trackingTime: 0,
    trackingInterval: null,
    fishMovementInterval: null,
    trackingMinigameTimeout: null,
    // 2단계: 막대 미니게임
    barMinigameActive: false,
    barMinigameStartTime: 0,
    barMinigameLoop: null,
    potentialFish: null, // rarity 대신 fish 객체 전체를 저장
    catchProgress: 50, // 0-100
    playerBar: { y: 100, height: 90, speed: 0, maxSpeed: 5 }, // 기본 막대 높이 100, 기본 낚싯대 페널티 -10
    barFish: { y: 100, height: 25, speed: 0, direction: 1 },
    isMouseDown: false,
    // 장비 및 스탯
    currentRod: {
        id: 'rod_default',
        name: '기본 낚싯대',
        stats: { barHeightBonus: -10, trackingBonus: 0, biteTimeReduction: 0, minigameInvincibilityTime: 0 }
    },
    playerStats: {
        barHeightBonus: -10,
        trackingBonus: 0,
        biteTimeReduction: 0,
        minigameInvincibilityTime: 0 // 초기 무적시간 0
    },
    // 상점 및 도전과제
    achievements: {
        fishCaught: { '붕어': 0, '참치': 0 },
    },
    shopItems: {
        gold: [
            { id: 'rod_apprentice', name: '견습생 낚싯대', cost: 15, owned: false, stats: { barHeightBonus: 2, trackingBonus: 0.1, biteTimeReduction: 0, minigameInvincibilityTime: 0 } },
            { id: 'rod_sturdy', name: '튼튼한 낚싯대', cost: 40, owned: false, stats: { barHeightBonus: 1.5, trackingBonus: 0.15, biteTimeReduction: 0, minigameInvincibilityTime: 500 } },
            { id: 'rod_basic_purchasable', name: '기본 낚싯대', cost: 75, owned: false, stats: { barHeightBonus: 2, trackingBonus: 0.3, biteTimeReduction: 250, minigameInvincibilityTime: 500 } },
            { id: 'rod_trainee', name: '순련자용 낚싯대', cost: 100, owned: false, stats: { barHeightBonus: 3, trackingBonus: 0.4, biteTimeReduction: 250, minigameInvincibilityTime: 400 } },
            { id: 'rod_advanced', name: '고급 낚싯대', cost: 120, owned: false, stats: { barHeightBonus: 4, trackingBonus: 0.5, biteTimeReduction: 300, minigameInvincibilityTime: 600 } },
            { id: 'rod_carbon', name: '카본 낚싯대', cost: 140, owned: false, stats: { barHeightBonus: 10, trackingBonus: 0.5, biteTimeReduction: 500, minigameInvincibilityTime: 0 } },
            { id: 'rod_steel', name: '강철 낚싯대', cost: 200, owned: false, stats: { barHeightBonus: 20, trackingBonus: 1, biteTimeReduction: 1000, minigameInvincibilityTime: 0 } },
        ],
        achievement: [
            { id: 'rod_master', name: '장인의 낚싯대', desc: '붕어 50마리 잡기', condition: () => gameState.achievements.fishCaught['붕어'] >= 50, owned: false, stats: { barHeightBonus: 15, trackingBonus: 0.6, biteTimeReduction: 600, minigameInvincibilityTime: 700 } },
            { id: 'rod_legend', name: '전설의 낚싯대', desc: '참치 1마리 잡기', condition: () => gameState.achievements.fishCaught['참치'] >= 1, owned: false, stats: { barHeightBonus: 25, trackingBonus: 1.2, biteTimeReduction: 1200, minigameInvincibilityTime: 800 } },
            { id: 'rod_sea_special', name: '바다의 낚싯대', desc: '바다 지역 도달 시 해금', cost: 300, condition: () => gameState.level >= regions['바다'].levelRequired, owned: false, stats: { barHeightBonus: 12, trackingBonus: 0.7, biteTimeReduction: 700, minigameInvincibilityTime: 500 } },
            { id: 'rod_deep_sea_special', name: '심해의 낚싯대', desc: '심해 지역 도달 시 해금', cost: 300, condition: () => gameState.level >= regions['심해'].levelRequired, owned: false, stats: { barHeightBonus: 18, trackingBonus: 0.9, biteTimeReduction: 900, minigameInvincibilityTime: 600 } },
            { id: 'rod_legendary_special', name: '호수의 낚싯대', desc: '전설의 호수 도달 시 해금', cost: 300, condition: () => gameState.level >= regions['전설의 호수'].levelRequired, owned: false, stats: { barHeightBonus: 30, trackingBonus: 1.5, biteTimeReduction: 1500, minigameInvincibilityTime: 1000 } },
        ]
    }
};

// ====================================
// 전역 낚시 플로우 관리
// ====================================

function startFishing() {
    if (gameState.fishing) return;
    updateGameMessage('낚싯대를 던졌습니다...');
    gameState.fishing = true;
    setButtonState(true);
    const biteWaitTime = 7500 - gameState.playerStats.biteTimeReduction;
    setTimeout(() => {
        if (gameState.fishing) startTrackingMinigame();
    }, biteWaitTime);
}

function resetAllFishingState() {
    gameState.fishing = false;
    gameState.trackingMinigameActive = false;
    gameState.barMinigameActive = false;
    gameState.isMouseDown = false;
    clearInterval(gameState.trackingInterval);
    clearInterval(gameState.fishMovementInterval);
    clearTimeout(gameState.trackingMinigameTimeout);
    cancelAnimationFrame(gameState.barMinigameLoop);
    hideFishIcon();
    hideBarMinigame();
    setButtonState(false);
    setFishingSpotCursor(false);
}

// ====================================
// 1단계: 추적 미니게임
// ====================================

function startTrackingMinigame() {
    updateGameMessage('물고기가 나타났다! 마우스를 올려두세요!');
    gameState.trackingMinigameActive = true;
    gameState.trackingTime = 0;
    showFishIcon();
    setFishingSpotCursor(true);
    gameState.fishMovementInterval = setInterval(moveFishIcon, 1000);
    gameState.trackingMinigameTimeout = setTimeout(endTrackingMinigame, 10000);
}

function endTrackingMinigame() {
    clearInterval(gameState.fishMovementInterval);
    clearInterval(gameState.trackingInterval);
    clearTimeout(gameState.trackingMinigameTimeout);
    hideFishIcon();
    setFishingSpotCursor(false);

    const finalTrackingTime = (gameState.trackingTime / 1000) + gameState.playerStats.trackingBonus;
    if (finalTrackingTime < 2) {
        updateGameMessage('물고기가 도망갔습니다...');
        resetAllFishingState();
        return;
    }

    const fishInRegion = fishTypesByRegion[gameState.currentRegion];
    if (fishInRegion.length === 0) {
        updateGameMessage('이곳에는 물고기가 없는 것 같다...');
        resetAllFishingState();
        return;
    }

    // 추적 시간에 따라 잡을 수 있는 희귀도 목록 결정
    let possibleRarities = [];
    if (finalTrackingTime >= 8) possibleRarities.push('legendary', 'epic');
    if (finalTrackingTime >= 6) possibleRarities.push('rare');
    if (finalTrackingTime >= 4) possibleRarities.push('uncommon');
    possibleRarities.push('common');

    // 현재 지역에 존재하는 희귀도만 필터링
    const availableRaritiesInRegion = [...new Set(fishInRegion.map(f => f.rarity))];
    const finalPossibleRarities = possibleRarities.filter(r => availableRaritiesInRegion.includes(r));
    
    if (finalPossibleRarities.length === 0) {
        // 이 경우는 거의 없지만, 만약을 위해 가장 흔한 등급으로 설정
        finalPossibleRarities.push('common');
    }

    // 최종 희귀도 결정 (가장 높은 등급 우선)
    const potentialRarity = finalPossibleRarities[0];

    const availableFish = fishInRegion.filter(f => f.rarity === potentialRarity);
    gameState.potentialFish = availableFish[Math.floor(Math.random() * availableFish.length)];
    
    startBarMinigame();
}

// ====================================
// 2단계: 막대 미니게임
// ====================================

function startBarMinigame() {
    updateGameMessage('잡았다! 이제 끌어올리자! (마우스 클릭으로 조종)');
    gameState.barMinigameActive = true;
    gameState.barMinigameStartTime = Date.now();
    gameState.catchProgress = 50;
    
    // 낚싯대 및 물고기 스탯 적용
    gameState.playerBar.height = 100 + gameState.playerStats.barHeightBonus;
    gameState.barFish.height = gameState.potentialFish.barHeight;

    showBarMinigame();
    gameState.barMinigameLoop = requestAnimationFrame(barMinigameLoop);
}

function barMinigameLoop() {
    const difficulty = { common: 1, uncommon: 1.5, rare: 2, epic: 2.5, legendary: 3.5 };
    const fishSpeed = difficulty[gameState.potentialFish.rarity] || 1;

    const acceleration = 0.25;
    if (gameState.isMouseDown) {
        gameState.playerBar.speed -= acceleration;
    } else {
        gameState.playerBar.speed += acceleration;
    }
    gameState.playerBar.speed = Math.max(-gameState.playerBar.maxSpeed, Math.min(gameState.playerBar.maxSpeed, gameState.playerBar.speed));
    gameState.playerBar.y += gameState.playerBar.speed;
    const controlBarContainerHeight = 360;
    gameState.playerBar.y = Math.max(0, Math.min(controlBarContainerHeight - gameState.playerBar.height, gameState.playerBar.y));

    if (Math.random() < 0.05) gameState.barFish.direction *= -1;
    gameState.barFish.y += fishSpeed * gameState.barFish.direction;
    gameState.barFish.y = Math.max(0, Math.min(controlBarContainerHeight - gameState.barFish.height, gameState.barFish.y));

    const playerTop = gameState.playerBar.y;
    const playerBottom = playerTop + gameState.playerBar.height;
    const fishTop = gameState.barFish.y;
    const fishBottom = fishTop + gameState.barFish.height;

    const invincibilityEndTime = gameState.barMinigameStartTime + gameState.playerStats.minigameInvincibilityTime;
    const isInvincible = Date.now() < invincibilityEndTime;

    if (playerTop < fishBottom && playerBottom > fishTop) {
        gameState.catchProgress += 0.4;
    } else {
        if (!isInvincible) { // Only decrease if not invincible
            const elapsedTime = Date.now() - gameState.barMinigameStartTime;
            if (elapsedTime > 3000) {
                gameState.catchProgress -= 0.2;
            }
        }
    }
    gameState.catchProgress = Math.max(0, Math.min(100, gameState.catchProgress));

    updateBarMinigameUI();

    if (gameState.catchProgress >= 100) {
        updateGameMessage('잡았다!');
        catchFish(gameState.potentialFish);
        resetAllFishingState();
    } else if (gameState.catchProgress <= 0) {
        updateGameMessage('낚싯줄이 끊어졌다...');
        resetAllFishingState();
    } else {
        gameState.barMinigameLoop = requestAnimationFrame(barMinigameLoop);
    }
}

// ====================================
// 최종 결과 처리
// ====================================

function catchFish(fish) {
    const size = Math.floor(Math.random() * (fish.maxSize - fish.minSize + 1)) + fish.minSize;
    const price = Math.round(fish.basePrice * (size / fish.minSize));
    const xpGained = Math.round(price * 1.5);

    if (gameState.achievements.fishCaught[fish.name] !== undefined) {
        gameState.achievements.fishCaught[fish.name]++;
    } else {
        gameState.achievements.fishCaught[fish.name] = 1;
    }

    // 도감에 새로운 물고기 추가
    if (!gameState.caughtFish.includes(fish.name)) {
        gameState.caughtFish.push(fish.name);
    }

    gameState.inventory.push({ name: fish.name, size: size, price: price, rarity: fish.rarity });
    console.log('Current inventory:', gameState.inventory); // Debugging line
    addXp(xpGained);

    updateGameMessage(`${fish.name} (${size}cm)를 낚았다! (+${xpGained}XP)`);
    updatePlayerInfo();
}

function addXp(amount) {
    gameState.xp += amount;
    if (gameState.xp >= gameState.xpToNextLevel) {
        gameState.level++;
        gameState.xp -= gameState.xpToNextLevel;
        gameState.xpToNextLevel = Math.round(gameState.xpToNextLevel * 1.5);
        updateGameMessage(`레벨 업! 레벨 ${gameState.level} 달성!`);
        updateRegionUI(); // 레벨업 시 지역 UI 업데이트
    }
}

const regionOrder = ['강', '바다', '심해', '전설의 호수'];

function changeRegion(regionName) {
    if (!regions[regionName] || gameState.currentRegion === regionName) return;

    if (gameState.fishing) {
        updateGameMessage('낚시 중에는 지역을 변경할 수 없습니다.');
        return;
    }

    const targetRegion = regions[regionName];
    if (gameState.level < targetRegion.levelRequired) {
        updateGameMessage(`레벨 ${targetRegion.levelRequired}이 필요합니다.`);
        return;
    }

    const currentRegionIndex = regionOrder.indexOf(gameState.currentRegion);
    const targetRegionIndex = regionOrder.indexOf(regionName);

    // 다음 지역으로 이동하는 경우에만 도감 조건 확인
    if (targetRegionIndex > currentRegionIndex) {
        const fishInCurrentRegion = fishTypesByRegion[gameState.currentRegion];
        const caughtInCurrentRegion = fishInCurrentRegion.filter(fish => gameState.caughtFish.includes(fish.name));
        const requiredCount = Math.max(0, fishInCurrentRegion.length - 3);

        if (caughtInCurrentRegion.length < requiredCount) {
            updateGameMessage(`${gameState.currentRegion}의 물고기를 ${requiredCount}종류 이상 잡아야 이동할 수 있습니다. (현재: ${caughtInCurrentRegion.length}종류)`);
            return;
        }
    }

    gameState.currentRegion = regionName;
    updateGameMessage(`${regionName}으로 이동했습니다.`);
    updateRegionUI();
}

// ====================================
// 인벤토리 물고기 판매/방생 로직
// ====================================

function sellFish(index) {
    if (index < 0 || index >= gameState.inventory.length) return;
    const fish = gameState.inventory.splice(index, 1)[0];
    gameState.gold += fish.price;
    updateGameMessage(`${fish.name}을(를) ${fish.price}골드에 판매했습니다.`);
    updatePlayerInfo();
    updateInventoryUI();
}

function releaseFish(index) {
    if (index < 0 || index >= gameState.inventory.length) return;
    const fish = gameState.inventory.splice(index, 1)[0];
    addXp(1); // 1 XP 고정
    updateGameMessage(`${fish.name}을(를) 방생했습니다. (+1XP)`);

    // 히든 요소: 희귀 등급 물고기 5번 이상 방생 시 보너스 XP
    if (fish.rarity === 'rare') {
        gameState.releasedRareFishCount++;
        if (gameState.releasedRareFishCount >= 5 && !gameState.rareFishBonusGiven) {
            addXp(250);
            gameState.rareFishBonusGiven = true;
            // 게임 내 표시하지 않음 (사용자 요청)
            console.log("희귀 물고기 5마리 방생 보너스! 250 XP 획득!");
        }
    }
    updatePlayerInfo();
    updateInventoryUI();
}

// ====================================
// 상점/장비 로직
// ====================================

function purchaseGoldItem(itemId) {
    const item = gameState.shopItems.gold.find(i => i.id === itemId);
    if (!item || item.owned || gameState.gold < item.cost) return;

    gameState.gold -= item.cost;
    item.owned = true;
    equipRod(item);
    updatePlayerInfo();
    updateShopUI();
}

function handleAchievementItem(itemId) {
    const item = gameState.shopItems.achievement.find(i => i.id === itemId);
    if (!item || item.owned || !item.condition()) return;

    // 비용이 있는 아이템인지 확인
    if (item.cost) {
        if (gameState.gold >= item.cost) {
            gameState.gold -= item.cost;
            item.owned = true;
            equipRod(item);
            updatePlayerInfo();
            updateShopUI();
        } else {
            updateGameMessage('골드가 부족합니다.');
        }
    } else {
        // 비용이 없는 기존 도전과제 아이템
        item.owned = true;
        equipRod(item);
        updateShopUI();
    }
}

// ====================================
// 저장/불러오기 로직
// ====================================

function saveGame() {
    try {
        // 함수 등 저장할 수 없는 부분을 제외하고 순수 데이터만 추출
        const saveData = {
            level: gameState.level,
            xp: gameState.xp,
            xpToNextLevel: gameState.xpToNextLevel,
            gold: gameState.gold,
            inventory: gameState.inventory,
            currentRegion: gameState.currentRegion,
            caughtFish: gameState.caughtFish,
            releasedRareFishCount: gameState.releasedRareFishCount,
            rareFishBonusGiven: gameState.rareFishBonusGiven,
            achievements: gameState.achievements,
            // 상점 아이템은 소유 여부만 저장
            shopItemsOwned: {
                gold: gameState.shopItems.gold.map(item => ({ id: item.id, owned: item.owned })),
                achievement: gameState.shopItems.achievement.map(item => ({ id: item.id, owned: item.owned }))
            },
            currentRodId: gameState.currentRod.id
        };

        localStorage.setItem('fishingman_save', JSON.stringify(saveData));
        updateGameMessage('게임이 저장되었습니다.');
    } catch (e) {
        console.error("저장 중 오류 발생:", e);
        updateGameMessage('게임 저장에 실패했습니다.');
    }
}

function loadGame() {
    try {
        const savedDataJSON = localStorage.getItem('fishingman_save');
        if (!savedDataJSON) {
            updateGameMessage('저장된 데이터가 없습니다.');
            return;
        }

        const saveData = JSON.parse(savedDataJSON);

        // 기본 gameState에 불러온 데이터를 덮어쓰기
        gameState.level = saveData.level;
        gameState.xp = saveData.xp;
        gameState.xpToNextLevel = saveData.xpToNextLevel;
        gameState.gold = saveData.gold;
        gameState.inventory = saveData.inventory;
        gameState.currentRegion = saveData.currentRegion;
        gameState.caughtFish = saveData.caughtFish;
        gameState.releasedRareFishCount = saveData.releasedRareFishCount;
        gameState.rareFishBonusGiven = saveData.rareFishBonusGiven;
        gameState.achievements = saveData.achievements;

        // 상점 아이템 소유 상태 업데이트
        saveData.shopItemsOwned.gold.forEach(savedItem => {
            const gameItem = gameState.shopItems.gold.find(i => i.id === savedItem.id);
            if (gameItem) gameItem.owned = savedItem.owned;
        });
        saveData.shopItemsOwned.achievement.forEach(savedItem => {
            const gameItem = gameState.shopItems.achievement.find(i => i.id === savedItem.id);
            if (gameItem) gameItem.owned = savedItem.owned;
        });

        // 현재 장착 장비 설정
        const allRods = [...gameState.shopItems.gold, ...gameState.shopItems.achievement];
        const equippedRod = allRods.find(r => r.id === saveData.currentRodId) || gameState.shopItems.gold[0];
        equipRod(equippedRod);

        // 모든 UI 업데이트
        updatePlayerInfo();
        updateShopUI();
        updateInventoryUI();
        updateRegionUI();
        updateGameMessage('게임을 불러왔습니다.');

    } catch (e) {
        console.error("불러오기 중 오류 발생:", e);
        updateGameMessage('게임 불러오기에 실패했습니다.');
    }
}

function deleteSaveData() {
    try {
        localStorage.removeItem('fishingman_save');
        sessionStorage.setItem('showDeleteMessage', 'true'); // 삭제 메시지 표시 플래그
        location.reload(); // 페이지 새로고침
    } catch (e) {
        console.error("삭제 중 오류 발생:", e);
        updateGameMessage('데이터 삭제에 실패했습니다.');
    }
}


function equipRod(item) {
    gameState.currentRod = item;
    // playerStats를 현재 장착한 장비의 스탯으로 교체
    gameState.playerStats = { ...item.stats };
    updateGameMessage(`${item.name}을(를) 장착했습니다.`);
}