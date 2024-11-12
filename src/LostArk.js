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

            var  croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
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
            var hat_point = characterInfo.equipments.hat.transcendence.point;
            var ornaments_point = characterInfo.equipments.ornaments.transcendence.point;
            var top_point = characterInfo.equipments.top.transcendence.point;
            var pants_point = characterInfo.equipments.pants.transcendence.point;
            var gloves_point = characterInfo.equipments.gloves.transcendence.point;
            var weapon_point = characterInfo.equipments.weapon.transcendence.point;


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
                elixir : characterInfo.equipments.elixirSetEffects[0].name,
                point : (hat_point+ornaments_point+top_point+pants_point+gloves_point+weapon_point)
            };
            KakaoLinkModule.send(114159,args,room);
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