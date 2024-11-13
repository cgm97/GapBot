const scriptName = "LostArk";

const KakaoLinkModule = require('KakaoLinkModule');
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

            var imgUrl = "https://pica.korlark.com/";
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
    }
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