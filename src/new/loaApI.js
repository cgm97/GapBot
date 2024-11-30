const bot = BotManager.getCurrentBot();

const API = require('key');
const kakaoLinkModule = require('KakaoLinkModule');
const Data = require('data');
var { KakaoApiService, KakaoShareClient } = require('kakaolink');

const service = KakaoApiService.createService();
const client = KakaoShareClient.createClient();

const cookies = service.login({
    signInWithKakaoTalk: true,
    context: App.getContext(), // 레거시: Api.getContext()
}).awaitResult();

client.init(API.KAKAOLINK_KEY, 'https://open.kakao.com', cookies);

/**
 * (string) msg.content: 메시지의 내용
 * (string) msg.room: 메시지를 받은 방 이름
 * (User) msg.author: 메시지 전송자
 * (string) msg.author.name: 메시지 전송자 이름
 * (Image) msg.author.avatar: 메시지 전송자 프로필 사진
 * (string) msg.author.avatar.getBase64()
 * (string | null) msg.author.userHash: 사용자의 고유 id
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 * (boolean) msg.isMention: 메세지 맨션 포함 여부
 * (bigint) msg.logId: 각 메세지의 고유 id
 * (bigint) msg.channelId: 각 방의 고유 id
 */
function onMessage(msg) {
    if(msg.content.startsWith(".")){
        let cmd = msg.content.slice(1);
        var cmdArr = cmd.split(' ');
        let param = cmdArr[0];
        let str = msg.content.substr(cmdArr[0].length + 1).trim();
    
        if(param == '경매장'){ // 보석
            try{
                var args = getPriceAuctionItem(str);
                kakaoLinkModule.send(client,114257,args,msg.room)
            }catch(e){
                msg.reply("잘못된 아이템 명이거나 존재하지 않습니다.");
            }
        }
        if(param == '거래소'){ // 각인서
            try{
                str = value = Data.BOOKINDEX[str] || str;
                var data = getPriceMarketItem(str);
                
                if (data.Items && data.Items[0]) {
                    var itemName = data.Items[0].Name;
                    
                    var text = "📢 "+itemName+" 최저가\n";
                    data.Items.forEach((Item) => {
                        text +="\n"+Item.Grade + " " + set_comma(Item.RecentPrice);
                    });

                    msg.reply(text);
                } else {
                    msg.reply("잘못된 아이템 명이거나 존재하지 않습니다.");
                }

            }catch(e){
                msg.reply("잘못된 아이템 명이거나 존재하지 않습니다.");
            }
            
        }
        else if(param == '시세'){ 
            var text = "";
            if(str == '상'){
                // 200010 목걸이 7(연마) 추피 41 3 13   200020 귀걸이 7(연마) 공% 45 3 9    200030 반지 7(연마) 치적% 49 3 9
                // 200010 목걸이 7(연마) 적추피 42 3 13 200020 귀걸이 7(연마) 무공% 46 3 9  200030  반지 7(연마) 치피% 50 3 9
                // 200010 목걸이 7(연마) 공+ 53 3 13    200020 귀걸이 7(연마) 공+ 53 3 9    200030  반지 7(연마) 공+ 53 3 9
                // 200010 목걸이 7(연마) 무공+ 54 3 13  200020 귀걸이 7(연마) 무공+ 54 3 9  200030  반지 7(연마) 무공+ 53 3 9
                // 200010 목걸이 7(연마) 낙인력 44 3 13  200030  반지 7(연마) 아공강% 51 3 9 200030  반지 7(연마) 아피강% 52 3 9
                // 200010 목걸이 7(연마) 세레나데 43 3 13
                text += "📢 상단일 최저가(고대, 연마3)\n";
                text += "\n※ 목걸이\n";
                try{
                    text += "적주피%  : " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,42,3,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "추가피해%: " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,41,3,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "낙인력%  : " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,44,3,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "세레나데 : " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,43,3,13)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력%  : " + set_comma(getAccessoriesPrice(200020,getEtcOptions(7,45,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "무공%    : " + set_comma(getAccessoriesPrice(200020,getEtcOptions(7,46,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 반지\n";
                    text += "치피%    : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,50,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "치적%    : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,49,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "아피강%  : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,52,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "아공강%  : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,51,3,12)).Items[0].AuctionInfo.BuyPrice);
                } catch(e){
    
                }
            } if(str == '중'){
                text += "📢 중단일 최저가(고대, 연마3)\n";
                text += "\n※ 목걸이\n";
                try{
                    text += "적주피%  : " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,42,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "추가피해%: " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,41,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "낙인력%  : " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,44,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "세레나데 : " + set_comma(getAccessoriesPrice(200010,getEtcOptions(7,43,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력%  : " + set_comma(getAccessoriesPrice(200020,getEtcOptions(7,45,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "무공%    : " + set_comma(getAccessoriesPrice(200020,getEtcOptions(7,46,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 반지\n";
                    text += "치피%    : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,50,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "치적%    : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,49,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "아피강%  : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,52,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "아공강%  : " + set_comma(getAccessoriesPrice(200030,getEtcOptions(7,51,2,12)).Items[0].AuctionInfo.BuyPrice);
                } catch(e){
    
                }
            } else if(str == '상상'){
                text += "📢 상상 최저가(고대, 연마3)\n";
                text += "\n※ 목걸이\n";
                try{ 
                    text += "적주피% + 추가피해% : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,42,41,3,3,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "낙인력% + 세레나데 : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,44,43,3,3,13)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + set_comma(getAccessoriesPrice(200020,getEtcOptions2(7,45,46,3,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "무공% + 무공+  : " + set_comma(getAccessoriesPrice(200020,getEtcOptions2(7,46,54,3,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,50,49,3,3,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "아피강% + 아공강% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,52,51,3,2,12)).Items[0].AuctionInfo.BuyPrice);
                } catch(e){
    
                }
            } else if(str == '상중'){
                text += "📢 상중 최저가(고대, 연마3)\n";
                text += "\n※ 목걸이\n";
                try{ 
                    text += "적주피% + 추가피해% : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,42,41,3,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "추가피해% + 적주피% : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,41,42,3,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "낙인력% + 세레나데 : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,44,43,3,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "세레나데 + 낙인력% : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,43,44,3,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + set_comma(getAccessoriesPrice(200020,getEtcOptions2(7,45,46,3,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "무공% + 공격력% : " + set_comma(getAccessoriesPrice(200020,getEtcOptions2(7,46,45,3,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "무공% + 무공+  : " + set_comma(getAccessoriesPrice(200020,getEtcOptions2(7,46,54,3,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,50,49,3,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "치적% + 치피% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,49,50,3,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "아피강% + 아공강% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,52,51,3,2,12)).Items[0].AuctionInfo.BuyPrice+"\n");
                    text += "아공강% + 아피강% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,51,52,3,2,12)).Items[0].AuctionInfo.BuyPrice);
                } catch(e){
    
                }
            } else if(str == '중중'){
                text += "📢 중중 최저가(고대, 연마3)\n";
                text += "\n※ 목걸이\n";
                try{ 
                    text += "적주피% + 추가피해% : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,42,41,2,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "낙인력% + 세레나데 : " + set_comma(getAccessoriesPrice(200010,getEtcOptions2(7,44,43,2,2,13)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + set_comma(getAccessoriesPrice(200020,getEtcOptions2(7,45,46,2,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "무공% + 무공+  : " + set_comma(getAccessoriesPrice(200020,getEtcOptions2(7,46,54,2,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,50,49,2,2,12)).Items[0].AuctionInfo.BuyPrice)+"\n";
                    text += "아피강% + 아공강% : " + set_comma(getAccessoriesPrice(200030,getEtcOptions2(7,52,51,2,2,12)).Items[0].AuctionInfo.BuyPrice);
                } catch(e){
    
                }
            } else if(cmdArr[1] == '유각'){
                let page = cmdArr[2]||1;
                text += "📢 유물각인서 최저가 "+page+"페이지\n\n";
                var data = getBookPrice(Data.CategoryCode.각인서, "유물", page);

                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += item.Name.replace("각인서","").replace(" ","") +" "+set_comma(item.CurrentMinPrice)+"\n";
                    });
                    if(data.Items.length == 10){
                        text += "\n다음페이지 검색( .시세 유각 "+ (Number(page)+1)+") ";
                    }
                    else{
                        text += "\n마지막페이지";
                    }
                }
                else{
                    text += "검색 결과가 없습니다.";
                }
            } else if(cmdArr[1] == '전각'){
                let page = cmdArr[2]||1;
                text += "📢 전설각인서 최저가 "+page+"페이지\n\n";
                var data = getBookPrice(Data.CategoryCode.각인서, "전설", page);

                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += item.Name.replace("각인서","").replace(" ","") +" "+set_comma(item.CurrentMinPrice)+"\n";
                    });
                    if(data.Items.length == 10){
                        text += "\n다음페이지 검색( .시세 전각 "+ (Number(page)+1)+") ";
                    }
                    else{
                        text += "\n마지막페이지";
                    }
                }
                else{
                    text += "검색 결과가 없습니다.";
                }
            } else if(cmdArr[1] == '재료'){
                let page = cmdArr[2]||1;
                text += "📢 재료 최저가\n\n";
                var data = getMarketItemPrice(Data.CategoryCode.에스더기운, 3);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += item.Name +" "+set_comma(item.CurrentMinPrice)+"\n";
                    });
                }
                text += "\n== 4티어 ==\n";
                var data = getMarketItemPrice(Data.CategoryCode.강화재료, 4);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += item.Name +" "+set_comma(item.CurrentMinPrice)+"\n";
                    });
                }
                text += "\n";
                var data = getMarketItemPrice(Data.CategoryCode.강화추가재료, 4);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        if(item.Grade == '영웅'){
                            text += item.Name +" "+set_comma(item.CurrentMinPrice)+"\n";
                        }
                    });
                }
                text += "\n== 3티어 ==";
                var data = getMarketItemPrice(Data.CategoryCode.강화재료, 3);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += "\n"+item.Name +" "+set_comma(item.CurrentMinPrice);
                    });
                }
            }
            msg.reply(text);
        }

    }
}

