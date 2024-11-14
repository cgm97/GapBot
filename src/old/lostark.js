const scriptName = "lostark";
importPackage(android.graphics);

// 이미지 생성 function
// Func.img(이미지URL, 제목, 설명);
const Func = require('function');
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    
    if(msg.startsWith(".")){
        let cmd = msg.slice(1);
        var cmdArr = cmd.split(' ');

        let param = cmdArr[0];

        if(param == '보석'){
            let nickName = msg.substr(cmdArr[0].length + 1).trim();
            if(isNaN(nickName)){
                replier.reply(getUserGem(nickName));
            }
            else {
                replier.reply('잘못된 명령어 입니다.');
            }              
        }
        if(param == '분배금' || param == 'ㅂㅂㄱ'){
            let gold = msg.substr(cmdArr[0].length + 1).trim();
            if(!isNaN(gold)){
                replier.reply(calGold(gold));
            }
            else{
                replier.reply('잘못된 명령어 입니다.');
            }
        }
        if(param == '아바타'){
            let nickName = msg.substr(cmdArr[0].length + 1).trim();
            if(isNaN(nickName)){
                replier.reply('아바타 이미지 생성중...');
                var data0 = org.jsoup.Jsoup.connect("https://lostark.game.onstove.com/Profile/Character/" + nickName).get();
                var imgUrl = data0.select(".profile-equipment__character img").attr("src");

                // replier.reply(Func.makeImgOG(nickName,imgUrl));  
                replier.reply(Func.makeImg(imgUrl,nickName,'아바타'));         
            }
            else{
                replier.reply('잘못된 명령어 입니다.');
            }      
        }
        if(param == '떠상'){
            let serverName = msg.substr(cmdArr[0].length + 1).trim();
            if(isNaN(serverName)){
                replier.reply(getMarketInfo(serverName));        
            }
            else{
                replier.reply('잘못된 명령어 입니다.');
            }        
        }
        if(param == '모험섬'){
            var date = new Date();
            var year = date.getFullYear();
            var month = ("0" + (1 + date.getMonth())).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);

            //replier.reply(getIsland(year +"-"+ month +"-"+ day));     
        }
        if(param == '크리스탈'){
            replier.reply(getCrystal());     
        }

        if(param == '부캐'){
            let nickName = msg.substr(cmdArr[0].length + 1).trim();
            if(isNaN(nickName)){
                replier.reply(getSubUserInfo(nickName));
            }
            else{
                replier.reply('잘못된 명령어 입니다.');
            }         
        }
        if(param == '주급'){
            let nickName = msg.substr(cmdArr[0].length + 1).trim();
            if(isNaN(nickName)){
                replier.reply(getCalWeekGold(nickName));
            }
            else{
                replier.reply('잘못된 명령어 입니다.');
            }       
        }
        if(param == '거래소'){ // 각인서 , 재료 등
            let itemName = msg.substr(cmdArr[0].length + 1).trim();
            if(isNaN(itemName)){
                replier.reply(getPriceMarketItem(itemName));
            }
            else{
                replier.reply('잘못된 명령어 입니다.');
            }       
        }
        if(param == '경매장'){ // 보석
            // let itemName = msg.substr(cmdArr[0].length + 1).trim();
            // if(isNaN(itemName)){
            //     replier.reply(getPriceAuctionItem(itemName));
            // }
            // else{
            //     replier.reply('잘못된 명령어 입니다.');
            // }       
        }
        if(param == '클골'){ 
            replier.reply("클리어(더보기)\n"+
            "노말 발탄 1,200(-700)\n"+
            "하드 발탄 1,800(-1,050)\n"+
            "노말 비아키스 1,600(-850)\n"+
           "하드 비아키스 2,400(-1,200)\n"+
            "노1하23 비아키스 2,200(-1,100)\n"+
            "노말 쿠크세이튼 3,000(-1,500)\n"+
            "노말 아브렐슈드 7,000(-4,500)\n"+
            "하드 아브렐슈드 10,500(-6,000)\n"+
            "노말 카양겔 4,500(-3,000)\n"+
            "하드 카양겔 5,500(-3,400)\n"+
            "노말 일리아칸 6,500(-3,500)\n"+
            "하드 일리아칸 10,000(-4,500)\n"+
            "노말 상아탑 9,000(-3,500)\n"+
            "하드 상아탑 14,500(-5,500)\n"+
            "노말 카멘 13,000\n"+
            "하드 카멘 41,000"
            );         
        }
        
    }
}


