const scriptName = "LostArk";

var KakaoLinkModule = require('KakaoLinkModule');

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
            data0 = org.jsoup.Jsoup.connect("https://lostark.game.onstove.com/Profile/Character/" + str).get();
            var imgUrl = data0.select(".profile-equipment__character img").attr("src");
    
            KakaoLinkModule.send(114159,{THU: imgUrl},room);
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