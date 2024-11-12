
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */

CategoryCode = {"보석":210000, "각인서":40000};
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
        if(msg == '테스트1'){
            
                try { 
                    var url = "https://developer-lostark.game.onstove.com/auctions/items";
                    var data = org.jsoup.Jsoup.connect(url)
                        .header("accept", "application/json")
                        .header("authorization", "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAxODU4ODQifQ.LJmC_1TUVgTARzjpWW488LT9UW3FOE-_-ICYMhbFEXAGZhyrgxgPVjO1e-45UFnwPPC_p3K-WrrkeeKFRtoly8cRdhnNoeufPGl4wbr-LDd2IiaqtFA78DKMgj5WHOz-fTUA91jW9P6pfkLCV866vifMaaLvwBSNp2oLuCINB2AHk9LILEFynNnOY0WDFSIfu__lrY4lTqC5pvqW6h9ecaSB2h7TEtLhMwLf09sqvQDD-MVh_X_olOr1oGkf9hg1yF0y5hHgCzdJHfkZqrRYbxisRDiLg3m9A8e39wG2URtn2uLGHECOHyuh4-i9sqRReSl35vVXbBEEWRrF1FdirQ")
                        .header("Content-Type", "application/json")
                        .requestBody(JSON.stringify(
                            { 
                            "CategoryCode": 210000,
                            "Sort": "BUY_PRICE",
                            "ItemTier": 3,
                            "ItemName": "10레벨 멸화의 보석"
                            }))

                        .ignoreHttpErrors(true)        
                        .ignoreContentType(true) 
                        .post()
                        .text();
                    // data = JSON.parse(data); 
                    return replier.reply(data);
                } catch (e) { 
                    Log.info("Failed: " + e); 
                    return replier.reply( e);
                } 

        }
        if(msg == '테스트2'){
            
            try { 
                var url = "https://developer-lostark.game.onstove.com/markets/items";
                var data = org.jsoup.Jsoup.connect(url)
                    .header("accept", "application/json")
                    .header("authorization", "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAxODU4ODQifQ.LJmC_1TUVgTARzjpWW488LT9UW3FOE-_-ICYMhbFEXAGZhyrgxgPVjO1e-45UFnwPPC_p3K-WrrkeeKFRtoly8cRdhnNoeufPGl4wbr-LDd2IiaqtFA78DKMgj5WHOz-fTUA91jW9P6pfkLCV866vifMaaLvwBSNp2oLuCINB2AHk9LILEFynNnOY0WDFSIfu__lrY4lTqC5pvqW6h9ecaSB2h7TEtLhMwLf09sqvQDD-MVh_X_olOr1oGkf9hg1yF0y5hHgCzdJHfkZqrRYbxisRDiLg3m9A8e39wG2URtn2uLGHECOHyuh4-i9sqRReSl35vVXbBEEWRrF1FdirQ")
                    .header("Content-Type", "application/json")
                    .requestBody(JSON.stringify(
                        {
                        "Sort": "GRADE",
                        "CategoryCode": 40000,
                        
                        "ItemGrade": "전설",
                        "ItemName": "원한 각인서",
                        
                        "SortCondition": "ASC"
                        }))

                    .ignoreHttpErrors(true)        
                    .ignoreContentType(true) 
                    .post()
                    .text();
                // data = JSON.parse(data); 
                return replier.reply(data);
            } catch (e) { 
                Log.info("Failed: " + e); 
                return replier.reply( e);
            } 

    }
    }



// var r = org.jsoup.Jsoup.connect('http://api.molya.kr/v1/image/byUrl')
// .header('x-api-key', 'ec2b3cc4-53e9-4343-874b-26807c75a98d')
// .header('content-type', 'application/json')
// .requestBody(JSON.stringify({
//     image: imgUrl,
//     title: nickName,
//     description: '아바타',
//     useOriginal: true
// }))
// .ignoreHttpErrors(true)
// .ignoreContentType(true)
// .post()
// .text()
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