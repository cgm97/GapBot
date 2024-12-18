const bot = BotManager.getCurrentBot();

const API = require('key');
const kakaoLinkModule = require('KakaoLinkModule');
const Data = require('data');
// var { KakaoApiService, KakaoShareClient } = require('kakaolink');

// const service = KakaoApiService.createService();
// const client = KakaoShareClient.createClient();

// const cookies = service.login({
//     signInWithKakaoTalk: true,
//     context: App.getContext(), // 레거시: Api.getContext()
// }).awaitResult();

// client.init(API.KAKAOLINK_KEY, 'https://open.kakao.com', cookies);

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
        let str = cmdArr[1];

        if(param == '경매장'){ // 보석
            try{
                var args = getPriceAuctionItem(str);

                var text = "📢 "+args.itemName+"\n";
                text += "가격 : "+args.price;
                msg.reply(text);
                // kakaoLinkModule.send(client,114257,args,msg.room)
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
            let type = cmdArr[2] || "고대"; // 고대,유물
            let count = cmdArr[3] || 3; // 연마단계
            // 고대 1연마 : 목(6) 나머지 5      유물 1연마 : 목(5) 나머지 4
            // 고대 2연마 : 목(9) 나머지 8      유물 2연마 : 목(7) 나머지 6
            // 고대 3연마 : 목(13) 나머지 12    유물 3연마 : 목(10) 나머지 9
            let point = 0;
            let itemLv = 1680;
            if(type == "고대"){
                if(count == 3){
                    point = 13;
                }
                else if(count == 2){
                    point = 9;
                }
                else if(count == 1){
                    point = 6;
                }
                else{
                    msg.reply("명령어를 확인해주세요.\n올바른 명령어 : .시세 상 고대 연마단계(1~3)");
                    return;
                }
                itemLv = 1680;
            }
            else if(type == "유물"){
                if(count == 3){
                    point = 10;
                }
                else if(count == 2){
                    point = 7;
                }
                else if(count == 1){
                    point = 5;
                }
                else{
                    msg.reply("명령어를 확인해주세요.\n올바른 명령어 : .시세 상 고대 연마단계(1~3)");
                    return;
                }
                itemLv = 1640;
            }
            else{
                msg.reply("명령어를 확인해주세요.\n올바른 명령어 : .시세 상 고대 연마단계(1~3)");
                return;
            }

            if(str == '상'){
                msg.reply("시세 " + str + " 검색중...");
                // 200010 목걸이 7(연마) 추피 41 3 13   200020 귀걸이 7(연마) 공% 45 3 9    200030 반지 7(연마) 치적% 49 3 9
                // 200010 목걸이 7(연마) 적추피 42 3 13 200020 귀걸이 7(연마) 무공% 46 3 9  200030  반지 7(연마) 치피% 50 3 9
                // 200010 목걸이 7(연마) 공+ 53 3 13    200020 귀걸이 7(연마) 공+ 53 3 9    200030  반지 7(연마) 공+ 53 3 9
                // 200010 목걸이 7(연마) 무공+ 54 3 13  200020 귀걸이 7(연마) 무공+ 54 3 9  200030  반지 7(연마) 무공+ 53 3 9
                // 200010 목걸이 7(연마) 낙인력 44 3 13  200030  반지 7(연마) 아공강% 51 3 9 200030  반지 7(연마) 아피강% 52 3 9
                // 200010 목걸이 7(연마) 세레나데 43 3 13
                text += "📢 상단일 최저가("+type+", 연마 "+count+"단계)\n";
                try{
                    text += "\n※ 목걸이\n";
                    text += "적주피%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,42,12,point), count))+"\n";
                    text += "추가피해%: " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,41,11,point), count))+"\n";
                    text += "낙인력%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,44,12,point), count))+"\n";
                    text += "세레나데 : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,43,12,point), count))+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions(7,45,12,point-1), count))+"\n";
                    text += "무공%    : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions(7,46,12,point-1), count))+"\n";

                    text += "\n※ 반지\n";
                    text += "치피%    : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,50,12,point-1), count))+"\n";
                    text += "치적%    : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,49,12,point-1), count))+"\n";
                    text += "아피강%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,52,12,point-1), count))+"\n";
                    text += "아공강%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,51,12,point-1), count));
                } catch(e){
                    text = "검색 중 오류발생\n검색결과가 없습니다.";
                }
            } else if(str == '상상'){
                if(count < 2){
                    msg.reply(str+"의 연마단계 조건은 2단계부터 검색 가능합니다.");
                    return;
                }
                msg.reply("시세 " + str + " 검색중...");
                text += "📢 상상 최저가("+type+", 연마 "+count+"단계)\n";
                try{ 
                    text += "\n※ 목걸이\n";
                    text += "적주피% + 추가피해% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,42,41,12,11,point), count))+"\n";
                    text += "낙인력% + 세레나데 : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,44,43,12,12,point), count))+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,45,46,12,12,point-1), count))+"\n";
                    text += "무공% + 무공+  : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,54,12,12,point-1), count))+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,50,49,12,12,point-1), count))+"\n";
                    text += "아피강% + 아공강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,52,51,12,12,point-1), count));
                } catch(e){
                    text = "검색 중 오류발생";
                }
            } else if(str == '상중'){
                if(count < 2){
                    msg.reply(str+"의 연마단계 조건은 2단계부터 검색 가능합니다.");
                    return;
                }
                msg.reply("시세 " + str + " 검색중...");
                text += "📢 상중 최저가("+type+", 연마 "+count+"단계)\n";
                try{ 
                    text += "\n※ 목걸이\n";
                    text += "적주피% + 추가피해% : " +  getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,42,41,12,9,point), count))+"\n";
                    text += "추가피해% + 적주피% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,41,42,11,10,point), count))+"\n";
                    text += "낙인력% + 세레나데 : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,44,43,12,10,point), count))+"\n";
                    text += "세레나데 + 낙인력% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,43,44,12,10,point), count))+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,45,46,12,10,point-1), count))+"\n";
                    text += "무공% + 공격력% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,45,12,10,point-1), count))+"\n";
                    text += "무공% + 무공+  : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,54,12,11,point-1), count))+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,50,49,12,10,point-1), count))+"\n";
                    text += "치적% + 치피% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,49,50,12,10,point-1), count))+"\n";
                    text += "아피강% + 아공강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,52,51,12,10,point-1), count))+"\n";
                    text += "아공강% + 아피강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,51,52,12,10,point-1), count));
                } catch(e){
                    text = "검색 중 오류발생";
                }
            } else if(str == '상하'){
                if(count < 2){
                    msg.reply(str+"의 연마단계 조건은 2단계부터 검색 가능합니다.");
                    return;
                }
                msg.reply("시세 " + str + " 검색중...");
                text += "📢 상하 최저가("+type+", 연마 "+count+"단계)\n";
                try{ 
                    text += "\n※ 목걸이\n";
                    text += "적주피% + 추가피해% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,42,41,12,4,point), count))+"\n";
                    text += "추가피해% + 적주피% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,41,42,11,5,point), count))+"\n";
                    text += "낙인력% + 세레나데 : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,44,43,12,4,point), count))+"\n";
                    text += "세레나데 + 낙인력% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,43,44,12,4,point), count))+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,45,46,12,4,point-1), count))+"\n";
                    text += "무공% + 공격력% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,45,12,4,point-1), count))+"\n";
                    text += "무공% + 무공+  : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,54,12,9,point-1), count))+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,50,49,12,4,point-1), count))+"\n";
                    text += "치적% + 치피% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,49,50,12,5,point-1), count))+"\n";
                    text += "아피강% + 아공강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,52,51,12,4,point-1), count))+"\n";
                    text += "아공강% + 아피강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,51,52,12,4,point-1), count));
                } catch(e){
                    text = "검색 중 오류발생";
                }
            } else if(str == '중'){
                msg.reply("시세 " + str + " 검색중...");
                text += "📢 중단일 최저가("+type+", 연마 "+count+"단계)\n";
                try{
                    text += "\n※ 목걸이\n";
                    text += "적주피%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,42,10,point), count))+"\n";
                    text += "추가피해%: " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,41,9,point), count))+"\n";
                    text += "낙인력%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,44,10,point), count))+"\n";
                    text += "세레나데 : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions(7,43,10,point), count))+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions(7,45,10,point-1), count))+"\n";
                    text += "무공%    : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions(7,46,10,point-1), count))+"\n";

                    text += "\n※ 반지\n";
                    text += "치피%    : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,50,10,point-1), count))+"\n";
                    text += "치적%    : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,49,10,point-1), count))+"\n";
                    text += "아피강%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,52,10,point-1), count))+"\n";
                    text += "아공강%  : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions(7,51,10,point-1), count));
                } catch(e){
                    text = "검색 중 오류발생";
                }   
            }  else if(str == '중중'){
                if(count < 2){
                    msg.reply(str+"의 연마단계 조건은 2단계부터 검색 가능합니다.");
                    return;
                }
                msg.reply("시세 " + str + " 검색중...");
                text += "📢 중중 최저가("+type+", 연마 "+count+"단계)\n";
                try{ 
                    text += "\n※ 목걸이\n";
                    text += "적주피% + 추가피해% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,42,41,10,9,point), count))+"\n";
                    text += "낙인력% + 세레나데 : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,44,43,10,10,point), count))+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,45,46,10,10,point-1), count))+"\n";
                    text += "무공% + 무공+  : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,54,10,10,point-1), count))+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,50,49,10,10,point-1), count))+"\n";
                    text += "아피강% + 아공강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,52,51,10,10,point-1), count));
                } catch(e){
                    text = "검색 중 오류발생";
                }
            } else if(str == '중하'){
                msg.reply("시세 " + str + " 검색중...");
                text += "📢 중하 최저가("+type+", 연마 "+count+"단계)\n";
                try{ 
                    text += "\n※ 목걸이\n";
                    text += "적주피% + 추가피해% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,42,41,10,4,point), count))+"\n";
                    text += "추가피해% + 적주피% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,41,42,9,5,point), count))+"\n";
                    text += "낙인력% + 세레나데 : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,44,43,10,4,point), count))+"\n";
                    text += "세레나데 + 낙인력% : " + getBuyPrice(getAccessoriesPrice(itemLv,200010,getEtcOptions2(7,43,44,10,4,point), count))+"\n";

                    text += "\n※ 귀걸이\n";
                    text += "공격력% + 무공% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,45,46,10,4,point-1), count))+"\n";
                    text += "무공% + 공격력% : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,45,10,4,point-1), count))+"\n";
                    text += "무공% + 무공+  : " + getBuyPrice(getAccessoriesPrice(itemLv,200020,getEtcOptions2(7,46,54,10,9,point-1), count))+"\n";

                    text += "\n※ 반지\n";
                    text += "치피% + 치적% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,50,49,10,4,point-1), count))+"\n";
                    text += "치적% + 치피% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,49,50,10,5,point-1), count))+"\n";
                    text += "아피강% + 아공강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,52,51,10,4,point-1), count))+"\n";
                    text += "아공강% + 아피강% : " + getBuyPrice(getAccessoriesPrice(itemLv,200030,getEtcOptions2(7,51,52,10,4,point-1), count));
                } catch(e){
                    text = "검색 중 오류발생";
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
                text += "📢 강화재료 최저가\n\n";
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
            } else if(cmdArr[1] == '식물'){
                text += "📢 식물채집 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.식물채집, null);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += "\n"+item.Name +" "+set_comma(item.CurrentMinPrice);
                    });
                }
            } else if(cmdArr[1] == '벌목'){
                text += "📢 벌목 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.벌목, null);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += "\n"+item.Name +" "+set_comma(item.CurrentMinPrice);
                    });
                }
            } else if(cmdArr[1] == '채광'){
                text += "📢 채광 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.채광, null);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                         text += "\n"+item.Name +" "+set_comma(item.CurrentMinPrice);
                    });
                }
            } else if(cmdArr[1] == '수렵'){
                text += "📢 수렵 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.수렵, null);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += "\n"+item.Name +" "+set_comma(item.CurrentMinPrice);
                    });
                }
            } else if(cmdArr[1] == '낚시'){
                text += "📢 낚시 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.낚시, null);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += "\n"+item.Name +" "+set_comma(item.CurrentMinPrice);
                    });
                }
            } else if(cmdArr[1] == '고고학'){
                text += "📢 고고학 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.고고학, null);
                if(data.Items.length > 0){
                    data.Items.forEach(item => {
                        text += "\n"+item.Name +" "+set_comma(item.CurrentMinPrice);
                    });
                }
            }
            
            else{
                msg.reply("존재하지않는 명령어입니다. /명령어를 확인해주세요.");
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
function getAccessoriesPrice(itemLv, CategoryCode, etcOptions, upgradeLv){
    var data;
    var url = "https://developer-lostark.game.onstove.com/auctions/items";
    data = org.jsoup.Jsoup.connect(url)
    .header("accept", "application/json")
    .header("authorization", API.LOA_KEY)
    .header("Content-Type", "application/json")
    .requestBody(JSON.stringify(
        {
            "ItemLevelMin": itemLv,
            "ItemLevelMax": itemLv,
            "ItemUpgradeLevel": upgradeLv,
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

// 검색결과가 없을때 대비
function getBuyPrice(args) {
    if (args.Items && args.Items.length > 0 && args.Items[0].AuctionInfo) {
        return set_comma(args.Items[0].AuctionInfo.BuyPrice);
    }
    return "조회된 아이템이 없습니다.";
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
function onCommand(msg) {
    if(msg.args[1] != "2"){
        return;
    }
    if(msg.command == "컴파일"){
        var ret = BotManager.compile(msg.args[0],true)
        if(ret){
            msg.reply("완료");
        }
        else{
            msg.reply("실패");
        }
    }
    if(msg.command == "컴파일확인"){
        var ret = BotManager.isCompiled(msg.args[0])
        if(ret){
            msg.reply("활성화");
        }
        else{
            msg.reply("비활성화");
        }
    }
}
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