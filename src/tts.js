import axios from 'axios';

const textToSpeech = async (inputText) => {
  const API_KEY = process.env.REACT_APP_xi_api_key;
  const VOICE_ID = process.env.REACT_APP_xi_voice_id;

  // Set options for the API request.
  const options = {
    method: 'POST',
    url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    headers: {
      accept: 'audio/mpeg', 
      'content-type': 'application/json',
      'xi-api-key': `${API_KEY}`,
    },
    data: {
      text: inputText, 
    },
    responseType: 'arraybuffer', 
  };

  // Send the API request using Axios and wait for the response.
  const speechDetails = await axios.request(options);

  // Return the binary audio data received from the API response.
  return speechDetails.data;
};

export default textToSpeech;