const bot = BotManager.getCurrentBot();

// const API = require('key');
// const lostArkFunc = require('LostArkFunc');
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
  
  var param = msg.content;

  if(param == '빈틈봇연동'){

    // 유저 ID 생성 (hash 값이 있으면 사용, 없으면 이름 사용)
    var userId = msg.author.hash ? msg.author.hash : msg.author.name;

    var retStr = '📢 '+ msg.author.name+ '님의 연동코드\n\n';;
    retStr += "채팅방 CODE : "+ msg.channelId +"\n";
    retStr += "유저 CODE : "+ userId +"\n\n";
    retStr += "빈틈봇연동은 https://www.loagap.com 내정보 페이지에서 등록하세요.";
    var retStr1 = '▼ 메뉴얼 ▼'+'\u200b'.repeat(501)+"\n\n";
    retStr1 += "https://superb-antler-e73.notion.site/17ac5e5dcbb1805b9ccefb207463361a"
    msg.reply(retStr);
    msg.reply(retStr1);
  }
  
  if(param == '씨익콩'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/씨익콩.png",param,msg.room)
    return ;
  }
  else if(param == '더줘콩'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/더줘콩.png",param,msg.room)
    return ;
  }
  else if(param == '뿅콩'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/뿅콩.png",param,msg.room)
    // lostArkFunc.exportImg(client,"https://cdn.discordapp.com/attachments/1129393351154737243/1310279225084739725/i013861341314.gif?ex=6744a41f&is=6743529f&hm=0c05a7e5a77b80cf65bc4dd9cd3fb7377e940bdb9cfccaf1861e39380a0847e3&",param,msg.room)
    return ;
  }
  else if(param == '감사콩'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/감사콩.png",param,msg.room)
    return ;
  }
  else if(param == '꺼억콩'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/꺼억콩.png",param,msg.room)
    return ;
  }
  else if(param == '도망콩'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/도망콩.png",param,msg.room)
    return ;
  }
  else if(param == '머쓱해요'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/머쓱해요.png",param,msg.room)
    return ;
  }
  else if(param == '놀자에요'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/놀자에요.png",param,msg.room)
    return ;
  }
  else if(param == '뭐라구요'){
    lostArkFunc.exportImg(client,"https://87k.netlify.app/emoji/뭐라구요.png",param,msg.room)
    return ;
  }

  // if(msg.content.startsWith(".")){
  //   if(!msg.isGroupChat){
  //     return ;
  //   }
  //   let cmd = msg.content.slice(1);
  //   var cmdArr = cmd.split(' ');
  //   let paramA = cmdArr[0];
  //   let str = msg.content.substr(cmdArr[0].length + 1).trim();

  //   if(paramA == '장비'){
  //     var croll = org.jsoup.Jsoup.connect("https://secapi.korlark.com/lostark/characters/" + str).ignoreContentType(true).get().text();
  //     var characterInfo = JSON.parse(croll);

  //     lostArkFunc.selectCharacterEquip2(client, characterInfo,msg.room);
  //   }
  // }
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
  if(cmd == "분양"){
    var talk = '';
    for(var i=0; i < msg.args.length; i++){
        talk += msg.args[i] + ' ';
    }       
    try{
      bot.send("빈틈테스트KM","분양 문의가 도착했습니다."+'\u200b'.repeat(501) + '\n\n'+ msg.author.name + ' > ' + talk)
      msg.reply('정상적으로 분양 신청이 완료 되었습니다.');
    } catch(e){
      msg.reply('양식에 맞지 않아 신청이 실패되었습니다.');
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