import express from 'express';
import { Connection, Client } from '@temporalio/client';
import { parentWorkflowArray, parentWorkflowAll, analyzeCSV, fetchUsers } from './workflows';
import { nanoid } from 'nanoid';


const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/create/:qnt', async (req, res) => {
    const quantity = parseInt(req.params.qnt);
    const idArray: number[] = [];
  
    for (let i = 0; i < quantity; i++) {
      const randomNumber = Math.floor(Math.random() * 50) + 1;
      idArray.push(randomNumber);
    }
  
    const connection = await Connection.connect({ address: 'localhost:7233' });
  
    const client = new Client({
      connection,
    });
  
    const handle = await client.workflow.start(parentWorkflowArray, {
      taskQueue: 'temporal-test',
      args: [idArray], 
      workflowId: 'workflow-' + nanoid(),
    });

    const result = await handle.result();

    res.json(result);
  });

app.get('/create', async (req, res) => {
    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(parentWorkflowAll, {
        taskQueue: 'temporal-test',
        args: [],
        workflowId: 'workflow-' + nanoid(),
        workflowTaskTimeout: 1 * 60000
    });

    console.log(`Started workflow ${handle.workflowId}`);

    const { comments, analysis } = await handle.result();
    await client.connection.close();

    res.json({ newComments: comments, analysis: analysis });
});

app.get('/users', async (req, res) => {
    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(fetchUsers, {
        taskQueue: 'temporal-test',
        workflowId: 'workflow-' + nanoid(),
        retry: {
            maximumAttempts: 5,
        }
    })

    const response = await handle.result();

    res.json(response);
})

app.get('/analyze', async (req, res) => {
    const connection = await Connection.connect({ address: 'localhost:7233' });

    const client = new Client({
        connection,
    });

    const handle = await client.workflow.start(analyzeCSV, {
        taskQueue: 'temporal-test',
        args: ['./output/csv/analysis.csv'],
        workflowId: 'workflow-' + nanoid(),
    });

    console.log(`Started workflow ${handle.workflowId}`);

    const handleRes = await handle.result();

    client.connection.close();

    res.json(handleRes);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});