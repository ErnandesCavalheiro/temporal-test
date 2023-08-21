import { Request, Response } from 'express';
import express from 'express';
import { Connection, Client } from '@temporalio/client';
import { AnalyzeCSV, GetAndAnalyzeComment } from './workflows';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3000;

app.get('/create/:qnt', async (req: any, res: any) => {
    const quantity = req.params.qnt;

    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(GetAndAnalyzeComment, {
        taskQueue: 'comment-analysis',
        args: [0, quantity],
        workflowId: 'workflow-' + nanoid(),
    });
});

app.get('/create', async (req: any, res: any) => {
    const randomNumber = Math.floor(Math.random() * 50) + 1;

    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(GetAndAnalyzeComment, {
        taskQueue: 'comment-analysis',
        args: [randomNumber, 1],
        workflowId: 'workflow-' + nanoid(),
    });
});

app.get('/analyze', async (req: Request, res: Response) => {
    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(AnalyzeCSV, {
        taskQueue: 'comment-analysis',
        args: ['./output/csv/analysis.csv'],
        workflowId: 'workflow-' + nanoid(),
    });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
