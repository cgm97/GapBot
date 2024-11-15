
const API = require('key');

// 직업코드
module.exports.JOB_CODE = {'11':'디스트로이어','12':'워로드','13':'버서커','14':'홀리나이트','91':'슬레이어','21':'스트라이커','22':'브레이커','31':'배틀마스터','32':'인파이터'
                ,'33':'기공사','34':'창술사','41':'데빌헌터','42':'블래스터','43':'호크아이','44':'스카우터','51':'건슬링어','61':'바드','62':'서머너'
                ,'63':'아르카나','64':'소서리스','71':'블레이드','72':'데모닉','73':'리퍼','74':'소울이터','81':'도화가','82':'기상술사'
                ,'10':'모험가','20':'모험가','30':'모험가','40':'모험가','50':'모험가','60':'모험가','70':'모험가','80':'모험가','90':'모험가'};
// 서버코드
module.exports.SERVER_CODE = {'1':'루페온','2':'실리안','3':'아만','4':'아브렐슈드','5':'카단','6':'카마인','7':'카제로스','8':'니나브'
                    ,'루페온':'1','실리안':'2','아만':'3','아브렐슈드':'4','카단':'5','카마인':'6','카제로스':'7','니나브':'8'
                    };
// LV별 획득골드량
module.exports.LV_GOLD = {'1620':65500,'1600':28000,'1580':22000,'1560':16500,'1550':16000,'1540':14500,'1520':12400,'1500':12400,'1490':9900};

module.exports.REWARD = {
    0: '골드',
    1: '카드',
    2: '주화',
    3: '실링'
};

// 분양받은 room 리스트
module.exports.ROOMLIST = ['로스트아크빈틈','기분좋은향기','삼로친구들','어이없넹','실례','뀨띠뽀짝채팅방','파타퐁'];

// 아이템 카테고리 코드
const CategoryCode = {"보석":210000, "각인서":40000, '강화재료':50010, '에스더':51100} ;

module.exports.GEMINDEX = {
    "10멸": "10레벨 멸화의 보석", "10홍": "10레벨 홍염의 보석",
    "9멸": "9레벨 멸화의 보석", "9홍": "9레벨 홍염의 보석",
    "8멸": "8레벨 멸화의 보석", "8홍": "8레벨 홍염의 보석",
    "7멸": "7레벨 멸화의 보석", "7홍": "7레벨 홍염의 보석",
    "6멸": "6레벨 멸화의 보석", "6홍": "6레벨 홍염의 보석",
    "5멸": "5레벨 멸화의 보석", "5홍": "5레벨 홍염의 보석",
    "4멸": "4레벨 멸화의 보석", "4홍": "4레벨 홍염의 보석",
    "3멸": "3레벨 멸화의 보석", "3홍": "3레벨 홍염의 보석",
    "2멸": "2레벨 멸화의 보석", "2홍": "2레벨 홍염의 보석",
    "1멸": "1레벨 멸화의 보석", "1홍": "1레벨 홍염의 보석",
    "10겁": "10레벨 겁화의 보석", "10작": "10레벨 작열의 보석",
    "9겁": "9레벨 겁화의 보석", "9작": "9레벨 작열의 보석",
    "8겁": "8레벨 겁화의 보석", "8작": "8레벨 작열의 보석",
    "7겁": "7레벨 겁화의 보석", "7작": "7레벨 작열의 보석",
    "6겁": "6레벨 겁화의 보석", "6작": "6레벨 작열의 보석",
    "5겁": "5레벨 겁화의 보석", "5작": "5레벨 작열의 보석",
    "4겁": "4레벨 겁화의 보석", "4작": "4레벨 작열의 보석",
    "3겁": "3레벨 겁화의 보석", "3작": "3레벨 작열의 보석",
    "2겁": "2레벨 겁화의 보석", "2작": "2레벨 작열의 보석",
    "1겁": "1레벨 겁화의 보석", "1작": "1레벨 작열의 보석"
};

module.exports.BOOKINDEX = {"저받":"저주받은 인형", "예둔":"예리한 둔기","아드":"이드레날린","타대":"타격의 대가","결대":"결투의 대가","기습":"기습의 대가","돌대":"돌격대장"};

module.exports.STUFFINDEX = ['찬란한 명예의 돌파석','정제된 파괴강석','정제된 수호강석'];

// 장비 등급
module.exports.getGradeName = (grade) => { 
    return grade == 7 ? "[에스더]" : 
           grade == 6 ? "[고대]" : 
           "[유물]";
}

