-- Insert sample client testimonials
INSERT INTO feedback (client_name, client_email, client_company, testimonial, rating, status, featured, created_at) VALUES
(
  'Sarah Johnson',
  'sarah@techstartup.com', 
  'TechStartup Inc',
  'Absolutely outstanding work! The team delivered our mobile app ahead of schedule with incredible attention to detail. The user interface is intuitive and the backend performance is flawless. Highly recommend for any serious business looking to go digital.',
  5,
  'approved',
  true,
  NOW() - INTERVAL '10 days'
),
(
  'Michael Chen',
  'michael@ecommerce.co',
  'E-Commerce Solutions',
  'Working with this team was a game-changer for our business. They built us a complete e-commerce platform that increased our sales by 300% in the first quarter. Professional, responsive, and truly understand modern web development.',
  5,
  'approved', 
  true,
  NOW() - INTERVAL '15 days'
),
(
  'Emily Rodriguez',
  'emily@aicompany.io',
  'AI Innovations Ltd',
  'Exceptional AI integration services! They helped us implement machine learning algorithms that transformed our data analysis capabilities. The custom dashboard they created gives us insights we never had before. Worth every penny.',
  5,
  'approved',
  true,
  NOW() - INTERVAL '20 days'
),
(
  'David Kumar',
  'david@digitalagency.com',
  'Digital Marketing Pro',
  'From concept to deployment, everything was seamless. The website they built for us is not only beautiful but also converts visitors into customers at a rate 250% higher than our previous site. Amazing ROI!',
  4,
  'approved',
  true,
  NOW() - INTERVAL '25 days'
);