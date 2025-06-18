const bot = BotManager.getCurrentBot();

const API = require('key');
const kakaoLinkModule = require('KakaoLinkModule');
const Data = require('data');
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

    if (!msg.isGroupChat) {
        return;
    }

    if (msg.content.includes('vs')) {
        // msg.content: 사용자 입력 메시지
        var cmdArr = msg.content.split('vs');

        // 입력 배열의 길이를 확인하여 처리
        if (cmdArr.length >= 2) {
            // 양쪽 공백 제거
            cmdArr = cmdArr.map(item => item.trim());

            // 랜덤으로 선택
            var randomIndex = Math.floor(Math.random() * cmdArr.length);

            // 선택된 항목 반환
            msg.reply(cmdArr[randomIndex]);
        }
        return;
    }

    if (msg.content.startsWith(".")) {
        let cmd = msg.content.slice(1);
        var cmdArr = cmd.split(' ');
        let param = cmdArr[0];
        let str = cmdArr[1];

        if (param == '경매장') { // 보석
            try {
                str = cmdArr.slice(1).join(' '); // 두 번째 요소부터 결합하여 문자열로 만듦
                var args = getPriceAuctionItem(str);

                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var today = year + month + day;
                var jewels = org.jsoup.Jsoup.connect("https://api.loagap.com/bot/jewelsLog?date=" + today).ignoreContentType(true).header("referer", "bot.loagap.com").get().text();
                var jewelsInfo = JSON.parse(jewels);

                var keys = Object.keys(jewelsInfo);

                var text = "📢 " + args.itemName + "\n";
                text += "가격 : " + set_comma(args.price);

                // forEach를 사용하여 각 키에 대한 처리
                keys.forEach(key => {
                    if (key == args.itemName) {
                        const jewel = jewelsInfo[key];  // 해당 키에 대한 보석 정보
                        const yesterdayPrice = jewel.yesterdayPrice; // 어제가격
                        const priceGap = (args.price - yesterdayPrice);

                        text += "\n\n전일대비 : " + set_comma(priceGap) + "(" + calculatePercentage(yesterdayPrice, args.price) + ")";
                    }
                });

                msg.reply(text);
                // kakaoLinkModule.send(client,114257,args,msg.room)
            } catch (e) {
                msg.reply("잘못된 아이템 명이거나 존재하지 않습니다.");
            }
        }
        if (param == '거래소') { // 각인서
            try {
                str = cmdArr.slice(1).join(' '); // 두 번째 요소부터 결합하여 문자열로 만듦
                str = Data.BOOKINDEX[str] || str;
                var data = getPriceMarketItem(str);

                if (data.Items && data.Items.length > 0) {
                    // Name별로 데이터를 그룹화
                    const groupedItems = data.Items.reduce((acc, item) => {
                        if (!acc[item.Name]) {
                            acc[item.Name] = [];
                        }
                        acc[item.Name].push(item);
                        return acc;
                    }, {});
                    let text = "📢 각인서 최저가";

                    // 그룹화된 데이터를 처리
                    for (var itemName in groupedItems) {
                        if (groupedItems.hasOwnProperty(itemName)) {
                            text += "\n\n❙ " + itemName;
                            groupedItems[itemName].forEach((item) => {
                                text += '\n' + item.Grade + ' ' + set_comma(item.RecentPrice);
                            });
                        }
                    }
                    msg.reply(text);
                } else {
                    msg.reply("잘못된 아이템 명이거나 존재하지 않습니다.");
                }

            } catch (e) {
                msg.reply("잘못된 아이템 명이거나 존재하지 않습니다.");
            }

        }
        else if (param == '시세') {
            var text = "";
            if (str == '상' || str =='상상' || str =='상중' || str =='상하' || str =='중' || str =='중상' || str =='중중' || str =='중하') {
                let grade = cmdArr[2] || "고대"; // 고대,유물
                let enhance = cmdArr[3] || 3; // 연마단계

                if((grade != "고대" && grade != "유물") || (Number(enhance) != 1 && Number(enhance) != 2 && Number(enhance) != 3)){
                    return msg.reply("옵션1 옵션2를 정확히 입력하세요.");
                }

                if ((str == '상상' || str == '상중' || str == '상하' || str == '중상' || str == '중중' || str == '중하') && Number(enhance) < 2) {
                    return msg.reply(str + "은 연마단계를 2이상 입력하세요.");
                }

                try {
                    var accessroy = org.jsoup.Jsoup.connect("https://api.loagap.com/bot/accessory?title=" + str + "&enhance=" + enhance + "&grade=" + grade).ignoreContentType(true).header("referer", "bot.loagap.com").get().text();
                    accessroy = JSON.parse(accessroy);
                    const items = accessroy.items;

                    text += "📢 " + str + "(" + grade + ", 연마 " + enhance + "단계)\n";
                    var diffText = '\n전일대비 ▼' + '\u200b'.repeat(501)+"\n";

                    items.forEach(item => {
                        const name = item.name;
                        const acsryItems = item.items;

                        text += "\n❚ " + name;
                        diffText += "\n❚ " + name;

                        acsryItems.forEach(acsry => {

                            const option = acsry.option.map(opt => {
                                if (!opt.includes(" ")) return opt; // 스페이스바 없으면 그대로
                                const parts = opt.trim().split(" ");
                                const suffix = opt.match(/[%+]+$/);
                                return parts.map(p => p[0]).join("") + (suffix ? suffix[0] : "");
                            }).join(" ");
                            const price = acsry.price;
                            const priceDiff = acsry.priceDiff || 0;
                            const percentDiff = acsry.percentDiff || 0;

                            if (price === 0 && priceDiff === 0) {
                                text += "\n" + option + ": 매물 없음";
                                diffText += "\n" + option + ": 매물 없음";
                            } else {
                                text += "\n" + option + ": " + set_comma(price);
                                diffText += "\n" + option + ": " + set_comma(priceDiff) + " (" + calculatePercentageemoz(percentDiff) + ")";
                            }
                        });
                        text += "\n";
                        diffText += "\n";
                    });
                    if (grade == "고대") {
                        text += diffText;
                    }
                } catch (e) {
                    text = "검색 중 오류발생\n검색결과가 없습니다.";
                }
            } else if (cmdArr[1] == '유각') {
                let page = cmdArr[2] || 1;
                if (!/^\d+$/.test(page)) {
                    text = "조회 페이지는 숫자만 입력해주세요.";
                }
                else {
                    text += "📢 유물각인서 최저가 " + page + "페이지\n\n";
                    var data = getBookPrice(Data.CategoryCode.각인서, "유물", page);

                    // 오늘 날짜 가져오기
                    var today = new Date();
                    // 하루 빼기
                    today.setDate(today.getDate() - 1);
                    // YYYYMMDD 형식으로 변환
                    var year = today.getFullYear();
                    var month = (today.getMonth() + 1).toString().padStart(2, '0');
                    var day = today.getDate().toString().padStart(2, '0');
                    var yesterdayDate = year + '' + month + '' + day;

                    // 전일자 각인서 시세 조회
                    var books = org.jsoup.Jsoup.connect("https://api.loagap.com/bot/booksLog?date=" + yesterdayDate).ignoreContentType(true).header("referer", "bot.loagap.com").get().text();
                    var booksInfo = JSON.parse(books);
                    var lastText = "";

                    if (data.Items.length > 0) {
                        data.Items.forEach(item => {
                            text += item.Name.replace("각인서", "").replace(" ", "") + " " + set_comma(item.CurrentMinPrice) + "\n";

                            // 전일 각인서 찾기
                            booksInfo.forEach(book => {
                                if (item.Name == book.name) {
                                    const name = book.name.replace("각인서", "").replace(" ", "");
                                    const price = book.price;
                                    var priceGap = (item.CurrentMinPrice - price);

                                    lastText += name + " " + set_comma(priceGap) + " (" + calculatePercentage(price, item.CurrentMinPrice) + ")" + "\n";
                                }
                            });

                        });
                        if (data.Items.length == 10) {
                            text += "\n다음페이지 검색( .시세 유각 " + (Number(page) + 1) + ") ";
                        }
                        else {
                            text += "\n마지막페이지";
                        }
                        text += '\n\n\전일대비 ▼' + '\u200b'.repeat(501) + "\n\n";
                        text += lastText;
                        text += "\n\nhttps://www.loagap.com/bookPrice";
                    }
                    else {
                        text += "검색 결과가 없습니다.";
                    }
                }
            } else if (cmdArr[1] == '전각') {
                let page = cmdArr[2] || 1;
                if (!/^\d+$/.test(page)) {
                    text = "조회 페이지는 숫자만 입력해주세요.";
                }
                else {
                    text += "📢 전설각인서 최저가 " + page + "페이지\n\n";
                    var data = getBookPrice(Data.CategoryCode.각인서, "전설", page);

                    if (data.Items.length > 0) {
                        data.Items.forEach(item => {
                            text += item.Name.replace("각인서", "").replace(" ", "") + " " + set_comma(item.CurrentMinPrice) + "\n";
                        });
                        if (data.Items.length == 10) {
                            text += "\n다음페이지 검색( .시세 전각 " + (Number(page) + 1) + ") ";
                        }
                        else {
                            text += "\n마지막페이지";
                        }
                    }
                    else {
                        text += "검색 결과가 없습니다.";
                    }
                }
            } else if (cmdArr[1] == '재료') {
                text += "📢 강화재료 최저가\n\n";
                var data = getMarketItemPrice(Data.CategoryCode.에스더기운, 3);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += item.Name + " " + set_comma(item.CurrentMinPrice) + "\n";
                    });
                }
                text += "\n== 4티어 ==\n";
                var data = getMarketItemPrice(Data.CategoryCode.강화재료, 4);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += item.Name + " " + set_comma(item.CurrentMinPrice) + "\n";
                    });
                }
                text += "\n";
                var data = getMarketItemPrice(Data.CategoryCode.강화추가재료, 4);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        if (item.Grade == '영웅') {
                            text += item.Name + " " + set_comma(item.CurrentMinPrice) + "\n";
                        }
                    });
                }
                text += "\n== 3티어 ==";
                var data = getMarketItemPrice(Data.CategoryCode.강화재료, 3);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += "\n" + item.Name + " " + set_comma(item.CurrentMinPrice);
                    });
                }
            } else if (cmdArr[1] == '식물' || cmdArr[1] == '채집') {
                text += "📢 식물채집 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.식물채집, null);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += "\n" + item.Name + " " + set_comma(item.CurrentMinPrice);
                    });
                }
            } else if (cmdArr[1] == '벌목') {
                text += "📢 벌목 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.벌목, null);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += "\n" + item.Name + " " + set_comma(item.CurrentMinPrice);
                    });
                }
            } else if (cmdArr[1] == '채광') {
                text += "📢 채광 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.채광, null);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += "\n" + item.Name + " " + set_comma(item.CurrentMinPrice);
                    });
                }
            } else if (cmdArr[1] == '수렵') {
                text += "📢 수렵 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.수렵, null);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += "\n" + item.Name + " " + set_comma(item.CurrentMinPrice);
                    });
                }
            } else if (cmdArr[1] == '낚시') {
                text += "📢 낚시 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.낚시, null);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += "\n" + item.Name + " " + set_comma(item.CurrentMinPrice);
                    });
                }
            } else if (cmdArr[1] == '고고학') {
                text += "📢 고고학 최저가\n";
                var data = getMarketItemPrice(Data.CategoryCode.고고학, null);
                if (data.Items.length > 0) {
                    data.Items.forEach(item => {
                        text += "\n" + item.Name + " " + set_comma(item.CurrentMinPrice);
                    });
                }
            } else if (cmdArr[1] == '보석') {
                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
                var today = year + month + day;

                text += "📢 보석시세 " + year + "-" + month + "-" + day + "_ 0시기준\n";
                var jewels1 = org.jsoup.Jsoup.connect("https://api.loagap.com/bot/jewelsLog?date=" + today).ignoreContentType(true).header("referer", "bot.loagap.com").get().text();
                var jewelsInfo = JSON.parse(jewels1);

                var keys = Object.keys(jewelsInfo);

                // 2. forEach를 사용하여 각 키에 대한 처리
                keys.forEach(key => {
                    const jewel = jewelsInfo[key];  // 해당 키에 대한 보석 정보
                    const name = extractGemInfo(key);
                    text += "\n" + name + " : " + set_comma(jewel.todayPrice) + " (" + jewel.priceDifference + ")";
                });
            }

            else {
                msg.reply("존재하지않는 명령어입니다. /명령어를 확인해주세요.");
            }
            msg.reply(text);
        }

    }
}

