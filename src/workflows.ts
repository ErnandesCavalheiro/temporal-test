import * as workflow from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { getComment, analyzeComment, createOrUpdateCSV, parseAndAnalyzeCSV } = workflow.proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function GetAndAnalyzeComment(id: number): Promise<Boolean> {
  let comment = await getComment(id);

  comment = await analyzeComment(comment);

  return createOrUpdateCSV(comment);
}

export async function AnalyzeCSV(filePath: string): Promise<any> {
  return parseAndAnalyzeCSV(filePath);
}


