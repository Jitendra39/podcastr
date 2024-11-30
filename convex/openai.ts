import { action } from "./_generated/server";
import { v } from "convex/values";

// Define a function to handle retries with exponential backoff
const retryWithBackoff = async (
  fn: () => Promise<any>, // Updated to Promise<any> for better flexibility
  retries: number = 3,
  delay: number = 1000
): Promise<any> => {
  try {
    return await fn();
  } catch (error: unknown) { 
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }

    if (error instanceof Error) {
      throw new Error(`Failed after retries: ${error.message}`);
    } else {
      throw new Error('Failed after retries: Unknown error');
    }
  }
};

// Define the action to generate audio
export const generateAudioAction = action({
  args:{
    input: v.string(),         
    voice: v.string(),      
    gender: v.string(),     
    language: v.any(),      
    voiceId: v.any(),        
    voiceName: v.string(),    
    voiceType: v.string(),   
  },
  handler: async (_, { voice, input, gender, voiceId, voiceName, voiceType, language }) => {
    console.log(input, gender, voiceId, voiceName, voiceType, language);

    const rapidApiKey = process.env.RAPID_API_KEY;
    const rapidApiHost = process.env.RAPID_API_HOST;

    if (!rapidApiKey || !rapidApiHost) {
      throw new Error("Missing RapidAPI key or host in environment variables");
    }

    // Define the API request function using fetch
    const apiRequest = async (): Promise<any> => {
      const response = await fetch(`https://${rapidApiHost}/v3/generate_voice_over_v2`, {
        method: 'POST',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice_obj: {
            id: 2014,
            voice_id: voiceId,          
            gender: gender,          
            language_code: voiceType,  
            language_name: language,    
            voice_name: voiceName,    
            sample_text: input,     
            sample_audio_url: 'https://s3.ap-south-1.amazonaws.com/invideo-uploads-ap-south-1/speechen-US-Neural2-A16831901130600.mp3',
            status: 2,
            rank: 0,
            type: 'google_tts',
            isPlaying: false,
          },
          json_data: [
            {
              block_index: 0,
              text: input,  
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const jsonResponse = await response.json();

      // Extract the link to the audio file
      const audioLink = jsonResponse[0]?.link;
      if (!audioLink) {
        throw new Error('No audio link found in response');
      }

      // Now fetch the audio file as a binary array buffer
      const audioResponse = await fetch(audioLink);
      if (!audioResponse.ok) {
        throw new Error(`Error fetching audio: ${audioResponse.statusText}`);
      }

      return await audioResponse.arrayBuffer();
    };

    // Retry mechanism for the API request
    try {
      const audioArrayBuffer = await retryWithBackoff(apiRequest, 3, 1000);
      return audioArrayBuffer; // Return the binary audio data in ArrayBuffer format
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      } else {
        throw new Error('Request failed: Unknown error');
      }
    }
  },
});




// import OpenAI from 'openai';
// import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export const generateThumbnailAction = action({
//   args: {prompt: v.string()},
//   handler: async(_, {prompt}) =>{
//    const response = await openai.images.generate({
//         model: 'dall-e-3',
//         prompt,
//         size: '1024x1024',
//         quality:'standard',
//         n: 1,
//     })

//     const url = response.data[0].url;
//     if(!url){
//       throw new Error('Error generating thumbnail');
//     }

//     const imageResponse = await fetch(url);
//     const buffer = await imageResponse.arrayBuffer();
//     return buffer; 
//   }
// })

 



export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const url = 'https://text-to-image13.p.rapidapi.com/';
    const options1 = {
      method: 'POST',
      headers: {
        'x-rapidapi-key':`${process.env.STABLE_DIFFUSION}`,
        'x-rapidapi-host': 'text-to-image13.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    };
    try {
      const response = await fetch(url, options1);
      console.log(response)
      if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      const imageUrl = result.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('Error generating thumbnail');
      }

      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Error fetching image: ${imageResponse.statusText}`);
      }
      const buffer = await imageResponse.arrayBuffer();
      return buffer;
      } else if (contentType && contentType.includes('image/')) {
      const buffer = await response.arrayBuffer();
      return buffer;
      } else {
      throw new Error('Unexpected content type');
      }
    } catch (error) {
      console.error('Error generating and fetching image:', error);
      throw new Error('Failed to generate thumbnail');
    }
    
    
  }
});








// export const generateAudioAction = action({
//   args: { input: v.string(), voice: v.string() },
//   handler: async (_, { voice, input }) => {
//     const rapidApiKey = process.env.RAPID_API_KEY;
//     const rapidApiHost = process.env.RAPID_API_HOST;

//     if (!rapidApiKey || !rapidApiHost) {
//       throw new Error("Missing RapidAPI key or host in environment variables");
//     }

//     const response = await fetch(`https://${rapidApiHost}/`, {
//       method: 'POST',
//       headers: {
//         'x-rapidapi-key': rapidApiKey,
//         'x-rapidapi-host': rapidApiHost,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         model: 'tts-1',
//         input,
//         voice,
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.statusText}`);
//     }

//     const buffer = await response.arrayBuffer();
//     return buffer;
//   },
// });
















// import { action } from "./_generated/server";
// import { v } from "convex/values";
// import OpenAI from 'openai';
// import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export const generateAudioAction = action({
//   args: { input: v.string(), voice: v.string() },
//   handler:async(_, {voice, input}) => {
//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: voice as SpeechCreateParams['voice'],
//       input,
//     });
//     const buffer =  await mp3.arrayBuffer();

//     return buffer;
//   },
// });