// 7레벨 겁화의 보석 -> 7겁 변환
function extractGemInfo(str) {
    const parts = str.split(" "); // 공백 기준으로 문자열 나누기
    const level = parts[0].match(/\d+/)[0]; // 숫자만 추출
    const gemInitial = parts[1][0]; // 보석의 첫 글자 추출
    return level + gemInitial;
}

// 퍼센트게산
function calculatePercentage(yesterday, today) {
    if (yesterday === 0) return ""; // 0으로 나누는 오류 방지
    let percentageChange = ((today - yesterday) / yesterday * 100).toFixed(2);
    if (percentageChange > 0) return '▲' + percentageChange + '%';
    if (percentageChange < 0) return '▼' + Math.abs(percentageChange) + '%';
    return `0.00%`; // 변화 없을 때
}

// 퍼센트게산
function calculatePercentageemoz(percentageChange) {
    if (percentageChange > 0) return '▲' + percentageChange + '%';
    if (percentageChange < 0) return '▼' + Math.abs(percentageChange) + '%';
    return `0.00%`; // 변화 없을 때
}

// 경매장
function getPriceMarketItem(itemName) {

    var data;
    var url = "https://developer-lostark.game.onstove.com/markets/items";
    data = org.jsoup.Jsoup.connect(url)
        .header("accept", "application/json")
        .header("authorization", API.LOA_KEY)
        .header("Content-Type", "application/json")
        .requestBody(JSON.stringify(
            {
                "CategoryCode": Data.CategoryCode.각인서,
                "Sort": "BUY_PRICE",
                "ItemName": itemName
            }))

        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .post()
        .text();

    data = JSON.parse(data);
    return data;
}

