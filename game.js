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
    '늪지대': [
        { name: '맹그로브 크랩', rarity: 'uncommon', minSize: 10, maxSize: 20, basePrice: 15, barHeight: 28 },
        { name: '늪지 미꾸라지', rarity: 'common', minSize: 15, maxSize: 25, basePrice: 5, barHeight: 38 },
        { name: '무태장어', rarity: 'epic', minSize: 80, maxSize: 150, basePrice: 200, barHeight: 10 },
        { name: '톱날 꽃게', rarity: 'uncommon', minSize: 15, maxSize: 25, basePrice: 20, barHeight: 26 },
        { name: '독가시치', rarity: 'legendary', minSize: 20, maxSize: 40, basePrice: 900, barHeight: 6 },
    ],
    '아마존 강': [
        { name: '피라루쿠', rarity: 'rare', minSize: 100, maxSize: 200, basePrice: 180, barHeight: 15 },
        { name: '피라냐', rarity: 'common', minSize: 15, maxSize: 30, basePrice: 10, barHeight: 30 },
        { name: '네온 테트라', rarity: 'uncommon', minSize: 2, maxSize: 4, basePrice: 25, barHeight: 40 },
        { name: '실버 아로와나', rarity: 'legendary', minSize: 60, maxSize: 100, basePrice: 1200, barHeight: 4 },
        { name: '칸디루(흡혈메기)', rarity: 'epic', minSize: 5, maxSize: 15, basePrice: 300, barHeight: 9 },
        { name: '울프 피쉬', rarity: 'secret', minSize: 40, maxSize: 70, basePrice: 2000, barHeight: 5 },
    ]
};

const regions = {
    '강': { levelRequired: 1, background: 'assets/river.jpg' },
    '바다': { levelRequired: 5, background: 'assets/sea.png' },
    '심해': { levelRequired: 10, background: 'assets/deep_sea.jpg' },
    '늪지대': { levelRequired: 20 },
    '아마존 강': { levelRequired: 30 }
};

// 게임 상태
const gameState = {
    level: 1,
    xp: 0,
    xpToNextLevel: 10,
    gold: 10,
    inventory: [],
    currentRegion: '강',
    caughtFish: [],
    releasedFishCounts: {},
    releasedRareFishCount: 0,
    rareFishBonusGiven: false,
    secretFishEncounters: 0,
    fishing: false,
    // 1단계: PC 추적 미니게임
    trackingMinigameActive: false,
    trackingTime: 0,
    trackingInterval: null,
    fishMovementInterval: null,
    trackingMinigameTimeout: null,
    // 1단계: 모바일 리듬 게임
    rhythmGameActive: false,
    rhythmAttemptCount: 0,
    rhythmSuccessCount: 0,
    // 2단계: 막대 미니게임
    barMinigameActive: false,
    barMinigameStartTime: 0,
    barMinigameLoop: null,
    potentialFish: null,
    catchProgress: 50,
    playerBar: { y: 100, height: 90, speed: 0, maxSpeed: 5 },
    barFish: { y: 100, height: 25, speed: 0, direction: 1 },
    isMouseDown: false,
    isUpPressed: false,
    isDownPressed: false,
    currentRod: {
        id: 'rod_default',
        name: '기본 낚싯대',
        stats: { barHeightBonus: -10, trackingBonus: 0, biteTimeReduction: 0, minigameInvincibilityTime: 0 }
    },
    playerStats: {
        barHeightBonus: -10,
        trackingBonus: 0,
        biteTimeReduction: 0,
        minigameInvincibilityTime: 0
    },
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
            { id: 'rod_amazon_special', name: '아마존의 낚싯대', desc: '아마존 강 지역 도달 시 해금', cost: 500, condition: () => gameState.level >= regions['아마존 강'].levelRequired, owned: false, stats: { barHeightBonus: 30, trackingBonus: 1.5, biteTimeReduction: 1500, minigameInvincibilityTime: 1000 } },
            { id: 'rod_basket', name: '바구니 낚싯대', desc: '인벤토리에 30마리 이상 보유', condition: () => gameState.inventory.length >= 30, owned: false, stats: { barHeightBonus: -5, trackingBonus: 0.5, biteTimeReduction: 500, minigameInvincibilityTime: 500 } },
            { id: 'rod_golden', name: '황금 낚싯대', desc: '5000골드 이상 보유', condition: () => gameState.gold >= 5000, owned: false, stats: { barHeightBonus: 10, trackingBonus: 0.2, biteTimeReduction: 800, minigameInvincibilityTime: 300 } },
            { id: 'rod_water', name: '물 낚싯대', desc: '바다 도감 100% 달성', condition: () => { const seaFish = fishTypesByRegion['바다']; const caughtSeaFish = seaFish.filter(f => gameState.caughtFish.includes(f.name)); return seaFish.length === caughtSeaFish.length; }, owned: false, stats: { barHeightBonus: 15, trackingBonus: 0.8, biteTimeReduction: 800, minigameInvincibilityTime: 800 } },
            { id: 'rod_black', name: '블랙 낚싯대', desc: '시크릿 물고기 2회 조우', condition: () => gameState.secretFishEncounters >= 2, owned: false, stats: { barHeightBonus: 5, trackingBonus: 0.5, biteTimeReduction: 500, minigameInvincibilityTime: 0 } },
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
        if (!gameState.fishing) return;
        if (document.body.classList.contains('mobile-mode')) {
            startRhythmGame();
        } else {
            startTrackingMinigame();
        }
    }, biteWaitTime);
}