// 보석 정보 조회
function getUserGem(nickName) {

    var data0;

    try{
        data0 = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/character/" + nickName).ignoreContentType(true).get().text();
    } catch(e){
        return '존재하지 않는 캐릭터입니다.';
    }

    var infoJson = JSON.stringify(data0);
    infoJson = JSON.parse(data0);
    
    var jewel_Key = Object.keys(infoJson.jewels);

    var bodyText = '';
    var powerGemCnt = 0;
    var coolGemCnt = 0;

    var jewel_arr = []; // 보석 배열 정렬 용 (내림차순)
    for(var i=0; i < jewel_Key.length; i++){
        if(infoJson.jewels[jewel_Key[i]].cooldown != null){      
            // 7레벨 홍염의 보석 [스킬이름] 
            jewel_arr.push({"name":infoJson.jewels[jewel_Key[i]].cooldown.name + ' ['+infoJson.jewels[jewel_Key[i]].cooldown.skill +']',
                            "level": infoJson.jewels[jewel_Key[i]].cooldown.level
                            });
            coolGemCnt++;
        }
        if(infoJson.jewels[jewel_Key[i]].damage != null){     
            jewel_arr.push({"name":infoJson.jewels[jewel_Key[i]].damage.name + ' ['+infoJson.jewels[jewel_Key[i]].damage.skill +']',
                            "level": infoJson.jewels[jewel_Key[i]].damage.level
                            }); 
            powerGemCnt++;
        }
    }

    var headText = '';
    headText += '📢 '+nickName+ ' 님의 보석 현황\n';

    if(powerGemCnt < 1 && coolGemCnt < 1){
        headText += '장착된 보석이 없습니다.';
    }
    else{
        headText += '멸화 ['+powerGemCnt+'개] 홍염 ['+coolGemCnt+'개]\n\n';
    }

    jewel_arr.sort((a,b) => b.level - a.level); // 내림차순

    for(var i=0; i<jewel_arr.length; i++){
        bodyText += jewel_arr[i].name + '\n';
    }

    return headText + bodyText;
}