// 거래소
function getPriceAuctionItem(itemName) {

    var keys = Object.keys(Data.GEMINDEX);

    var flag = '';
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] == itemName) {
            flag = '보석';
            itemName = Data.GEMINDEX[keys[i]];
            break;
        }
    }
    var priceJson = getItemPrice(itemName, flag);
    var price;
    var args;
    try {
        if (flag == '보석') {
            price = priceJson.Items[0].AuctionInfo.BuyPrice;
            args = {
                itemName: itemName,
                flag: flag,
                price: price,
                img: priceJson.Items[0].Icon
            };
        }

    } catch (e) {
    }
    return args;
}
function getItemPrice(itemName, Code) {

    // auctions = 경매장 - > 보석
    // markets = 거래소
    var data;
    if (Code == "보석") {
        var url = "https://developer-lostark.game.onstove.com/auctions/items";
        data = org.jsoup.Jsoup.connect(url)
            .header("accept", "application/json")
            .header("authorization", API.LOA_KEY)
            .header("Content-Type", "application/json")
            .requestBody(JSON.stringify(
                {
                    "CategoryCode": Data.CategoryCode.보석,
                    "Sort": "BUY_PRICE",
                    //"ItemTier": 3,
                    "ItemName": itemName
                }))

            .ignoreHttpErrors(true)
            .ignoreContentType(true)
            .post()
            .text();
    }
    data = JSON.parse(data);
    return data;
}

