import { Configuration, OpenAIApi } from "openai"

const apiKey = process.env.REACT_APP_openai_api_key;
const orgId = process.env.REACT_APP_openai_org_id;

const openAiConfig = new Configuration({
    organization: orgId,
    apiKey: apiKey,
  });

delete openAiConfig.baseOptions.headers['User-Agent'];

const openaiapi = new OpenAIApi(openAiConfig);

async function createConversation(text) {
  const completion = await openaiapi.createChatCompletion({
    messages: [{ "role": "user", "content": text + "Give me a response as if you're steve jobs" }],
    model: "gpt-3.5-turbo-16k-0613",
    max_tokens: 150,
    temperature: 0.9
  });

  console.log(completion.data.choices[0].message.content);
  return completion.data.choices[0].message.content;
}

export default createConversation;