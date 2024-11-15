const scriptName = "LostArk";

const KakaoLinkModule = require('KakaoLinkModule');
const Func = require('function');
const imgUrl = "https://pica.korlark.com/";
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
        let str = msg.substr(cmdArr[0].length + 1).trim();

        if(param == '정보'){

            var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
            var characterInfo = JSON.parse(croll);

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
            var total_point = hat_point + ornaments_point + top_point + pants_point + gloves_point + weapon_point;

            var args = {
                img : characterInfo.image,
                title : characterInfo.title,
                nickName : characterInfo.name,
                itemLv : characterInfo.maxItemLevel,
                lv : characterInfo.level,
                expeditionLv : characterInfo.expeditionLevel,
                job : Func.JOB_CODE[characterInfo.job],
                server : Func.SERVER_CODE[characterInfo.server],
                guild : characterInfo.guild.name,
                crit : characterInfo.stats.crit.value,
                spez : characterInfo.stats.specialization.value,
                swift : characterInfo.stats.swiftness.value,
                engrav : engravingStr,
                evolution : characterInfo.arkPassive.evolution,
                realization : characterInfo.arkPassive.realization,
                leap : characterInfo.arkPassive.leap,
                elixirNpointTitle : (elixir && total_point) ? "엘/초" : "",
                elixirNpointData : (elixir && total_point) ? elixir + " / " + total_point : ""

            };
            KakaoLinkModule.send(114159,args,room);
        }
        else if(param == '장비'){
            var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
            var characterInfo = JSON.parse(croll);

            var weapon = characterInfo.equipments.weapon;
            var argWeapon = {
                title : "무기",
                itemTitle_1 : Func.getItemTitle(weapon),
                itemDesc_1 : Func.getTranscendence(weapon),
                img1 : imgUrl + weapon.icon,
            };
            KakaoLinkModule.send(114176,argWeapon,room);
        }
        else if(param == '장신구'){
            var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
            var characterInfo = JSON.parse(croll);
        
            var necklace  = characterInfo.accessories.necklace; //목걸이
            var earring_1 = characterInfo.accessories.earring1; // 귀걸이
            var earring_2 = characterInfo.accessories.earring2; // 귀걸이
            var ring_1  = characterInfo.accessories.ring1; // 반지
            var ring_2 = characterInfo.accessories.ring2; // 반지
            var bracelet = characterInfo.accessories.bracelet; // 팔찌
        
            var retTxt = "📢 "+ str+"님의 장신구";
            // 장신구
            retTxt += Func.getAccessories(necklace);
            retTxt += Func.getAccessories(earring_1);
            retTxt += Func.getAccessories(earring_2);
            retTxt += Func.getAccessories(ring_1);
            retTxt += Func.getAccessories(ring_2);

            // 팔찌
            retTxt += '\n\n'+ Func.getGradeName(bracelet.grade) + ' '+ bracelet.name + '\n';
            for(var i=0; i < bracelet.effects.length; i++){
                retTxt += bracelet.effects[i].name||bracelet.effects[i].description;
                retTxt += " ";
            }
            replier.reply(retTxt);
        }
        else if(param == '내실'){
            var characterInfo = JSON.parse(org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/character/"+str+"/collection").ignoreContentType(true).get().text());

            var island_heart = Func.getCollection(characterInfo.island_heart);
            var giant_heart = Func.getCollection(characterInfo.giant_heart);
            var ignea_token = Func.getCollection(characterInfo.ignea_token);
            var masterpiece = Func.getCollection(characterInfo.masterpiece);
            var memory_orgel = Func.getCollection(characterInfo.memory_orgel);
            var mokoko_seed = Func.getCollection(characterInfo.mokoko_seed);
            var orpheus_star = Func.getCollection(characterInfo.orpheus_star);
            var sea_bounty = Func.getCollection(characterInfo.sea_bounty);
            var world_tree_leaf = Func.getCollection(characterInfo.world_tree_leaf);
            var crimsnail_chart = Func.getCollection(characterInfo.crimsnail_chart);

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

            replier.reply(result);
        }
        else if(param == '모험섬'){
            var date = new Date();
            var year = date.getFullYear();
            var month = ("0" + (1 + date.getMonth())).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);
            
            // 요일 배열 (일요일부터 시작)
            var daysInKorean = ["일", "월", "화", "수", "목", "금", "토"];
            var dayOfWeek = daysInKorean[date.getDay()];     
            var today = year + "-" + month + "-" + day;
            
            // 토요일 또는 일요일이고 13시 기준으로 이전이면 0, 이후면 1
            var timeCheck = 0;
            if ((dayOfWeek === "토" || dayOfWeek === "일") && date.getHours() >= 12) {
                timeCheck = 1;
            }
            var islandJson = JSON.parse(org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/calendar/adventure-islands?date="+today).ignoreContentType(true).get().text());
            
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
                bonusReward_1: Func.REWARD[selectedIslands[0].bonusRewardType],
                img1 : imgUrl+selectedIslands[0].icon,
                islandName_2 : selectedIslands[1].name,
                bonusReward_2: Func.REWARD[selectedIslands[1].bonusRewardType],
                img2 : imgUrl+selectedIslands[1].icon,
                islandName_3 : selectedIslands[2].name,
                bonusReward_3: Func.REWARD[selectedIslands[2].bonusRewardType],
                img3 : imgUrl+selectedIslands[2].icon,
    
            };

            // replier.reply(JSON.stringify(args));
            KakaoLinkModule.send(114231,args,room);
        }
        else if(param == '부캐'){
            var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
            var characterInfo = JSON.parse(croll);

            var memberArr = characterInfo.members;
            // 현재 검색된 캐릭의 서버
            var server = characterInfo.server;

            var myCharacter = [];
            for(var i=0; i < memberArr.length; i++){
                if(memberArr[i].server == server && memberArr[i].maxItemLevel != -1){
                    myCharacter.push(memberArr[i]);
                }
                // replier.reply(memberArr[i].server);
            }

            // maxItemLevel 내림차순 정렬
            const sortedMembers = myCharacter.sort((a, b) => b.maxItemLevel - a.maxItemLevel); // maxItemLevel 기준 내림차순 정렬
            var args = {
                nickName: str,
                server: Func.SERVER_CODE[server],
            
                name: Func.getMemberName(sortedMembers, 0),
                title: Func.getMemberLv(sortedMembers, 0),
                job: Func.getMemberJob(sortedMembers, 0),

                title_1: Func.getMemberLv(sortedMembers, 1),
                name_1: Func.getMemberName(sortedMembers, 1),
                job_1: Func.getMemberJob(sortedMembers, 1),

                title_2: Func.getMemberLv(sortedMembers, 2),
                name_2: Func.getMemberName(sortedMembers, 2),
                job_2: Func.getMemberJob(sortedMembers, 2),

                title_3:Func.getMemberLv(sortedMembers, 3),
                name_3: Func.getMemberName(sortedMembers, 3),
                job_3: Func.getMemberJob(sortedMembers, 3),

                title_4: Func.getMemberLv(sortedMembers, 4),
                name_4: Func.getMemberName(sortedMembers, 4),
                job_4: Func.getMemberJob(sortedMembers, 4),

                title_5: Func.getMemberLv(sortedMembers, 5),
                name_5: Func.getMemberName(sortedMembers, 5),
                job_5: Func.getMemberJob(sortedMembers, 5),
            }; 
            KakaoLinkModule.send(114294,args,room);
        }
        else if(param == '경매장'){ // 보석
            if(isNaN(str)){
                var args = getPriceAuctionItem(str);
                KakaoLinkModule.send(114257,args,room);
            }
            else{
                replier.reply('잘못된 명령어 입니다.');
            }       
        }
    }
    
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
    try{
        if(flag == '보석'){
            price = priceJson.Items[0].AuctionInfo.BuyPrice;
            var args = {
                itemName : itemName,
                flag : flag,
                price : set_comma(price),
                img : priceJson.Items[0].Icon
            };      
        } 
        return args;
    } catch(e){
        return '잘못된 아이템 명이거나 존재하지 않습니다.';
    }
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