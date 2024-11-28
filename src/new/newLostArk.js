const bot = BotManager.getCurrentBot();

const API = require('key');
const lostArkFunc = require('LostArkFunc');
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
    if(!msg.isGroupChat){
      msg.reply("해당 명령어를 실행 할 권한이 없습니다.\n관리자에게 문의주세요.");
      return ;
    }

    let cmd = msg.content.slice(1);
    var cmdArr = cmd.split(' ');
    let param = cmdArr[0];
    let str = msg.content.substr(cmdArr[0].length + 1).trim();

    if(param == '정보'){
      try{
      var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch(e){
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      lostArkFunc.selectCharacterInfo(client, characterInfo,msg.room);
    }
    else if(param == '장비'){
      try{
      var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch(e){
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      lostArkFunc.selectCharacterEquip1(client, characterInfo,msg.room);
    }
    else if(param == '장신구'){
      try{
        var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch(e){
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      msg.reply(lostArkFunc.selectCharacterAccessories(characterInfo,str));
    }
    else if(param == '내실'){
      try{
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/character/"+str+"/collection").ignoreContentType(true).get().text();
      } catch(e){
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      
      var characterInfo = JSON.parse(croll);

      msg.reply(lostArkFunc.selectCharacterCollection(characterInfo,str));
    }
    else if(param == '모험섬'){
      var date = new Date();
      var year = date.getFullYear();
      var month = ("0" + (1 + date.getMonth())).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);
      var today = year + "-" + month + "-" + day;
      var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/calendar/adventure-islands?date="+today).ignoreContentType(true).get().text();
      var islandJson = JSON.parse(croll);

      lostArkFunc.selectAdventureIsland(client,islandJson,today,msg.room);
    }
    else if(param == '부캐'){
      try{
      var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch(e){
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      lostArkFunc.selectMembers(client,characterInfo,str,msg.room);
    }
    else if(param == '주급'){
      try{
      var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch(e){
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      lostArkFunc.selectCharactersGold(client,characterInfo,msg.room);
    }
    else if(param == '앜패'){
      try{
      var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch(e){
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      var arkPassive = characterInfo.arkPassive;
      if(!arkPassive.enabled){
        msg.reply('아크패시브 비활성화 캐릭입니다.');
        return ;
      }
      else{
        msg.reply(lostArkFunc.selectCharacterArkPassive(arkPassive,str));
      }
    }
    else if(param == '분배금' || param == 'ㅂㅂㄱ'){
      if(!isNaN(str)){
        msg.reply(lostArkFunc.calGold(str));
      }
      else{
        msg.reply('잘못된 명령어 입니다.');
      }
    }
    else if(param == '떠상'){
      if(isNaN(str)){
        if(Data.SERVER_CODE[str] == undefined){
          msg.reply('잘못된 서버명입니다.');
          return ;
        }
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/merchants?limit=15&server="+Data.SERVER_CODE[str]).ignoreContentType(true).get().text();
        var characterInfo = JSON.parse(croll);
        msg.reply(lostArkFunc.getMarketInfo(str,characterInfo));        
      }
      else{
        msg.reply('잘못된 명령어 입니다.');
      }        
    }
    if(param == '크리스탈'){
      var min = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1mon").ignoreContentType(true).get().text());
      var hour = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1h").ignoreContentType(true).get().text());
      msg.reply(lostArkFunc.getCrystal(min,hour));     
    }
    if(param == '보석'){
      try{
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/character/" + str).ignoreContentType(true).get().text();
      } catch(e){
        return msg.reply('존재하지 않는 캐릭터입니다.');
      }
      var characterInfo = JSON.parse(croll);
      if(isNaN(str)){
        msg.reply(lostArkFunc.getUserGem(str,characterInfo));
      }
      else {
        msg.reply('잘못된 명령어 입니다.');
      }              
    }

  }
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
  var cmd = msg.command
  if(cmd == "명령어"){
    lostArkFunc.getCmd(client,msg.room);
  }
  else if(cmd =="로또"){
    let percent = msg.args[0]
    var data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?&query=로또번호").get();
    if(!isNaN(percent)){
      msg.reply(lostArkFunc.lotto(msg.author.name, percent, data));
    }
    else {
      msg.reply(lostArkFunc.lotto(msg.author.name, 0, data));         
    }
  }

}
bot.setCommandPrefix("/"); //@로 시작하는 메시지를 command로 판단
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