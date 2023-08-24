import { Request, Response } from 'express';
import express from 'express';
import { Connection, Client } from '@temporalio/client';
import { AnalyzeCSV, GetAndAnalyzeComment } from './workflows';
import { nanoid } from 'nanoid';


const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/create/:qnt', async (req, res) => {
    const quantity = req.params.qnt;

    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    for (let i = 0; i < quantity; i++) {
        const randomNumber = Math.floor(Math.random() * 50) + 1;

        const handle = await client.workflow.start(GetAndAnalyzeComment, {
            taskQueue: 'sentiments',
            args: [randomNumber],
            workflowId: 'workflow-' + nanoid(),
        });

        console.log(`Started workflow ${handle.workflowId}`);
    }

    res.send(`Creating ${quantity} comments...`);
});

app.get('/create', async (req, res) => {
    const randomNumber = Math.floor(Math.random() * 50) + 1;

    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(GetAndAnalyzeComment, {
        taskQueue: 'comment',
        args: [randomNumber],
        workflowId: 'workflow-' + nanoid(),
    });

    console.log(`Started workflow ${handle.workflowId}`);

    console.log(await handle.result()); 

    res.send('Created one comment.')
});

app.get('/analyze', async (req, res) => {
    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(AnalyzeCSV, {
        taskQueue: 'comment',
        args: ['./output/csv/analysis.csv'],
        workflowId: 'workflow-' + nanoid(),
    });

    console.log(`Started workflow ${handle.workflowId}`);

    const handleRes = await handle.result(); 

    console.log(handleRes);

    res.json(handleRes);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
