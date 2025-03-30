
const API = require('key');
const Grade = require('grade');

// 직업코드
module.exports.JOB_CODE = {'11':'디스트로이어','12':'워로드','13':'버서커','14':'홀리나이트','91':'슬레이어','21':'스트라이커','22':'브레이커','31':'배틀마스터','32':'인파이터'
                ,'33':'기공사','34':'창술사','41':'데빌헌터','42':'블래스터','43':'호크아이','44':'스카우터','51':'건슬링어','61':'바드','62':'서머너'
                ,'63':'아르카나','64':'소서리스','71':'블레이드','72':'데모닉','73':'리퍼','74':'소울이터','81':'도화가','82':'기상술사','83':'환수사'
                ,'10':'모험가','20':'모험가','30':'모험가','40':'모험가','50':'모험가','60':'모험가','70':'모험가','80':'모험가','90':'모험가'};
// 서버코드
module.exports.SERVER_CODE = {'1':'루페온','2':'실리안','3':'아만','4':'아브렐슈드','5':'카단','6':'카마인','7':'카제로스','8':'니나브'
                    ,'루페온':'1','실리안':'2','아만':'3','아브렐슈드':'4','카단':'5','카마인':'6','카제로스':'7','니나브':'8'
                    };
// LV별 획득골드량
module.exports.LV_GOLD = {'1620':65500,'1600':28000,'1580':22000,'1560':16500,'1550':16000,'1540':14500,'1520':12400,'1500':12400,'1490':9900};

module.exports.REWARD = {
    0: '골드',
    1: '카드',
    2: '주화',
    3: '실링'
};

// 분양받은 room 리스트
module.exports.ROOMLIST = ['로스트아크빈틈','기분좋은향기','삼로친구들','어이없넹','실례','뀨띠뽀짝채팅방','파타퐁'];

// 아이템 카테고리 코드
module.exports.CategoryCode = {"보석":210000, "각인서":40000, '강화재료':50010, '강화추가재료':50020, '에스더기운':51100
                                , "식물채집":90200, "벌목":90300, "채광":90400, "수렵":90500, "낚시":90600, "고고학":90700
} ;

module.exports.GEMINDEX = {
    "10멸": "10레벨 멸화의 보석", "10홍": "10레벨 홍염의 보석",
    "9멸": "9레벨 멸화의 보석", "9홍": "9레벨 홍염의 보석",
    "8멸": "8레벨 멸화의 보석", "8홍": "8레벨 홍염의 보석",
    "7멸": "7레벨 멸화의 보석", "7홍": "7레벨 홍염의 보석",
    "6멸": "6레벨 멸화의 보석", "6홍": "6레벨 홍염의 보석",
    "5멸": "5레벨 멸화의 보석", "5홍": "5레벨 홍염의 보석",
    "4멸": "4레벨 멸화의 보석", "4홍": "4레벨 홍염의 보석",
    "3멸": "3레벨 멸화의 보석", "3홍": "3레벨 홍염의 보석",
    "2멸": "2레벨 멸화의 보석", "2홍": "2레벨 홍염의 보석",
    "1멸": "1레벨 멸화의 보석", "1홍": "1레벨 홍염의 보석",
    "10겁": "10레벨 겁화의 보석", "10작": "10레벨 작열의 보석",
    "9겁": "9레벨 겁화의 보석", "9작": "9레벨 작열의 보석",
    "8겁": "8레벨 겁화의 보석", "8작": "8레벨 작열의 보석",
    "7겁": "7레벨 겁화의 보석", "7작": "7레벨 작열의 보석",
    "6겁": "6레벨 겁화의 보석", "6작": "6레벨 작열의 보석",
    "5겁": "5레벨 겁화의 보석", "5작": "5레벨 작열의 보석",
    "4겁": "4레벨 겁화의 보석", "4작": "4레벨 작열의 보석",
    "3겁": "3레벨 겁화의 보석", "3작": "3레벨 작열의 보석",
    "2겁": "2레벨 겁화의 보석", "2작": "2레벨 작열의 보석",
    "1겁": "1레벨 겁화의 보석", "1작": "1레벨 작열의 보석"
};

