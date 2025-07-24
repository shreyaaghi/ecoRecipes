import Anthropic from "@anthropic-ai/sdk";

const sendAiRequest = async (message:string) => {
    if (message.length == 0) {
        return {
            status: 400,
            error: "No message"
        }
    }
    const anthropic = new Anthropic();
    const msg = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        temperature: 1,
        system: "Act normal",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: message
                    }
                ]
            },
        ],
    });
    return {
        status: 200,
        data: msg
    }
};


export { sendAiRequest };