// 'use client'

// import { GeneratePodcastProps } from '@/types'
// import React, { useState } from 'react'
// import { Label } from './ui/label'
// import { Textarea } from './ui/textarea'
// import { Button } from './ui/button'
// import { Loader } from 'lucide-react'
// import { useAction, useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import {v4 as uuidv4} from 'uuid'
// import { useUploadFiles } from '@xixixao/uploadstuff/react'
// import { useToast } from "@/hooks/use-toast"

// const useGeneratePodcast = (props: GeneratePodcastProps) =>{
//        const [isGenerating, setIsGenarating] = useState(false);
//        const generateUploadUrl = useMutation(api.files.generateUploadUrl);
//        const {startUpload} = useUploadFiles(generateUploadUrl);
//        const { toast } = useToast()
//        const getPodcastAudio = useAction(api.openai.generateAudioAction)

//        const getAudioUrl = useMutation(api.podcast.getUrl)

//   const generatePodcast = async ({setAudio, voiceType, setAudioStorageId, voicePrompt} : GeneratePodcastProps) => {
//       setIsGenarating(true);
//       setAudio('');
//       if(!voicePrompt){
//         return setIsGenarating(false);
//       }
//       try{
//           const response = await getPodcastAudio({
//             voice: voiceType,
//             input: voicePrompt,
//           })

//           const blob = new Blob([response],{ type: 'audio/mpeg' });
//           const fileName = `podcast-${uuidv4()}.mp3`;
//           const file = new File([blob], fileName, { type: 'audio/mpeg' });
//         const uploaded = await startUpload([file]);
//         const storageId = (uploaded[0].response as any).storageId;
//         setAudioStorageId(storageId);
//         const audioUrl = await getAudioUrl({ storageId});
//         setAudio(audioUrl!);
//         setIsGenarating(false);
//         toast({
//           title: "Podcast generated successfully",
//         })
//       }catch(err){
//         toast({
//           title: "Error creating a podcast",
//           variant: "destructive",
//         })
//         setIsGenarating(false);
//       }
//   }

//   return {isGenerating,generatePodcast }
// }


// function GeneratePodcast(props: GeneratePodcastProps) {
//     const {isGenerating, generatePodcast} = useGeneratePodcast(props)
//   return (
//     <div>
//       <div className='flex flex-col gap-2.5 '>
//         <Label className='text-10 font-bold text-white-1'>
//           AI Prompt to Generate Podcast
//         </Label>
//         <Textarea
//         className='input-class focus-visible:ring-offset-orange-1 font-light'
//         placeholder='Provide text to generate audio'
//         rows={5}
//         value={props.voicePrompt}
//         onChange={(e) => props.setVoicePrompt(e.target.value)}
        
//         /> 
//       </div>
//       <div className="mt-5 w-full max-w-[200px]">
//       <Button
//                 type="submit"
//                 className="text-16   bg-orange-1 py-4 font-extrabold text-white-1"  
//                 onClick={() =>generatePodcast(props)}
//               >
//                 {isGenerating ? (
//                   <>
//                     <Loader
//                      size={20} className="animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   "Generate"
//                 )}
//               </Button>
//       </div>
//       {props.audio && (
//         <audio 
//         controls
//         src={props.audio}
//         autoPlay
//         className="mt-5"
//         onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)} 
//         />
          
// )}
//     </div>
//   )
// }

// export default GeneratePodcast




























"use client";
import * as yup from 'yup';

import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { api } from "@/convex/_generated/api";
import { GeneratePodcastProps } from "@/types";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

// we can keep the hook in separate file as well.
const useGeneratePodcast = (props: GeneratePodcastProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getAudioUrl = useMutation(api.podcast.getUrl);





  const podcastSchema = yup.object().shape({
    input: yup.string().required('Voice prompt is required'),
    voice: yup.string().required('Voice type is required'),
    gender: yup.string().required('Gender is required'),
    language: yup.string().required('Language is required'),
    voiceId: yup.string().required('Voice ID is required'),
    voiceName: yup.string().required('Voice name is required'),
    voiceType: yup.string().required('Voice type is required'),
  });

  const generatePodcast = async () => {
    setIsGenerating(true);
    props.setAudio("");
    if (!props.voicePrompt) {
      toast({
        title: "Please provide a voice prompt to generate podcast",
      });
      setIsGenerating(false);
      return;
    }
    if (!props.finalTypes || props.finalTypes.length === 0) {
      toast({
        title: "Please provide final types to generate podcast",
      });
      setIsGenerating(false);
      return;
    }
    const podcastData = {
      input: props.voicePrompt,
      voice: props.voiceType,
      gender: props.finalTypes[0].gender,
      language: props.finalTypes[0].language,
      voiceId: props.finalTypes[0].voiceId,
      voiceName: props.finalTypes[0].voiceName,
      voiceType: props.finalTypes[0].voiceType,
    };

    try {
      await podcastSchema.validate(podcastData, { abortEarly: false });
      const response = await getPodcastAudio(podcastData);
      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, {
        type: "audio/mpeg",
      });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      props.setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      props.setAudio(audioUrl!);
      props.setFinalTypes('');

      setIsGenerating(false);
      toast({
        title: "Podcast generated successfully",
      });
    } catch (error) {
      console.error("Error generating and uploading podcast:", error);
      toast({
        title: "Error generating podcast",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return { isGenerating, generatePodcast };
};

const GeneratePodcast = ({
  voiceType,
  setAudio,
  setAudioStorageId,
  setFinalTypes,
  audio,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
  finalTypes
}: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast({
    voiceType,
    setAudio,
    audio,
    setAudioStorageId,
    voicePrompt,
    setVoicePrompt,
    setAudioDuration,
    finalTypes,
    setFinalTypes
  });
  
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI prompt to generate podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder={`Provide text to AI to generate audio ${finalTypes && finalTypes[0] && finalTypes[0].language ? "in " + finalTypes[0].language : "but currently please select a language"}`}
          rows={5}
          value={voicePrompt}
          onChange={(e) => setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 font-bold text-white-1 duration-500"
          onClick={generatePodcast}
        >
          {isGenerating ? (
            <>
              <Loader className="animate-spin" size={20} /> &nbsp; Generating...
            </>
          ) : (
            "Generate Podcast"
          )}
        </Button>
      </div>
      {audio && (
        <audio
          controls
          src={audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
};

export default GeneratePodcast;