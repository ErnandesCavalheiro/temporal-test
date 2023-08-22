import * as csvWriter from "csv-writer";
import fs from "fs";
import path from "path"; // Importe o módulo path para lidar com caminhos

import Comment from "../interfaces/Comment";

async function CreateOrUpdateCSV(data: Comment | Comment[]) {
    const headers = [
        { id: 'id', title: 'ID' },
        { id: 'body', title: 'Body' },
        { id: 'postId', title: 'Post ID' },
        { id: 'userId', title: 'User ID' },
        { id: 'sentiment', title: 'Sentiment' }
    ];

    // Verificar e criar a pasta output/csv/ se ela não existir
    const csvFolderPath = './output/csv/';
    if (!fs.existsSync(csvFolderPath)) {
        fs.mkdirSync(csvFolderPath, { recursive: true });
    }

    const csvPath = path.join(csvFolderPath, 'analysis.csv');
    const csvFileExists = fs.existsSync(csvPath);

    const csv = csvWriter.createObjectCsvWriter({
        path: csvPath,
        header: headers,
        append: csvFileExists
    });

    const dataArray = Array.isArray(data) ? data : [data];

    try {
        await csv.writeRecords(dataArray);
        if (!csvFileExists) {
            console.log('CSV file created and data added.');
        } else {
            console.log('Data added to existing CSV file.');
        }
        return true;
    } catch (error) {
        console.error('error: ', error);
        return false;
    }
}

export default CreateOrUpdateCSV;