module.exports.RAID = [
    { raidName: "발탄", difficulty: "노말", levelRequirement: 1415, reward: 1200, more: 700 },
    { raidName: "발탄", difficulty: "하드", levelRequirement: 1445, reward: 1800, more: 1050 },
    { raidName: "비아키스", difficulty: "노말", levelRequirement: 1430, reward: 1600, more: 750 },
    { raidName: "비아키스", difficulty: "하드", levelRequirement: 1460, reward: 2400, more: 1150 },
    { raidName: "쿠크세이튼", difficulty: "노말", levelRequirement: 1475, reward: 3000, more: 1500 },
    { raidName: "아브렐슈드", difficulty: "노말", levelRequirement: 1490, reward: 3000, more: 950, week: 4600, weekmore: 1550 },
    { raidName: "아브렐슈드", difficulty: "하드", levelRequirement: 1540, reward: 3600, more: 1300, week: 5600, weekmore: 2100 },
    { raidName: "카양겔", difficulty: "노말", levelRequirement: 1540, reward: 3600, more: 1200 },
    { raidName: "카양겔", difficulty: "하드", levelRequirement: 1580, reward: 4800, more: 1550 },
    { raidName: "일리아칸", difficulty: "노말", levelRequirement: 1580, reward: 5400, more: 1750 },
    { raidName: "일리아칸", difficulty: "하드", levelRequirement: 1600, reward: 7500, more: 2250 },
    { raidName: "상아탑", difficulty: "노말", levelRequirement: 1600, reward: 6500, more: 2250 },
    { raidName: "상아탑", difficulty: "하드", levelRequirement: 1620, reward: 9000, more: 3000 },
    { raidName: "카멘", difficulty: "노말", levelRequirement: 1610, reward: 8000, more: 2630 },
    { raidName: "카멘", difficulty: "하드", levelRequirement: 1630, reward: 10000, more: 3220, week: 15500, weekmore: 4870},
    { raidName: "에키드나", difficulty: "노말", levelRequirement: 1620, reward: 9500, more: 3200 },
    { raidName: "에키드나", difficulty: "하드", levelRequirement: 1640, reward: 11000, more: 3610 },
    { raidName: "베히모스", difficulty: "노말", levelRequirement: 1640, reward: 11000, more: 3610 },
    { raidName: "1막 에기르", difficulty: "노말", levelRequirement: 1660, reward: 18000, more: 6000 },
    { raidName: "1막 에기르", difficulty: "하드", levelRequirement: 1680, reward: 27500, more: 10700 },
    { raidName: "2막 아브렐슈드", difficulty: "노말", levelRequirement: 1670, reward: 25000, more: 9400 },
    { raidName: "2막 아브렐슈드", difficulty: "하드", levelRequirement: 1690, reward: 30500, more: 11700 },
    { raidName: "3막 모르둠", difficulty: "노말", levelRequirement: 1680, reward: 28000, more: 9800 },
    { raidName: "3막 모르둠", difficulty: "하드", levelRequirement: 1700, reward: 38000, more: 12600 },
    { raidName: "강습", difficulty: "노말", levelRequirement: 9999, reward: 10000, more: 4000 },
    { raidName: "강습", difficulty: "하드", levelRequirement: 9999, reward: 18000, more: 6000 }
];

module.exports.BOOKINDEX = {"저받":"저주받은 인형", "예둔":"예리한 둔기","아드":"아드레날린","타대":"타격의 대가","결대":"결투의 대가","기습":"기습의 대가","돌대":"돌격대장","최마증":"최대 마나 증가","마효증":"마나 효율 증가","마흐":"마나의 흐름","질증":"질량 증가"};

module.exports.STUFFINDEX = ['찬란한 명예의 돌파석','정제된 파괴강석','정제된 수호강석'];