function resetAllFishingState() {
    gameState.fishing = false;
    gameState.trackingMinigameActive = false;
    gameState.rhythmGameActive = false;
    gameState.barMinigameActive = false;
    gameState.isMouseDown = false;
    gameState.isUpPressed = false;
    gameState.isDownPressed = false;
    gameState.potentialFish = null;
    clearInterval(gameState.trackingInterval);
    clearInterval(gameState.fishMovementInterval);
    clearTimeout(gameState.trackingMinigameTimeout);
    cancelAnimationFrame(gameState.barMinigameLoop);
    hideFishIcon();
    hideBarMinigame();
    hideRhythmGame();
    setButtonState(false);
    setFishingSpotCursor(false);
}

// ====================================
// 1단계: PC 추적 미니게임
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

    let possibleRarities = [];
    if (finalTrackingTime >= 8) possibleRarities.push('legendary', 'epic');
    if (finalTrackingTime >= 6) possibleRarities.push('rare');
    if (finalTrackingTime >= 4) possibleRarities.push('uncommon');
    possibleRarities.push('common');

    selectFishByRarity(possibleRarities);
}

// ====================================
// 1단계: 모바일 리듬 게임
// ====================================

function startRhythmGame() {
    gameState.rhythmGameActive = true;
    gameState.rhythmAttemptCount = 0;
    gameState.rhythmSuccessCount = 0;
    showRhythmGame();
    updateGameMessage(`성공: 0 / 10`);
    scheduleNextBar();
}

function scheduleNextBar() {
    if (!gameState.rhythmGameActive) return;
    if (gameState.rhythmAttemptCount >= 10) {
        endRhythmGame();
        return;
    }
    // 애니메이션 시간(2초)을 기반으로 최소 간격 계산
    const minInterval = 2000 / 6; // 1/6 화면 너비에 해당하는 시간
    const randomInterval = Math.random() * 1000 + minInterval;
    setTimeout(spawnRhythmBar, randomInterval);
}

function spawnRhythmBar() {
    if (!gameState.rhythmGameActive) return;
    gameState.rhythmAttemptCount++;
    const bar = document.createElement('div');
    bar.className = 'rhythm-bar';
    document.getElementById('rhythm-bar-container').appendChild(bar);

    bar.addEventListener('animationend', () => {
        bar.remove();
        // 탭으로 성공하지 못하고 애니메이션이 끝나면 실패로 간주
        if (gameState.rhythmGameActive) { // 게임이 아직 끝나지 않았을 때만
             gameState.rhythmSuccessCount = Math.max(0, gameState.rhythmSuccessCount - 1);
             updateGameMessage(`실패! 성공: ${gameState.rhythmSuccessCount} / 10`);
        }
    });
    scheduleNextBar();
}

