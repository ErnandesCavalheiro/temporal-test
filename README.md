### Running this sample

1. `npm install` to install dependencies.
1. `npm run start.watch` to initiate the Worker.
1. `npm run server` to launch the [Server](https://localhost:3000).
1. access (https://localhost:3000/create/:qnt) to create the CSV file (:qnt to creates multiple comments; without :qnt, it creates a single comment).

The Workflow should return JSON containing the quantity of comments and the percentages of positive, neutral, and negative sentiments
