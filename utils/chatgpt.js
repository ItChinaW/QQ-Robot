const {Configuration, OpenAIApi} = require("openai");
const config = require("../config.json");

exports.AskQuestion = async (question) => {
    const configuration = new Configuration({
        apiKey: config.chatgpt.apiKey,
    });
    const openai = new OpenAIApi(configuration);

    const completion = openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 1000,
    });

    let theAnswer;
    await completion.then(async (r) => {
        theAnswer = await r.data.choices[0].text;
    });
    return theAnswer;
}