// 장비 아이템 이름
module.exports.getItemTitle = (item) => {
    const gradeName = module.exports.getGradeName(item.grade);
    const itemName = item.grade == 7 ? item.name : item.name.substring(4, 6);
    return item.quality + " " + gradeName + " +" + item.reinforce + "강(" + item.advancedReinforce + ") " + itemName;
}

// 엘릭서 정보
module.exports.getElixir = (item) => {
    var retElixir = "";
    if(item.elixir != null){
        for(var i=0; i < item.elixir.effects.length; i++){
            retElixir += (item.elixir.effects[i].name).replace(" ","");
            retElixir += ("Lv"+item.elixir.effects[i].level);
            retElixir += " ";
        } 
    }
    return retElixir;
}

// 초월 정보
module.exports.getTranscendence = (item) => {
    return "초월"+(item && item.transcendence && item.transcendence.point) || 0;
}

// 장신구 정보
module.exports.getAccessories = (item) => {
    // 악세
    var retTxt = '\n\n'+ item.quality +" "+ module.exports.getGradeName(item.grade) + ' '+ item.name + '\n';
        
    var engrave_effects = Object.keys(item.engraveEffects);
    var enforce_effects = Object.keys(item.enforceEffects);

    // 각인효과
    for(var i=0; i< engrave_effects.length; i++){
        retTxt += item.engraveEffects[i].name +' '+ item.engraveEffects[i].point+' ';
    }
    for(var i=0; i< enforce_effects.length; i++){
        retTxt += item.enforceEffects[i]+' ';
    }

    return retTxt;
}

// 내실 정보
module.exports.getCollection = (item) => {
    const score = Math.floor((item.value / item.max_value) * 100);
    const result = '▶️ ' + item.name + ' [' + item.value + ' / ' + item.max_value + '] ' + score + '%\n';
    
    const output = {}; // 빈 객체 생성
    output.result = result; // result 속성 추가
    output.score = score; // score 속성 추가
    return output;
}

// 원정대 캐릭터 관련
module.exports.getMemberLv = (sortedMembers, index) => {
    var lv = sortedMembers[index] && sortedMembers[index].maxItemLevel ? sortedMembers[index].maxItemLevel : "";
    if (lv) {
        lv = "Lv" + lv;      
    } else {
        lv = ""; // 값이 없을 때 기본값 설정
    }
    return lv;
}

module.exports.getMemberName = (sortedMembers, index) => {
    var name = sortedMembers[index] && sortedMembers[index].name ? sortedMembers[index].name : "";
    return name;
}

module.exports.getMemberJob = (sortedMembers, index) => {
    var job = Func.JOB_CODE[sortedMembers[index] && sortedMembers[index].job ? sortedMembers[index].job : ""];
    if (job) {
        job = "[" + job + "]";      
    } else {
        job = ""; // 값이 없을 때 기본값 설정
    }
    return job;
}

// 이미지 출력 함수
module.exports.makeImg = (url,title,desc) => { 

    let res = org.jsoup.Jsoup.connect('https://api.molya.kr/v1/image/create')
    .header('x-api-key', API.MOLYA_KEY)
    .data('type','url')
    .data('image',url)
    .data('title', title)
    .data('description', desc)
    .ignoreContentType(true)
    .post()
    .text();

    var retImg = JSON.parse(res);

    return retImg.data.viewUrl;
} 


