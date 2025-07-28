import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify GitHub webhook signature
  const signature = req.headers['x-hub-signature-256'] as string;
  const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
  
  if (!verifyWebhookSignature(JSON.stringify(req.body), secret, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.headers['x-github-event'] as string;
  const payload = req.body;

  try {
    switch (event) {
      case 'push':
        await handlePush(payload);
        break;
      case 'pull_request':
        await handlePullRequest(payload);
        break;
      case 'issues':
        await handleIssue(payload);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function verifyWebhookSignature(payload: string, secret: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

async function handlePush(payload: any) {
  console.log('Push event received:', payload.ref);
  // Auto-deploy to Vercel if main branch
  if (payload.ref === 'refs/heads/main') {
    // Trigger Vercel deployment
    console.log('Triggering Vercel deployment...');
  }
}

async function handlePullRequest(payload: any) {
  console.log('Pull request event:', payload.action);
  // Handle PR events (opened, closed, merged)
}

async function handleIssue(payload: any) {
  console.log('Issue event:', payload.action);
  // Handle issue events
}