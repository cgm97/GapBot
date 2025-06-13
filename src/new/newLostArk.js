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
const roomListFile = "roomListDB"; // 방목록

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

  // 채팅방 저장 - 공지용
  if (!Database.exists(roomListFile)) {
    Database.writeObject(roomListFile, []);
  }

  let roomList = Database.readObject(roomListFile); // 전체 데이터 로드

  if (!Array.isArray(roomList)) {
    // roomList가 배열이 아닌 경우 초기화
    roomList = [];
  }

  if (msg.isGroupChat) {
    const roomName = msg.room; // 현재 메시지의 방 이름

    // roomList에 방 이름이 없으면 추가
    if (!roomList.includes(roomName)) {
      roomList.push(roomName); // 새로운 방 이름 추가
      Database.writeObject(roomListFile, roomList); // 변경된 데이터 저장
    }
  }

  if (msg.content.startsWith(".")) {
    if (!msg.isGroupChat) {
      msg.reply("해당 명령어를 실행 할 권한이 없습니다.\n관리자에게 문의주세요.");
      return;
    }

    let cmd = msg.content.slice(1);
    var cmdArr = cmd.split(' ');
    let param = cmdArr[0];
    let str = msg.content.substr(cmdArr[0].length + 1).trim();

    const userCode = msg.author.hash ? msg.author.hash : msg.author.name;
    const roomCode = msg.channelId;
    var myNickName = "";

    if (param == '정보' || param == 'ㅈㅂ') {
      // try{
      // var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      // } catch(e){
      //   msg.reply("존재하지 않는 캐릭터입니다.");
      // }
      // var characterInfo = JSON.parse(croll);

      // lostArkFunc.selectCharacterInfo(client, characterInfo,msg.room);
      // msg.reply("현재 정보(25/02/01 22시42분 ~ ) 점검중입니다.");
    }
    // else if(param == '장비'){
    // try{
    // var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
    // } catch(e){
    //   msg.reply("존재하지 않는 캐릭터입니다.");
    // }
    // var characterInfo = JSON.parse(croll);

    // lostArkFunc.selectCharacterEquip1(client, characterInfo,msg.room);
    // }
    else if (param == '장신구' || param == '악세' || param == 'ㅇㅅ' || param == 'ㅈㅅㄱ' || param == 'ㄴㅈㅅㄱ' || param == '내장신구'
      || param == '내악세' || param == 'ㄴㅇㅅ') {
      try {
        if (param == 'ㄴㅈㅅㄱ' || param == '내장신구' || param == '내악세' || param == 'ㄴㅇㅅ') {
          myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
          str = myNickName;
          if (str == "") {
            return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
          }
        }

        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch (e) {
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      msg.reply(lostArkFunc.selectCharacterAccessories(characterInfo, str));
    }
    // else if(param == '팔찌' || param =='ㅍㅉ'){
    //   try{
    //     var croll = org.jsoup.Jsoup.connect("https://api.loagap.com/bot/bangleOption?nickName=" + str).ignoreContentType(true).get().text();
    //   } catch(e){
    //     msg.reply("존재하지 않는 캐릭터입니다.");
    //   }
    //   var characterInfo = JSON.parse(croll);
    //   var bracelet = characterInfo.bangleOption; // 팔찌

    //   var retTxt = "📢 "+ str+"님의 팔찌\n";
    //   // 팔찌
    //   bracelet.forEach(bangleOption => {
    //     retTxt += "\n["+bangleOption.quality+"] " + bangleOption.option
    //   })
    //   msg.reply(retTxt);
    // }
    else if (param == '내실' || param == 'ㄴㅅ' || param == '내내실' || param == 'ㄴㄴㅅ') {
      try {
        if (param == '내내실' || param == 'ㄴㄴㅅ') {
          myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
          str = myNickName;
          if (str == "") {
            return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
          }
        }
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/characters/" + str + "/collectibles").ignoreContentType(true).get().text();
      } catch (e) {
        msg.reply("존재하지 않는 캐릭터입니다.");
      }

      var characterInfo = JSON.parse(croll);

      msg.reply(lostArkFunc.selectCharacterCollection(characterInfo, str));
    }
    else if (param == '모험섬' || param == 'ㅁㅎㅅ') {
      var date = new Date();
      var year = date.getFullYear();
      var month = ("0" + (1 + date.getMonth())).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);
      var today = year + "-" + month + "-" + day;
      var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/calendar/adventure-islands?date=" + today).ignoreContentType(true).get().text();
      var islandJson = JSON.parse(croll);

      lostArkFunc.selectAdventureIsland(client, islandJson, today, msg.room);
    }
    else if (param == '부캐' || param == 'ㅂㅋ' || param == '내부캐' || param == 'ㄴㅂㅋ') {
      try {
        if (param == '내부캐' || param == 'ㄴㅂㅋ') {
          myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
          str = myNickName;
          if (str == "") {
            return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
          }
        }
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch (e) {
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      lostArkFunc.selectMembers(client, characterInfo, str, msg.room);
    }
    else if (param == '원정대' || param == 'ㅇㅈㄷ' || param == '내원정대' || param == 'ㄴㅇㅈㄷ') {
      var data;

      if (param == '내원정대' || param == 'ㄴㅇㅈㄷ') {
        myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
        str = myNickName;
        if (str == "") {
          return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
        }
      }

      var url = "https://developer-lostark.game.onstove.com/characters/" + str + "/siblings";
      data = org.jsoup.Jsoup.connect(url)
        .header("accept", "application/json")
        .header("authorization", API.LOA_KEY)
        .header("Content-Type", "application/json")
        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .get()
        .text();
      data = JSON.parse(data);

      var retTxt = "📢 " + str + "님의 원정대";
      if (data.length > 1) {
        data.sort((a, b) => {
          // 1. ServerName을 기준으로 정렬 (오름차순)
          const serverComparison = a.ServerName.localeCompare(b.ServerName);
          if (serverComparison !== 0) {
            return serverComparison;
          }
        });

        // 최대 길이 계산
        const maxClassLength = Math.max.apply(null, data.map(item => String(item.CharacterClassName).length));
        // 서버별 그룹화
        const groupedData = data.reduce((acc, item) => {
          acc[item.ServerName] = acc[item.ServerName] || [];
          acc[item.ServerName].push(item);
          return acc;
        }, {});

        // 출력
        Object.keys(groupedData).forEach(ServerName => {
          retTxt += "\n\n❙ " + ServerName; // 서버명 출력
          groupedData[ServerName].sort((a, b) => Number(b.ItemMaxLevel.replace(/,/g, "")) - Number(a.ItemMaxLevel.replace(/,/g, "")));
          groupedData[ServerName].forEach(({ CharacterClassName, ItemMaxLevel, CharacterName }) => {
            const paddedClass = String(CharacterClassName).padEnd(maxClassLength, "　");
            retTxt += "\n" + paddedClass + " " + CharacterName + " (" + ItemMaxLevel + ")";
          });
        });
      }
      else {
        retTxt = "검색 결과가 없습니다.";
      }
      msg.reply(retTxt);

    }
    else if (param == '주급' || param == 'ㅈㄱ' || param == '내주급' || param == 'ㄴㅈㄱ') {
      try {
        if (param == '내주급' || param == 'ㄴㅈㄱ') {
          myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
          str = myNickName;
          if (str == "") {
            return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
          }
        }
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch (e) {
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);


      var header = "📢 " + str + "님의 주급(격주제외, 6캐릭)\n\n";
      var body = lostArkFunc.selectCharactersGold(client, characterInfo, msg.room);

      msg.reply(header + body);

    }
    else if (param == '앜패' || param == 'ㅇㅍ' || param == '내앜패' || param == 'ㄴㅇㅍ') {
      try {
        if (param == '내앜패' || param == 'ㄴㅇㅍ') {
          myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
          str = myNickName;
          if (str == "") {
            return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
          }
        }
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch (e) {
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      var arkPassive = characterInfo.arkPassive;
      msg.reply(lostArkFunc.selectCharacterArkPassive(arkPassive, str));
      // if(!arkPassive.enabled){
      //   msg.reply('아크패시브 비활성화 캐릭입니다.');
      //   return ;
      // }
      // else{
      // }
    }
    else if (param == '분배금' || param == 'ㅂㅂㄱ') {
      if (!isNaN(str)) {
        msg.reply(lostArkFunc.calGold(str));
      }
      else {
        msg.reply('잘못된 명령어 입니다.');
      }
    }
    else if (param == '떠상' || param == 'ㄸㅅ') {
      if (isNaN(str)) {
        if (Data.SERVER_CODE[str] == undefined) {
          msg.reply('잘못된 서버명입니다.');
          return;
        }
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/merchant/reports?server=" + Data.SERVER_CODE[str]).ignoreContentType(true).get().text();
        var merchantInfo = JSON.parse(croll);
        msg.reply(lostArkFunc.getMarketInfo(str, merchantInfo));
      }
      else {
        msg.reply('잘못된 명령어 입니다.');
      }
    }
    else if (param == '크리스탈' || param == 'ㅋㄹㅅㅌ') {
      var min = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1mon").ignoreContentType(true).get().text());
      var hour = JSON.parse(org.jsoup.Jsoup.connect("https://loatool.taeu.kr/api/crystal-history/ohlc/1h").ignoreContentType(true).get().text());
      msg.reply(lostArkFunc.getCrystal(min, hour));
    }
    // else if(param == '보석' || param =='ㅄ' || param =='ㅂㅅ'){
    // try{
    //   var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
    // } catch(e){
    //   return msg.reply('존재하지 않는 캐릭터입니다.');
    // }
    // var characterInfo = JSON.parse(croll);
    // if(isNaN(str)){
    //   msg.reply(lostArkFunc.getUserGem(str,characterInfo));
    // }
    // else {
    //   msg.reply('잘못된 명령어 입니다.');
    // }              
    // }
    else if (param == '사사게' || param == 'ㅅㅅㄱ') {
      if (str == "") {
        txt = "검색 키워드를 입력하세요.";
        msg.reply(txt);
        return;
      }
      var croll = org.jsoup.Jsoup.connect("https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjcont&keyword=" + str).ignoreContentType(true).get();
      var rows = croll.select("#new-board > form > div > table > tbody > tr:not(.notice)");

      const rawHtml = String(rows.select(".tit a"));
      // <a class="subject-link" 태그로 분리
      const links = rawHtml.split('<a class="subject-link"').slice(1); // 첫 번째 빈 항목 제거

      var txt = ""

      if (links.length < 1) {
        txt = "검색 결과가 없습니다.";
      } else {
        txt = str + "님의 사사게 검색 결과 (제목+내용)\n" + '\u200b'.repeat(501);

        var i = 0;
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

          txt += "\n[" + category + "] " + title + "\n" + href;
        });
      }
      msg.reply(txt);
    }
    else if (param == '클골' || param == 'ㅋㄱ') {
      var clearGold = Data.RAID;

      var txt = "📢 레이드 클리어 골드" + '\u200b'.repeat(501) + "\n";
      clearGold.forEach(raid => {
        txt += "\nLv." + raid.levelRequirement + " " + raid.raidName + "(" + raid.difficulty + ") " + lostArkFunc.set_comma(raid.reward) + "(-" + lostArkFunc.set_comma(raid.more) + ")";
        if (raid.week) {
          txt += "\n  └> 격주 " + lostArkFunc.set_comma(raid.week) + "(-" + lostArkFunc.set_comma(raid.weekmore) + ")";
        }
      });
      msg.reply(txt);
    }
    else if (param == '스킬' || param == 'ㅅㅋ' || param == '내스킬' || param == 'ㄴㅅㅋ') {
      try {
        if (param == '내스킬' || param == 'ㄴㅅㅋ') {
          myNickName = lostArkFunc.getMyNickName(userCode, roomCode);
          str = myNickName;
          if (str == "") {
            return msg.reply("빈틈봇과 연동이 되어있지않습니다.\n(빈틈봇연동 을 입력 해주세요.)");
          }
        }
        var croll = org.jsoup.Jsoup.connect("https://api.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
      } catch (e) {
        msg.reply("존재하지 않는 캐릭터입니다.");
      }
      var characterInfo = JSON.parse(croll);

      msg.reply(lostArkFunc.selectSkills(str, characterInfo));
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
  if (cmd == "명령어") {
    lostArkFunc.getCmd(client, msg.room);
  }
  else if (cmd == "로또") {
    let percent = msg.args[0]
    var data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?&query=로또번호").get();
    if (!isNaN(percent)) {
      msg.reply(lostArkFunc.lotto(msg.author.name, percent, data));
    }
    else {
      msg.reply(lostArkFunc.lotto(msg.author.name, 0, data));
    }
  }
  // else if (cmd == "재련") {
  //   msg.reply("리뉴얼작업중 추후 공지 예정");
  // }
  // else if (cmd == "재련랭킹") {
  //   msg.reply("리뉴얼작업중 추후 공지 예정");
  // }
  else if (cmd == "재련") {
    var userId = msg.author.hash ? msg.author.hash : msg.author.name;
    var roomId = msg.channelId;
    var userName = msg.author.name;
    var roomName = msg.room;
    var url = "https://api.loagap.com/bot/enhance/try";
    data = org.jsoup.Jsoup.connect(url)
      .header("accept", "application/json")
      .header("Content-Type", "application/json")
      .requestBody(JSON.stringify(
        {
          "userId": userId,
          "userName": userName,
          "roomId": roomId.toString(),
          "roomName": roomName
        }))

      .ignoreHttpErrors(true)
      .ignoreContentType(true)
      .post();
    data = data.outputSettings(new org.jsoup.nodes.Document.OutputSettings().prettyPrint(false)).select("body").first().html();

    msg.reply(data);
    //   var today = new Date();
    //   var year = today.getFullYear();
    //   var month = ('0' + (today.getMonth() + 1)).slice(-2);
    //   var day = ('0' + today.getDate()).slice(-2);
    //   var hours = ('0' + today.getHours()).slice(-2); 
    //   var minutes = ('0' + today.getMinutes()).slice(-2);
    //   var seconds = ('0' + today.getSeconds()).slice(-2); 

    //   var dateString = year + '-' + month  + '-' + day;
    //   var timeString = hours + ':' + minutes  + ':' + seconds;

    //   var currentDate = dateString +' '+ timeString;

    //   if (!Database.exists(dataFile)) {
    //     Database.writeObject(dataFile, {});
    //   }

    //   let data = Database.readObject(dataFile); // 전체 데이터 로드

    //   // 현재 메시지의 채널 ID 가져오기
    //   var channelId = msg.channelId;

    //   // 해당 채널 ID가 없으면 빈 배열로 초기화
    //   if (!data[channelId]) {
    //       data[channelId] = [];
    //   }

    //   // 현재 채널의 유저 데이터 배열
    //   var nowRoom = data[channelId];

    //   // 유저 ID 생성 (hash 값이 있으면 사용, 없으면 이름 사용)
    //   var userId = msg.author.hash ? msg.author.hash : msg.author.name;

    //   // 해당 유저가 채널에 없으면 새로 추가
    //   if (!nowRoom.find(e => e.userId === userId)) {
    //       const info = {
    //           "userName": msg.author.name,
    //           "userId": userId,
    //           "step": 1,
    //           "bonus": 0,
    //           "lastChat": null,
    //           "sucStep": null
    //       };
    //       nowRoom.push(info);
    //   }

    //   // 유저 정보 업데이트 (예: 마지막 채팅 시간 업데이트)
    //   var user = nowRoom.find(e => e.userId === userId);

    //   const currentStep = user.step;
    //   const nextStep = currentStep + 1;

    //   // 현재 단계 데이터 확인
    //   const nextData = Data.ENHANCEMENTDATA.find(e => e.step === nextStep);

    //   if (!nextData) {
    //       msg.reply(msg.author.name+"님은 이미 최대 강화 25단계에 도달했습니다.");
    //       return;
    //   }
    //   else{

    //     if(user.lastChat != null){
    //       var baseTime = 2 * 60 * 1000; // 2분

    //       var nowDate = lostArkFunc.toDate(currentDate);
    //       var lastChatDate = lostArkFunc.toDate(user.lastChat);

    //       var checkTime = nowDate - lastChatDate;

    //       if(checkTime < baseTime) { 
    //         var remainingTime = (baseTime) - checkTime; // 남은 시간 = 2분 - 경과 시간
    //         // 분과 초로 변환
    //         var minutes = Math.floor(remainingTime / 60000); // 전체 분
    //         var seconds = Math.floor((remainingTime % 60000) / 1000); // 나머지를 초로 변환
    //         msg.reply(msg.author.name + "님 현재 재련 쿨타임입니다.\n남은시간 : " + 
    //                 (minutes > 0 ? minutes + "분 " : "") + // 분이 0보다 크면 분 출력, 아니면 생략
    //                 (seconds + "초")); // 초는 항상 출력
    //         return ;
    //       }
    //     }

    //     if(user.bonus == 100){
    //       msg.reply(msg.author.name+"님 강화를 시작합니다...!\n성공확률: 100%(장기백ㅋ)");
    //     }
    //     else{
    //       msg.reply(msg.author.name+"님 강화를 시작합니다...!\n성공확률: " + nextData.chance + "%");
    //     }
    //   }

    //   // 강화 확률 계산
    //   let successChance = nextData.chance;

    //   // 강화 시도
    //   const randomValue = Math.random() * 100; // 0~100 사이의 난수
    //   if (randomValue < successChance || user.bonus == 100) {
    //       // 강화 성공
    //       user.step = nextStep;
    //       user.bonus = 0; // 장인의 기운 초기화
    //       user.sucStep = currentDate;

    //       msg.reply(msg.author.name+"님 강화 성공!\n현재 단계: " + user.step);
    //   } else {
    //       // 강화 실패
    //       user.bonus += nextData.bonusChance; // 장인의 기운 추가
    //       if(user.bonus > 100){
    //         user.bonus = 100;
    //       }
    //       msg.reply(msg.author.name+"님 강화 실패!\n현재 단계: " + user.step + "\n장인의 기운: "+user.bonus.toFixed(2)+"%");
    //   }
    //   user.lastChat = currentDate;
    //   user.userName = msg.author.name; // 닉변유저 체크 (안드버전9이상만 작동)
    //   // 업데이트된 채널 데이터를 다시 저장
    //   data[channelId] = nowRoom;

    //   // JSON 데이터를 파일에 저장
    //   Database.writeObject(dataFile, data);
    //   // 결과 JSON 출력
    //   // msg.reply(JSON.stringify(data, null, 2)); // 보기 쉽게 들여쓰기 추가




  }
  else if (cmd == '재련랭킹') {
    var userId = msg.author.hash ? msg.author.hash : msg.author.name;
    var roomId = msg.channelId;
    var url = "https://api.loagap.com/bot/enhance/rank";
    data = org.jsoup.Jsoup.connect(url)
      .header("accept", "application/json")
      .header("Content-Type", "application/json")
      .requestBody(JSON.stringify(
        {
          "userId": userId,
          "roomId": roomId.toString()
        }))

      .ignoreHttpErrors(true)
      .ignoreContentType(true)
      .post().text();
    data = JSON.parse(data);

    const allRank = data.allRanking || [];
    // const myRank = data.myRanking||null;
    let rankingText = "";

    // STEP 내림차순, 같은 STEP은 ACHIEVE_DTTI 오름차순 정렬
    if (allRank.length === 0) {
      rankingText = "📢 현재 랭킹 정보가 없습니다.";
    } else {
      const sorted = allRank.sort((a, b) => {
        if (b.STEP !== a.STEP) return b.STEP - a.STEP;
        return new Date(a.ACHIEVE_DTTI) - new Date(b.ACHIEVE_DTTI);
      });

      rankingText = sorted.map(function (item, index) {
        return (
          "#" + (index + 1) +
          " | " + item.USER_NAME + " (" + item.NICKNAME + ")" +
          " | 단계: " + item.STEP
          // +" | 달성: " + item.ACHIEVE_DTTI
        );
      }).join('\n');

    }
    rankingText += "\n\n• 안내 •\n" + "닉네임(대표 캐릭터)로 표시되며, 빈틈봇과 연동하지 않은 경우 'UNKNOWN'으로 표시됩니다.\n빈틈봇연동 을 입력해보세요!";

    const loagapurl = "LOAGAP으로 보기▼\nhttps://loagap.com/enhance/rank/room/" + roomId.toString();
    const header = "\n\n재련 랭킹 ▼" + '\u200b'.repeat(501) + "\n\n";
    msg.reply(loagapurl + header + rankingText);
    //   let data = Database.readObject(dataFile); // 전체 데이터 로드
    //   // 현재 채널의 유저 데이터 배열
    //   var nowRoom = data[msg.channelId];
    //   const rank = nowRoom.sort((a,b)=> b.step-a.step || a.sucStep-b.sucStep).map((v,i)=>(i+1)+"위 : "+v.userName+" 강화단계 : "+v.step);
    //   var _return="[ 재련 랭킹 ]\n\n";
    //   for(var i in rank){
    //     _return+=rank[i]+"\n";
    //     if(i==4){
    //       _return+="\u200b".repeat(501);
    // }
    // }
    //   msg.reply(_return); 
  }
  else if (cmd == '공지보내기') {
    const roomList = Database.readObject(roomListFile);

    roomList.forEach((room) => {
      bot.send(room, msg.args.join(" "));
    });
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