// 재련강화확률표
module.exports.ENHANCEMENTDATA = [
    { step: 1, chance: 100, bonusChance: 100 },
    { step: 2, chance: 100, bonusChance: 100 },
    { step: 3, chance: 50, bonusChance: 27.91 },
    { step: 4, chance: 50, bonusChance: 27.91 },
    { step: 5, chance: 30, bonusChance: 18.60 },
    { step: 6, chance: 30, bonusChance: 18.60 },
    { step: 7, chance: 20, bonusChance: 13.95 },
    { step: 8, chance: 20, bonusChance: 13.95 },
    { step: 9, chance: 15, bonusChance: 11.63 },
    { step: 10, chance: 15, bonusChance: 11.63 },
    { step: 11, chance: 10, bonusChance: 9.30 },
    { step: 12, chance: 10, bonusChance: 9.30 },
    { step: 13, chance: 10, bonusChance: 9.30 },
    { step: 14, chance: 5, bonusChance: 4.65 },
    { step: 15, chance: 4, bonusChance: 1.86 },
    { step: 16, chance: 4, bonusChance: 1.86 },
    { step: 17, chance: 3, bonusChance: 1.40 },
    { step: 18, chance: 3, bonusChance: 1.40 },
    { step: 19, chance: 3, bonusChance: 1.40 },
    { step: 20, chance: 1.5, bonusChance: 0.70 },
    { step: 21, chance: 1.5, bonusChance: 0.70 },
    { step: 22, chance: 1, bonusChance: 0.47 },
    { step: 23, chance: 1, bonusChance: 0.47 },
    { step: 24, chance: 0.5, bonusChance: 0.23 },
    { step: 25, chance: 0.5, bonusChance: 0.23 }
];


// 장비 등급
module.exports.getGradeName = (grade) => { 
    return grade == 7 ? "[에스더]" : 
           grade == 6 ? "[고대]" : 
           grade == 5 ? "[유물]" : 
           grade == 4 ? "[전설]" : 
           grade == 3 ? "[영웅]" : 
           grade == 2 ? "[희귀]" : 
           "";
}

// 장비 아이템 이름
module.exports.getItemTitle = (item) => {
    const gradeName = module.exports.getGradeName(item.grade);
    const itemName = item.grade == 7 ? item.name : item.name.substring(4, 6);
    return item.quality + " " + gradeName + " +" + item.reinforce + "강(" + item.advancedReinforce + ") " + itemName;
}

// 엘릭서 정보
module.exports.getElixir = (item) => {
    var retElixir = "";
    if(item.elixir != null){
        for(var i=0; i < item.elixir.effects.length; i++){
            var name = (item.elixir.effects[i].name).replace(/\([^)]*\)/g, "").trim();
            var nameArr = name.split(" ");
            if(nameArr.length > 1){
                retElixir += nameArr[0][0]+nameArr[1][0];
            }
            else{
                retElixir += name;
            }
            retElixir += ("Lv"+item.elixir.effects[i].level);
            retElixir += " ";
        } 
    }
    return retElixir;
}

// 초월 정보
module.exports.getTranscendence = (item) => {
    return "초월"+(item && item.transcendence && item.transcendence.point) || 0;
}

// 장신구 정보
module.exports.getAccessories = (item) => {
    // 악세
    var name = item.name.split(" ");
    var retTxt = '\n'+item.quality +" "+item.tier+"T"+ module.exports.getGradeName(item.grade) + ' '+ name[name.length-1] + '\n';
        
    var engrave_effects = Object.keys(item.engraveEffects);
    var enforce_effects = Object.keys(item.enforceEffects);

    // 각인효과
    for(var i=0; i < engrave_effects.length; i++){
        retTxt += item.engraveEffects[i].name +' '+ item.engraveEffects[i].point+' ';
    }
    for(var i=0; i < enforce_effects.length; i++){
        retTxt += Grade.findValueAndLabel(item.enforceEffects[i])+item.enforceEffects[i]+'\n';
    }

    return retTxt;
}

