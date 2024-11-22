
const API = require('key');

var { KakaoApiService, KakaoShareClient } = require('kakaolink');

const service = KakaoApiService.createService();
const client = KakaoShareClient.createClient();

const cookies = service.login({
    signInWithKakaoTalk: true,
    context: Api.getContext(), // 레거시: Api.getContext()
}).awaitResult();

client.init(API.KAKAOLINK_KEY, 'https://open.kakao.com', cookies);

module.exports.send = (templateId,templateArgs,room) => { 

    try {
        client.sendLink(room, {
            templateId: templateId, // your template id
            templateArgs: templateArgs,
        }, 'custom').awaitResult();
    }catch(e) {
        
    }
} 