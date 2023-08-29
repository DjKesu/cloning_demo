import { Configuration, OpenAIApi } from "openai";
import textToSpeech from "./tts";

const apiKey = process.env.REACT_APP_openai_api_key;
const orgId = process.env.REACT_APP_openai_org_id;

const openAiConfig = new Configuration({
  organization: orgId,
  apiKey: apiKey,
});

delete openAiConfig.baseOptions.headers["User-Agent"];

const openaiapi = new OpenAIApi(openAiConfig);

async function createConversation(text) {
  const completion = await openaiapi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are Steve Jobs." },
      { role: "user", content: text },
    ],
    stream: false, // Not using streaming here
    max_tokens: 120,
  });

  // Get the content directly from the response
  const content = completion.data.choices[0].message.content;

  if (content) {
    textToSpeech(content).then((audio) => {
      const audioBlob = new Blob([audio], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    });
  }
}

export default createConversation;