// 내실 정보
module.exports.getCollection = (item, name) => {
    const score = Math.floor((item.value / item.maxValue) * 100);
    const result = '▶️ ' + name + ' [' + item.value + ' / ' + item.maxValue + '] ' + score + '%\n';
    
    const output = {}; // 빈 객체 생성
    output.result = result; // result 속성 추가
    output.score = score; // score 속성 추가
    return output;
}

// 원정대 캐릭터 관련
module.exports.getMemberLv = (sortedMembers, index) => {
    var lv = sortedMembers[index] && sortedMembers[index].maxItemLevel ? sortedMembers[index].maxItemLevel : "";
    if (lv) {
        lv = "Lv" + lv;      
    } else {
        lv = ""; // 값이 없을 때 기본값 설정
    }
    return lv;
}

module.exports.getMemberName = (sortedMembers, index) => {
    var name = sortedMembers[index] && sortedMembers[index].name ? sortedMembers[index].name : "";
    return name;
}

module.exports.getMemberJob = (sortedMembers, index) => {
    var job = module.exports.JOB_CODE[sortedMembers[index] && sortedMembers[index].job ? sortedMembers[index].job : ""];
    if (job) {
        job = "[" + job + "]";      
    } else {
        job = ""; // 값이 없을 때 기본값 설정
    }
    return job;
}

// 최상단 3개의 레이드 계산 함수 (중복 제거)
module.exports.getTop3UniqueRaidsForMember = (member) => {
    // 레이드 데이터
    const raids = module.exports.RAID;

    const memberLevel = member.maxItemLevel;

    // 레벨 제한 만족하는 레이드 필터링
    const availableRaids = raids.filter(raid => memberLevel >= raid.levelRequirement);

    // 중복 레이드명을 제거하면서 보상이 높은 항목만 유지
    const uniqueRaids = [];
    const seenRaidNames = new Set();

    availableRaids
        .sort((a, b) => b.reward - a.reward) // 보상 기준으로 정렬
        .forEach(raid => {
            if (!seenRaidNames.has(raid.raidName)) {
                uniqueRaids.push(raid);
                seenRaidNames.add(raid.raidName);
            }
        });

    // 상위 3개 선택
    return uniqueRaids.slice(0, 3);
}

module.exports.sumGold = (raid, index) => {
    // raid[index]가 유효한 배열인지 확인
    if (!Array.isArray(raid[index])) {
        return 0; // 기본값 반환
    }

    // reward 속성이 있는지 확인하고 합산
    const reward1 = raid[index][0] && raid[index][0].reward ? raid[index][0].reward : 0;
    const reward2 = raid[index][1] && raid[index][1].reward ? raid[index][1].reward : 0;
    const reward3 = raid[index][2] && raid[index][2].reward ? raid[index][2].reward : 0;

    return reward1 + reward2 + reward3;
};

// 이미지 출력 함수
module.exports.makeImg = (url,title,desc) => { 

    let res = org.jsoup.Jsoup.connect('https://api.molya.kr/v1/image/create')
    .header('x-api-key', API.MOLYA_KEY)
    .data('type','url')
    .data('image',url)
    .data('title', title)
    .data('description', desc)
    .ignoreContentType(true)
    .post()
    .text();

    var retImg = JSON.parse(res);

    return retImg.data.viewUrl;
} 


