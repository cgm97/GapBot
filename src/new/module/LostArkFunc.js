const KakaoLinkModule = require('KakaoLinkModule');
const Data = require('data');

const imgUrl = "https://pica.korlark.com/";

// 천단위 콤마 함수
module.exports.set_comma = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 명령어
module.exports.getCmd = (client,room) => {
    var args = {
    };
    KakaoLinkModule.send(client,114479,args,room);
}

// 로또
module.exports.lotto = (nickName, percent, data) => {
    let retMsg = '';

    let bDay = data.select("#ct >section.sc.mcs_lotto.mcs_common_module._lotto > div.api_subject_bx > div.content_wrap > div > div > div.tab_area > div.type_flick_select > div > a.text._slide_board_trigger._text").text();
    let lottoNum = data.select("#ct > section.sc.mcs_lotto.mcs_common_module._lotto > div.api_subject_bx > div.content_wrap > div > div > div:nth-child(2) > div.win_number_box > div.win_ball");
    let moneyTbody = data.select("#ct > section.sc.mcs_lotto.mcs_common_module._lotto > div.api_subject_bx > div.content_wrap > div > div > div:nth-child(3) > div > table > tbody");

    try{   
        var lottoBuyNumArray = []; //구매 번호 생성할 array
        var lottoBuyNum = ''; //로또번호 생성 숫자
        let winNum = lottoNum.select(".winning_number").text();
        let bonusNum = lottoNum.select(".bonus_number").text();
        
        var winNumArray = winNum.split(' ');
        winNumArray.push(bonusNum);
 
        if(percent == 0){

        }
        else if(percent == 1){
            lottoBuyNumArray.push(winNumArray[0]);
            //lottoBuyNumArray.push(winNumArray[1])
        }
        else if(percent == 2){
            lottoBuyNumArray.push(winNumArray[0]);
            lottoBuyNumArray.push(winNumArray[1]);
            //lottoBuyNumArray.push(winNumArray[2])
        }
        else if(percent == 3){
            lottoBuyNumArray.push(winNumArray[0]);
            lottoBuyNumArray.push(winNumArray[1]);
            lottoBuyNumArray.push(winNumArray[2]);
        }
        else if(percent == 4){
            lottoBuyNumArray.push(winNumArray[0]);
            lottoBuyNumArray.push(winNumArray[1]);
            lottoBuyNumArray.push(winNumArray[2]);
            lottoBuyNumArray.push(winNumArray[3]);
        }
         else {
            return '/로또 0~4 입력하세요.';

        }

        while(lottoBuyNumArray.length < 6){
            lottoBuyNum = (Math.floor(Math.random()*(45)) + 1).toString(); //1~45 숫자 랜덤 생성
            if(!lottoBuyNumArray.includes(lottoBuyNum)){ //구매 번호에 없으면 구매 번호 추가
                lottoBuyNumArray.push(lottoBuyNum);
            }
        }

        var pickCnt = 0;
        var bonusFlag = false;
        //당첨값과 비교
        for(var j=0; j < 7; j++){
            for(var k=0; k <6; k++){
                if(winNumArray [j] == lottoBuyNumArray[k]){
                    if(j == 6){
                        bonusFlag = true;
                        
                    }
                    pickCnt++;
                }
            }
        }

        if(pickCnt == 6){
            if(bonusFlag){
                pickRankMsg  = "🥈등 당첨!!\n";
                pickRankMsg += "당첨금 : " + moneyTbody.select(".emphasis")[1].text().substr(8);
            } else {
                pickRankMsg  = "🥇등 당첨!!\n";
                pickRankMsg += "당첨금 : " +moneyTbody.select(".emphasis")[0].text().substr(8);
            }
        }
        else if(pickCnt == 5){ 
                pickRankMsg  = "🥉등 당첨!!\n";
                pickRankMsg += "당첨금 : " + moneyTbody.select(".emphasis")[2].text().substr(8);     
        }
        else if(pickCnt == 4){
            pickRankMsg  = "4등 당첨!!\n";
            pickRankMsg += "당첨금 : " + moneyTbody.select(".emphasis")[3].text().substr(8);
        }
        else if(pickCnt == 3){
            pickRankMsg  = "5등 당첨!!\n";
            pickRankMsg += "당첨금 : " + moneyTbody.select(".emphasis")[4].text().substr(8);
        }
        else{
            pickRankMsg  = "꽝ㅋㅋㅋ";
        }

        lottoBuyNumArray = lottoBuyNumArray.sort(function(a,b){
            return a - b;
        });
        
        var lottoBuyStr = '';
        for(var i=0; i<lottoBuyNumArray.length;i++){
            lottoBuyStr += lottoBuyNumArray[i] +' ';
        }

        retMsg += "["+bDay+"] 기준\n\n";
        if(percent == 0){
            retMsg += "ALL Random VERSION\n\n";
        } 
        else if(percent == 1){
            retMsg += "로또 당첨 1개 확정 VERSION\n\n";
        }
        else if(percent == 2){
            retMsg += "로또 당첨 2개 확정 VERSION\n\n";
        }
        else if(percent == 3){
            retMsg += "로또 당첨 3개 확정 VERSION\n\n";
        }
        else if(percent == 4){
            retMsg += "로또 당첨 4개 확정 VERSION\n\n";
        }
        retMsg += "만약... "+nickName+"님이 로또를 구매했다면?\n\n";
        retMsg += "------------------------------------\n";
        retMsg += "지난 당첨 번호 : " + winNum +" + "+ bonusNum+"\n";
        retMsg += "나의 로또 번호 : " + lottoBuyStr +"\n";
        retMsg += "------------------------------------\n\n";
        retMsg += pickRankMsg;
    }catch(e){
        retMsg = e;
        Log.e(e);
    }
 
    return retMsg;      
}

