const scriptName = "equip";

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
    let cmd = msg.slice(1);
    var cmdArr = cmd.split(' ');
    let param = cmdArr[0];
    let str = msg.substr(cmdArr[0].length + 1).trim();

    if(msg.startsWith(".")){
        if(param == '장비'){
            java.lang.Thread.sleep(1000);
            var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
            var characterInfo = JSON.parse(croll);
            var hat = characterInfo.equipments.hat;
            var ornaments = characterInfo.equipments.ornaments;
            var top = characterInfo.equipments.top;
            var pants = characterInfo.equipments.pants;
            var gloves = characterInfo.equipments.gloves;
            var weapon = characterInfo.equipments.weapon;
    
            var avg_quality = (hat.quality + ornaments.quality + top.quality + pants.quality + gloves.quality + weapon.quality) / 6;
            var imgUrl = "https://pica.korlark.com/";

            var args = {
                title : "방어구",
                itemTitle_1 : Func.getItemTitle(hat),
                itemDesc_1 : Func.getElixir(hat) + Func.getTranscendence(hat),
                img1 : imgUrl + hat.icon,
                itemTitle_2 : Func.getItemTitle(ornaments),
                itemDesc_2 : Func.getElixir(ornaments) + Func.getTranscendence(ornaments),
                img2 : imgUrl + ornaments.icon,
                itemTitle_3 : Func.getItemTitle(top),
                itemDesc_3 : Func.getElixir(top) + Func.getTranscendence(top),
                img3 : imgUrl + top.icon,
                itemTitle_4 : Func.getItemTitle(pants),
                itemDesc_4 : Func.getElixir(pants) + Func.getTranscendence(pants),
                img4 : imgUrl + pants.icon,
                itemTitle_5 : Func.getItemTitle(gloves),
                itemDesc_5 : Func.getElixir(gloves) + Func.getTranscendence(gloves),
                img5 : imgUrl + gloves.icon
            };
    
            KakaoLinkModule.send(114176,args,room);
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