// 이미지 _ oe image
module.exports.makeImgOG = (nickName, imgUrl) => {
    txt = nickName;
    size = 40;
    url = imgUrl;
    con = new java.net.URL(url).openConnection(); // URL을 통해 연결을 생성합니다.
    con.setDoInput(true); // 입력 가능한 상태로 설정합니다.
    con.setConnectTimeout(3000); // 연결 제한 시간을 3초로 설정합니다.
    con.setReadTimeout(5000); // 읽기 제한 시간을 5초로 설정합니다.
    bmp = android.graphics.BitmapFactory.decodeStream(con.getInputStream()); // 인풋 스트림으로부터 비트맵을 디코딩합니다.
    con.disconnect(); // 연결을 종료합니다.
    img = bmp.copy(Bitmap.Config.ARGB_8888, true); // 비트맵을 복사하고, 컨피그는 ARGB_8888, isMutable은 true로 설정합니다.
    can = new Canvas(img); // 캔버스를 생성합니다.
    bounds = new Rect(); // 경계 값을 저장할 Rect 객체를 생성합니다.
    paint = new Paint(); // 페인트 객체를 생성합니다.
    paint.setTextSize(size); // 텍스트 사이즈를 설정합니다.
    paint.setAntiAlias(true); // 안티 앨리어싱을 적용합니다.
    paint.getTextBounds(txt,0,txt.length,bounds); // 텍스트의 경계 값을 Rect 객체에 저장합니다.
    paint.setARGB(255,255,255,255); // 페인트 객체에 흰색을 설정합니다.
    paint2 = new Paint(); // 두 번째 페인트 객체를 생성합니다.
    paint2.setStyle(Paint.Style.STROKE); // 스트로크 스타일을 설정합니다.
    paint2.setStrokeWidth(3); // 선 굵기를 설정합니다.
    paint2.setARGB(255,0,0,0); // 검은색을 설정합니다.
    paint2.setTextSize(size); // 텍스트 사이즈를 설정합니다.
    paint2.setAntiAlias(true); // 안티 앨리어싱을 적용합니다.
    // can.drawText(txt,(can.width-bounds.width())/5,(can.height-bounds.height())/5,paint2); // 검은색으로 중앙에 텍스트를 그립니다.
    // can.drawText(txt,(can.width-bounds.width())/5,(can.height-bounds.height())/5,paint); // 흰색으로 중앙에 텍스트를 그립니다.
    bytearrayoutputstream = new java.io.ByteArrayOutputStream();
    img.compress(Bitmap.CompressFormat.JPEG, 100, bytearrayoutputstream);
    bytearray = bytearrayoutputstream.toByteArray();
    imgb64 = new java.util.Base64.getEncoder().encodeToString(bytearray);
    d = {"image":imgb64,"title":"title"};
    r = org.jsoup.Jsoup.connect("https://a.cgm97.workers.dev/s")
            .header("Content-Type", "application/json")
            .header("Accept", "text/plain")
            .followRedirects(true)
            .ignoreHttpErrors(true)
            .ignoreContentType(true)
            .method(org.jsoup.Connection.Method.POST)
            .maxBodySize(1000000*30)
            .requestBody(JSON.stringify(d))
            .timeout(0)
            .execute();
            res = r.body(); // 암호화 6자리

    
    return 'https://a.cgm97.workers.dev/e/'+res;
}

// module.exports.getItemPrice = (itemName, Code) => {

//     // auctions = 경매장 - > 보석
//     // markets = 거래소
//     var data;
    
//     if(Code == "보석"){
//         var url = "https://developer-lostark.game.onstove.com/auctions/items";
//         data = org.jsoup.Jsoup.connect(url)
//         .header("accept", "application/json")
//         .header("authorization", API.LOA_KEY)
//         .header("Content-Type", "application/json")
//         .requestBody(JSON.stringify(
//             { 
//             "CategoryCode": CategoryCode.보석,
//             "Sort": "BUY_PRICE",
//             //"ItemTier": 3,
//             "ItemName": itemName
//             }))
    
//         .ignoreHttpErrors(true)        
//         .ignoreContentType(true) 
//         .post()
//         .text();
//     }
//     else if(Code == "각인서"){
//         var url = "https://developer-lostark.game.onstove.com/markets/items";
//         data = org.jsoup.Jsoup.connect(url)
//             .header("accept", "application/json")
//             .header("authorization", API.LOA_KEY)
//             .header("Content-Type", "application/json")
//             .requestBody(JSON.stringify(
//                 {
//                 "Sort": "GRADE",
//                 "CategoryCode": CategoryCode.각인서,
                