// 캐릭터 정보
module.exports.selectCharacterInfo = (client,characterInfo,room) => {

    // 각인 (간략)
    var engravings =  Object.keys(characterInfo.engravings);
    var engravingStr = "";
    for(var i=0; i<engravings.length; i++){
        engravingStr += characterInfo.engravings[i].name.substring(0,1);
        engravingStr += characterInfo.engravings[i].level;
        if(i != engravings.length){
            engravingStr+=" ";
        }
    }

    // 앜패 (간략)
    // var effects =  Object.keys(characterInfo.arkPassive.effects);
    // var mainEffect = "";
    // for(var i=0; i<effects.length; i++){
    //     if(characterInfo.arkPassive.effects[i].type == "2"){
    //         if(characterInfo.arkPassive.effects[i].tier == "1"){
    //             mainEffect += characterInfo.arkPassive.effects[i].name;
    //         }
    //     }
    // }

    // 엘릭스
    // var elixirSetEffects =  Object.keys(characterInfo.elixirSetEffects);
    // var elixirName = "";

    // if(elixirSetEffects.length == 1){
    //     elixirName = characterInfo.elixirSetEffects[0].name;
    // }

    // for(var i=0; i<elixirSetEffects.length; i++){
    //     if(characterInfo.arkPassive.effects[i].type == "2"){
    //         if(characterInfo.arkPassive.effects[i].tier == "1"){
    //             mainEffect += characterInfo.arkPassive.effects[i].name;
    //         }
    //     }
    // }           

    // 초월
    var hat_point = (characterInfo.equipments.hat && characterInfo.equipments.hat.transcendence && characterInfo.equipments.hat.transcendence.point) || "";
    var ornaments_point = (characterInfo.equipments.ornaments && characterInfo.equipments.ornaments.transcendence && characterInfo.equipments.ornaments.transcendence.point) || "";
    var top_point = (characterInfo.equipments.top && characterInfo.equipments.top.transcendence && characterInfo.equipments.top.transcendence.point) || "";
    var pants_point = (characterInfo.equipments.pants && characterInfo.equipments.pants.transcendence && characterInfo.equipments.pants.transcendence.point) || "";
    var gloves_point = (characterInfo.equipments.gloves && characterInfo.equipments.gloves.transcendence && characterInfo.equipments.gloves.transcendence.point) || "";
    var weapon_point = (characterInfo.equipments.weapon && characterInfo.equipments.weapon.transcendence && characterInfo.equipments.weapon.transcendence.point) || "";

    var elixir = (characterInfo.equipments.elixirSetEffects && Array.isArray(characterInfo.equipments.elixirSetEffects) && characterInfo.equipments.elixirSetEffects[0] && characterInfo.equipments.elixirSetEffects[0].name) || "";
    var elixirSetEffects = characterInfo.equipments.elixirSetEffects;

    var elixirText = "";
    elixirSetEffects.forEach(i => {
        elixirText += i.name; // 이름 추가
    
        // 마지막 활성화된 단계만 추출
        var lastEnabledPhase = null;
        i.phases.forEach(j => {
            if (j.enabled) {
                lastEnabledPhase = j.phase; // 활성화된 단계가 있을 경우 저장
            }
        });
    
        // 마지막 활성화된 단계만 추가
        if (lastEnabledPhase !== null) {
            elixirText += "("+lastEnabledPhase + "단계)";
        }
    });

    var total_point = hat_point + ornaments_point + top_point + pants_point + gloves_point + weapon_point;

    var args = {
        img: characterInfo.image || "",
        title: characterInfo.title || "",
        nickName: characterInfo.name || "",
        itemLv: characterInfo.maxItemLevel || "",
        lv: characterInfo.level || "",
        expeditionLv: characterInfo.expeditionLevel || "",
        job: Data.JOB_CODE[characterInfo.job] || "",
        server: Data.SERVER_CODE[characterInfo.server] || "",
        guild: (characterInfo.guild && characterInfo.guild.name) || "",
        crit: (characterInfo.stats && characterInfo.stats.crit && characterInfo.stats.crit.value) || "",
        spez: (characterInfo.stats && characterInfo.stats.specialization && characterInfo.stats.specialization.value) || "",
        swift: (characterInfo.stats && characterInfo.stats.swiftness && characterInfo.stats.swiftness.value) || "",
        engrav: engravingStr || "",
        evolution: (characterInfo.arkPassive && characterInfo.arkPassive.evolution) || "",
        realization: (characterInfo.arkPassive && characterInfo.arkPassive.realization) || "",
        leap: (characterInfo.arkPassive && characterInfo.arkPassive.leap) || "",
        elixirNpointTitle: (elixir && total_point) ? "엘/초" : "",
        elixirNpointData: (elixir && total_point) ? elixirText + " / " + total_point : ""
    };
    KakaoLinkModule.send(client,114159,args,room);
}
// 캐릭터 장비(무기)
module.exports.selectCharacterEquip1 = (client,characterInfo,room) => {
    var weapon = characterInfo.equipments.weapon;
    var elixirSetEffects = characterInfo.equipments.elixirSetEffects;

    var elixirText = "";
    elixirSetEffects.forEach(i => {
        elixirText += i.name; // 이름 추가
    
        // 마지막 활성화된 단계만 추출
        var lastEnabledPhase = null;
        i.phases.forEach(j => {
            if (j.enabled) {
                lastEnabledPhase = j.phase; // 활성화된 단계가 있을 경우 저장
            }
        });
    
        // 마지막 활성화된 단계만 추가
        if (lastEnabledPhase !== null) {
            elixirText += "("+lastEnabledPhase + "단계)";
        }
    });

    var argWeapon = {
        title : "무기",
        itemTitle_1 : Data.getItemTitle(weapon),
        // itemDesc_1 : elixirSetEffects.name+"("+step+"단계) " + Data.getTranscendence(weapon),
        itemDesc_1 : elixirText+" " + Data.getTranscendence(weapon),
        img1 : imgUrl + weapon.icon,
    };
    KakaoLinkModule.send(client,114176,argWeapon,room);
}
// 캐릭터 장비(방어구)
module.exports.selectCharacterEquip2 = (client,characterInfo,room) => {
    var hat = characterInfo.equipments.hat;
    var ornaments = characterInfo.equipments.ornaments;
    var top = characterInfo.equipments.top;
    var pants = characterInfo.equipments.pants;
    var gloves = characterInfo.equipments.gloves;
    var weapon = characterInfo.equipments.weapon;

    var avg_quality = (hat.quality + ornaments.quality + top.quality + pants.quality + gloves.quality + weapon.quality) / 6;

    var args = {
        title : "방어구",
        itemTitle_1 : Data.getItemTitle(hat),
        itemDesc_1 : Data.getElixir(hat) + Data.getTranscendence(hat),
        img1 : imgUrl + hat.icon,
        itemTitle_2 : Data.getItemTitle(ornaments),
        itemDesc_2 : Data.getElixir(ornaments) + Data.getTranscendence(ornaments),
        img2 : imgUrl + ornaments.icon,
        itemTitle_3 : Data.getItemTitle(top),
        itemDesc_3 : Data.getElixir(top) + Data.getTranscendence(top),
        img3 : imgUrl + top.icon,
        itemTitle_4 : Data.getItemTitle(pants),
        itemDesc_4 : Data.getElixir(pants) + Data.getTranscendence(pants),
        img4 : imgUrl + pants.icon,
        itemTitle_5 : Data.getItemTitle(gloves),
        itemDesc_5 : Data.getElixir(gloves) + Data.getTranscendence(gloves),
        img5 : imgUrl + gloves.icon
    };
    KakaoLinkModule.send(client,114176,args,room);
}
// 캐릭터 장신구
module.exports.selectCharacterAccessories = (characterInfo,str) => {
    var necklace  = characterInfo.accessories.necklace; //목걸이
    var earring_1 = characterInfo.accessories.earring1; // 귀걸이
    var earring_2 = characterInfo.accessories.earring2; // 귀걸이
    var ring_1  = characterInfo.accessories.ring1; // 반지
    var ring_2 = characterInfo.accessories.ring2; // 반지
    // var bracelet = characterInfo.accessories.bracelet; // 팔찌

    var retTxt = "📢 "+ str+"님의 장신구\n";
    // 장신구
    retTxt += Data.getAccessories(necklace);
    retTxt += Data.getAccessories(earring_1);
    retTxt += Data.getAccessories(earring_2);
    retTxt += Data.getAccessories(ring_1);
    retTxt += Data.getAccessories(ring_2);

    // 팔찌
    // retTxt += '\n'+ Data.getGradeName(bracelet.grade) + ' '+ bracelet.name + '\n';
    // for(var i=0; i < bracelet.effects.length; i++){
    //     retTxt += bracelet.effects[i].name||bracelet.effects[i].description;
    //     retTxt += " ";
    // }
    return retTxt;
}
// 캐릭터 내실
module.exports.selectCharacterCollection = (characterInfo,str) => {
    var island_heart = Data.getCollection(characterInfo.islandHeart,"섬의 마음");
    var giant_heart = Data.getCollection(characterInfo.giantHeart,"거인의 심장");
    var ignea_token = Data.getCollection(characterInfo.igneaToken,"이그네아의 징표");
    var masterpiece = Data.getCollection(characterInfo.masterpiece,"위대한 미술품");
    var memory_orgel = Data.getCollection(characterInfo.memoryOrgel,"기억의 오르골");
    var mokoko_seed = Data.getCollection(characterInfo.mokokoSeed,"모코코 씨앗");
    var orpheus_star = Data.getCollection(characterInfo.orpheusStar,"오르페우스의 별");
    var sea_bounty = Data.getCollection(characterInfo.seaBounty,"항해 모험물");
    var world_tree_leaf = Data.getCollection(characterInfo.worldTreeLeaf,"세계수의 잎");
    var crimsnail_chart = Data.getCollection(characterInfo.crimsnailChart,"크림스네일의 해도");

    var avg_score = (
        island_heart.score 
        + giant_heart.score 
        + ignea_token.score 
        + masterpiece.score 
        + memory_orgel.score 
        + mokoko_seed.score 
        + orpheus_star.score 
        + sea_bounty.score 
        + world_tree_leaf.score 
        + crimsnail_chart.score ) / 10;
    var header = '📢 내실 - '+str+'  ｡·͜·｡\n\n';
    var result = header;
    result += island_heart.result;
    result += giant_heart.result;
    result += ignea_token.result;
    result += masterpiece.result;
    result += memory_orgel.result;
    result += mokoko_seed.result;
    result += orpheus_star.result;
    result += sea_bounty.result;
    result += world_tree_leaf.result;
    result += crimsnail_chart.result;
    result += '\n내실 점수 : ' + Math.floor(avg_score) + '%';
    return result;
}
// 모험섬
module.exports.selectAdventureIsland = (client,islandJson,today,room) => {
    var date = new Date();
    // 요일 배열 (일요일부터 시작)
    var daysInKorean = ["일", "월", "화", "수", "목", "금", "토"];
    var dayOfWeek = daysInKorean[date.getDay()];     

    // 토요일 또는 일요일이고 13시 기준으로 이전이면 0, 이후면 1
    var timeCheck = 0;
    if ((dayOfWeek === "토" || dayOfWeek === "일") && date.getHours() >= 12) {
        timeCheck = 1;
    }

    // 결과를 저장할 배열
    var selectedIslands = [];
    var count = 0;

    for (var i = 0; i < islandJson.length; i++) {
        if (islandJson[i].time === timeCheck) {
            selectedIslands.push(islandJson[i]);
            count++;
            if (count === 3) break; // 3개 찾으면 종료
        }
    }
   
    var args = {
        today : today,
        day : dayOfWeek,
        type : (dayOfWeek === "토" || dayOfWeek === "일") ? (timeCheck == 0 ? "오전" : "오후") : "",
        islandName_1 : selectedIslands[0].name,
        bonusReward_1: Data.REWARD[selectedIslands[0].bonusRewardType],
        img1 : imgUrl+selectedIslands[0].icon,
        islandName_2 : selectedIslands[1].name,
        bonusReward_2: Data.REWARD[selectedIslands[1].bonusRewardType],
        img2 : imgUrl+selectedIslands[1].icon,
        islandName_3 : selectedIslands[2].name,
        bonusReward_3: Data.REWARD[selectedIslands[2].bonusRewardType],
        img3 : imgUrl+selectedIslands[2].icon,

    };
    KakaoLinkModule.send(client,114231,args,room);
}
// 부캐
module.exports.selectMembers = (client,characterInfo,str,room) => {
    var memberArr = characterInfo.members;
    // 현재 검색된 캐릭의 서버
    var server = characterInfo.server;

    var myCharacter = [];
    for(var i=0; i < memberArr.length; i++){
        if(memberArr[i].server == server && memberArr[i].maxItemLevel != -1){
            myCharacter.push(memberArr[i]);
        }
    }

    // maxItemLevel 내림차순 정렬
    const sortedMembers = myCharacter.sort((a, b) => b.maxItemLevel - a.maxItemLevel); // maxItemLevel 기준 내림차순 정렬
    var args = {
        nickName: str,
        server: Data.SERVER_CODE[server],
    
        name: Data.getMemberName(sortedMembers, 0),
        title: Data.getMemberLv(sortedMembers, 0),
        job: Data.getMemberJob(sortedMembers, 0),

        title_1: Data.getMemberLv(sortedMembers, 1),
        name_1: Data.getMemberName(sortedMembers, 1),
        job_1: Data.getMemberJob(sortedMembers, 1),

        title_2: Data.getMemberLv(sortedMembers, 2),
        name_2: Data.getMemberName(sortedMembers, 2),
        job_2: Data.getMemberJob(sortedMembers, 2),

        title_3:Data.getMemberLv(sortedMembers, 3),
        name_3: Data.getMemberName(sortedMembers, 3),
        job_3: Data.getMemberJob(sortedMembers, 3),

        title_4: Data.getMemberLv(sortedMembers, 4),
        name_4: Data.getMemberName(sortedMembers, 4),
        job_4: Data.getMemberJob(sortedMembers, 4),

        title_5: Data.getMemberLv(sortedMembers, 5),
        name_5: Data.getMemberName(sortedMembers, 5),
        job_5: Data.getMemberJob(sortedMembers, 5),
    }; 
    KakaoLinkModule.send(client,114294,args,room);
}
// 주급
module.exports.selectCharactersGold = (client,characterInfo,room) => {
    var memberArr = characterInfo.members;
    // 현재 검색된 캐릭의 서버
    var server = characterInfo.server;

    // 1415이상 캐릭이면서 상위 6캐릭터만
    var myCharacter = [];
    for(var i=0; i < memberArr.length; i++){
        if(memberArr[i].server == server && memberArr[i].maxItemLevel >= 1415){
            myCharacter.push(memberArr[i]);
        }
    }
    myCharacter = myCharacter.sort((a, b) => b.maxItemLevel - a.maxItemLevel); // maxItemLevel 기준 내림차순 정렬

    const retRaid = [];
    // 멤버별 최상위 3개의 레이드를 계산
    myCharacter.forEach(myCharacter => {
        const top3Raids = Data.getTop3UniqueRaidsForMember(myCharacter);
        retRaid.push(top3Raids);
    });
    var args = {
        nickName_0 : Data.getMemberName(myCharacter,0),
        gold_0 : module.exports.set_comma(Data.sumGold(retRaid, 0)) + "G",

        nickName_1 : Data.getMemberName(myCharacter,1),
        gold_1 : module.exports.set_comma(Data.sumGold(retRaid, 1)) + "G",

        nickName_2 : Data.getMemberName(myCharacter,2),
        gold_2 : module.exports.set_comma(Data.sumGold(retRaid, 2)) + "G",

        nickName_3 : Data.getMemberName(myCharacter,3),
        gold_3 : module.exports.set_comma(Data.sumGold(retRaid, 3)) + "G",

        nickName_4 : Data.getMemberName(myCharacter,4),
        gold_4 : module.exports.set_comma(Data.sumGold(retRaid, 4)) + "G",

        nickName_5 : Data.getMemberName(myCharacter,5),
        gold_5 : module.exports.set_comma(Data.sumGold(retRaid, 5)) + "G",

        totalGold: module.exports.set_comma((Data.sumGold(retRaid, 0) || 0) + (Data.sumGold(retRaid, 1) || 0) + (Data.sumGold(retRaid, 2) || 0) + (Data.sumGold(retRaid, 3) || 0) + (Data.sumGold(retRaid, 4) || 0) +  (Data.sumGold(retRaid, 5) || 0)) + "G"
    }
    KakaoLinkModule.send(client,114314,args,room);
}
// 캐릭터 아크패시브
module.exports.selectCharacterArkPassive = (arkPassive, str) => {
    var effects = arkPassive.effects;

    // 구분된 데이터를 저장할 객체
    var evolution = []  // 진화
    var realization = [] // 깨달음
    var leap = []        // 도약
    

    for(var i=0; i < effects.length; i++){
        if(effects[i].type == 1){
            evolution.push(effects[i]);
        }
        else if(effects[i].type == 2){
            realization.push(effects[i]);
        }
        else if(effects[i].type == 3){
            leap.push(effects[i]);
        }
    }

    var retText = "";
    retText += '📢 '+str+ ' 님의 아크패시브';
    retText += "\n\n진화 "+arkPassive.evolution
    evolution.forEach(effect => {
        retText += "\n"+effect.tier+"티어 "+effect.name+"Lv"+effect.level
    })
    retText += "\n\n깨달음 "+arkPassive.realization
    realization.forEach(effect => {
        retText += "\n"+effect.tier+"티어 "+effect.name+"Lv"+effect.level
    })
    retText += "\n\n도약 "+arkPassive.leap
    leap.forEach(effect => {
        retText += "\n"+effect.tier+"티어 "+effect.name+"Lv"+effect.level
    })
    return retText;
}

