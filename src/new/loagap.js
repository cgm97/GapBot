const bot = BotManager.getCurrentBot();

const API = require('key');
var { KakaoApiService, KakaoShareClient } = require('kakaolink');
const KakaoLinkModule = require('KakaoLinkModule');
const service = KakaoApiService.createService();
const client = KakaoShareClient.createClient();
const lostArkFunc = require('LostArkFunc');

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
 * (string | null) msg.author.hash: 사용자의 고유 id
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 * (boolean) msg.isMention: 메세지 맨션 포함 여부
 * (bigint) msg.logId: 각 메세지의 고유 id
 * (bigint) msg.channelId: 각 방의 고유 id
 */
function onMessage(msg) {

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

  if (!msg.isGroupChat) {
    return;
  }
  const userCode = msg.author.hash ? msg.author.hash : msg.author.name;
  const roomCode = msg.channelId;
  var myNickName = "";
  if (msg.command == "정보" || msg.command == "ㅈㅂ" || msg.command == "내정보" || msg.command == "ㄴㅈㅂ") {
    var nickName = msg.args[0];

    if (msg.command == "내정보") {
      myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
      nickName = myNickName;
      if (nickName == "") {
        return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
      }
    }

    try {
      var characterInfo = org.jsoup.Jsoup.connect("https://api.loagap.com/character/search?nickName=" + nickName).ignoreContentType(true)
        .header("referer", "bot.loagap.com")
        .get().text();

      characterInfo = JSON.parse(characterInfo);

      // 캐릭터 장비
      var equipItems = characterInfo.equipItems;

      var retTxt = "📢 " + nickName + "님의 장비\n";
      var avgProgress = 0;
      const itemNames = ["투구", "견갑", "상의", "하의", "장갑", "무기"];

      // 장비
      for (var i = 0; i < equipItems.length; i++) {
        if (equipItems[i].name != "평균") {
          var nameParts = equipItems[i].name.split(" "); // 공백 기준으로 분리
          var prefix = nameParts[0]; // "+16"
          var suffix = nameParts[nameParts.length - 1].startsWith("X") ? nameParts[nameParts.length - 1] : ""; // "X10" 또는 ""

          retTxt += "\n[" + equipItems[i].tier + "T " + equipItems[i].grade + "] " + prefix + " " + itemNames[i] + " " + suffix + " : " + equipItems[i].progress;
          avgProgress += parseFloat(equipItems[i].progress);
        }
      }

      retTxt += "\n\n• 평균 품질 : " + (avgProgress / 6).toFixed(1);
      retTxt += '\n\n더보기 ▼' + '\u200b'.repeat(501) + "\n";
      retTxt += '\n❙ 엘릭서 정보\n';
      for (var i = 0; i < equipItems.length - 2; i++) {
        if (equipItems[i].name != "평균") {
          retTxt += "[" + itemNames[i] + "] ";
          for (var j = 0; j < equipItems[i].elixirs.length; j++) {
            retTxt += equipItems[i].elixirs[j] + " ";
          }
          retTxt += "\n";
        }
      }
      retTxt += "\n• 엘릭서 합계 : " + equipItems[6].elixirSum;
      retTxt += '\n\n❙ 초월 정보';
      for (var i = 0; i < equipItems.length; i++) {
        if (equipItems[i].name != "평균") {
          retTxt += "\n[" + itemNames[i] + "] " + (equipItems[i].hyperLevel || 0) + " " + (equipItems[i].hyper || 0);
        }
      }
      retTxt += "\n\n• 초월 합계 : " + equipItems[6].hyperSum || 0;

      retTxt += "\n\n• 후원안내 •\n" + "https://www.loagap.com/donate";
      msg.reply(retTxt);

      // 캐릭터 정보
      var engravings = characterInfo.engravings;
      var engravingStr = "";

      for (var i = 0; i < engravings.length; i++) {
        engravingStr += characterInfo.engravings[i].name.substring(0, 1);
        if (characterInfo.engravings[i].abilityLevel != "") {
          engravingStr += "(" + characterInfo.engravings[i].grade + "," + characterInfo.engravings[i].abilityLevel.substring(3) + ")";
        } else {
          engravingStr += "(" + characterInfo.engravings[i].grade + ")";
        }

        if (i != engravings.length) {
          engravingStr += " ";
        }
      }

      var gemItems = characterInfo.gemItems;

      function buildGemString(type, prefix) {
        var result = prefix;
        var hasGem = false;

        for (var i = 0; i < gemItems.length; i++) {
          if (gemItems[i].type === type) {
            result += gemItems[i].level;
            hasGem = true;
          }
        }

        return hasGem ? result + ")" : "";
      }

      var gemStrPower4 = buildGemString("겁화", "겁(");
      var gemStrPower3 = buildGemString("멸화", "멸(");
      var gemStrCool4 = buildGemString("작열", "작(");
      var gemStrCool3 = buildGemString("홍염", "홍(");

      var args = {
        img: characterInfo.profile.IMG_URL || "",
        title: characterInfo.profile.TITLE || "",
        nickName: characterInfo.profile.NICKNAME || "",
        itemLv: characterInfo.profile.ITEM_LEVEL || "",
        lv: characterInfo.profile.CHARACTER_LEVEL || "",
        expeditionLv: characterInfo.profile.EXPEDITION_LEVEL || "",
        job: characterInfo.profile.JOB || "",
        server: characterInfo.profile.SERVER || "",
        guild: characterInfo.guild.NAME || "",
        crit: characterInfo.profile.STATS[0].Value || "",
        spez: characterInfo.profile.STATS[1].Value || "",
        swift: characterInfo.profile.STATS[3].Value || "",
        engrav: engravingStr || "",
        evolution: characterInfo.arkItems.evolution.point || "",
        realization: characterInfo.arkItems.enlightenment.point || "",
        leap: characterInfo.arkItems.leap.point || "",
        elixirNpointTitle: "엘/초",
        elixirNpointData: characterInfo.equipItems[6].elixirAbility + "(" + characterInfo.equipItems[6].elixirSum + ")" + " / " + characterInfo.equipItems[6].hyperSum + "(" + characterInfo.equipItems[6].hyperAvg.substring(3) + ")",

        elixirValue: characterInfo.equipItems[6].elixirValue == null || characterInfo.equipItems[6].elixirValue === 0
          ? ""
          : "엘릭서(" + characterInfo.equipItems[6].elixirValue + "%)",

        hyperValue: characterInfo.equipItems[6].hyperValue == null || characterInfo.equipItems[6].hyperValue === 0
          ? ""
          : "초월(" + characterInfo.equipItems[6].hyperValue + "%)",


        bangleValue: characterInfo.accessoryItems[6] && characterInfo.accessoryItems[6].bangleValue != null && characterInfo.accessoryItems[6].bangleValue !== 0
          ? "팔찌(" + characterInfo.accessoryItems[6].bangleValue + "%)"
          : "",

        stigmaticValue: characterInfo.equipItems[6].stigmaticValue == null || characterInfo.equipItems[6].stigmaticValue === 0
          ? ""
          : "낙인력(" + characterInfo.equipItems[6].stigmaticValue + "%)",

        supportJob: characterInfo.profile.SUBJOB,

        cardName: characterInfo.cardItems.name,
        gemStr: gemStrPower4 + gemStrPower3 + gemStrCool4 + gemStrCool3,

        donate: characterInfo.profile.IS_DONATE == "Y" ? "https://www.loagap.com/donation.png" : "https://www.loagap.com/logo.png",
        donateKing: characterInfo.profile.IS_DONATE == "Y" ? "https://www.loagap.com/donationKing.png" : ""
      };

      KakaoLinkModule.send(client, 114159, args, msg.room);
    } catch (e) {
      msg.reply("존재하지 않는 캐릭터입니다.");
    }
  }

  else if (msg.command == "보석" || msg.command == "ㅂㅅ" || msg.command == "내보석" || msg.command == "ㄴㅂㅅ") {
    var nickName = msg.args[0];
    if (msg.command == "내보석" || msg.command == "ㄴㅂㅅ") {
      myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
      nickName = myNickName;
      if (nickName == "") {
        return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
      }
    }
    try {

      var characterInfo = org.jsoup.Jsoup.connect("https://api.loagap.com/character/search?nickName=" + nickName).ignoreContentType(true).header("referer", "bot.loagap.com").get().text();

      characterInfo = JSON.parse(characterInfo);

      var gemItems = characterInfo.gemItems;

      var headText = '';
      headText += '📢 ' + nickName + ' 님의 보석 현황 (딜 점유율 표시)\n';

      var bodyText = '';
      gemItems.forEach(gem => {
        bodyText += "\n" + gem.level + gem.type + " [" + gem.name + "] " + (gem.option !== "" ? "(" + gem.option + ")" : "");
      });

      msg.reply(headText + bodyText);
    } catch (e) {
      msg.reply("존재하지 않는 캐릭터입니다.");
    }
  }

  else if (msg.command == '팔찌' || msg.command == 'ㅍㅉ' || msg.command == '내팔찌' || msg.command == 'ㄴㅍㅉ') {
    var nickName = msg.args[0];

    if (msg.command == "내팔찌" || msg.command == "ㄴㅍㅉ") {
      myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
      nickName = myNickName;
      if (nickName == "") {
        return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
      }
    }
    try {
      var croll = org.jsoup.Jsoup.connect("https://api.loagap.com/character/search?nickName=" + nickName).ignoreContentType(true).header("referer", "bot.loagap.com").get().text();
    } catch (e) {
      msg.reply("존재하지 않는 캐릭터입니다.");
    }
    var characterInfo = JSON.parse(croll);
    var accessoryItems = characterInfo.accessoryItems; // 팔찌

    var retTxt = "📢 " + nickName + "님의 팔찌\n";
    // 팔찌
    accessoryItems.forEach(bangleOption => {
      if (bangleOption.name == "팔찌") {
        retTxt += "\n" + bangleOption.tier + "T " + bangleOption.grade + " (" + bangleOption.bangleValue + "%)";
        bangleOption.options.forEach(option => {
          retTxt += "\n" + (option.grade ? "[" + option.grade + "] " : "") + option.optionName;
        })
      }
    })
    msg.reply(retTxt);
  }
  else if (msg.command == '큐브' || msg.command == 'ㅋㅂ') {
    var croll = org.jsoup.Jsoup.connect("https://api.loagap.com/bot/cube?roomCode=" + roomCode + "&userCode=" + userCode).ignoreContentType(true).get().text();
    msg.reply(lostArkFunc.getUserCharCubeInfo(msg.author.name, croll));
  }

}
bot.setCommandPrefix("."); //@로 시작하는 메시지를 command로 판단
bot.addListener(Event.COMMAND, onCommand);


function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) { }

function onResume(activity) { }

function onPause(activity) { }

function onStop(activity) { }

function onRestart(activity) { }

function onDestroy(activity) { }

function onBackPressed(activity) { }

bot.addListener(Event.Activity.CREATE, onCreate);
bot.addListener(Event.Activity.START, onStart);
bot.addListener(Event.Activity.RESUME, onResume);
bot.addListener(Event.Activity.PAUSE, onPause);
bot.addListener(Event.Activity.STOP, onStop);
bot.addListener(Event.Activity.RESTART, onRestart);
bot.addListener(Event.Activity.DESTROY, onDestroy);
bot.addListener(Event.Activity.BACK_PRESSED, onBackPressed);