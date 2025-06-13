// 특성 가중치 설정
const statWeights = {
    crit: 0.5,
    specialization: 1.0,
    swiftness: 0.3,
    domination: 0.2,
    endurance: 0.2,
    expertise: 0.1,
};

// 특성 가중치에 따른 추가 딜량 계산
function calculateStatImpact(stats) {
    let additionalDmgFromStats = 0;

    for (const [statName, statValue] of Object.entries(stats)) {
        if (!statValue || !statValue.value) continue;
        const weight = statWeights[statName] || 0;
        additionalDmgFromStats += (statValue.value * weight) / 1000;
    }

    return additionalDmgFromStats;
}

// 딜량 계산 함수
function calculateDamage(character) {
    const { stats } = character;
    const atkPower = stats.atkPower.value;

    const critRate = stats.crit.value / 1000;
    const critDamageBonus = (stats.critDamageBonus || 0) + 0.2; // 기본 치명타 피해량
    const additionalDamage = (stats.additionalDamage || 0) + calculateStatImpact(stats);

    return atkPower * (1 + critRate * (1 + critDamageBonus)) * (1 + additionalDamage);
}

// 팔찌 옵션 효과 계산
function applyOptionEffect(optionName, description, character) {
    // const effectsByLevel = {
    //     "쐐기": [0.003, 0.0035, 0.0045, 0.005],
    //     "망치": [0.06, 0.08, 0.10, 0.12],
    //     "순환": [0.025, 0.03, 0.035, 0.04],
    //     "열정": [0.025, 0.03, 0.035, 0.04],
    //     "냉정": [0.025, 0.03, 0.035, 0.04],
    //     "비수": [0.015, 0.018, 0.021, 0.025],
    //     "약점 노출": [0.015, 0.018, 0.021, 0.025],
    //     "응원": [0.007, 0.009, 0.011, 0.013],
    //     "우월": [0.015, 0.02, 0.025, 0.03],
    //     "습격": [0.04, 0.06, 0.08, 0.10],
    //     "정밀": [0.02, 0.03, 0.04, 0.05],
    //     "상처악화": [0.02, 0.03, 0.05, 0.07],
    //     "기습": [0.025, 0.03, 0.035, 0.04],
    //     "결투": [0.025, 0.03, 0.035, 0.04],
    // };

    // // 옵션 이름에 따른 효과 계산
    // const effectValues = effectsByLevel[optionName];
    // if (effectValues) {
    //     const level = description
    //         ? effectValues.findIndex((_, idx) => description.includes(effectValues[idx] * 100 + "%"))
    //         : -1;
    //     if (level >= 0) {
    //         const effectValue = effectValues[level];
    //         switch (optionName) {
    //             case "쐐기":
    //             case "망치":
    //             case "습격":
    //                 character.stats.critDamageBonus = (character.stats.critDamageBonus || 0) + effectValue;
    //                 break;
    //             case "순환":
    //             case "열정":
    //             case "냉정":
    //             case "우월":
    //             case "기습":
    //             case "결투":
    //                 character.stats.additionalDamage = (character.stats.additionalDamage || 0) + effectValue;
    //                 break;
    //         }
    //     }
    // }

    // 설명만 존재하는 옵션에 따른 효과 계산
    if (description) {
        if (description.includes("치명타 피해가")) {
            const critDamageMatch = description.match(/치명타 피해가 ([\d.]+)%/);
            if (critDamageMatch) {
                const value = parseFloat(critDamageMatch[1]) / 100;
                character.stats.critDamageBonus += value;
            }
        }

        if (description.includes("적에게 주는 피해가")) {
            const generalDamageMatch = description.match(/적에게 주는 피해가 ([\d.]+)%/);
            if (generalDamageMatch) {
                const value = parseFloat(generalDamageMatch[1]) / 100;
                character.stats.additionalDamage += value;
            }
        }

        if (description.includes("무력화 상태의 적에게 주는 피해가")) {
            const staggerDamageMatch = description.match(/무력화 상태의 적에게 주는 피해가 ([\d.]+)%/);
            if (staggerDamageMatch) {
                const value = parseFloat(staggerDamageMatch[1]) / 100;
                character.stats.additionalDamage += value;
            }
        }

        if (description.includes("공격 적중 시")) {
            const attackSpeedMatch = description.match(/공격 및 이동 속도가 (\d+)%/);
            if (attackSpeedMatch) {
                const value = parseFloat(attackSpeedMatch[1]) / 100;
                character.stats.additionalDamage += value * 0.5; // 가정된 비율
            }
        }
    }
}

// 팔찌 효과 및 옵션 처리
function handleEffectsAndOptions(effects, character) {
    effects.forEach(effect => {
        const { name, description } = effect;
        if (name || description) {
            applyOptionEffect(name, description, character);
        }
    });
}

// 팔찌 효과 기여도 계산
function calculateBraceletImpact(character) {
    if (!character || !character.accessories || !character.accessories.bracelet) {
        throw new Error("Invalid character data: Missing bracelet information.");
    }

    const originalCharacter = JSON.parse(JSON.stringify(character));
    const braceletEffects = character.accessories.bracelet.effects;

    // 팔찌 포함 딜량 계산
    handleEffectsAndOptions(braceletEffects, character);
    const damageWithBracelet = calculateDamage(character);

    // 팔찌 효과 제거 후 딜량 계산
    const characterWithoutBracelet = JSON.parse(JSON.stringify(originalCharacter));
    characterWithoutBracelet.accessories.bracelet.effects = [];
    const damageWithoutBracelet = calculateDamage(characterWithoutBracelet);

    // 각 옵션별 기여도 계산
    const optionEfficiencies = {};
    braceletEffects.forEach(effect => {
        const modifiedCharacter = JSON.parse(JSON.stringify(originalCharacter));
        const { name, description } = effect;

        const filteredEffects = braceletEffects.filter(e => e !== effect);
        handleEffectsAndOptions(filteredEffects, modifiedCharacter);

        const damageWithoutOption = calculateDamage(modifiedCharacter);

        const efficiency = ((damageWithBracelet - damageWithoutOption) / damageWithBracelet) * 100;
        optionEfficiencies[name || description] = efficiency.toFixed(2);
    });

    // 전체 기여도 계산
    const overallEfficiency =
        ((damageWithBracelet - damageWithoutBracelet) / damageWithoutBracelet) * 100;

    return {
        overallEfficiency: overallEfficiency.toFixed(2),
        optionEfficiencies,
        damageWithBracelet,
        damageWithoutBracelet,
    };
}