//                 "ItemGrade": "전설",
//                 "ItemName": itemName+" 각인서",
                
//                 "SortCondition": "ASC"
//                 }))

//             .ignoreHttpErrors(true)        
//             .ignoreContentType(true) 
//             .post()
//             .text();   
//     }
//     else if(Code == "강화재료"){
//         var url = "https://developer-lostark.game.onstove.com/markets/items";
//         data = org.jsoup.Jsoup.connect(url)
//             .header("accept", "application/json")
//             .header("authorization", API.LOA_KEY)
//             .header("Content-Type", "application/json")
//             .requestBody(JSON.stringify(
//                 {
//                 "Sort": "GRADE",
//                 "CategoryCode": CategoryCode.강화재료,
                
//                 // "ItemGrade": "전설",
//                 "ItemName": itemName,

//                 "SortCondition": "ASC"
//                 }))

//             .ignoreHttpErrors(true)        
//             .ignoreContentType(true) 
//             .post()
//             .text();   
//     }
//     else if(Code == "에스더"){
//         var url = "https://developer-lostark.game.onstove.com/markets/items";
//         data = org.jsoup.Jsoup.connect(url)
//             .header("accept", "application/json")
//             .header("authorization", API.LOA_KEY)
//             .header("Content-Type", "application/json")
//             .requestBody(JSON.stringify(
//                 {
//                 "Sort": "GRADE",
//                 "CategoryCode": CategoryCode.에스더,
                
//                 // "ItemGrade": "전설",
//                 // "ItemName": itemName,

//                 "SortCondition": "ASC"
//                 }))

//             .ignoreHttpErrors(true)        
//             .ignoreContentType(true) 
//             .post()
//             .text();   
//     }
//     return JSON.parse(data);
// }

