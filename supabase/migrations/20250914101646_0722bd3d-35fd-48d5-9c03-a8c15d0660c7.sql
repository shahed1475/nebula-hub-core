-- Insert sample services data
INSERT INTO services (title, description, features, icon, order_index, active) VALUES
(
  'AI & Machine Learning',
  'Advanced AI solutions including NLP, computer vision, predictive analytics, and AI security systems.',
  ARRAY['Natural Language Processing', 'Computer Vision', 'Predictive Analytics', 'AI Security', 'Deep Learning', 'Neural Networks'],
  'Brain',
  1,
  true
),
(
  'Custom Software Development', 
  'Bespoke enterprise solutions including ERP, CRM, SaaS platforms, and business automation tools.',
  ARRAY['ERP Systems', 'CRM Solutions', 'SaaS Platforms', 'Business Automation', 'Enterprise Apps', 'Legacy Modernization'],
  'Code',
  2,
  true
),
(
  'Web Development',
  'Modern web applications from corporate websites to e-commerce platforms and progressive web apps.',
  ARRAY['Corporate Websites', 'E-commerce Platforms', 'Content Management', 'Progressive Web Apps', 'API Development', 'Cloud Integration'],
  'Globe',
  3,
  true
),
(
  'Mobile Apps',
  'Native and cross-platform mobile applications powered by AI for iOS, Android, and hybrid platforms.',
  ARRAY['iOS Development', 'Android Development', 'Cross-platform', 'AI-powered Apps', 'React Native', 'Flutter Development'],
  'Smartphone',
  4,
  true
),
(
  'CRM & SaaS Tools',
  'Intelligent CRM systems and SaaS tools with sales automation and AI-driven analytics dashboards.',
  ARRAY['Sales Automation', 'AI Dashboards', 'Customer Analytics', 'Lead Management', 'Marketing Automation', 'Business Intelligence'],
  'Users',
  5,
  true
),
(
  'Cloud & DevOps',
  'Cloud migration services, CI/CD pipelines, Kubernetes orchestration, and scalable infrastructure.',
  ARRAY['Cloud Migration', 'CI/CD Pipelines', 'Kubernetes', 'Infrastructure Scaling', 'AWS/Azure/GCP', 'Monitoring & Security'],
  'Cloud',
  6,
  true
);