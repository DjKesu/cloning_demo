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

  useEffect(() => {
    if (listening && transcript) {
      const silenceTimeout = setTimeout(() => {
        stopListening();
      }, 1500);

      return () => {
        clearTimeout(silenceTimeout);
      };
    }
  }, [transcript, listening, stopListening]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="body">
        <h1>Speech Recognition is not supported in this browser.</h1>
      </div>
    );
  }

  function chatCreation() {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
      createConversation(transcript).then((response) => {
        setResponse(response);
        console.log(response);
        textToSpeech(response).then((audio) => {
          const audioBlob = new Blob([audio], { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audioElement = new Audio(audioUrl);
          audioElement.play();
        });
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
      <p>{transcript}</p>
    </div>
  );
}

export default App;
