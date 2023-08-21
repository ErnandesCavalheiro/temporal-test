import fs from 'fs';
import CSV from '../interfaces/Csv';

// Função para ler o CSV e retornar um array de objetos
function parseCSV(filePath: string) {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');

    const result: CSV[] = [];

    for (let i = 1; i < lines.length; i++) {
        const obj: any = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }

        result.push(obj);
    }

    return result;
}

// Função para contar os sentimentos e calcular as porcentagens
function analyzeSentiments(data: any[]) {
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    for (const item of data) {
        // Verifica se a propriedade Sentiment existe e não é nula
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

    const positivePercentage = (positiveCount / totalCount) * 100;
    const negativePercentage = (negativeCount / totalCount) * 100;
    const neutralPercentage = (neutralCount / totalCount) * 100;

    return {
        totalCount,
        positivePercentage,
        negativePercentage,
        neutralPercentage
    };
}


function parseAndAnalyzeCSV(filePath: string): Object {
    const data = parseCSV(filePath);

    const sentimentAnalysis = analyzeSentiments(data);

    return sentimentAnalysis;
}

export default parseAndAnalyzeCSV;