// 이미지 _ oe image
module.exports.makeImgOG = (nickName, imgUrl) => {
    txt = nickName;
    size = 40;
    url = imgUrl;
    con = new java.net.URL(url).openConnection(); // URL을 통해 연결을 생성합니다.
    con.setDoInput(true); // 입력 가능한 상태로 설정합니다.
    con.setConnectTimeout(3000); // 연결 제한 시간을 3초로 설정합니다.
    con.setReadTimeout(5000); // 읽기 제한 시간을 5초로 설정합니다.
    bmp = android.graphics.BitmapFactory.decodeStream(con.getInputStream()); // 인풋 스트림으로부터 비트맵을 디코딩합니다.
    con.disconnect(); // 연결을 종료합니다.
    img = bmp.copy(Bitmap.Config.ARGB_8888, true); // 비트맵을 복사하고, 컨피그는 ARGB_8888, isMutable은 true로 설정합니다.
    can = new Canvas(img); // 캔버스를 생성합니다.
    bounds = new Rect(); // 경계 값을 저장할 Rect 객체를 생성합니다.
    paint = new Paint(); // 페인트 객체를 생성합니다.
    paint.setTextSize(size); // 텍스트 사이즈를 설정합니다.
    paint.setAntiAlias(true); // 안티 앨리어싱을 적용합니다.
    paint.getTextBounds(txt,0,txt.length,bounds); // 텍스트의 경계 값을 Rect 객체에 저장합니다.
    paint.setARGB(255,255,255,255); // 페인트 객체에 흰색을 설정합니다.
    paint2 = new Paint(); // 두 번째 페인트 객체를 생성합니다.
    paint2.setStyle(Paint.Style.STROKE); // 스트로크 스타일을 설정합니다.
    paint2.setStrokeWidth(3); // 선 굵기를 설정합니다.
    paint2.setARGB(255,0,0,0); // 검은색을 설정합니다.
    paint2.setTextSize(size); // 텍스트 사이즈를 설정합니다.
    paint2.setAntiAlias(true); // 안티 앨리어싱을 적용합니다.
    // can.drawText(txt,(can.width-bounds.width())/5,(can.height-bounds.height())/5,paint2); // 검은색으로 중앙에 텍스트를 그립니다.
    // can.drawText(txt,(can.width-bounds.width())/5,(can.height-bounds.height())/5,paint); // 흰색으로 중앙에 텍스트를 그립니다.
    bytearrayoutputstream = new java.io.ByteArrayOutputStream();
    img.compress(Bitmap.CompressFormat.JPEG, 100, bytearrayoutputstream);
    bytearray = bytearrayoutputstream.toByteArray();
    imgb64 = new java.util.Base64.getEncoder().encodeToString(bytearray);
    d = {"image":imgb64,"title":"title"};
    r = org.jsoup.Jsoup.connect("https://a.cgm97.workers.dev/s")
            .header("Content-Type", "application/json")
            .header("Accept", "text/plain")
            .followRedirects(true)
            .ignoreHttpErrors(true)
            .ignoreContentType(true)
            .method(org.jsoup.Connection.Method.POST)
            .maxBodySize(1000000*30)
            .requestBody(JSON.stringify(d))
            .timeout(0)
            .execute();
            res = r.body(); // 암호화 6자리

    
    return 'https://a.cgm97.workers.dev/e/'+res;
}

module.exports.getItemPrice = (itemName, Code) => {

    // auctions = 경매장 - > 보석
    // markets = 거래소
    var data;
    
    if(Code == "보석"){
        var url = "https://developer-lostark.game.onstove.com/auctions/items";
        data = org.jsoup.Jsoup.connect(url)
        .header("accept", "application/json")
        .header("authorization", API.LOA_KEY)
        .header("Content-Type", "application/json")
        .requestBody(JSON.stringify(
            { 
            "CategoryCode": CategoryCode.보석,
            "Sort": "BUY_PRICE",
            //"ItemTier": 3,
            "ItemName": itemName
            }))
    
        .ignoreHttpErrors(true)        
        .ignoreContentType(true) 
        .post()
        .text();
    }
    else if(Code == "각인서"){
        var url = "https://developer-lostark.game.onstove.com/markets/items";
        data = org.jsoup.Jsoup.connect(url)
            .header("accept", "application/json")
            .header("authorization", API.LOA_KEY)
            .header("Content-Type", "application/json")
            .requestBody(JSON.stringify(
                {
                "Sort": "GRADE",
                "CategoryCode": CategoryCode.각인서,
                
                "ItemGrade": "전설",
                "ItemName": itemName+" 각인서",
                
                "SortCondition": "ASC"
                }))

            .ignoreHttpErrors(true)        
            .ignoreContentType(true) 
            .post()
            .text();   
    }
    else if(Code == "강화재료"){
        var url = "https://developer-lostark.game.onstove.com/markets/items";
        data = org.jsoup.Jsoup.connect(url)
            .header("accept", "application/json")
            .header("authorization", API.LOA_KEY)
            .header("Content-Type", "application/json")
            .requestBody(JSON.stringify(
                {
                "Sort": "GRADE",
                "CategoryCode": CategoryCode.강화재료,
                
                // "ItemGrade": "전설",
                "ItemName": itemName,

                "SortCondition": "ASC"
                }))

            .ignoreHttpErrors(true)        
            .ignoreContentType(true) 
            .post()
            .text();   
    }
    else if(Code == "에스더"){
        var url = "https://developer-lostark.game.onstove.com/markets/items";
        data = org.jsoup.Jsoup.connect(url)
            .header("accept", "application/json")
            .header("authorization", API.LOA_KEY)
            .header("Content-Type", "application/json")
            .requestBody(JSON.stringify(
                {
                "Sort": "GRADE",
                "CategoryCode": CategoryCode.에스더,
                
                // "ItemGrade": "전설",
                // "ItemName": itemName,

                "SortCondition": "ASC"
                }))

            .ignoreHttpErrors(true)        
            .ignoreContentType(true) 
            .post()
            .text();   
    }

    
    data = JSON.parse(data);

    return data;
}