function endRhythmGame() {
    hideRhythmGame();
    gameState.rhythmGameActive = false;
    let possibleRarities = [];
    const success = gameState.rhythmSuccessCount;

    if (success >= 9) possibleRarities.push('legendary', 'epic', 'rare', 'uncommon', 'common');
    else if (success >= 7) possibleRarities.push('epic', 'rare', 'uncommon', 'common');
    else if (success >= 5) possibleRarities.push('rare', 'uncommon', 'common');
    else if (success >= 3) possibleRarities.push('uncommon', 'common');
    else possibleRarities.push('common');

    updateGameMessage(`${success}번 성공!`);
    selectFishByRarity(possibleRarities);
}

// ====================================
// 공통 물고기 선택 로직
// ====================================

function selectFishByRarity(possibleRarities) {
    if (gameState.currentRegion === '아마존 강') {
        const piranhaReleased = gameState.releasedFishCounts['피라냐'] || 0;
        const candiruReleased = gameState.releasedFishCounts['칸디루(흡혈메기)'] || 0;
        const tetraReleased = gameState.releasedFishCounts['네온 테트라'] || 0;

        if ((piranhaReleased >= 3 || candiruReleased >= 3 || tetraReleased >= 3) && Math.random() < 0.1) {
            const wolfFish = fishTypesByRegion['아마존 강'].find(f => f.rarity === 'secret');
            if (wolfFish) {
                gameState.potentialFish = wolfFish;
                gameState.secretFishEncounters++;
                showSecretAppearanceMessage();
                startBarMinigame();
                return;
            }
        }
    }

    const fishInRegion = fishTypesByRegion[gameState.currentRegion];
    if (fishInRegion.length === 0) {
        updateGameMessage('이곳에는 물고기가 없는 것 같다...');
        resetAllFishingState();
        return;
    }

    const availableRaritiesInRegion = [...new Set(fishInRegion.map(f => f.rarity))];
    const finalPossibleRarities = possibleRarities.filter(r => availableRaritiesInRegion.includes(r));

    if (finalPossibleRarities.length === 0) {
        updateGameMessage('아쉽지만, 물고기가 입질만 하고 도망갔습니다...');
        resetAllFishingState();
        return;
    }

    const potentialRarity = finalPossibleRarities[0];
    const availableFish = fishInRegion.filter(f => f.rarity === potentialRarity);
    gameState.potentialFish = availableFish[Math.floor(Math.random() * availableFish.length)];

    if (gameState.currentRod.id === 'rod_basket' && (gameState.potentialFish.rarity === 'legendary' || gameState.potentialFish.rarity === 'secret')) {
        const nonLegendaryFish = fishInRegion.filter(f => f.rarity === 'rare' || f.rarity === 'uncommon' || f.rarity === 'common');
        if (nonLegendaryFish.length > 0) {
            gameState.potentialFish = nonLegendaryFish[Math.floor(Math.random() * nonLegendaryFish.length)];
            updateGameMessage('거대한 기운이... 평범한 무언가로 바뀌었다?');
        }
    }
    
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
    
    gameState.playerBar.height = 100 + gameState.playerStats.barHeightBonus;
    gameState.barFish.height = gameState.potentialFish.barHeight;

    showBarMinigame();
    gameState.barMinigameLoop = requestAnimationFrame(barMinigameLoop);
}

