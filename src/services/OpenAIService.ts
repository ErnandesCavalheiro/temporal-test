import OpenAI from "openai"

class OpenAIService {
    private openai: OpenAI;
    private sentimentAnalysisPrompt = "Please classify the sentiment expressed in the following sentence as positive, neutral or negative. More information should be provided on the mood and tone: "

    constructor(key: string | undefined) {
        this.openai = new OpenAI({
            apiKey: key
        })
    }

    async analyzeComment(comment: string) {
        const response = await this.openai.completions
                            .create({
                                prompt: this.sentimentAnalysisPrompt + comment + ".",
                                model: "text-davinci-003",
                                max_tokens: 5
                            })

        return response.choices;
    }
}

export default OpenAIService;