// 상단일 악세사리 검색용
// 200010 목걸이 7(연마) 추피 41 3 13   200020 귀걸이 7(연마) 공% 45 3 9    200030 반지 7(연마) 치적% 49 3 9
// 200010 목걸이 7(연마) 적추피 42 3 13 200020 귀걸이 7(연마) 무공% 46 3 9  200030  반지 7(연마) 치피% 50 3 9
// 200010 목걸이 7(연마) 공+ 53 3 13    200020 귀걸이 7(연마) 공+ 53 3 9    200030  반지 7(연마) 공+ 53 3 9
// 200010 목걸이 7(연마) 무공+ 54 3 13  200020 귀걸이 7(연마) 무공+ 54 3 9  200030  반지 7(연마) 무공+ 53 3 9
// 200010 목걸이 7(연마) 낙인력 44 3 13  200030  반지 7(연마) 아공강% 51 3 9 200030  반지 7(연마) 아피강% 52 3 9
function getAccessoriesPrice(itemLv, CategoryCode, etcOptions, upgradeLv) {
    var data;
    var url = "https://developer-lostark.game.onstove.com/auctions/items";
    data = org.jsoup.Jsoup.connect(url)
        .header("accept", "application/json")
        .header("authorization", API.LOA_KEY)
        .header("Content-Type", "application/json")
        .requestBody(JSON.stringify(
            {
                "ItemLevelMin": itemLv,
                "ItemLevelMax": itemLv,
                "ItemUpgradeLevel": upgradeLv,
                "CategoryCode": CategoryCode,
                "ItemGradeQuality": null,
                "SkillOptions": [],
                "EtcOptions": etcOptions,
                "Sort": "BUY_PRICE",
                "PageNo": 1,
                "SortCondition": "ASC"
            }
        ))
        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .post()
        .text();

    data = JSON.parse(data);
    return data;
}

