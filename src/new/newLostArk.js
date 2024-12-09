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

const dataFile = "refiningDB"; // 재련DB
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
    else if(param == '크리스탈'){
      var min = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1mon").ignoreContentType(true).get().text());
      var hour = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1h").ignoreContentType(true).get().text());
      msg.reply(lostArkFunc.getCrystal(min,hour));     
    }
    else if(param == '보석'){
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
    else if(param == '사사게'){
      if(str == ""){
        txt = "검색 키워드를 입력하세요.";
        msg.reply(txt);
        return;
      }
      var croll = org.jsoup.Jsoup.connect("https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword="+str).ignoreContentType(true).get();
      var rows  = croll.select("#new-board > form > div > table > tbody > tr:not(.notice)");

      const rawHtml = String(rows.select(".tit a"));
      // <a class="subject-link" 태그로 분리
      const links = rawHtml.split('<a class="subject-link"').slice(1); // 첫 번째 빈 항목 제거

      var txt = ""

      if(links.length < 1){
        txt = "검색 결과가 없습니다.";
      } else{
        txt = str + "님의 사사게 검색 결과 (제목+내용)\n"+'\u200b'.repeat(501);

        var i=0;
        links.forEach(link => {
          // href 추출
          const hrefStart = link.indexOf('href="') + 6; // "href=" 이후 위치
          const hrefEnd = link.indexOf('"', hrefStart);
          const href = link.substring(hrefStart, hrefEnd);
  
          // category 추출
          const categoryStart = link.indexOf('<span class="category">[') + 24; // "[카테고리]" 안쪽
          const categoryEnd = link.indexOf(']</span>', categoryStart);
          const category = link.substring(categoryStart, categoryEnd);
  
          // title 추출
          const titleStart = link.indexOf(']</span>') + 8; // 제목 시작 위치
          const titleEnd = link.indexOf('</a>', titleStart);
          const title = link.substring(titleStart, titleEnd).trim();

          txt += "\n["+category+"] "+title+"\n"+href;
        });
      }
      msg.reply(txt);
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
  else if(cmd == "재련"){
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var hours = ('0' + today.getHours()).slice(-2); 
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2); 
    
    var dateString = year + '-' + month  + '-' + day;
    var timeString = hours + ':' + minutes  + ':' + seconds;
    
    var currentDate = dateString +' '+ timeString;

    if (!Database.exists(dataFile)) {
      Database.writeObject(dataFile, {});
    }
    
    let data = Database.readObject(dataFile); // 전체 데이터 로드
      
    // 현재 메시지의 채널 ID 가져오기
    var channelId = msg.channelId;
    
    // 해당 채널 ID가 없으면 빈 배열로 초기화
    if (!data[channelId]) {
        data[channelId] = [];
    }
    
    // 현재 채널의 유저 데이터 배열
    var nowRoom = data[channelId];
    
    // 유저 ID 생성 (hash 값이 있으면 사용, 없으면 이름 사용)
    var userId = msg.author.hash ? msg.author.hash : msg.author.name;
    
    // 해당 유저가 채널에 없으면 새로 추가
    if (!nowRoom.find(e => e.userId === userId)) {
        const info = {
            "userName": msg.author.name,
            "userId": userId,
            "step": 1,
            "bonus": 0,
            "lastChat": null,
            "sucStep": null
        };
        nowRoom.push(info);
    }
    
    // 유저 정보 업데이트 (예: 마지막 채팅 시간 업데이트)
    var user = nowRoom.find(e => e.userId === userId);

    const currentStep = user.step;
    const nextStep = currentStep + 1;

    // 현재 단계 데이터 확인
    const nextData = Data.ENHANCEMENTDATA.find(e => e.step === nextStep);

    if (!nextData) {
        msg.reply(msg.author.name+"님은 이미 최대 강화 25단계에 도달했습니다.");
        return;
    }
    else{

      if(user.lastChat != null){
        var baseTime = 2 * 60 * 1000; // 2분
        
        var nowDate = lostArkFunc.toDate(currentDate);
        var lastChatDate = lostArkFunc.toDate(user.lastChat);
    
        var checkTime = nowDate - lastChatDate;
        
        if(checkTime < baseTime) { 
          var remainingTime = (baseTime) - checkTime; // 남은 시간 = 2분 - 경과 시간
          // 분과 초로 변환
          var minutes = Math.floor(remainingTime / 60000); // 전체 분
          var seconds = Math.floor((remainingTime % 60000) / 1000); // 나머지를 초로 변환
          msg.reply(msg.author.name + "님 현재 재련 쿨타임입니다.\n남은시간 : " + 
                  (minutes > 0 ? minutes + "분 " : "") + // 분이 0보다 크면 분 출력, 아니면 생략
                  (seconds + "초")); // 초는 항상 출력
          return ;
        }
      }

      msg.reply(msg.author.name+"님 강화를 시작합니다...!\n성공확률: " + nextData.chance + "%");
      java.lang.Thread.sleep(1000);
    }

    // 강화 확률 계산
    let successChance = nextData.chance;

    // 강화 시도
    const randomValue = Math.random() * 100; // 0~100 사이의 난수
    if (randomValue < successChance || user.bonus == 100) {
        // 강화 성공
        user.step = nextStep;
        user.bonus = 0; // 장인의 기운 초기화
        user.sucStep = currentDate;
        msg.reply(msg.author.name+"님 강화 성공!\n현재 단계: " + user.step);
    } else {
        // 강화 실패
        user.bonus += nextData.bonusChance; // 장인의 기운 추가
        if(user.bonus > 100){
          user.bonus = 100;
        }
        msg.reply(msg.author.name+"님 강화 실패!\n현재 단계: " + user.step + "\n장인의 기운: "+user.bonus.toFixed(2)+"%");
    }
    user.lastChat = currentDate;
    user.userName = msg.author.name; // 닉변유저 체크 (안드버전9이상만 작동)
    // 업데이트된 채널 데이터를 다시 저장
    data[channelId] = nowRoom;
    
    // JSON 데이터를 파일에 저장
    Database.writeObject(dataFile, data);
    // 결과 JSON 출력
    // msg.reply(JSON.stringify(data, null, 2)); // 보기 쉽게 들여쓰기 추가
  }
  else if(cmd=='재련랭킹'){
    let data = Database.readObject(dataFile); // 전체 데이터 로드
    // 현재 채널의 유저 데이터 배열
    var nowRoom = data[msg.channelId];
    const rank = nowRoom.sort((a,b)=> b.step-a.step || a.sucStep-b.sucStep).map((v,i)=>(i+1)+"위 : "+v.userName+" 강화단계 : "+v.step);
    var _return="[ 재련 랭킹 ]\n\n";
    for(var i in rank){
      _return+=rank[i]+"\n";
      if(i==4){
        _return+="\u200b".repeat(501);
      }
    }
    msg.reply(_return); 
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