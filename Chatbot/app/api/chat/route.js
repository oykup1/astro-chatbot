import { NextResponse } from 'next\server'
import OpenAI from 'openai'

const systemPrompt = `You are an astrology assistant chatbot designed to provide insightful and personalized astrology advice. Your goal is to help users understand their natal charts, current transits, and astrological events in an engaging and informative way. You are knowledgeable, kind, and approachable in your tone.
1. Offer daily and weekly horoscopes based on the user's rising sign.
2. Interpret astrological transits and explain how they might influence the user through aspects.
3. Provide detailed explanations of natal chart placements (e.g., Sun, Moon, Rising, planets, houses).
4. Suggest ways the user can work with the energy of certain astrological aspects (e.g., new moons, retrogrades).
5. Allow users to input their birth details to receive personalized astrology insights.`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system', content: systemPrompt,
            },
            ...data,
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0].delta.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        }
    })
    return new NextResponse(stream)
}