// 분배금 최적가
function calGold(gold) {
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

function getMarketInfo(serverName){

    if(Func.SERVER_CODE[serverName] == undefined){
        return '잘못된 서버명입니다.';
    }
    let info = JSON.parse(org.jsoup.Jsoup.connect("https://api.korlark.com/merchants?limit=15&server="+Func.SERVER_CODE[serverName]).ignoreContentType(true).get().text());

    var header = '📢 떠돌이상인 - '+serverName+' ⸜(*◉ ᴗ ◉)⸝\n\n';
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

// 금일 모험섬 정보
function getIsland(today){
    let info = JSON.parse(org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/calendar/adventure-islands?date="+today).ignoreContentType(true).get().text());

    var infoJson = info;


    var header = '📢 오늘의 모험섬 정보 (ว˙∇˙)ง\n'+today+'\n';
    var result = '';

    for(var i=0; i < infoJson.length; i++){
        if(i == 3){
            result += '\n------------------------------------\n\n';
        }
        var reward = '';
        if(infoJson[i].bonusRewardType == 0){
            reward = '골드'
        }
        else if(infoJson[i].bonusRewardType == 1){
            reward = '카드'
        }
        else if(infoJson[i].bonusRewardType == 2){
            reward = '주화'
        }
        else if(infoJson[i].bonusRewardType == 3){
            reward = '실링'
        } 
        else {
            
        }

        result += '▶️ ' + infoJson[i].name +' ⎝⍥⎠ ' + reward +'섬';

        if(i != infoJson.length-1){
            result += "\n";
        }
    }


    return header + result;
}

// 크리스탈 실시간 가격
function getCrystal(){
    var info = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1mon").ignoreContentType(true).get().text());
    var info1 = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1h").ignoreContentType(true).get().text());

    pre_price = parseInt(info1[info1.length-2].close);
    now_price = parseInt(info[info.length-1].close);

    var result = '📢 실시간 크리스탈 시세 정보\n\n';

    result += '100 : ' + set_comma(now_price);
    if(now_price > pre_price) {
        result += ' (🔺'+set_comma(now_price-pre_price)+')';
    } else if(now_price < pre_price) {
        result += ' (🔽'+set_comma(pre_price-now_price)+')';
    }
    
    result += '\n\n100 크리스탈 : 골드 (기준 : 1시간)'
    return result;
}   

// 부캐 목록 조회
function getSubUserInfo(nickName) {

    let info;
    try{
        info = JSON.parse(org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/character/"+nickName+"/expedition").ignoreContentType(true).get().text());
    }
    catch(e){
        return '존재하지않는 캐릭터입니다.';
    }

    var infoJson = info;

    var server1Arr = []; //루페온
    var server2Arr = []; //실리안
    var server3Arr = []; //아만
    var server4Arr = []; //아브렐슈드
    var server5Arr = []; //카단
    var server6Arr = []; //카마인
    var server7Arr = []; //카제로스
    var server8Arr = []; //니나브

    for(var i=0; i<infoJson.characters.length;i++){
        if(infoJson.characters[i].server == Func.SERVER_CODE["루페온"]){
            server1Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }
        else if(infoJson.characters[i].server == Func.SERVER_CODE["실리안"]){
            server2Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }
        else if(infoJson.characters[i].server == Func.SERVER_CODE["아만"]){
            server3Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }
        else if(infoJson.characters[i].server == Func.SERVER_CODE["아브렐슈드"]){
            server4Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }
        else if(infoJson.characters[i].server == Func.SERVER_CODE["카단"]){
            server5Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }
        else if(infoJson.characters[i].server == Func.SERVER_CODE["카마인"]){
            server6Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }
        else if(infoJson.characters[i].server == Func.SERVER_CODE["카제로스"]){
            server7Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }
        else if(infoJson.characters[i].server == Func.SERVER_CODE["니나브"]){
            server8Arr.push(
                Func.JOB_CODE[infoJson.characters[i].job] +"\n"+
                "["+infoJson.characters[i].level+"] "+ infoJson.characters[i].name + " (Lv."+infoJson.characters[i].max_item_level+")\n"
            )
        }

    }

    var header = '📢 부캐 목록\n';
    var result = '';

    if(server1Arr.length > 0){
        result += '\n⊰✿ 루페온\n'
        for(var i=0; i < server1Arr.length; i++){
            result += server1Arr[i];
        }
    }
    if(server2Arr.length > 0){
        result += '\n⊰✿ 실리안\n'
        for(var i=0; i < server2Arr.length; i++){
            result += server2Arr[i];
        }
    }
    if(server3Arr.length > 0){
        result += '\n⊰✿ 아만\n'
        for(var i=0; i < server3Arr.length; i++){
            result += server3Arr[i];
        }
    }
    if(server4Arr.length > 0){
        result += '\n⊰✿ 아브렐슈드\n'
        for(var i=0; i < server4Arr.length; i++){
            result += server4Arr[i];
        }
    }
    if(server5Arr.length > 0){
        result += '\n⊰✿ 카단\n'
        for(var i=0; i < server5Arr.length; i++){
            result += server5Arr[i];
        }
    }
    if(server6Arr.length > 0){
        result += '\n⊰✿ 카마인\n'
        for(var i=0; i < server6Arr.length; i++){
            result += server6Arr[i] ;
        }
    }
    if(server7Arr.length > 0){
        result += '\n⊰✿ 카제로스\n'
        for(var i=0; i < server7Arr.length; i++){
            result += server7Arr[i];
        }
    }
    if(server8Arr.length > 0){
        result += '\n⊰✿ 니나브\n'
        for(var i=0; i < server8Arr.length; i++){
            result += server8Arr[i];
        }
    }

    return header + result;
}

// 주급 계산
function getCalWeekGold(nickName){

    let info;
    try{
        info = JSON.parse(org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/character/"+nickName+"/expedition").ignoreContentType(true).get().text());
    }
    catch(e){
        return '존재하지않는 캐릭터입니다.';
    }

    var infoJson = info;

    var server = 0;
    var lvList = []; // 검색 캐릭과 같은 서버 원정대캐릭 레벨 저장 리스트

    // 검색 캐릭터 서버 찾기
    for(var i=0; i<infoJson.characters.length;i++){
        if(infoJson.characters[i].name == nickName){
            server = infoJson.characters[i].server;
        }  
    }

    // 같은 서버 캐릭 정보 -> LV 찾기
    for(var i=0; i<infoJson.characters.length;i++){
        if(infoJson.characters[i].server == server){
            lvList.push(Math.floor(infoJson.characters[i].max_item_level));
        }  
    }

    // 레벨 높은 순 -> 가장 많은 주급 계산을 하기 위해
    lvList = lvList.sort(function(a,b){ // 내림차순
        return b - a;
    });
    

    // 주급 계산
    var limitCnt = 0; // 주간골드량 제한캐릭 수 (현재 6개)
    var totalSum = 0; // ㅗㅇ 주급
    for(var i=0; i < lvList.length; i++){

        if(lvList[i] >= 1620 ){
            totalSum += Func.LV_GOLD["1620"];
        }
        else if(lvList[i] >= 1600 && lvList[i] < 1620 ){
            totalSum += Func.LV_GOLD["1600"];
        }
        else if(lvList[i] >= 1580 && lvList[i] < 1600 ){
            totalSum += Func.LV_GOLD["1580"];
        }
        else if(lvList[i] >= 1560 && lvList[i] < 1580 ){
            totalSum += Func.LV_GOLD["1560"];
        }
        else if(lvList[i] >= 1550 && lvList[i] < 1560 ){
            totalSum += Func.LV_GOLD["1550"];
        }
        else if(lvList[i] >= 1540 && lvList[i] < 1550 ){
            totalSum += Func.LV_GOLD["1540"];
        }
        else if(lvList[i] >= 1520 && lvList[i] < 1540 ){
            totalSum += Func.LV_GOLD["1520"];
        }
        else if(lvList[i] >= 1500 && lvList[i] < 1520 ){
            totalSum += Func.LV_GOLD["1500"];
        }
        else if(lvList[i] >= 1490 && lvList[i] < 1500 ){
            totalSum += Func.LV_GOLD["1490"];
        }
        else { // 1490 미만은 계산안함
            totalSum += 0;
        }
        
        limitCnt += 1;

        if(limitCnt == 6){
            break;
        }
    }
    
    var header = '📢 '+Func.SERVER_CODE[server]+' [' + nickName+ ']님 주급 정보 \n\n';
    var result = '(상위 6캐릭)\n총 ' + set_comma(totalSum)+" G";
    result += '\n\n※1490미만 캐릭터 계산 X'
    return header + result;
}

// 거래소
function getPriceMarketItem(itemName) {
   
    var bookKeys = Object.keys(Func.BOOKINDEX);

    var flag='각인서';
    for(var i=0; i < bookKeys.length; i++){
        if(bookKeys[i] == itemName){
            flag = '각인서';
            itemName = Func.BOOKINDEX[bookKeys[i]];
            break;
        }
    }
    
    if(itemName == '에스더 기운'){
        flag = '에스더'
    }
    var priceJson = Func.getItemPrice(itemName,flag);

    var price;
    var result = '';

    try{
        if(flag == '각인서'){
            price = priceJson.Items[0].CurrentMinPrice;
            result +=  '📢 '+ itemName+' 각인서\n';
            // result +=  '현재가 : '+set_comma(price);
            result +=  Func.makeImg(priceJson.Items[0].Icon,itemName+" 각인서",set_comma(price));
        } 
        else if(flag == '에스더'){
            price = priceJson.Items[0].CurrentMinPrice;
            result +=  '📢 '+ itemName+'\n';
            result +=  set_comma(price);
            // result +=  '현재가 : '+set_comma(price);
            // result +=  Func.makeImg(priceJson.Items[0].Icon,itemName,set_comma(price));
        } 

    } catch(e){
        return '해당 아이템은 현재 지원하지 않습니다..';
    }

    return result;
}

// 경매장
function getPriceAuctionItem(itemName) {
   
    var keys = Object.keys(Func.GEMINDEX); 

    var flag='';
    for(var i=0; i < keys.length; i++){
        if(keys[i] == itemName){
            flag = '보석';
            itemName = Func.GEMINDEX[keys[i]];
            break;
        }
    }
    
    var priceJson = Func.getItemPrice(itemName,flag);

    var price;
    var result = '';

    try{
        if(flag == '보석'){
            price = priceJson.Items[0].AuctionInfo.BuyPrice;
            result +=  '📢 '+ itemName+'\n';
            result +=  set_comma(price);
            // result +=  '현재가 : '+set_comma(price);
            // result +=  Func.makeImg(priceJson.Items[0].Icon,itemName,set_comma(price));
        } 

    } catch(e){
        return '잘못된 아이템 명이거나 존재하지 않습니다.';
    }

    return result;
}

// 천단위 콤마 함수
function set_comma(price) {

    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

}

//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}