// 분배금 최적가
module.exports.calGold= (gold) => {    
    var party4 = 0.95 * 0.75;
    var party8 = 0.95 * 0.875;
    var party16 = 0.95 * 0.9375;
    var result = '';
    result += '[4인 경매 추천 금액]';
    result += '\n* 이 금액이 짱 최고이득 : ' + Math.floor(gold * party4 * 0.909);
    result += '\n* 이 금액이 딱 마지노선 : ' + Math.floor(gold * party4);
    result += '\n--------------------';
    result += '\n[8인 경매 추천 금액]';
    result += '\n* 이 금액이 짱 최고이득 : ' + Math.floor(gold * party8 * 0.909);
    result += '\n* 이 금액이 딱 마지노선 : ' + Math.floor(gold * party8);
    result += '\n--------------------';
    result += '\n[16인 경매 추천 금액]';
    result += '\n* 이 금액이 짱 최고이득 : ' + Math.floor(gold * party16 * 0.909);
    result += '\n* 이 금액이 딱 마지노선 : ' + Math.floor(gold * party16);

    return result;
}

// 떠상
module.exports.getMarketInfo= (str,info) => {    
    var header = '📢 떠돌이상인 - '+str+' ⸜(*◉ ᴗ ◉)⸝\n\n';
    var result = '';

    for(var i=0; i < info.merchants.length; i++){

        var created_at = info.merchants[0].created_at.substring(11,13); // 현재 떠상

        if(created_at == info.merchants[i].created_at.substring(11,13)){ // 현재 시간과 동일한 떠상 내역만 출력
            var continent = info.merchants[i].continent; // 지역
            result += '➡️ '+continent+"\n";

            for(var j=0; j < info.merchants[i].items.length; j++){
                var type = info.merchants[i].items[j].type; // 아이템 종류
                if(type == 0){ // 카드
                    result += info.merchants[i].items[j].content+" 카드 / ";
                }
                else if(type == 1){ // 호감도
                    var content = info.merchants[i].items[j].content;
                    if(content == "0"){
                        result += "영웅호감도 / ";
                    } else {
                        result += "전설호감도 / ";
                    }
                }
                else { // 기타(내실)
                    result += info.merchants[i].items[j].content+" / ";
                }
            }
            result += "\n\n";
        }


    }
    return header + result;
}

