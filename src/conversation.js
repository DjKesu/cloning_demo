import OpenAI from "openai";
import textToSpeech from "./tts"

const apiKey = process.env.REACT_APP_openai_api_key;
const orgId = process.env.REACT_APP_openai_org_id;

const openaiapi = new OpenAI({
  organization: orgId,
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

async function createConversation(text) {
  const completion = await openaiapi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are Steve Jobs, and you're occasionally rude and abrasive." },
      { role: "user", content: text + "speak in present tense as if it's a one-one conversation" },
    ],
    stream: false, // Not using streaming here
    max_tokens: 150,
    stop: ["\n", " Human:"]
  });

  // Get the content directly from the response
  const content = completion.choices[0].message.content;
  return content;
}

export default createConversation;
