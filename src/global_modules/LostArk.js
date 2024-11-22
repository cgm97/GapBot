const bot = BotManager.getCurrentBot();

const KakaoLinkModule = require('KakaoLinkModule');
const Func = require('function');
const imgUrl = "https://pica.korlark.com/";

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
  // msg.reply("@@@#");
}
bot.addListener(Event.MESSAGE, onMessage);


/** * (string) msg.content: 메시지의 내용
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
  let cmd = msg.content.slice(1);
  var cmdArr = cmd.split(' ');
  let param = cmdArr[0];
  let str = msg.content.substr(cmdArr[0].length + 1).trim();
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
}
bot.setCommandPrefix("@"); //@로 시작하는 메시지를 command로 판단
bot.addListener(Event.COMMAND, onCommand);


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