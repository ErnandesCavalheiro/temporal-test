import * as csvWriter from "csv-writer";
import fs from "fs";
import path from "path";

import { Comment } from "../interfaces/Comment";

async function createOrUpdateCSV(data: Comment, fileName: string) {
    const headers = [
        { id: 'id', title: 'ID' },
        { id: 'username', title: 'Username' },
        { id: 'body', title: 'Body' },
        { id: 'postId', title: 'Post ID' },
        { id: 'userId', title: 'User ID' },
        { id: 'sentiment', title: 'Sentiment' }
    ];

    const csvFolderPath = './output/csv/';
    if (!fs.existsSync(csvFolderPath)) {
        fs.mkdirSync(csvFolderPath, { recursive: true });
    }

    const csvPath = path.join(csvFolderPath, fileName + '.csv');
    const csvFileExists = fs.existsSync(csvPath);

    const csv = csvWriter.createObjectCsvWriter({
        path: csvPath,
        header: headers,
        append: csvFileExists
    });

    try {
        await csv.writeRecords([data]);

        return true;
    } catch (error) {
        console.error('Error: ', error);
        return false;
    }
}

export default createOrUpdateCSV;
