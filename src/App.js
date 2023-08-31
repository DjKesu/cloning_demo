import React, { useEffect, useState } from "react";
import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import steve from "./static/steve.jpg";
import createConversation from "./conversation";
import textToSpeech from "./tts";

function App() {
  const {
    transcript,
    listening,
    stopListening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [response, setResponse] = useState("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (listening && transcript) {
      const silenceTimeout = setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 3000);

      return () => {
        clearTimeout(silenceTimeout);
      };
    }
  }, [transcript, listening, stopListening]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="body">
        <h1>Speech Recognition is not supported in this browser. You're the issue, not me lmao</h1>
      </div>
    );
  }

  async function speakNow(response){
    setSpeaking(true);
    await textToSpeech(response).then((audio) => {
      console.log(speaking);
      console.log(response);
      console.log(audio);
      const audioBlob = new Blob([audio], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      console.log(audioElement);
      audioElement.play();
    });
    setSpeaking(false);
  }

  async function chatCreation() {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
      await createConversation(transcript).then((response) => {
        setResponse(response);
        console.log(response);
        speakNow(response);
      });
      SpeechRecognition.transcript = "";
    }
  }

  return (
    <div className="body">
      <h1>Voice Chat Demo</h1>
      <img id="steve" src={steve} alt="Steve" />
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={chatCreation}>
        {listening ? "Listening..." : "Ask me something"}
      </button>
      <p>Your Question: {transcript}</p>
      <p>Steve is speaking: {speaking ? "yes" : "no"}</p>
      <p>Steve's Response: {response}</p>
    </div>
  );
}

export default App;