// 경매장
function getPriceMarketItem(itemName) {

    var data;
    var url = "https://developer-lostark.game.onstove.com/markets/items";
    data = org.jsoup.Jsoup.connect(url)
    .header("accept", "application/json")
    .header("authorization", API.LOA_KEY)
    .header("Content-Type", "application/json")
    .requestBody(JSON.stringify(
        { 
        "CategoryCode": Data.CategoryCode.각인서,
        "Sort": "BUY_PRICE",
        "ItemName": itemName
        }))

    .ignoreHttpErrors(true)        
    .ignoreContentType(true) 
    .post()
    .text();
    
    data = JSON.parse(data);
    return data;
}

// 거래소
function getPriceAuctionItem(itemName) {

    var keys = Object.keys(Data.GEMINDEX); 
    
    var flag='';
    for(var i=0; i < keys.length; i++){
        if(keys[i] == itemName){
            flag = '보석';
            itemName = Data.GEMINDEX[keys[i]];
            break;
        }
    }  
    var priceJson = getItemPrice(itemName,flag);
    var price;
    var args;
    try{
        if(flag == '보석'){
            price = priceJson.Items[0].AuctionInfo.BuyPrice;
            args = {
                itemName : itemName,
                flag : flag,
                price : set_comma(price),
                img : priceJson.Items[0].Icon
            };      
        } 
        
    } catch(e){
    }
    return args;
    }

