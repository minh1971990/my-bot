const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// Add axios for making HTTP requests
const axios = require('axios');

// Add middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
res.send('Hello, World!');
});

// Add a new route to trigger the webhook POST request
app.get('/trigger-webhook', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5678/webhook-test/test', {
      message: 'This is a test webhook payload',
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      response: response.data
    });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add a route to receive Discord slash command interactions
app.post('/trigger-command', express.json(), async (req, res) => {
  // Verify the request is coming from Discord (simplified for this example)
  // In production, you should validate the signature
  
  console.log('Received Discord interaction:', req.body);
  
  // For slash commands, Discord expects an immediate response
  // Respond to the interaction first
  res.json({
    type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
    data: {
      content: "Processing your command..."
    }
  });
  
  try {
    // Now trigger your webhook logic
    const webhookResponse = await axios.post('http://localhost:5678/webhook-test/test', {
      message: 'Command triggered from Discord',
      timestamp: new Date().toISOString(),
      discordData: req.body // Forward the Discord data to your webhook
    });
    
    console.log('Webhook response:', webhookResponse.data);
    
    // You could also update the Discord message if needed
    // This would require storing the interaction token and making another request
    
  } catch (error) {
    console.error('Error processing webhook:', error.message);
  }
});

app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});