// 각인서 조회
function getBookPrice(CategoryCode, ItemGrade, PageNo) {
    var data;
    var url = "https://developer-lostark.game.onstove.com/markets/items";
    data = org.jsoup.Jsoup.connect(url)
        .header("accept", "application/json")
        .header("authorization", API.LOA_KEY)
        .header("Content-Type", "application/json")
        .requestBody(JSON.stringify(
            {
                // 현재 최저가
                "Sort": "CURRENT_MIN_PRICE",
                "CategoryCode": CategoryCode,
                "ItemGrade": ItemGrade,
                "PageNo": PageNo,
                "SortCondition": "DESC"
            }))

        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .post()
        .text();

    data = JSON.parse(data);
    return data;
}

// 마켓재료 조회
function getMarketItemPrice(CategoryCode, ItemTier) {
    var data;
    var url = "https://developer-lostark.game.onstove.com/markets/items";
    data = org.jsoup.Jsoup.connect(url)
        .header("accept", "application/json")
        .header("authorization", API.LOA_KEY)
        .header("Content-Type", "application/json")
        .requestBody(JSON.stringify(
            {
                "CategoryCode": CategoryCode,
                "ItemTier": ItemTier,
                "Sort": "CURRENT_MIN_PRICE ",
                "SortCondition": "DESC"
            }))

        .ignoreHttpErrors(true)
        .ignoreContentType(true)
        .post()
        .text();

    data = JSON.parse(data);
    return data;
}

// 검색결과가 없을때 대비
function getBuyPrice(args) {
    if (args.Items && args.Items.length > 0 && args.Items[0].AuctionInfo) {
        return set_comma(args.Items[0].AuctionInfo.BuyPrice);
    }
    return "조회된 아이템이 없습니다.";
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
    if (msg.args[1] != "3") {
        return;
    }
    if (msg.command == "컴파일") {
        var ret = BotManager.compile(msg.args[0], true)
        if (ret) {
            msg.reply("완료");
        }
        else {
            msg.reply("실패");
        }
    }
    if (msg.command == "컴파일확인") {
        var ret = BotManager.isCompiled(msg.args[0])
        if (ret) {
            msg.reply("활성화");
        }
        else {
            msg.reply("비활성화");
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

// 천단위 콤마 함수
function set_comma(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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