// 아이템 상세정보 (상단일)
function getEtcOptions(firstOption, secondOption, value, point){

    var etcOptions = [
        {
            // 상단일
            "FirstOption": firstOption,        
            "SecondOption": secondOption,
            "MinValue": value,
            "MaxValue": value
        }
        ,
        { // 깨포
            "FirstOption": 8,        
            "SecondOption": 1,
            "MinValue": point,
            "MaxValue": point
        }
        ]
    return etcOptions;
}
// 아이템 상세정보 (상중)
function getEtcOptions2(firstOption, secondOption, secondOption2,value1, value2, point){

    var etcOptions = [
        {
            // 상옵
            "FirstOption": firstOption,        
            "SecondOption": secondOption,
            "MinValue": value1,
            "MaxValue": value1
        }
        ,
        {
            // 중옵
            "FirstOption": firstOption,        
            "SecondOption": secondOption2,
            "MinValue": value2,
            "MaxValue": value2
        } 
        ,
        { // 깨포
            "FirstOption": 8,        
            "SecondOption": 1,
            "MinValue": point,
            "MaxValue": point
        }
        ]
    return etcOptions;
}

function getItemPrice(itemName, Code){

    // auctions = 경매장 - > 보석
    // markets = 거래소
    var data;
    if(Code == "보석"){
        var url = "https://developer-lostark.game.onstove.com/auctions/items";
        data = org.jsoup.Jsoup.connect(url)
        .header("accept", "application/json")
        .header("authorization", API.LOA_KEY)
        .header("Content-Type", "application/json")
        .requestBody(JSON.stringify(
            { 
            "CategoryCode": Data.CategoryCode.보석,
            "Sort": "BUY_PRICE",
            //"ItemTier": 3,
            "ItemName": itemName
            }))

        .ignoreHttpErrors(true)        
        .ignoreContentType(true) 
        .post()
        .text();
    }
    data = JSON.parse(data);
    return data;
}

