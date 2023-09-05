import SentimentObject from "../interfaces/SentimentObject";

function averageSentiment(sentimentObjects: SentimentObject[]): string {
  const len = sentimentObjects.length;

  if (len <= 0) {
    return "Neutral";
  }

  let totalCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let positiveCount = 0;

  sentimentObjects.forEach((obj) => {
    switch (obj.sentiment) {
      case 'Positive':
        totalCount++;
        positiveCount++;
        break;
      case 'Neutral':
        totalCount++;
        neutralCount++;
        break;
      case 'Negative':
        totalCount++;
        negativeCount++;
        break;
      default:
        break;
    }
  });

  let avgSentiment = '';

  if (totalCount === 1 && positiveCount === 1) {
    return avgSentiment = 'Positive';
  } else {
    const total = (negativeCount * 1 + neutralCount * 2 + positiveCount * 3) / (negativeCount + neutralCount + positiveCount);

    if (total > 2.33) {
      return avgSentiment = 'Positive';
    } else if (total < 1.67) {
      return avgSentiment = 'Negative';
    } else {
      return avgSentiment = 'Neutral';
    }
  }
}

export default averageSentiment;