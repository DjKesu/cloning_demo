import React, { useState, useEffect } from "react";
import "./App.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import steve from "./static/steve.jpg";
import createConversation from "./conversation";
import textToSpeech from "./tts";

function App() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const [response, setResponse] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("");

  async function speakNow(response) {
    setSpeaking(true);
    try {
      const audio = await textToSpeech(response);
      const audioBlob = new Blob([audio], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      // add event listener to set speaking to false when audio is done playing
      await new Promise((resolve) => {
        audioElement.addEventListener("ended", resolve);
        audioElement.play();
      });
  
      setSpeaking(false);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setSpeaking(false);
    }
  }

  async function chatCreation(question) {
    console.log(question);
    if (question !== "") {
      try {
        const chatResponse = await createConversation(question);
        setResponse(chatResponse);
        console.log(chatResponse);
        await speakNow(chatResponse);
      } catch (error) {
        console.log("Error creating conversation:", error);
      }
    }
  }

  useEffect(() => {
    if (transcript !== "" && !listening) {
      setPrompt(transcript);
      chatCreation(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript, listening]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return (
      <div className="body">
        <h1>
          Speech Recognition is not supported in this browser. You're the issue,
          not me lmao
        </h1>
      </div>
    );
  }

  async function micUse() {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Clear any previous transcript
      SpeechRecognition.startListening();
    }
  }

  return (
    <div className="body">
      <h1>Voice Chat Demo</h1>
      <img id="steve" src={steve} alt="Steve" />
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={micUse} disabled={speaking}>
        {listening ? "Listening..." : "Ask me something"}
      </button> 
      <p>Your Question: {prompt}</p>
      <p>Steve is speaking: {speaking ? "yes" : "no"}</p>
      {response && <p>Steve's Response: {response}</p>}
    </div>
  );
}

export default App;
