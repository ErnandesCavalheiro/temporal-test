import * as workflow from '@temporalio/workflow';
import { executeChild, ParentClosePolicy } from '@temporalio/workflow';
import type * as activities from './activities';
import { Comment } from './interfaces/Comment';
const { getCommentsByPost } = workflow.proxyActivities<typeof activities>({
  startToCloseTimeout: '2 minute',
  retry: {
    initialInterval: '30s',
    backoffCoefficient: 2,
    maximumAttempts: 100,
    nonRetryableErrorTypes: [],
  },
});
const act = workflow.proxyActivities<typeof activities>({
  startToCloseTimeout: '2 minute',
  retry: {
    initialInterval: '5s',
    backoffCoefficient: 2,
    maximumAttempts: 2,
    nonRetryableErrorTypes: [],
  },
});

export async function parentWorkflowAll(): Promise<any> {
  const commentArray = await act.getAllComments();

  const childWorkflowPromises = commentArray.comments.map(async (comment) => {
    return executeChild(childWorkFlowAnalyzeComment, {
      args: [comment],
      parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
    });
  })

  const comments = await Promise.allSettled(childWorkflowPromises);

  const analysis = await executeChild(analyzeCSV, {
    args: ['./output/csv/analysis.csv']
  })

  return { comments, analysis };
}

export async function childWorkFlowAnalyzeComment(comment: Comment): Promise<any> {
  const analyzedComment = await act.fakeAnalyzeComment(comment);

  const csv = await act.createOrUpdateCSV(analyzedComment, 'analysis');

  if (csv) {
    return analyzedComment;
  }

  return "error";
}

export async function parentWorkflowArray(idArray: Array<any>): Promise<any> {
  const childWorkflowPromises = idArray.map(async (id) => {
    return executeChild(childWorkflowArray, {
      args: [id],
      parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
    });
  })

  const comments = await Promise.allSettled(childWorkflowPromises);

  return comments;
}

export async function childWorkflowArray(id: number): Promise<any> {
  const comment = await act.getComment(id);
  const analyzedComment = await act.analyzeComment(comment);

  const csv = await act.createOrUpdateCSV(analyzedComment, 'analysis');

  if (csv) {
    return analyzedComment;
  }

  return "error";
}

export async function analyzeCSV(filePath: string): Promise<any> {
  return act.analyzeDataByUser(filePath);
}

export async function fetchUsers(): Promise<any> {
  act.verifyAndCreateDir('./output/csv/posts/');

  const users = await act.getAllUsers();

  const userPromises = users.map(async (user) => {
    const { avgPostsSentiment, postsWithSentiments, userComments, avgCommentsSentiment } = await executeChild(fetchPostsByUser, {
      args: [parseInt(user.id)],
    });

    user.postSentimentAverage = avgPostsSentiment;
    user.posts = postsWithSentiments;
    user.commentSentimentAverage = avgCommentsSentiment;
    user.comments = userComments;

    return user;
  });

  const usersWithPosts = (await Promise.allSettled(userPromises)).map(result => result.status === 'fulfilled' ? result.value : null);

  return usersWithPosts;
}

export async function fetchPostsByUser(userId: number): Promise<any> {
  const posts = await act.getPostsByUser(userId);

  const postPromises = posts.map(async (post) => {
    const { avgSentiment} = await executeChild(fetchCommentsAndAnalyzeByPost, {
      args: [parseInt(post.id)],
    });

    return { postsWithSentiments: { id: post.id, sentiment: avgSentiment }};
  });

  const postAnalyzed = (await Promise.allSettled(postPromises)).map(result => result.status === 'fulfilled' ? result.value : null);

  const postsWithSentiments = postAnalyzed.map(value => value ? value.postsWithSentiments : null).filter(Boolean);

  const { userComments, avgCommentsSentiment } = await act.getAndAnalyzeUserComments(userId);

  const avgPostsSentiment = await act.analyzeAverageSentiment(postsWithSentiments);

  return { postsWithSentiments, avgPostsSentiment, userComments, avgCommentsSentiment };
}

export async function fetchCommentsAndAnalyzeByPost(postId: number) {
  const comments = await getCommentsByPost(postId);
  const postHasComments = postId && comments && comments.length > 0;

  if (postHasComments) {
    const promises: Promise<any>[] = [];

    comments.forEach((comment: Comment) => {
      promises.push(
        (async () => {
          const analyzedComment = await act.fakeAnalyzeComment(comment);
          await act.createOrUpdateCSV(analyzedComment, `posts/${postId}-comments`);
        })()
      );
    });

    await Promise.all(promises);
    const { avgSentiment } = await act.analyzeData(`./output/csv/posts/${postId}-comments.csv`);

    return { avgSentiment};
  }
  
  const avgSentiment = 'Neutral';

  return { avgSentiment };
}

