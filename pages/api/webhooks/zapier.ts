import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Zapier webhook authentication
  const apiKey = req.headers['x-zapier-api-key'] as string;
  const expectedKey = process.env.ZAPIER_API_KEY;
  
  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { event, data } = req.body;

  try {
    switch (event) {
      case 'github.push':
        await handleGitHubPush(data);
        break;
      case 'github.issue.created':
        await handleGitHubIssueCreated(data);
        break;
      case 'github.pr.merged':
        await handleGitHubPRMerged(data);
        break;
      case 'database.updated':
        await handleDatabaseUpdate(data);
        break;
      case 'notification.send':
        await handleSendNotification(data);
        break;
      default:
        console.log(`Unhandled Zapier event: ${event}`);
    }

    res.status(200).json({ 
      message: 'Zapier webhook processed successfully',
      event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Zapier webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGitHubPush(data: any) {
  console.log('GitHub push received via Zapier:', data);
  // Trigger deployment or other actions
}

async function handleGitHubIssueCreated(data: any) {
  console.log('GitHub issue created:', data);
  // Create corresponding task in project management system
}

async function handleGitHubPRMerged(data: any) {
  console.log('GitHub PR merged:', data);
  // Update deployment status or trigger CI/CD
}

async function handleDatabaseUpdate(data: any) {
  console.log('Database update received:', data);
  // Sync changes to GitHub or trigger notifications
}

async function handleSendNotification(data: any) {
  console.log('Send notification request:', data);
  // Send notifications via email, Slack, etc.
}