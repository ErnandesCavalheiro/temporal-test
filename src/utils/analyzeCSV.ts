import fs from 'fs';

function parseCSV(filePath: string) {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');

    const result: any[] = [];

    for (let i = 1; i < lines.length; i++) {
        const obj: any = {};
        const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j]
        }

        result.push(obj);
    }

    return result;
}


function groupByUser(data: any[]) {
    const groupedData: { [key: string]: any[] } = {};

    for (const item of data) {
        if (item['User ID']) {
            const userID = item['User ID'];

            if (!groupedData[userID]) {
                groupedData[userID] = [];
            }

            groupedData[userID].push(item);
        }
    }

    return groupedData;
}

function analyzeSentiments(data: any[]) {
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    for (const item of data) {
        if (item.Sentiment) {
            const sentiment = item.Sentiment.toLowerCase();

            if (sentiment.includes('positive')) {
                positiveCount++;
            } else if (sentiment.includes('negative')) {
                negativeCount++;
            } else {
                neutralCount++;
            }
        }
    }

    const totalCount = data.length;

    let avgSentiment = '';

    if (totalCount === 1 && positiveCount === 1) {
        avgSentiment = 'Positive';
    } else {
        const total = (negativeCount * 1 + neutralCount * 2 + positiveCount * 3) / (negativeCount + neutralCount + positiveCount);

        if (total > 2.33) {
            avgSentiment = 'Positive';
        } else if (total < 1.67) {
            avgSentiment = 'Negative';
        } else {
            avgSentiment = 'Neutral';
        }
    }

    return {
        totalCount,
        avgSentiment
    };
}

function analyzeSentimentsForGroupedData(groupedData: { [key: string]: any[] }) {
    const analysisResults: { [key: string]: any } = {};

    for (const userID in groupedData) {
        if (groupedData.hasOwnProperty(userID)) {
            const userGroup = groupedData[userID];
            const sentimentAnalysis = analyzeSentiments(userGroup);
            analysisResults[userID] = sentimentAnalysis;
        }
    }

    return analysisResults;
}

function parseAndAnalyzeCSV(filePath: string): any {
    const data = parseCSV(filePath);

    return analyzeSentiments(data);
}

function parseAndAnalyzeCSVGrouped(filePath: string): any {
    const data = parseCSV(filePath);

    const groupedData = groupByUser(data);

    const analysis = analyzeSentimentsForGroupedData(groupedData);

    return analysis;
}

export { parseAndAnalyzeCSV, parseAndAnalyzeCSVGrouped };