// 테스트 데이터
const characterData = {
    "status": 1,
    "name": "쉴틈없이몰아치는펀치공격",
    "job": 22,
    "server": 1,
    "level": 70,
    "members": [
        {
            "name": "쉴틈없이3버블무한유지중",
            "server": 1,
            "job": 61,
            "level": 59,
            "itemLevel": 913.33,
            "maxItemLevel": 1385,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "흔틈",
            "server": 1,
            "job": 62,
            "level": 59,
            "itemLevel": 1370,
            "maxItemLevel": 1370,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "피할틈조차없는비바람번개",
            "server": 1,
            "job": 82,
            "level": 70,
            "itemLevel": 1660,
            "maxItemLevel": 1660,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "빈틈봇",
            "server": 1,
            "job": 83,
            "level": 62,
            "itemLevel": 1620.5,
            "maxItemLevel": 1620.5,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "피할틈없는백발백중명사수",
            "server": 1,
            "job": 51,
            "level": 67,
            "itemLevel": 1590.83,
            "maxItemLevel": 1590.83,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "방구틈",
            "server": 1,
            "job": 21,
            "level": 60,
            "itemLevel": 1370,
            "maxItemLevel": 1370,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "빈틈없이구석구석섹시도발",
            "server": 1,
            "job": 12,
            "level": 60,
            "itemLevel": 1477.5,
            "maxItemLevel": 1477.5,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "피할틈이없는대검대검공격",
            "server": 1,
            "job": 91,
            "level": 60,
            "itemLevel": 1500,
            "maxItemLevel": 1500,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "도화지에빈틈없이먹물칠",
            "server": 1,
            "job": 81,
            "level": 67,
            "itemLevel": 1541.67,
            "maxItemLevel": 1541.67,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "피할틈이없는망치망치공격",
            "server": 1,
            "job": 11,
            "level": 70,
            "itemLevel": 1680.83,
            "maxItemLevel": 1680.83,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "쉴틈없이몰아치는펀치공격",
            "server": 1,
            "job": 22,
            "level": 70,
            "itemLevel": 1680,
            "maxItemLevel": 1680,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        },
        {
            "name": "실틈",
            "server": 1,
            "job": 73,
            "level": 70,
            "itemLevel": 1640.83,
            "maxItemLevel": 1640.83,
            "guild": {
                "name": "빈틈",
                "isOwner": true
            }
        }
    ],
    "itemLevel": 1680,
    "maxItemLevel": 1680,
    "expeditionLevel": 267,
    "wisdom": {
        "name": "틈가",
        "level": 70
    },
    "guild": {
        "name": "빈틈",
        "isOwner": true
    },
    "title": "이클립스",
    "pvpGrade": "11급",
    "image": "https://img.lostark.co.kr/armory/7/00B616C7FB23D0BC2749444844A96ACF4110A3B5A7284AC3754A5C82C95D1A50.jpg?v=20250110212753",
    "stats": {
        "atkPower": {
            "value": 101196,
            "default": 91872,
            "effect": 9324
        },
        "maxHp": {
            "value": 313506,
            "stamina": 176787,
            "vitality": 43.53
        },
        "crit": {
            "value": 1834,
            "expedition": 28,
            "effects": [
                "치명타 적중률이 65.64% 증가합니다."
            ]
        },
        "specialization": {
            "value": 72,
            "expedition": 32,
            "effects": [
                "권왕태세 시 충격 스킬의 피해량이 6.64% 증가합니다.",
                "권왕태세 시 기력 스킬의 피해량이 4.12% 증가합니다.",
                "투지 에너지 회복량이 2.88% 증가합니다.",
                "각성 스킬의 피해량이 1.57% 증가합니다."
            ]
        },
        "domination": {
            "value": 79,
            "expedition": 36,
            "effects": [
                "피격이상 및 상태이상 대상에게 주는 피해량이 4.84% 증가합니다.",
                "무력화 대상에게 주는 피해량이  증가합니다."
            ]
        },
        "swiftness": {
            "value": 570,
            "expedition": 28,
            "effects": [
                "공격 속도가 9.79% 증가합니다.",
                "이동 속도가 9.79% 증가합니다.",
                "스킬 재사용 대기시간이 12.24% 감소합니다."
            ]
        },
        "endurance": {
            "value": 69,
            "expedition": 28,
            "effects": [
                "물리 방어력이 5.64% 증가합니다.",
                "마법 방어력이 5.64% 증가합니다.",
                "보호막 효과가 1.76% 증가합니다.",
                "생명력 회복 효과가 2.46% 증가합니다."
            ]
        },
        "expertise": {
            "value": 71,
            "expedition": 28,
            "effects": [
                "상태이상 공격 지속시간이 3.04% 증가합니다.",
                "상태이상 피해 지속시간이 2.54% 감소합니다.",
                "무력화 피해량이 2.03% 증가합니다."
            ]
        }
    },
    "engravings": [
        {
            "name": "결투의 대가",
            "grade": 5,
            "level": 0,
            "abilityStoneLevel": 2,
            "description": "적에게 주는 피해가 8.20% 증가하며, 헤드어택 성공 시 피해량이 추가로 15.00% 증가한다."
        },
        {
            "name": "돌격대장",
            "grade": 5,
            "level": 0,
            "abilityStoneLevel": 0,
            "description": "이동속도 증가량의 40.00% 만큼 적에게 주는 피해량이 증가한다."
        },
        {
            "name": "원한",
            "grade": 5,
            "level": 0,
            "abilityStoneLevel": 2,
            "description": "보스 및 레이드 몬스터에게 주는 피해가 21.75% 증가하지만, 받는 피해가 20.00% 증가한다."
        },
        {
            "name": "예리한 둔기",
            "grade": 5,
            "level": 0,
            "abilityStoneLevel": 0,
            "description": "치명타 피해량이 44.00% 증가하지만, 공격 시 일정 확률로 20.00% 감소된 피해를 준다."
        },
        {
            "name": "아드레날린",
            "grade": 5,
            "level": 0,
            "abilityStoneLevel": 0,
            "description": "이동기 및 기본공격을 제외한 스킬 사용 후 6초 동안 공격력이 0.90% 증가하며 (최대 6중첩) 해당 효과가 최대 중첩 도달 시 치명타 적중률이 추가로 14.00% 증가한다. 해당 효과는 스킬 취소에 따른 재사용 대기시간 감소가 적용되는 경우, 스킬 종료 후 적용된다."
        }
    ],
    "equipments": {
        "hat": {
            "name": "신념의 업화 머리장식",
            "type": 1,
            "grade": 6,
            "tier": 4,
            "icon": "efui_iconatlas/ifm_item/ifm_item_31.png",
            "itemLevel": 1680,
            "quality": 88,
            "reinforce": 16,
            "advancedReinforce": 10,
            "basicEffects": {
                "physicalDefensive": 6610,
                "magicDefensive": 7344,
                "strength": 51941,
                "agility": 0,
                "intelligence": 0,
                "stamina": 6390,
                "weaponPower": 0
            },
            "bonusEffects": {
                "vitality": 1085,
                "additionalDamage": 0
            },
            "arkPassivePointEffects": {
                "evolution": 0
            },
            "setEffect": null,
            "esther": null,
            "elixir": {
                "type": "지혜의 엘릭서",
                "effects": [
                    {
                        "type": "공용",
                        "name": "자원의 축복",
                        "level": 3
                    },
                    {
                        "type": "투구",
                        "name": "회심 (질서)",
                        "level": 5
                    }
                ]
            },
            "transcendence": {
                "phase": 7,
                "point": 20,
                "basicEffects": {
                    "strength": 5880,
                    "agility": 0,
                    "intelligence": 0,
                    "weaponPower": 0
                }
            },
            "durability": {
                "value": 51,
                "maxValue": 66
            }
        },
        "ornaments": {
            "name": "신념의 업화 견갑",
            "type": 2,
            "grade": 6,
            "tier": 4,
            "icon": "efui_iconatlas/ifm_item/ifm_item_27.png",
            "itemLevel": 1680,
            "quality": 92,
            "reinforce": 16,
            "advancedReinforce": 10,
            "basicEffects": {
                "physicalDefensive": 7344,
                "magicDefensive": 6610,
                "strength": 55281,
                "agility": 0,
                "intelligence": 0,
                "stamina": 5538,
                "weaponPower": 0
            },
            "bonusEffects": {
                "vitality": 1185,
                "additionalDamage": 0
            },
            "arkPassivePointEffects": {
                "evolution": 0
            },
            "setEffect": null,
            "esther": null,
            "elixir": {
                "type": "지혜의 엘릭서",
                "effects": [
                    {
                        "type": "어깨",
                        "name": "보스 피해",
                        "level": 5
                    },
                    {
                        "type": "공용",
                        "name": "공격력",
                        "level": 2
                    }
                ]
            },
            "transcendence": {
                "phase": 7,
                "point": 20,
                "basicEffects": {
                    "strength": 5880,
                    "agility": 0,
                    "intelligence": 0,
                    "weaponPower": 0
                }
            },
            "durability": {
                "value": 49,
                "maxValue": 62
            }
        },
        "top": {
            "name": "신념의 업화 상의",
            "type": 3,
            "grade": 6,
            "tier": 4,
            "icon": "efui_iconatlas/ifm_item/ifm_item_30.png",
            "itemLevel": 1680,
            "quality": 100,
            "reinforce": 16,
            "advancedReinforce": 10,
            "basicEffects": {
                "physicalDefensive": 8813,
                "magicDefensive": 8079,
                "strength": 41554,
                "agility": 0,
                "intelligence": 0,
                "stamina": 8519,
                "weaponPower": 0
            },
            "bonusEffects": {
                "vitality": 1400,
                "additionalDamage": 0
            },
            "arkPassivePointEffects": {
                "evolution": 0
            },
            "setEffect": null,
            "esther": null,
            "elixir": {
                "type": "지혜의 엘릭서",
                "effects": [
                    {
                        "type": "공용",
                        "name": "공격력",
                        "level": 5
                    },
                    {
                        "type": "상의",
                        "name": "최대 생명력",
                        "level": 5
                    }
                ]
            },
            "transcendence": {
                "phase": 7,
                "point": 20,
                "basicEffects": {
                    "strength": 5880,
                    "agility": 0,
                    "intelligence": 0,
                    "weaponPower": 0
                }
            },
            "durability": {
                "value": 69,
                "maxValue": 84
            }
        },
        "pants": {
            "name": "신념의 업화 하의",
            "type": 4,
            "grade": 6,
            "tier": 4,
            "icon": "efui_iconatlas/ifm_item/ifm_item_28.png",
            "itemLevel": 1680,
            "quality": 96,
            "reinforce": 16,
            "advancedReinforce": 10,
            "basicEffects": {
                "physicalDefensive": 8079,
                "magicDefensive": 8813,
                "strength": 44892,
                "agility": 0,
                "intelligence": 0,
                "stamina": 7243,
                "weaponPower": 0
            },
            "bonusEffects": {
                "vitality": 1291,
                "additionalDamage": 0
            },
            "arkPassivePointEffects": {
                "evolution": 0
            },
            "setEffect": null,
            "esther": null,
            "elixir": {
                "type": "지혜의 엘릭서",
                "effects": [
                    {
                        "type": "공용",
                        "name": "공격력",
                        "level": 4
                    },
                    {
                        "type": "하의",
                        "name": "치명타 피해",
                        "level": 5
                    }
                ]
            },
            "transcendence": {
                "phase": 7,
                "point": 20,
                "basicEffects": {
                    "strength": 5880,
                    "agility": 0,
                    "intelligence": 0,
                    "weaponPower": 0
                }
            },
            "durability": {
                "value": 63,
                "maxValue": 76
            }
        },
        "gloves": {
            "name": "신념의 업화 장갑",
            "type": 5,
            "grade": 6,
            "tier": 4,
            "icon": "efui_iconatlas/ifm_item/ifm_item_24.png",
            "itemLevel": 1680,
            "quality": 90,
            "reinforce": 16,
            "advancedReinforce": 10,
            "basicEffects": {
                "physicalDefensive": 5876,
                "magicDefensive": 5876,
                "strength": 62329,
                "agility": 0,
                "intelligence": 0,
                "stamina": 4259,
                "weaponPower": 0
            },
            "bonusEffects": {
                "vitality": 1134,
                "additionalDamage": 0
            },
            "arkPassivePointEffects": {
                "evolution": 0
            },
            "setEffect": null,
            "esther": null,
            "elixir": {
                "type": "지혜의 엘릭서",
                "effects": [
                    {
                        "type": "공용",
                        "name": "방랑자",
                        "level": 2
                    },
                    {
                        "type": "장갑",
                        "name": "회심 (혼돈)",
                        "level": 5
                    }
                ]
            },
            "transcendence": {
                "phase": 7,
                "point": 20,
                "basicEffects": {
                    "strength": 5880,
                    "agility": 0,
                    "intelligence": 0,
                    "weaponPower": 0
                }
            },
            "durability": {
                "value": 46,
                "maxValue": 59
            }
        },
        "weapon": {
            "name": "운명의 결단 헤비 건틀릿",
            "type": 6,
            "grade": 5,
            "tier": 4,
            "icon": "efui_iconatlas/if_item/if_item_01_228.png",
            "itemLevel": 1680,
            "quality": 97,
            "reinforce": 16,
            "advancedReinforce": 10,
            "basicEffects": {
                "physicalDefensive": 0,
                "magicDefensive": 0,
                "strength": 0,
                "agility": 0,
                "intelligence": 0,
                "stamina": 0,
                "weaponPower": 90032
            },
            "bonusEffects": {
                "vitality": 0,
                "additionalDamage": 28.82
            },
            "arkPassivePointEffects": {
                "evolution": 0
            },
            "setEffect": null,
            "esther": null,
            "elixir": null,
            "transcendence": {
                "phase": 7,
                "point": 21,
                "basicEffects": {
                    "strength": 0,
                    "agility": 0,
                    "intelligence": 0,
                    "weaponPower": 2940
                }
            },
            "durability": {
                "value": 70,
                "maxValue": 175
            }
        },
        "elixirSetEffects": [
            {
                "name": "회심",
                "phases": [
                    {
                        "phase": 1,
                        "enabled": true
                    },
                    {
                        "phase": 2,
                        "enabled": true
                    }
                ]
            }
        ]
    },
    "accessories": {
        "necklace": {
            "name": "도래한 결전의 목걸이",
            "type": 1,
            "grade": 6,
            "tier": 4,
            "quality": 88,
            "icon": "efui_iconatlas/acc/acc_215.png",
            "itemLevel": 1680,
            "tradeRemainCount": 0,
            "basicEffects": {
                "strength": 16170,
                "agility": 0,
                "intelligence": 0,
                "stamina": 4086
            },
            "bonusEffects": {
                "critical": 0,
                "specialization": 0,
                "domination": 0,
                "swiftness": 0,
                "endurance": 0,
                "expertise": 0
            },
            "engraveEffects": [],
            "enforceEffects": [
                "적에게 주는 피해 +1.20%",
                "무기 공격력 +480",
                "공격력 +80"
            ],
            "arkPassivePointEffects": {
                "realization": 13
            }
        },
        "earring1": {
            "name": "도래한 결전의 귀걸이",
            "type": 2,
            "grade": 6,
            "tier": 4,
            "quality": 94,
            "icon": "efui_iconatlas/acc/acc_115.png",
            "itemLevel": 1680,
            "tradeRemainCount": 0,
            "basicEffects": {
                "strength": 13535,
                "agility": 0,
                "intelligence": 0,
                "stamina": 2894
            },
            "bonusEffects": {
                "critical": 0,
                "specialization": 0,
                "domination": 0,
                "swiftness": 0,
                "endurance": 0,
                "expertise": 0
            },
            "engraveEffects": [],
            "enforceEffects": [
                "공격력 +80",
                "공격력 +0.40%",
                "파티원 회복 효과 +0.95%"
            ],
            "arkPassivePointEffects": {
                "realization": 12
            }
        },
        "earring2": {
            "name": "도래한 결전의 귀걸이",
            "type": 2,
            "grade": 6,
            "tier": 4,
            "quality": 79,
            "icon": "efui_iconatlas/acc/acc_115.png",
            "itemLevel": 1680,
            "tradeRemainCount": 0,
            "basicEffects": {
                "strength": 12806,
                "agility": 0,
                "intelligence": 0,
                "stamina": 2755
            },
            "bonusEffects": {
                "critical": 0,
                "specialization": 0,
                "domination": 0,
                "swiftness": 0,
                "endurance": 0,
                "expertise": 0
            },
            "engraveEffects": [],
            "enforceEffects": [
                "공격력 +1.55%",
                "최대 생명력 +1300",
                "무기 공격력 +195"
            ],
            "arkPassivePointEffects": {
                "realization": 12
            }
        },
        "ring1": {
            "name": "도래한 결전의 반지",
            "type": 3,
            "grade": 6,
            "tier": 4,
            "quality": 87,
            "icon": "efui_iconatlas/acc/acc_22.png",
            "itemLevel": 1680,
            "tradeRemainCount": 0,
            "basicEffects": {
                "strength": 11543,
                "agility": 0,
                "intelligence": 0,
                "stamina": 2338
            },
            "bonusEffects": {
                "critical": 0,
                "specialization": 0,
                "domination": 0,
                "swiftness": 0,
                "endurance": 0,
                "expertise": 0
            },
            "engraveEffects": [],
            "enforceEffects": [
                "치명타 피해 +1.10%",
                "최대 생명력 +3250",
                "상태이상 공격 지속시간 +1.00%"
            ],
            "arkPassivePointEffects": {
                "realization": 12
            }
        },
        "ring2": {
            "name": "도래한 결전의 반지",
            "type": 3,
            "grade": 6,
            "tier": 4,
            "quality": 84,
            "icon": "efui_iconatlas/acc/acc_22.png",
            "itemLevel": 1680,
            "tradeRemainCount": 0,
            "basicEffects": {
                "strength": 11814,
                "agility": 0,
                "intelligence": 0,
                "stamina": 2270
            },
            "bonusEffects": {
                "critical": 0,
                "specialization": 0,
                "domination": 0,
                "swiftness": 0,
                "endurance": 0,
                "expertise": 0
            },
            "engraveEffects": [],
            "enforceEffects": [
                "아군 공격력 강화 효과 +3.00%",
                "무기 공격력 +480",
                "치명타 피해 +4.00%"
            ],
            "arkPassivePointEffects": {
                "realization": 12
            }
        },
        "bracelet": {
            "name": "찬란한 구원자의 팔찌",
            "grade": 6,
            "tier": 4,
            "icon": "efui_iconatlas/acc/acc_327.png",
            "itemLevel": 1680,
            "assignRemainCount": 0,
            "effects": [
                {
                    "name": "치명",
                    "value": 105,
                    "description": null,
                    "isLocked": true
                },
                {
                    "name": "체력",
                    "value": 4620,
                    "description": null,
                    "isLocked": true
                },
                {
                    "name": "",
                    "value": -1,
                    "description": "치명타 피해 +8.40%",
                    "isLocked": true
                },
                {
                    "name": "",
                    "value": -1,
                    "description": "치명타 적중률 +4.20%",
                    "isLocked": true
                },
                {
                    "name": "힘",
                    "value": 14592,
                    "description": null,
                    "isLocked": false
                }
            ]
        },
        "abilityStone": {
            "name": "준엄한 비상의 돌",
            "grade": 6,
            "tier": 3,
            "icon": "efui_iconatlas/ability/ability_257.png",
            "basicEffects": {
                "stamina": 21326
            },
            "bonusEffects": {
                "stamina": 1067
            },
            "engraveEffects": []
        }
    },
    "avatars": {
        "weapon": {
            "name": "6주년 여정 헤비 건틀릿",
            "icon": "efui_iconatlas/shop_icon/shop_icon_9115.png",
            "type": 1,
            "grade": 3,
            "availableFor": "브레이커 전용",
            "tradeRemainCount": 3,
            "basicEffect": "힘 +1.00%",
            "tendencies": {
                "intellect": 0,
                "courage": 0,
                "charm": 10,
                "kindness": 5
            }
        },
        "weaponOvercoat": null,
        "instrument": null,
        "hat": {
            "name": "6주년 여정 머리",
            "icon": "efui_iconatlas/shop_icon/shop_icon_9005.png",
            "type": 3,
            "grade": 3,
            "availableFor": "무도가(남)계열",
            "tradeRemainCount": 3,
            "basicEffect": "힘 +1.00%",
            "tendencies": {
                "intellect": 0,
                "courage": 0,
                "charm": 15,
                "kindness": 0
            }
        },
        "hatOvercoat": null,
        "face1": {
            "name": "6주년 여정 얼굴1",
            "icon": "efui_iconatlas/shop_icon/shop_icon_9008.png",
            "type": 4,
            "grade": 3,
            "availableFor": "무도가(남)계열",
            "tradeRemainCount": 3,
            "basicEffect": null,
            "tendencies": {
                "intellect": 0,
                "courage": 0,
                "charm": 5,
                "kindness": 0
            }
        },
        "face2": {
            "name": "6주년 여정 얼굴2",
            "icon": "efui_iconatlas/shop_icon/shop_icon_9009.png",
            "type": 5,
            "grade": 3,
            "availableFor": "무도가(남)계열",
            "tradeRemainCount": 3,
            "basicEffect": null,
            "tendencies": {
                "intellect": 0,
                "courage": 0,
                "charm": 0,
                "kindness": 5
            }
        },
        "top": {
            "name": "6주년 여정 상의",
            "icon": "efui_iconatlas/shop_icon/shop_icon_9006.png",
            "type": 6,
            "grade": 3,
            "availableFor": "무도가(남)계열",
            "tradeRemainCount": 3,
            "basicEffect": "힘 +1.00%",
            "tendencies": {
                "intellect": 0,
                "courage": 0,
                "charm": 0,
                "kindness": 20
            }
        },
        "topOvercoat": null,
        "pants": {
            "name": "6주년 여정 하의",
            "icon": "efui_iconatlas/shop_icon/shop_icon_9007.png",
            "type": 7,
            "grade": 3,
            "availableFor": "무도가(남)계열",
            "tradeRemainCount": 3,
            "basicEffect": "힘 +1.00%",
            "tendencies": {
                "intellect": 0,
                "courage": 0,
                "charm": 20,
                "kindness": 0
            }
        },
        "pantsOvercoat": null,
        "trails": {
            "name": "베히모스의 폭풍우 이동 효과",
            "icon": "efui_iconatlas/moving_effect/moving_effect_33.png",
            "type": 8,
            "grade": 3,
            "availableFor": "무도가(남)계열",
            "tradeRemainCount": 0,
            "basicEffect": null,
            "tendencies": {
                "intellect": 0,
                "courage": 0,
                "charm": 0,
                "kindness": 0
            }
        },
        "skin": null
    },
    "jewels": [
        {
            "name": "7레벨 겁화의 보석",
            "grade": 4,
            "type": 1,
            "level": 7,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_102.png",
            "itemLevel": 1640,
            "isTradable": true,
            "job": 22,
            "skill": "유성 낙하",
            "effects": [
                "피해 32.00% 증가"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.6
            }
        },
        {
            "name": "7레벨 작열의 보석",
            "grade": 4,
            "type": 2,
            "level": 7,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_112.png",
            "itemLevel": 1640,
            "isTradable": true,
            "job": 22,
            "skill": "진 파공권",
            "effects": [
                "재사용 대기시간 18.00% 감소"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.6
            }
        },
        {
            "name": "6레벨 작열의 보석 (귀속)",
            "grade": 4,
            "type": 2,
            "level": 6,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_174.png",
            "itemLevel": 1640,
            "isTradable": false,
            "job": 22,
            "skill": "척결",
            "effects": [
                "재사용 대기시간 16.00% 감소"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.45
            }
        },
        {
            "name": "6레벨 겁화의 보석 (귀속)",
            "grade": 4,
            "type": 1,
            "level": 6,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_173.png",
            "itemLevel": 1640,
            "isTradable": false,
            "job": 22,
            "skill": "척결",
            "effects": [
                "피해 28.00% 증가"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.45
            }
        },
        {
            "name": "8레벨 겁화의 보석",
            "grade": 5,
            "type": 1,
            "level": 8,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_103.png",
            "itemLevel": 1640,
            "isTradable": true,
            "job": 22,
            "skill": "수라결 기본 공격",
            "effects": [
                "피해 36.00% 증가"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.8
            }
        },
        {
            "name": "8레벨 겁화의 보석",
            "grade": 5,
            "type": 1,
            "level": 8,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_103.png",
            "itemLevel": 1640,
            "isTradable": true,
            "job": 22,
            "skill": "진 파공권",
            "effects": [
                "피해 36.00% 증가"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.8
            }
        },
        {
            "name": "8레벨 겁화의 보석",
            "grade": 5,
            "type": 1,
            "level": 8,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_103.png",
            "itemLevel": 1640,
            "isTradable": true,
            "job": 22,
            "skill": "파천섬광",
            "effects": [
                "피해 36.00% 증가"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.8
            }
        },
        {
            "name": "6레벨 작열의 보석",
            "grade": 4,
            "type": 2,
            "level": 6,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_111.png",
            "itemLevel": 1640,
            "isTradable": true,
            "job": 22,
            "skill": "비뢰격",
            "effects": [
                "재사용 대기시간 16.00% 감소"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.45
            }
        },
        {
            "name": "6레벨 겁화의 보석 (귀속)",
            "grade": 4,
            "type": 1,
            "level": 6,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_173.png",
            "itemLevel": 1640,
            "isTradable": false,
            "job": 22,
            "skill": "비상격",
            "effects": [
                "피해 28.00% 증가"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.45
            }
        },
        {
            "name": "6레벨 작열의 보석",
            "grade": 4,
            "type": 2,
            "level": 6,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_111.png",
            "itemLevel": 1640,
            "isTradable": true,
            "job": 22,
            "skill": "권왕의 진격",
            "effects": [
                "재사용 대기시간 16.00% 감소"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.45
            }
        },
        {
            "name": "6레벨 작열의 보석 (귀속)",
            "grade": 4,
            "type": 2,
            "level": 6,
            "tier": 4,
            "icon": "efui_iconatlas/use/use_12_174.png",
            "itemLevel": 1640,
            "isTradable": false,
            "job": 22,
            "skill": "파천섬광",
            "effects": [
                "재사용 대기시간 16.00% 감소"
            ],
            "bonusEffects": {
                "defaultAtkPower": 0.45
            }
        }
    ],
    "cards": [
        {
            "name": "샨디",
            "grade": 5,
            "image": "efui_iconatlas/card_legend/card_legend_00_4.png",
            "awake": 5,
            "maxAwake": 5,
            "cardSets": [
                "세상을 구하는 빛"
            ]
        },
        {
            "name": "아제나&이난나",
            "grade": 5,
            "image": "efui_iconatlas/card_legend/card_legend_02_0.png",
            "awake": 5,
            "maxAwake": 5,
            "cardSets": [
                "세상을 구하는 빛"
            ]
        },
        {
            "name": "니나브",
            "grade": 5,
            "image": "efui_iconatlas/card_legend/card_legend_02_6.png",
            "awake": 5,
            "maxAwake": 5,
            "cardSets": [
                "세상을 구하는 빛"
            ]
        },
        {
            "name": "바훈투르",
            "grade": 5,
            "image": "efui_iconatlas/card_legend/card_legend_02_1.png",
            "awake": 5,
            "maxAwake": 5,
            "cardSets": [
                "세상을 구하는 빛"
            ]
        },
        {
            "name": "카단",
            "grade": 5,
            "image": "efui_iconatlas/card_legend/card_legend_02_7.png",
            "awake": 5,
            "maxAwake": 5,
            "cardSets": [
                "세상을 구하는 빛"
            ]
        },
        {
            "name": "실리안",
            "grade": 5,
            "image": "efui_iconatlas/card_legend/card_legend_00_1.png",
            "awake": 5,
            "maxAwake": 5,
            "cardSets": [
                "세상을 구하는 빛"
            ]
        }
    ],
    "cardSets": [
        {
            "name": "세상을 구하는 빛",
            "effects": [
                {
                    "cardCount": 2,
                    "awakeCount": 0,
                    "description": "암속성 피해 감소 +10.00%"
                },
                {
                    "cardCount": 4,
                    "awakeCount": 0,
                    "description": "암속성 피해 감소 +10.00%"
                },
                {
                    "cardCount": 6,
                    "awakeCount": 0,
                    "description": "암속성 피해 감소 +10.00%"
                },
                {
                    "cardCount": 6,
                    "awakeCount": 12,
                    "description": "공격 속성을 성속성으로 변환"
                },
                {
                    "cardCount": 6,
                    "awakeCount": 18,
                    "description": "성속성 피해 +7.00%"
                },
                {
                    "cardCount": 6,
                    "awakeCount": 24,
                    "description": "성속성 피해 +4.00%"
                },
                {
                    "cardCount": 6,
                    "awakeCount": 30,
                    "description": "성속성 피해 +4.00%"
                }
            ]
        }
    ],
    "skillPoint": {
        "value": 386,
        "maxValue": 480
    },
    "skills": [
        {
            "name": "대지파쇄권",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_16.png",
            "type": "[충격 스킬]",
            "castType": "일반",
            "level": 11,
            "isMaxLevel": false,
            "cooldown": 20,
            "resource": "충격 35 소모, 기력 25 생성",
            "description": "헤비 건틀릿으로 지면을 강타하며 주변으로 충격파를 발생시켜 323,175, 1,293,303의 피해를 주고 적중된 적을 날려버린다.",
            "effects": {
                "attackType": null,
                "counter": false,
                "neutralization": "중상",
                "destruction": 1,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 2,
                    "name": "재빠른 손놀림",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_41.png",
                    "description": "공격 속도가 27.0% 증가한다."
                },
                {
                    "tier": 2,
                    "slot": 3,
                    "name": "견고한 움직임",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_25.png",
                    "description": "스킬 사용 중 받는 피해가 50.0% 감소하고 지면을 내려치는 횟수가 2회 증가하며 적에게 주는 피해가 40.0% 증가한다."
                },
                {
                    "tier": 3,
                    "slot": 2,
                    "name": "대격변",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_3_7.png",
                    "description": "공격 범위가 30.0% 증가하고 시드 이하 몬스터에게 주는 피해가 130.0% 증가한다."
                }
            ],
            "rune": {
                "name": "질풍",
                "grade": 4,
                "icon": "efui_iconatlas/use/use_7_194.png",
                "effect": "스킬 시전 속도가 14% 증가"
            }
        },
        {
            "name": "유성 낙하",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_7.png",
            "type": "[기력 스킬]",
            "castType": "지점",
            "level": 11,
            "isMaxLevel": false,
            "cooldown": 14,
            "resource": "기력 25 소모, 충격 20 생성",
            "description": "헤비 건틀릿에 에너지 모아 10m 내 지정한 위치로 도약하여 지면을 내려쳐 적중된 적에게 918,343의 피해를 주고 넘어뜨린다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "중상",
                "destruction": 1,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 3,
                    "name": "집중",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_37.png",
                    "description": "충격 생성량이 15 증가한다."
                },
                {
                    "tier": 2,
                    "slot": 2,
                    "name": "불 주먹",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_13.png",
                    "description": "[화] 속성으로 변경된다. 적에게 공격 적중 시 5.0초간 화상 상태로 만들어 매 초마다 27,537의 피해를 입히며 적에게 주는 피해가 80.0% 증가한다."
                },
                {
                    "tier": 3,
                    "slot": 1,
                    "name": "십자 분쇄",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_3_40.png",
                    "description": "내려찍는 공격 시 지면이 십자 형태로 분쇄되며 1.0초 뒤 분쇄된 지면이 폭발하며 추가 공격을 하며 적에게 주는 최대 피해가 80.0% 증가한다. 재사용 대기시간이 10.0초 증가한다."
                }
            ],
            "rune": {
                "name": "질풍",
                "grade": 3,
                "icon": "efui_iconatlas/use/use_7_194.png",
                "effect": "스킬 시전 속도가 12% 증가"
            }
        },
        {
            "name": "천기심권",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_20.png",
            "type": "[충격 스킬]",
            "castType": "일반",
            "level": 11,
            "isMaxLevel": false,
            "cooldown": 24,
            "resource": "충격 40 소모, 기력 35 생성",
            "description": "주먹을 쥐고 자세를 잡은 뒤 집중을 하며 주변에 4개의 포스 건틀릿을 생성한 뒤 헤비 건틀릿으로 전방을 타격하면서 316,073의 피해를 주고, 동시에 모든 포스 건틀릿이 직선 방향으로 발사되며 316,073의 피해를 4회 준다.",
            "effects": {
                "attackType": null,
                "counter": false,
                "neutralization": "중상",
                "destruction": 0,
                "pushImmunity": false,
                "paralysisImmunity": false,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 2,
                    "name": "재빠른 손놀림",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_41.png",
                    "description": "공격 속도가 27.0% 증가한다."
                },
                {
                    "tier": 2,
                    "slot": 3,
                    "name": "공간 장악",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_82.png",
                    "description": "직접 공격을 하지 않고 포스 건틀릿을 소환해 순차적으로 1개씩 총 4회 발사하며 적에게 주는 피해가 최대 65.0% 증가한다."
                },
                {
                    "tier": 3,
                    "slot": 2,
                    "name": "광풍권",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_3_16.png",
                    "description": "휘몰아치는 바람의 기운을 생성하여 공격한다. 불규칙적인 움직임으로 교차되어 전방으로 뻗어나가며 공격 범위가 40% 증가하고 적에게 주는 피해가 80.0% 증가한다."
                }
            ],
            "rune": {
                "name": "질풍",
                "grade": 2,
                "icon": "efui_iconatlas/use/use_7_194.png",
                "effect": "스킬 시전 속도가 8% 증가"
            }
        },
        {
            "name": "청월난무",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_18.png",
            "type": "[충격 스킬]",
            "castType": "일반",
            "level": 11,
            "isMaxLevel": false,
            "cooldown": 18,
            "resource": "충격 40 소모, 기력 35 생성",
            "description": "포스 건틀릿을 생성해 전방으로 내지르며 에너지를 회전시켜 175,265의 피해를 4회 입히고 피격이상 중인 적 공격 시 공중에 띄운다. 이후, 회전중인 에너지를 폭발시키며 468,217의 피해를 입히고 적을 날려버린다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "중상",
                "destruction": 0,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 2,
                    "name": "재빠른 손놀림",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_41.png",
                    "description": "공격 속도가 15.0% 증가한다."
                },
                {
                    "tier": 2,
                    "slot": 3,
                    "name": "지면 강타",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_42.png",
                    "description": "홀딩 조작으로 변경된다. 더 이상 헤드 어택이 적용되지 않고 바닥을 내려찍는 공격으로 변경된다. 바닥이 회전력에 의해 갈려나가며 캐릭터 주위 6.0m 범위에 지속적으로 피해를 주고 시드 이하 몬스터에게 주는 피해가 100.0% 증가한다."
                },
                {
                    "tier": 3,
                    "slot": 1,
                    "name": "회전 가속",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_3_71.png",
                    "description": "회전력을 가속시켜 타격당 2회 피해를 입히고 적에게 주는 피해가 120.0% 증가한다."
                }
            ],
            "rune": {
                "name": "질풍",
                "grade": 4,
                "icon": "efui_iconatlas/use/use_7_194.png",
                "effect": "스킬 시전 속도가 14% 증가"
            }
        },
        {
            "name": "파천섬광",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_21.png",
            "type": "[충격 스킬]",
            "castType": "일반",
            "level": 11,
            "isMaxLevel": false,
            "cooldown": 40,
            "resource": "충격 50 소모, 기력 40 생성",
            "description": "전방을 타격할 준비 자세를 취한 뒤 포스 건틀릿을 생성시키며 일정 시간동안 에너지를 모은 후 빛의 속도로 전방 상단을 타격해 3,093,359의 피해를 주고 적을 날려버린다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "최상",
                "destruction": 2,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 3,
                    "name": "에너지 순환",
                    "level": 1,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_37.png",
                    "description": "스킬 사용 후 5초 동안 1초마다 기력 및 충격 에너지가 3씩 생성된다."
                },
                {
                    "tier": 2,
                    "slot": 2,
                    "name": "초근접 타격",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_8.png",
                    "description": "공격 범위가 20.0% 감소하지만 공격 준비 시간이 0.5초 짧아지며 적에게 주는 피해가 75.0% 증가한다."
                },
                {
                    "tier": 3,
                    "slot": 2,
                    "name": "전천극",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_3_6.png",
                    "description": "재사용 대기시간이 10.0초 감소하며 전방을 향해 순간적으로 강하게 휘두르는 공격으로 변경되고 공격 거리가 4.0m 늘어나며 적에게 주는 피해가 120.0% 증가한다."
                }
            ],
            "rune": {
                "name": "질풍",
                "grade": 3,
                "icon": "efui_iconatlas/use/use_7_194.png",
                "effect": "스킬 시전 속도가 12% 증가"
            }
        },
        {
            "name": "금강난격",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_11.png",
            "type": "[기력 스킬]",
            "castType": "콤보",
            "level": 10,
            "isMaxLevel": false,
            "cooldown": 16,
            "resource": "기력 20 소모, 충격 50 생성",
            "description": "전방으로 이동하며 뒤를 돌아 헤비 건틀릿의 바깥쪽으로 공격하며 125,843의 피해를 준 뒤, 다시 반대로 돌아 한번 더 공격하여 125,843의 피해를 주고 피격이상 중인 적 공격 시 공중에 띄운다. 공격 중 추가 키 입력 시 전방으로 주먹을 강하게 내지르며 251,690의 피해를 주고 피격이상 중인 적을 날려버린다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "중",
                "destruction": 0,
                "pushImmunity": false,
                "paralysisImmunity": false,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 1,
                    "name": "분노의 타격",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_0.png",
                    "description": "적에게 주는 피해가 15.0% 증가한다."
                },
                {
                    "tier": 2,
                    "slot": 2,
                    "name": "암영타",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_174.png",
                    "description": "충격 생성량이 15 증가하고 마지막 공격 시작 0.5초 이후에 그림자가 나타나 1회 공격하여 적에게 주는 피해가 60% 증가한다."
                },
                {
                    "tier": 3,
                    "slot": 2,
                    "name": "필살격",
                    "level": 4,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_3_17.png",
                    "description": "공격 속도가 20.0% 증가하고 피격이상 면역인 적에게 주는 피해가 72.5% 증가한다."
                }
            ],
            "rune": {
                "name": "속행",
                "grade": 4,
                "icon": "efui_iconatlas/use/use_7_196.png",
                "effect": "스킬 사용 시 일정 확률로 전체 재사용 대기 시간이 16% 감소"
            }
        },
        {
            "name": "백렬권",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_10.png",
            "type": "[기력 스킬]",
            "castType": "홀딩",
            "level": 10,
            "isMaxLevel": false,
            "cooldown": 16,
            "resource": "기력 15 소모, 충격 50 생성",
            "description": "헤비 건틀릿으로 전방을 타격하여 58,807의 피해를 준 뒤, 홀딩 시 39,323의 피해를 주는 빠른 잽 공격을 최대 6회 타격 한다. 잽 공격이 종료되면 마무리 공격을 하며 117,879, 176,859 피해를 준다. 피격이상 중인 적 공격 시 공중에 띄운다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "중",
                "destruction": 0,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 1,
                    "name": "넓은 타격",
                    "level": 1,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_7.png",
                    "description": "공격 범위가 20.0% 증가한다."
                },
                {
                    "tier": 2,
                    "slot": 2,
                    "name": "빠른 판단",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_88.png",
                    "description": "잽을 양손으로 공격하며 적에게 주는 피해가 최대 55.0% 증가한다."
                },
                {
                    "tier": 3,
                    "slot": 2,
                    "name": "다재다능",
                    "level": 1,
                    "isMaxLevel": false,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_3_50.png",
                    "description": "공격 속도가 10.0%, 충격 생성량이 1, 투지 에너지 획득량이 30.0%, 무력화 피해가 20.0%, 적에게 주는 피해가 65.0% 증가하고 마지막 타격에 부위파괴 1 레벨이 부여된다."
                }
            ],
            "rune": {
                "name": "질풍",
                "grade": 2,
                "icon": "efui_iconatlas/use/use_7_194.png",
                "effect": "스킬 시전 속도가 8% 증가"
            }
        },
        {
            "name": "권왕의 진격",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_4.png",
            "type": "[기력 스킬]",
            "castType": "일반",
            "level": 7,
            "isMaxLevel": false,
            "cooldown": 8,
            "resource": "기력 10 소모, 충격 20 생성",
            "description": "전방으로 6m 이동하며 67,891의 피해를 3회 준 뒤, 헤비 건틀릿으로 내려찍으며 135,947의 피해를 준다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "하",
                "destruction": 1,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [
                {
                    "tier": 1,
                    "slot": 2,
                    "name": "탁월한 기동성",
                    "level": 5,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_1_10.png",
                    "description": "돌진 거리가 5.0m 증가한다."
                },
                {
                    "tier": 2,
                    "slot": 2,
                    "name": "강인한 주먹",
                    "level": 1,
                    "isMaxLevel": true,
                    "icon": "efui_iconatlas/tripod_tier/tripod_tier_2_71.png",
                    "description": "내려치는 공격 범위가 30.0% 증가하고 적을 앞으로 모은다."
                }
            ],
            "rune": {
                "name": "속행",
                "grade": 3,
                "icon": "efui_iconatlas/use/use_7_196.png",
                "effect": "스킬 사용 시 일정 확률로 전체 재사용 대기 시간이 12% 감소"
            }
        },
        {
            "name": "비뢰격",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_6.png",
            "type": "[기력 스킬]",
            "castType": "일반",
            "level": 1,
            "isMaxLevel": false,
            "cooldown": 8,
            "resource": "기력 15 소모, 충격 25 생성",
            "description": "헤비 건틀릿으로 내려치며 46,357의 피해를 2회 주고, 반동을 이용하여 강하게 올려치며 61,752의 피해를 주고 넘어뜨린다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": true,
                "neutralization": "하",
                "destruction": 0,
                "pushImmunity": false,
                "paralysisImmunity": false,
                "statusAilmentImmunity": false
            },
            "tripods": [],
            "rune": null
        },
        {
            "name": "비상격",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_15.png",
            "type": "[충격 스킬]",
            "castType": "일반",
            "level": 1,
            "isMaxLevel": false,
            "cooldown": 14,
            "resource": "충격 30 소모, 기력 25 생성",
            "description": "전방을 향해 어퍼 공격을 하며 최대 609,733의 피해를 주고 적중된 적을 공중에 띄운다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "중상",
                "destruction": 0,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [],
            "rune": null
        },
        {
            "name": "진 파공권",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_17.png",
            "type": "[충격 스킬]",
            "castType": "일반",
            "level": 1,
            "isMaxLevel": false,
            "cooldown": 18,
            "resource": "충격 30 소모, 기력 30 생성",
            "description": "헤비 건틀릿에 기를 모은 뒤 전방으로 힘껏 내지르며 강력한 충격 에너지 폭발을 발생시켜 428,110의 피해를 주고 적중된 적에게 내부 충격을 발생시켜 2초 뒤 642,166의 피해를 추가로 입힌다.",
            "effects": {
                "attackType": "헤드 어택",
                "counter": false,
                "neutralization": "상",
                "destruction": 2,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [],
            "rune": null
        },
        {
            "name": "척결",
            "icon": "efui_iconatlas/ifm_skill/ifm_skill_01_13.png",
            "type": "[충격 스킬]",
            "castType": "일반",
            "level": 1,
            "isMaxLevel": false,
            "cooldown": 12,
            "resource": "충격 20 소모, 기력 15 생성",
            "description": "제자리에서 공중으로 도약한 뒤 헤비 건틀릿을 전방 아래 방향으로 내려치며 179,028의 피해를 준다. 피격이상 중인 적 공격 시 내리꽂는다.",
            "effects": {
                "attackType": null,
                "counter": false,
                "neutralization": "하",
                "destruction": 0,
                "pushImmunity": false,
                "paralysisImmunity": true,
                "statusAilmentImmunity": false
            },
            "tripods": [],
            "rune": null
        }
    ],
    "lifeSkills": {
        "planting": 34,
        "logging": 53,
        "mining": 31,
        "hunting": 33,
        "fishing": 40,
        "digging": 36
    },
    "specialEquipments": {
        "compass": {
            "name": "특제 성운 나침반",
            "icon": "efui_iconatlas/acc/acc_312.png",
            "grade": 5
        },
        "charm": {
            "name": "광휘의 별무리 부적",
            "icon": "efui_iconatlas/acc/acc_308.png",
            "grade": 5
        },
        "emblem": null
    },
    "tendencies": {
        "intellect": 570,
        "courage": 580,
        "charm": 548,
        "kindness": 520
    },
    "arkPassive": {
        "enabled": true,
        "evolution": 120,
        "realization": 96,
        "leap": 62,
        "effects": [
            {
                "type": 1,
                "tier": 1,
                "name": "치명",
                "icon": "efui_iconatlas/ark_passive_evolution/ark_passive_evolution_1.png",
                "level": 30,
                "description": "치명이 1500 증가합니다."
            },
            {
                "type": 1,
                "tier": 1,
                "name": "신속",
                "icon": "efui_iconatlas/ark_passive_evolution/ark_passive_evolution_4.png",
                "level": 10,
                "description": "신속이 500 증가합니다."
            },
            {
                "type": 1,
                "tier": 2,
                "name": "예리한 감각",
                "icon": "efui_iconatlas/ark_passive_evolution/ark_passive_evolution_29.png",
                "level": 2,
                "description": "치명타 적중률이 8.0% 증가하고, 진화형 피해가 10.0% 증가합니다."
            },
            {
                "type": 1,
                "tier": 2,
                "name": "한계 돌파",
                "icon": "efui_iconatlas/ark_passive_evolution/ark_passive_evolution_34.png",
                "level": 1,
                "description": "진화형 피해가 10.0% 증가합니다."
            },
            {
                "type": 1,
                "tier": 3,
                "name": "일격",
                "icon": "efui_iconatlas/ark_passive_evolution/ark_passive_evolution_32.png",
                "level": 2,
                "description": "치명타 적중률이 20.0% 증가하고, 방향성 공격 스킬의 치명타 피해가 32.0% 증가합니다."
            },
            {
                "type": 1,
                "tier": 4,
                "name": "뭉툭한 가시",
                "icon": "efui_iconatlas/ark_passive_evolution/ark_passive_evolution_20.png",
                "level": 2,
                "description": "진화형 피해가 15.0% 증가합니다. 치명타가 발생할 확률이 최대 80.0% 로 제한됩니다. 공격 시, 초과한 모든 치명타가 발생할 확률의 140.0%가 진화형 피해로 전환됩니다. 이 노드에 의한 진화형 피해는 최대 70.0%까지 적용됩니다."
            },
            {
                "type": 2,
                "tier": 1,
                "name": "수라의 길",
                "icon": "efui_iconatlas/ark_passive_ifm/ark_passive_ifm_4.png",
                "level": 1,
                "description": "기력 및 충격 에너지 총량이 30.0% 감소되며 투지 에너지가 수라 에너지로 변경된다.\n수라 에너지는 기력 스킬 사용 후 충격 스킬을 사용하거나, 충격 스킬 사용 후 기력 스킬 사용 시 고정적으로 4.0% 획득한다.\n전투 상태에 진입 시 '투기' 효과를 획득하며 '권왕태세'가 '수라 상태'로 변경된다.\nX키가 활성화되며, 사용 시 '호신투기' 효과를 획득할 수 있다.\n\n투기 : 이동속도가 15.0% 증가한다.\n\n수라 상태 : '수라결' 효과를 획득하며 이동기 스킬이 변경되고, 기본 공격이 수라결 기본 공격으로 변경된다.\n\n수라결 : 진정한 수라가 되어 일시적으로 야성적인 기운이 몸을 감싸며 강력한 힘을 얻고 이동속도가 15.0% 증가한다.\n\n호신투기 : 2.0초동안 피격이상에 면역되고 최대 생명력의 40.0%에 해당하는 보호막을 획득한다. 받는 피해가 20.0% 감소하며 특정 보스 등급 이상에게 피격 시 발생하는 패널티 게이지가 50.0% 감소된다. 호신투기 상태 중 피격 시 1회에 한해 호신투기 유지시간이 3.0초 증가한다. 호신투기 사용 후 10.0초 간 투기흡수 상태에 들어가 호신투기를 사용할 수 없다."
            },
            {
                "type": 2,
                "tier": 2,
                "name": "치명적인 주먹",
                "icon": "efui_iconatlas/ark_passive_ifm/ark_passive_ifm_5.png",
                "level": 3,
                "description": "수라결 기본 공격은 치명타 적중률의 200.0% 만큼 피해량이 증가한다."
            },
            {
                "type": 2,
                "tier": 3,
                "name": "수라강체",
                "icon": "efui_iconatlas/ark_passive_ifm/ark_passive_ifm_6.png",
                "level": 3,
                "description": "투기 및 수라결 상태일 때, 모든 피해량이 25.0% 증가한다."
            },
            {
                "type": 2,
                "tier": 4,
                "name": "무아지경",
                "icon": "efui_iconatlas/ark_passive_ifm/ark_passive_ifm_9.png",
                "level": 3,
                "description": "적에게 주는 피해량이 12.0% 증가한다.\n수라결 기본 공격의 최대 공격 횟수가 6회 증가하며, 8번째 공격마다 '무아지경' 효과를 획득한다.\n\n무아지경 : 수라결 기본 공격의 공격 속도가 점차 증가하여 최대 44.0% 증가한다."
            },
            {
                "type": 3,
                "tier": 1,
                "name": "풀려난 힘",
                "icon": "efui_iconatlas/ark_passive_02/ark_passive_02_2.png",
                "level": 5,
                "description": "초각성 스킬이 적에게 주는 피해가 15.0% 증가한다."
            },
            {
                "type": 3,
                "tier": 1,
                "name": "잠재력 해방",
                "icon": "efui_iconatlas/ark_passive_01/ark_passive_01_10.png",
                "level": 5,
                "description": "초각성 스킬의 재사용 대기 시간이 10.0% 감소한다."
            },
            {
                "type": 3,
                "tier": 1,
                "name": "즉각적인 주문",
                "icon": "efui_iconatlas/ark_passive_02/ark_passive_02_5.png",
                "level": 1,
                "description": "초각성 스킬의 시전 속도가 4.0% 증가하고, 무력화 피해가 10.0% 증가한다."
            },
            {
                "type": 3,
                "tier": 2,
                "name": "사방 타격",
                "icon": "efui_iconatlas/ark_passive_ifm/ark_passive_ifm_14.png",
                "level": 2,
                "description": "성운멸쇄권의 공격 타입이 헤드 어택으로 변경된다. 공격속도가 20.0% 증가하고, 권왕태세 및 수라결 상태가 아닐 때 적에게 주는 피해가 57.0% 증가한다. 충격 소모량이 30 감소한다."
            }
        ]
    },
    "titles": [
        {
            "name": "이클립스",
            "grade": 4,
            "description": "카멘 The FIRST 난이도 클리어 보상"
        },
        {
            "name": "별을 제패한 자",
            "grade": 4,
            "description": "별을 제패한 자, 카멘 처치하기"
        },
        {
            "name": "대지를 분쇄하는",
            "grade": 4,
            "description": "가디언 '하누마탄'의 하드 난이도 토벌에 성공하기"
        },
        {
            "name": "질병군단장",
            "grade": 2,
            "description": "질병군단장 일리아칸 물리치기"
        },
        {
            "name": "어둠군단장",
            "grade": 2,
            "description": "어둠군단장 카멘 처치하기"
        }
    ],
    "viewCount": {
        "daily": 1,
        "total": 50
    },
    "fetchedAt": "2025-01-16T12:15:51.231813Z"
};

// 결과 계산
const result = calculateBraceletImpact(characterData);
console.log("결과:", result);
