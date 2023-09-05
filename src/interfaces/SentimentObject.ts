interface SentimentObject {
    id?: number;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    body?: string;
    error?: string;
}

export default SentimentObject;
