// app/api/languages/route.ts

import { NextResponse } from 'next/server';

const languages = [
    {
        language: "English (United States)",
        code: "en-US",
        voices: [
            { voiceId: "en-US-Neural2-A", voiceName: "Jenny" },
            { voiceId: "en-US-Neural2-C", voiceName: "Aria" },
            { voiceId: "en-US-Neural2-D", voiceName: "John" },
            { voiceId: "en-US-Neural2-F", voiceName: "Guy" }
        ]
    },
    {
        language: "English (United Kingdom)",
        code: "en-GB",
        voices: [
            { voiceId: "en-GB-Neural2-A", voiceName: "Libby" },
            { voiceId: "en-GB-Neural2-C", voiceName: "Sonia" },
            { voiceId: "en-GB-Neural2-D", voiceName: "Ryan" },
            { voiceId: "en-GB-Neural2-B", voiceName: "George" }
        ]
    },
    {
        language: "English (Australia)",
        code: "en-AU",
        voices: [
            { voiceId: "en-AU-Neural2-A", voiceName: "Nicole" },
            { voiceId: "en-AU-Neural2-B", voiceName: "Russell" }
        ]
    },
    {
        language: "Spanish (Spain)",
        code: "es-ES",
        voices: [
            { voiceId: "es-ES-Neural2-A", voiceName: "Lucia" },
            { voiceId: "es-ES-Neural2-B", voiceName: "Enrique" }
        ]
    },
    {
        language: "Spanish (Mexico)",
        code: "es-MX",
        voices: [
            { voiceId: "es-MX-Neural2-A", voiceName: "Mia" },
            { voiceId: "es-MX-Neural2-B", voiceName: "Carlos" }
        ]
    },
    {
        language: "French (France)",
        code: "fr-FR",
        voices: [
            { voiceId: "fr-FR-Neural2-A", voiceName: "Julie" },
            { voiceId: "fr-FR-Neural2-B", voiceName: "Louis" }
        ]
    },
    {
        language: "French (Canada)",
        code: "fr-CA",
        voices: [
            { voiceId: "fr-CA-Neural2-A", voiceName: "Chantal" },
            { voiceId: "fr-CA-Neural2-B", voiceName: "Claude" }
        ]
    },
    {
        language: "German (Germany)",
        code: "de-DE",
        voices: [
            { voiceId: "de-DE-Neural2-A", voiceName: "Marlene" },
            { voiceId: "de-DE-Neural2-B", voiceName: "Hans" }
        ]
    },
    {
        language: "Hindi (India)",
        code: "hi-IN",
        voices: [
            { voiceId: "hi-IN-Neural2-A", voiceName: "Kajal" },
            { voiceId: "hi-IN-Neural2-B", voiceName: "Ravi" }
        ]
    },
    {
        language: "Bengali (India)",
        code: "bn-IN",
        voices: [
            { voiceId: "bn-IN-Neural2-A", voiceName: "Meera" },
            { voiceId: "bn-IN-Neural2-B", voiceName: "Amit" }
        ]
    },
    {
        language: "Japanese (Japan)",
        code: "ja-JP",
        voices: [
            { voiceId: "ja-JP-Neural2-A", voiceName: "Haruka" },
            { voiceId: "ja-JP-Neural2-B", voiceName: "Ichiro" }
        ]
    },
    {
        language: "Korean (South Korea)",
        code: "ko-KR",
        voices: [
            { voiceId: "ko-KR-Neural2-A", voiceName: "Ji-hye" },
            { voiceId: "ko-KR-Neural2-B", voiceName: "Min-ho" }
        ]
    },
    {
        language: "Mandarin Chinese (China Mainland)",
        code: "zh-CN",
        voices: [
            { voiceId: "zh-CN-Neural2-A", voiceName: "Xiaoxiao" },
            { voiceId: "zh-CN-Neural2-B", voiceName: "Yunhao" }
        ]
    },
    {
        language: "Portuguese (Brazil)",
        code: "pt-BR",
        voices: [
            { voiceId: "pt-BR-Neural2-A", voiceName: "Vitoria" },
            { voiceId: "pt-BR-Neural2-B", voiceName: "Felipe" }
        ]
    },
    {
        language: "Russian (Russia)",
        code: "ru-RU",
        voices: [
            { voiceId: "ru-RU-Neural2-A", voiceName: "Tatyana" },
            { voiceId: "ru-RU-Neural2-B", voiceName: "Ivan" }
        ]
    },
    {
        language: "Arabic (Saudi Arabia)",
        code: "ar-SA",
        voices: [
            { voiceId: "ar-SA-Neural2-A", voiceName: "Salma" },
            { voiceId: "ar-SA-Neural2-B", voiceName: "Youssef" }
        ]
    },
    {
        language: "Italian (Italy)",
        code: "it-IT",
        voices: [
            { voiceId: "it-IT-Neural2-A", voiceName: "Giulia" },
            { voiceId: "it-IT-Neural2-B", voiceName: "Luca" }
        ]
    },
    {
        language: "Dutch (Netherlands)",
        code: "nl-NL",
        voices: [
            { voiceId: "nl-NL-Neural2-A", voiceName: "Femke" },
            { voiceId: "nl-NL-Neural2-B", voiceName: "Daan" }
        ]
    }
];

// Define a type for the voice structure
interface Voice {
    voiceId: string;
    voiceName: string;
}

// Define a type for the language structure
interface Language {
    language: string;
    code: string;
    voices: Voice[];
}

// Handler function for the API route
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const langCode = searchParams.get('code');

    if (langCode) {
        const language = languages.find((lang: Language) => lang.code === langCode);
        if (language) {
            return NextResponse.json(language.voices);
        } else {
            return NextResponse.json({ error: 'Language not found' }, { status: 404 });
        }
    }

    return NextResponse.json(languages);
}
