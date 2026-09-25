import pptxgen from "pptxgenjs";

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

// Helper for title + bullets
const addStandardSlide = (title, bullets, notes) => {
  let slide = pres.addSlide();
  slide.addText(title, { x: 0.5, y: 0.5, w: '90%', fontSize: 28, bold: true, color: '003366' });
  
  let bulletItems = bullets.map(b => ({ text: b, options: { bullet: true, color: '333333' } }));
  slide.addText(bulletItems, { x: 0.5, y: 1.5, w: '90%', h: '70%', fontSize: 18, lineSpacing: 32 });
  
  if(notes) slide.addNotes(notes);
};

// Slide 1: Title
let s1 = pres.addSlide();
s1.addText('Ganesh Engineering Industries - ERP', { x: 0, y: '40%', w: '100%', fontSize: 40, bold: true, align: 'center', color: '003366' });
s1.addText('B.Tech Final Year Project', { x: 0, y: '55%', w: '100%', fontSize: 24, align: 'center', color: '666666' });
s1.addNotes('Introduce yourself and the company.');

// Slide 2: Problem
addStandardSlide('The Problem', [
  'Manual Record Keeping: Factory operations tracked on paper.',
  'Lack of Centralization: Billing, HR, and Supply Chain disconnected.',
  'Security Risks: No role-based security; sensitive data visible to all.',
  'Inefficiency: Generating invoices took hours.'
], 'Explain what you observed at Ganesh Engineering.');

// Slide 3: Solution
addStandardSlide('Our Solution', [
  'Centralized Web Application: Unified ERP dashboard.',
  'Digital Transformation: Secure database replacing physical ledgers.',
  'Role-Based Access Control (RBAC): Distinct roles (Admin, Worker).',
  'Automated Billing: Instant GST calculations and PDF invoices.'
], 'Emphasize the shift from physical to digital.');

// Slide 4: Tech Stack
addStandardSlide('Technology Stack (MERN)', [
  'Frontend: React.js, Tailwind CSS',
  'Backend: Node.js, Express.js',
  'Database: MongoDB (Virtual In-Memory Server)',
  'Libraries: jspdf (PDF generation), html2canvas'
], 'Be prepared to explain why you chose MERN.');

// Slide 5: Architecture
addStandardSlide('System Architecture', [
  'Client-Server Model: React UI, Node.js logic.',
  'RESTful APIs: JSON endpoints for communication.',
  'Authentication Flow: Secure login unlocks specific tabs based on Role.'
], 'Keep this brief. Frontend and backend are separate.');

// Slide 6: Core Modules (Floor)
addStandardSlide('Factory Floor Operations', [
  'Inventory Management: Real-time tracking of raw materials (Steel).',
  'Process Management: Cold Forging, Thread Rolling, Machining.',
  'Material Ledger: Strict log of materials IN and OUT.'
], 'This is the heart of the factory.');

// Slide 7: Core Modules (HR/SCM)
addStandardSlide('HR & Supply Chain', [
  'Worker Management (HR): Tracking hours worked and efficiency.',
  'Purchase Orders (SCM): Logging material orders with suppliers.',
  'Status Tracking: Updating orders from Pending to Received.'
], 'Highlight that the ERP handles people and suppliers too.');

// Slide 8: Billing
addStandardSlide('Automated Financials', [
  'Dynamic GST: CGST (9%) + SGST (9%) or IGST (18%).',
  'PDF Export: 1-Click generation of professional invoices.'
], 'Show a screenshot of the PDF invoice here.');

// Slide 9: Key Achievements
addStandardSlide('Key Technical Achievements', [
  'Dynamic Routing (RBAC): Workers cannot see Billing tabs.',
  'Bulk CSV Onboarding: Upload Excel files to instantly create 100 accounts.',
  'Foolproof Virtual DB: Runs flawlessly on any machine.'
], 'Proves you thought like a senior engineer.');

// Slide 10: Future
addStandardSlide('Future Enhancements', [
  'Graphical Analytics: Live pie charts and bar graphs.',
  'Low-Stock Alerts: SMS notifications for low materials.',
  'Machine IoT Integration: Connecting physical machines to the app.'
], 'Shows you know how the system scales.');

// Slide 11: Conclusion
addStandardSlide('Conclusion', [
  'Developed a highly secure, scalable ERP system.',
  'Eliminated paper-based tracking for Ganesh Engineering.',
  'Delivered an enterprise-grade solution using modern web tech.'
], 'Thank you and Q&A.');

pres.writeFile({ fileName: 'Ganesh_ERP_Presentation.pptx' }).then(fileName => {
    console.log(`Successfully created: ${fileName}`);
}).catch(err => {
    console.error(err);
});
