

module.exports.send = (client,templateId,templateArgs,room) => { 

    try {
        client.sendLink(room, {
            templateId: templateId, // your template id
            templateArgs: templateArgs,
        }, 'custom').awaitResult();
    }catch(e) {
        
    }
} 