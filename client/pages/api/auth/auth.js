export default function handler(req, res) {
  if (req.method === 'POST') {      
    // This is a mock implementation - replace with your actual auth logic 
    const { email, password } = req.body;

    // Mock user data - replace with actual database check
    if (email === 'test@example.com' && password === 'password') {
      return res.status(200).json({ 
        token: 'mock-jwt-token',    
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });       
  }
  
  if (req.method === 'GET') {       
    // Mock user data for the /me endpoint
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'mock-jwt-token') {
      return res.status(200).json({ 
        id: 1,
        email: 'test@example.com',  
        name: 'Test User'
      });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(Method  Not Allowed);
}