function barMinigameLoop() {
    const difficulty = { common: 1, uncommon: 1.5, rare: 2, epic: 2.5, legendary: 3.5, secret: 5 };
    const fishSpeed = difficulty[gameState.potentialFish.rarity] || 1;
    const acceleration = 0.25;

    if (gameState.isMouseDown || gameState.isUpPressed) {
        gameState.playerBar.speed -= acceleration;
    } else if (gameState.isDownPressed) {
        gameState.playerBar.speed += acceleration;
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
        if (!isInvincible) {
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
        if (gameState.potentialFish.rarity === 'secret' && gameState.potentialFish.name === '울프 피쉬') {
            const elapsedTime = Date.now() - gameState.barMinigameStartTime;
            if (elapsedTime > 6000) {
                updateGameMessage('울프 피쉬가 너무 빨라 놓쳤습니다!');
                resetAllFishingState();
                return;
            }
        }
        gameState.barMinigameLoop = requestAnimationFrame(barMinigameLoop);
    }
}

// ====================================
// 최종 결과 처리
// ====================================

function catchFish(fish, isBonus = false) {
    let fishToCatch = { ...fish };
    let size = Math.floor(Math.random() * (fishToCatch.maxSize - fishToCatch.minSize + 1)) + fishToCatch.minSize;
    let price = Math.round(fishToCatch.basePrice * (size / fishToCatch.minSize));
    let isGolden = false;

    if (gameState.currentRod.id === 'rod_golden' && Math.random() < 0.1 && !isBonus) {
        price *= 2;
        isGolden = true;
    }

    const xpGained = Math.round(price * 1.5);

    if (gameState.achievements.fishCaught[fishToCatch.name] !== undefined) {
        gameState.achievements.fishCaught[fishToCatch.name]++;
    } else {
        gameState.achievements.fishCaught[fishToCatch.name] = 1;
    }

    if (!gameState.caughtFish.includes(fishToCatch.name)) {
        gameState.caughtFish.push(fishToCatch.name);
    }

    const inventoryFish = { name: fishToCatch.name, size: size, price: price, rarity: fishToCatch.rarity };
    if (isGolden) {
        inventoryFish.isGolden = true;
    }
    gameState.inventory.push(inventoryFish);
    
    if (!isBonus) {
        addXp(xpGained);
        let message = `${fishToCatch.name} (${size}cm)를 낚았다! (+${xpGained}XP)`;
        if (isGolden) {
            message = `황금 ${fishToCatch.name} (${size}cm)를 낚았다! (+${xpGained}XP)`;
        }
        updateGameMessage(message);
    } else {
        updateGameMessage(`바구니에서 ${fishToCatch.name} (${size}cm)가 추가로 나왔다!`);
    }

    if (gameState.currentRod.id === 'rod_basket' && Math.random() < 0.2 && !isBonus) {
        const fishInRegion = fishTypesByRegion[gameState.currentRegion].filter(f => f.rarity !== 'legendary' && f.rarity !== 'secret');
        if (fishInRegion.length > 0) {
            const bonusFish = fishInRegion[Math.floor(Math.random() * fishInRegion.length)];
            catchFish(bonusFish, true);
        }
    }
    
    updatePlayerInfo();
}

function addXp(amount) {
    gameState.xp += amount;
    if (gameState.xp >= gameState.xpToNextLevel) {
        gameState.level++;
        gameState.xp -= gameState.xpToNextLevel;
        gameState.xpToNextLevel = Math.round(gameState.xpToNextLevel * 1.5);
        updateGameMessage(`레벨 업! 레벨 ${gameState.level} 달성!`);
        updateRegionUI();
    }
}

const regionOrder = ['강', '바다', '심해', '늪지대', '아마존 강'];

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
    
    let xpGained = 1;
    if (gameState.currentRod.id === 'rod_black') {
        xpGained = 10;
    } else if (fish.isGolden) {
        xpGained = 15;
    }
    addXp(xpGained);
    updateGameMessage(`${fish.name}을(를) 방생했습니다. (+${xpGained}XP)`);

    if (!gameState.releasedFishCounts[fish.name]) {
        gameState.releasedFishCounts[fish.name] = 0;
    }
    gameState.releasedFishCounts[fish.name]++;

    if (fish.rarity === 'rare') {
        gameState.releasedRareFishCount++;
        if (gameState.releasedRareFishCount >= 5 && !gameState.rareFishBonusGiven) {
            addXp(250);
            gameState.rareFishBonusGiven = true;
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
        const saveData = {
            level: gameState.level,
            xp: gameState.xp,
            xpToNextLevel: gameState.xpToNextLevel,
            gold: gameState.gold,
            inventory: gameState.inventory,
            currentRegion: gameState.currentRegion,
            caughtFish: gameState.caughtFish,
            releasedFishCounts: gameState.releasedFishCounts,
            releasedRareFishCount: gameState.releasedRareFishCount,
            rareFishBonusGiven: gameState.rareFishBonusGiven,
            secretFishEncounters: gameState.secretFishEncounters,
            achievements: gameState.achievements,
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

        gameState.level = saveData.level || 1;
        gameState.xp = saveData.xp || 0;
        gameState.xpToNextLevel = saveData.xpToNextLevel || 10;
        gameState.gold = saveData.gold || 10;
        gameState.inventory = saveData.inventory || [];
        gameState.currentRegion = saveData.currentRegion || '강';
        gameState.caughtFish = saveData.caughtFish || [];
        gameState.releasedFishCounts = saveData.releasedFishCounts || {};
        gameState.releasedRareFishCount = saveData.releasedRareFishCount || 0;
        gameState.rareFishBonusGiven = saveData.rareFishBonusGiven || false;
        gameState.secretFishEncounters = saveData.secretFishEncounters || 0;
        gameState.achievements = saveData.achievements || { fishCaught: { '붕어': 0, '참치': 0 } };

        if (saveData.shopItemsOwned) {
            if (saveData.shopItemsOwned.gold) {
                saveData.shopItemsOwned.gold.forEach(savedItem => {
                    const gameItem = gameState.shopItems.gold.find(i => i.id === savedItem.id);
                    if (gameItem) gameItem.owned = savedItem.owned;
                });
            }
            if (saveData.shopItemsOwned.achievement) {
                saveData.shopItemsOwned.achievement.forEach(savedItem => {
                    const gameItem = gameState.shopItems.achievement.find(i => i.id === savedItem.id);
                    if (gameItem) gameItem.owned = savedItem.owned;
                });
            }
        }

        const allRods = getAllRods();
        const equippedRod = allRods.find(r => r.id === saveData.currentRodId);
        if (equippedRod) {
            equipRod(equippedRod);
        } else {
            equipRod(allRods.find(r => r.id === 'rod_default'));
        }

        updatePlayerInfo();
        updateShopUI();
        updateInventoryUI();
        updateRegionUI();
        updateGameMessage('게임을 불러왔습니다.');

    } catch (e) {
        console.error("불러오기 중 오류 발생:", e);
        updateGameMessage('게임 불러오기에 실패했습니다.');
        Object.assign(gameState, {
            level: 1,
            xp: 0,
            xpToNextLevel: 10,
            gold: 10,
            inventory: [],
            currentRegion: '강',
            caughtFish: [],
            releasedFishCounts: {},
            releasedRareFishCount: 0,
            rareFishBonusGiven: false,
            secretFishEncounters: 0,
        });
    }
}

function deleteSaveData() {
    try {
        localStorage.removeItem('fishingman_save');
        sessionStorage.setItem('showDeleteMessage', 'true');
        location.reload();
    } catch (e) {
        console.error("삭제 중 오류 발생:", e);
        updateGameMessage('데이터 삭제에 실패했습니다.');
    }
}


function equipRod(item) {
    gameState.currentRod = item;
    gameState.playerStats = { ...item.stats };
    updateGameMessage(`${item.name}을(를) 장착했습니다.`);
}

function getAllRods() {
    return [
        { id: 'rod_default', name: '기본 낚싯대', stats: { barHeightBonus: -10, trackingBonus: 0, biteTimeReduction: 0, minigameInvincibilityTime: 0 }, owned: true },
        ...gameState.shopItems.gold,
        ...gameState.shopItems.achievement
    ];
}