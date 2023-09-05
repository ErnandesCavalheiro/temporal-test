import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import SentimentObject from '../interfaces/SentimentObject';

export default async function getUserCommentFromCSV(userId: number): Promise<SentimentObject[]> {
  const comments: SentimentObject[] = [];

  const directory = './output/csv/posts/';

  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);

    if (path.extname(file) === '.csv') {
      const fileStream = fs.createReadStream(filePath, 'utf8');

      await new Promise<void>((resolve, reject) => {
        fileStream
          .pipe(csv())
          .on('data', (row) => {
            if (row['User ID'] && parseInt(row['User ID']) == userId) {
                comments.push({
                    id: parseInt(row['ID']),
                    sentiment: row['Sentiment'],
                });
            }
          })
          .on('end', () => resolve())
          .on('error', (error) => reject(error));
      });
    }
  }

  return comments;
}