// 상단일 악세사리 검색용
// 200010 목걸이 7(연마) 추피 41 3 13   200020 귀걸이 7(연마) 공% 45 3 9    200030 반지 7(연마) 치적% 49 3 9
// 200010 목걸이 7(연마) 적추피 42 3 13 200020 귀걸이 7(연마) 무공% 46 3 9  200030  반지 7(연마) 치피% 50 3 9
// 200010 목걸이 7(연마) 공+ 53 3 13    200020 귀걸이 7(연마) 공+ 53 3 9    200030  반지 7(연마) 공+ 53 3 9
// 200010 목걸이 7(연마) 무공+ 54 3 13  200020 귀걸이 7(연마) 무공+ 54 3 9  200030  반지 7(연마) 무공+ 53 3 9
// 200010 목걸이 7(연마) 낙인력 44 3 13  200030  반지 7(연마) 아공강% 51 3 9 200030  반지 7(연마) 아피강% 52 3 9
function getAccessoriesPrice(CategoryCode, etcOptions){
    var data;
    var url = "https://developer-lostark.game.onstove.com/auctions/items";
    data = org.jsoup.Jsoup.connect(url)
    .header("accept", "application/json")
    .header("authorization", API.LOA_KEY)
    .header("Content-Type", "application/json")
    .requestBody(JSON.stringify(
        {
            "ItemLevelMin": 1680,
            "ItemLevelMax": 1700,
            "ItemUpgradeLevel": 3,
            "CategoryCode": CategoryCode,
            "ItemGradeQuality": null,
            "SkillOptions": [],
            "EtcOptions": etcOptions,
            "Sort": "BUY_PRICE",
            "PageNo": 1,
            "SortCondition": "ASC"
        }
    ))
    .ignoreHttpErrors(true)        
    .ignoreContentType(true) 
    .post()
    .text();

    data = JSON.parse(data);
    return data;
}

// 각인서 조회
function getBookPrice(CategoryCode, ItemGrade, PageNo){
    var data;
    var url = "https://developer-lostark.game.onstove.com/markets/items";
    data = org.jsoup.Jsoup.connect(url)
            .header("accept", "application/json")
            .header("authorization", API.LOA_KEY)
            .header("Content-Type", "application/json")
            .requestBody(JSON.stringify(
                {
                // 현재 최저가
                "Sort": "CURRENT_MIN_PRICE",
                "CategoryCode": CategoryCode,  
                "ItemGrade": ItemGrade,
                "PageNo":PageNo,
                "SortCondition": "DESC"
                }))

            .ignoreHttpErrors(true)        
            .ignoreContentType(true) 
            .post()
            .text();   

    data = JSON.parse(data);
    return data;
}

// 마켓재료 조회
function getMarketItemPrice(CategoryCode, ItemTier){
    var data;
    var url = "https://developer-lostark.game.onstove.com/markets/items";
    data = org.jsoup.Jsoup.connect(url)
            .header("accept", "application/json")
            .header("authorization", API.LOA_KEY)
            .header("Content-Type", "application/json")
            .requestBody(JSON.stringify(
                {
                    "CategoryCode": CategoryCode,
                    "ItemTier": ItemTier,
                    "Sort" : "CURRENT_MIN_PRICE ",
                    "SortCondition":"DESC"
                  }))

            .ignoreHttpErrors(true)        
            .ignoreContentType(true) 
            .post()
            .text();   

    data = JSON.parse(data);
    return data;
}
bot.addListener(Event.MESSAGE, onMessage);


/**
 * (string) msg.content: 메시지의 내용
 * (string) msg.room: 메시지를 받은 방 이름
 * (User) msg.author: 메시지 전송자
 * (string) msg.author.name: 메시지 전송자 이름
 * (Image) msg.author.avatar: 메시지 전송자 프로필 사진
 * (string) msg.author.avatar.getBase64()
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 * (string) msg.command: 명령어 이름
 * (Array) msg.args: 명령어 인자 배열
 */
function onCommand(msg) {}
bot.setCommandPrefix("@"); //@로 시작하는 메시지를 command로 판단
bot.addListener(Event.COMMAND, onCommand);


function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

// 천단위 콤마 함수
function set_comma(price){
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}

function onRestart(activity) {}

function onDestroy(activity) {}

function onBackPressed(activity) {}

bot.addListener(Event.Activity.CREATE, onCreate);
bot.addListener(Event.Activity.START, onStart);
bot.addListener(Event.Activity.RESUME, onResume);
bot.addListener(Event.Activity.PAUSE, onPause);
bot.addListener(Event.Activity.STOP, onStop);
bot.addListener(Event.Activity.RESTART, onRestart);
bot.addListener(Event.Activity.DESTROY, onDestroy);
bot.addListener(Event.Activity.BACK_PRESSED, onBackPressed);