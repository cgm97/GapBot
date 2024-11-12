/**
* Created by 개발자 on 2023/04/09
* Copyright (c) 개발자.
* 저작권자표시 및 2차저작물배포금지 및 영리목적 사용금지
* This code is licensed under the MIT Licensing Principles.
**/

let prefix = "!";

function getResult(FW, EW, WC, POS) {
  let a = ["N", "V", "A", "I", "C", "P", "S"];
  let b = ["명사", "동사", "형용사", "감탄사", "대명사", "구어체 축약형"];
  let cWNum = EW.replace("_").length;
  let wWNum = FW.length - cWNum;
  let a1 = ["", "" , ""  , "┏━━", "┏━━┓", "┏━━┓"  , "┏━━┓"     , "┏━━┓"    , "┏━━┓"      , "┏━━┓"      , "┏━━┓"       ];
  let a2 = ["", "┃", "┃╱", "┃╱" , "┃╱"  , "┃╱   ○", "┃╱   ○"   , "┃╱   ○"  , "┃╱   ○"    , "┃╱   ○"    , "┃╱   ○"     ];
  let a3 = ["", "┃", "┃" , "┃"  , "┃"   , "┃"     , "┃       ┃", "┃     /┃", "┃     /┃\\", "┃     /┃\\", "┃     /┃\\" ];
  let a4 = ["", "┃", "┃" , "┃"  , "┃"   , "┃"     , "┃"        , "┃"       , "┃"         , "┃       /" , "┃       /\\"];
  let a5 = ["", "┃", "┃" , "┃"  , "┃"   , "┃"     , "┃"        , "┃"       , "┃"         , "┃"         , "┃"          ];
  return a1[WC] + "\n" + a2[WC] + "\n" + a3[WC] + "\n" + a4[WC] + "\n" + a5[WC] + "\n" + EW.split("").join(" ") + " (" + b[a.indexOf(POS)] + ")" + (EW == FW ? "\n뜻: " + Api.papagoTranslate("en", "ko", EW) : "");
}

/**
영단어 목록>
https://github.com/felixfischer/categorized-words
**/
let wordList = JSON.parse(org.jsoup.Jsoup.connect("https://raw.githubusercontent.com/felixfischer/categorized-words/master/2of12id.json").ignoreContentType(true).get().text());

let fWord = "", eWord = "", wCount = "", pos = "";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
  if(room == '빈틈 테스트'){
    if (msg.startsWith(prefix + "행맨 ")) {
      let say = msg.slice(4);
      switch (say) {
        case "시작":
          if (eWord != "") {
            replier.reply("이미 게임을 시작하였습니다.");
            return;
          }
          let a = ("N".repeat(47004) + "V".repeat(31232) +  "A".repeat(14903) + "I".repeat(188) + "C".repeat(139) + "P".repeat(78) + "S".repeat(9)).split("")[Math.floor(Math.random() * 93553)];
          let b = wordList[a];
          fWord = b[Math.floor(Math.random() * a.length)];
          eWord = "_".repeat(fWord.length);
          wCount = 0;
          pos = a;
          replier.reply(getResult(fWord, eWord, wCount, pos));
        break;
        default:
          if (eWord == undefined) {
            replier.reply("게임을 시작하지 않았습니다.");
            return;
          }
          if (!say.match(/[a-z]/) || say.length != 1) {
            replier.reply("한 글자의 영문자를 입력해주세요!");
            return;
          }
          if (fWord.includes(say)) {
            eWord = fWord.split("").map((e, i) => (e == say ? fWord[i] : eWord[i])).join("");
          } else {
            wCount++;
          }
          replier.reply(getResult(fWord, eWord, wCount, pos));
          if (wCount == 10) {
            replier.reply("〈 " + sender + " 〉\n패배하였습니다.\n정답: " + fWord);
            eWord = "", fWord = "", wCount = "";
            return;
          } else if (eWord == fWord) {
            replier.reply("〈 " + sender + " 〉\n승리하였습니다.\n오답 횟수: " + wCount + "번");
            eWord = "", fWord = "", wCount = "";
            return;
          }
      }
    }
  }
}