// 각인 분류 _ 앜패
module.exports.arkFilter = [
    { name: "창술 수련", initial: "고기", finalDamagePer: 6.4, criticalChancePer: 15 },
    { name: "철옹성", initial: "전태", finalDamagePer: 6.4 },
    { name: "강인한 육체", initial: "비기", moveSpeed: 20, atkSpeed: 20, finalDamagePer: 6, criticalChancePer: 63.2, },
    { name: "광기", initial: "광기", moveSpeed: 15, atkSpeed: 15, finalDamagePer: 6, criticalChancePer: 33.2 },
    { name: "중력 갑옷", initial: "분망", finalDamagePer: 6.4, criticalChancePer: 18 },
    { name: "중력 충격", initial: "중수", finalDamagePer: 6.4, criticalChancePer: 30 },
    { name: "신성한 의무", initial: "심판자", criFinalDamagePer: 8, finalDamagePer: 6 },
    { name: "신성 보호", initial: "서폿", stigmaPer: 10 },
    { name: "지치지 않는 힘", initial: "처단", criticalChancePer: 10, moveSpeed: 20, atkSpeed: 20, finalDamagePer: 6, criticalChancePer: 30 },
    { name: "끝나지 않는 분노", initial: "포식", criticalChancePer: 10, moveSpeed: 20, atkSpeed: 20, finalDamagePer: 6, criticalChancePer: 30 },
    { name: "기력 회복", initial: "체술", criticalChancePer: 10, moveSpeed: 1, atkSpeed: 1, finalDamagePer: 6 },
    { name: "속도 강화", initial: "충단", criticalChancePer: 10, moveSpeed: 1, atkSpeed: 20, finalDamagePer: 6 },
    { name: "강력한 체술", initial: "초심", criticalChancePer: 30, moveSpeed: 16, atkSpeed: 20.8, criticalDamagePer: 35, finalDamagePer: 6 },
    { name: "강력한 오의", initial: "오의", criticalChancePer: 30, moveSpeed: 16, atkSpeed: 20.8, finalDamagePer: 6 },
    { name: "세맥타통", initial: "세맥", moveSpeed: 1, atkSpeed: 10, atkPer: 6, finalDamagePer: 6 },
    { name: "역천지체", initial: "역천", moveSpeed: 1, atkSpeed: 15, atkPer: 6, finalDamagePer: 6 },
    { name: "절제", initial: "절제", criticalChancePer: 10, criFinalDamagePer: 8, criticalChancePer: 20, finalDamagePer: 6 },
    { name: "절정", initial: "절정", criticalChancePer: 10, moveSpeed: 15, atkSpeed: 15, criFinalDamagePer: 8, criticalChancePer: 20, finalDamagePer: 6 },
    { name: "일격필살", initial: "일격", criticalChancePer: 30, finalDamagePer: 6 },
    { name: "오의난무", initial: "난무", criticalChancePer: 30, atkSpeed: 8, finalDamagePer: 6 },
    { name: "권왕파천무", initial: "권왕", atkSpeed: 20, finalDamagePer: 6, criticalChancePer: 15 },
    { name: "수라의 길", initial: "수라", moveSpeed: 15, finalDamagePer: 6 },
    { name: "전술 탄환", initial: "강무", criticalChancePer: 34, finalDamagePer: 6 },
    { name: "핸드 거너", initial: "핸건", criticalChancePer: 10, moveSpeed: 8, atkSpeed: 8, skillCool: 5, finalDamagePer: 6 },
    { name: "죽음의 습격", initial: "죽습", finalDamagePer: 6 },
    { name: "두 번째 동료", initial: "두동", moveSpeed: 8, finalDamagePer: 6, criticalChancePer: 40 },
    { name: "포격 강화", initial: "포강", atkSpeed: 4, finalDamagePer: 6.4, criticalChancePer: 40 },
    { name: "화력 강화", initial: "화강", finalDamagePer: 6.4 },
    { name: "진화의 유산", initial: "유산", moveSpeed: 30, atkSpeed: 15, atkPer: 6, finalDamagePer: 6 },
    { name: "아르데타인의 기술", initial: "기술", moveSpeed: 29.2, atkPer: 6, finalDamagePer: 6 },
    { name: "피스메이커", initial: "피메", criticalChancePer: 10, atkSpeed: 16, finalDamagePer: 6 },
    { name: "사냥의 시간", initial: "사시", criticalChancePer: 10, finalDamagePer: 6 },
    { name: "황후의 은총", initial: "황후", criticalChancePer: 10, moveSpeed: 30, atkSpeed: 19.2, criticalChancePer: 33, finalDamagePer: 6 },
    { name: "황제의 칙령", initial: "황제", criticalChancePer: 10, criticalChancePer: 37.6, finalDamagePer: 6 },
    { name: "넘치는 교감", initial: "교감", moveSpeed: 10, atkSpeed: 10, finalDamagePer: 6.4, criticalChancePer: 11.8 },
    { name: "상급 소환사", initial: "상소", moveSpeed: 1, atkSpeed: 1, finalDamagePer: 6.4, criticalChancePer: 27.8 },
    { name: "구원의 선물", initial: "서폿", stigmaPer: 10 },
    { name: "진실된 용맹", initial: "진실된 용맹" },
    { name: "점화", initial: "점화", finalDamagePer: 6, criticalChancePer: 30, criticalDamagePer: 55 },
    { name: "환류", initial: "환류", finalDamagePer: 6 },
    { name: "버스트 강화", initial: "버스트", criticalChancePer: 10, moveSpeed: 22.8, atkSpeed: 32.8, finalDamagePer: 6 },
    { name: "신속한 일격", initial: "잔재", criticalChancePer: 10, moveSpeed: 24.8, atkSpeed: 24.8, finalDamagePer: 6 },
    { name: "멈출 수 없는 충동", initial: "충동", moveSpeed: 20, finalDamagePer: 6 },
    { name: "완벽한 억제", initial: "억제", moveSpeed: 30, finalDamagePer: 6 },
    { name: "달의 소리", initial: "달소", criticalChancePer: 10, moveSpeed: 30, atkSpeed: 12, finalDamagePer: 6.4, criticalChancePer: 37 },
    { name: "피냄새", initial: "갈증", criticalChancePer: 10, moveSpeed: 10, atkSpeed: 10, finalDamagePer: 6.4, criticalChancePer: 43 },
    { name: "영혼친화력", initial: "만월", moveSpeed: 39.2, atkSpeed: 10, finalDamagePer: 6, criticalChancePer: 34 },
    { name: "그믐의 경계", initial: "그믐", moveSpeed: 29.2, atkSpeed: 20, finalDamagePer: 6 },
    { name: "해의 조화", initial: "서폿", stigmaPer: 10 },
    { name: "회귀", initial: "회귀" },
    { name: "질풍노도", initial: "질풍", criticalChancePer: 10, criticalDamagePer: 102.08, finalDamagePer: 6 },
    { name: "이슬비", initial: "이슬비", criticalChancePer: 10, finalDamagePer: 6 },
    { name: "야성", initial: "야성", },
    { name: "환수 각성", initial: "환수", },

    { name: "핸드거너", initial: "핸건", criticalChancePer: 10, moveSpeed: 8, atkSpeed: 8, skillCool: 5, finalDamagePer: 6 },
    { name: "강화 무기", initial: "강무", criticalChancePer: 34, finalDamagePer: 6 },
    { name: "고독한 기사", initial: "고기", finalDamagePer: 6, criticalChancePer: 15 },
    { name: "전투 태세", initial: "전태", finalDamagePer: 6 },
    { name: "광전사의 비기", initial: "비기", moveSpeed: 20, atkSpeed: 20, finalDamagePer: 6, criticalChancePer: 63.2 },
    { name: "분노의 망치", initial: "분망", finalDamagePer: 6.4, criticalChancePer: 18 },
    { name: "중력 수련", initial: "중수", finalDamagePer: 6.4, criticalChancePer: 30 },
    { name: "심판자", initial: "심판자", criFinalDamagePer: 8, finalDamagePer: 6 },
    { name: "축복의 오라", initial: "서폿", stigmaPer: 10 },
    { name: "처단자", initial: "처단", criticalChancePer: 10, moveSpeed: 20, atkSpeed: 20, finalDamagePer: 6, criticalChancePer: 30 },
    { name: "포식자", initial: "포식", criticalChancePer: 10, moveSpeed: 20, atkSpeed: 20, finalDamagePer: 6, criticalChancePer: 30 },
    { name: "극의: 체술", initial: "체술", criticalChancePer: 10, finalDamagePer: 6 },
    { name: "충격 단련", initial: "충단", criticalChancePer: 10, atkSpeed: 20, finalDamagePer: 6 },
    { name: "초심", initial: "초심", criticalChancePer: 30, moveSpeed: 16, atkSpeed: 20.8, finalDamagePer: 6 },
    { name: "오의 강화", initial: "오의", criticalChancePer: 30, moveSpeed: 16, atkSpeed: 20.8, finalDamagePer: 6 },
    { name: "절실한 구원", initial: "서폿", stigmaPer: 10 },
    { name: "버스트", initial: "버스트", criticalChancePer: 10, moveSpeed: 22.8, atkSpeed: 32.8, finalDamagePer: 6 },
    { name: "잔재된 기운", initial: "잔재", criticalChancePer: 10, moveSpeed: 24.8, atkSpeed: 24.8, finalDamagePer: 6 },
    { name: "깔쯩", initial: "갈증", criticalChancePer: 10, moveSpeed: 10, atkSpeed: 10, finalDamagePer: 6.4, criticalChancePer: 43 },
    { name: "만월의 집행자", initial: "만월", moveSpeed: 39.2, atkSpeed: 10, finalDamagePer: 6, criticalChancePer: 34 },
    { name: "만개", initial: "서폿", stigmaPer: 10 },

]