// 크리스탈시세
module.exports.getCrystal = (min,hour) => {   
    var pre_price = parseInt(hour[hour.length-2].close);
    var now_price = parseInt(min[min.length-1].close);

    var result = '📢 실시간 크리스탈 시세 정보\n\n';

    result += '100 : ' + module.exports.set_comma(now_price);
    if(now_price > pre_price) {
        result += ' (🔺'+module.exports.set_comma(now_price-pre_price)+')';
    } else if(now_price < pre_price) {
        result += ' (🔽'+module.exports.set_comma(pre_price-now_price)+')';
    }
    
    result += '\n\n100 크리스탈 : 골드 (기준 : 1시간)'
    return result;
}

// 보석
module.exports.getUserGem = (nickName,infoJson) => {   
    var jewel_Key = infoJson.jewels;

    var bodyText = '';
    var powerGemCnt = 0;
    var coolGemCnt = 0;

    var jewel_arr = []; // 보석 배열 정렬 용 (내림차순)
    for(var i=0; i < jewel_Key.length; i++){
        if(jewel_Key[i].type == 2){      
            coolGemCnt++;
        }
        if(jewel_Key[i].type == 1){     
            powerGemCnt++;
        }
        // 7레벨 홍염의 보석 [스킬이름] 
        jewel_arr.push({"name":jewel_Key[i].name + ' ['+jewel_Key[i].skill +']',
            "level": jewel_Key[i].level
        });
    }

    var headText = '';
    headText += '📢 '+nickName+ ' 님의 보석 현황\n';

    if(powerGemCnt < 1 && coolGemCnt < 1){
        headText += '장착된 보석이 없습니다.';
    }
    else{
        headText += '멸화 ['+powerGemCnt+'개] 홍염 ['+coolGemCnt+'개]\n';
    }

    jewel_arr.sort((a,b) => b.level - a.level); // 내림차순

    for(var i=0; i<jewel_arr.length; i++){
        bodyText += '\n'+jewel_arr[i].name;
    }

    return headText + bodyText;
}

// 이모티콘
module.exports.exportImg = (client,url,text,room) => {
    var args = {
        img : url,
        text : text
    };
    KakaoLinkModule.send(client,114599,args,room);
}

// 시간계산
module.exports.toDate = (dateTimeStr) => {
    var parts = dateTimeStr.split(" "); // 날짜와 시간을 분리
    var dateParts = parts[0].split("-"); // 날짜를 분리 (YYYY-MM-DD)
    var timeParts = parts[1].split(":"); // 시간을 분리 (HH:mm:ss)

    return new Date(
        parseInt(dateParts[0]), // 년
        parseInt(dateParts[1]) - 1, // 월 (0부터 시작하므로 -1 필요)
        parseInt(dateParts[2]), // 일
        parseInt(timeParts[0]), // 시
        parseInt(timeParts[1]), // 분
        parseInt(timeParts[2]) // 초
    );
}