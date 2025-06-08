import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('pages/home', {
      title: 'Spill Studies - Online Learning Platform'
  });
});

app.get('/courses', async (req, res, next) => {
    try {
        console.log('Fetching courses...');
        const courses = await db.all(`
            SELECT c.*, i.name as instructor_name 
            FROM courses c 
            LEFT JOIN instructors i ON c.instructor_id = i.id 
            ORDER BY c.created_at DESC
        `);
        
        console.log(`Found ${courses.length} courses`);
        res.render('pages/courses', {
            title: 'Courses - Online Learning Platform',
            courses: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        next(error);
    }
});

app.get('/instructors', async (req, res, next) => {
  try {
      console.log('Fetching instructors...');
      const instructors = await db.all('SELECT * FROM instructors ORDER BY name');
      
      console.log(`Found ${instructors.length} instructors`);
      res.render('pages/instructors', {
          title: 'Instructors - Online Learning Platform',
          instructors: instructors
      });
  } catch (error) {
      console.error('Error fetching instructors:', error);
      next(error);
  }
});

app.get('/events', async (req, res, next) => {
  try {
      console.log('Fetching events...');
      const events = await db.all(`
          SELECT e.*, 
                 i.name as instructor_name,
                 c.name as course_name
          FROM events e
          LEFT JOIN instructors i ON e.instructor_id = i.id
          LEFT JOIN courses c ON e.course_id = c.id
          ORDER BY e.date_time DESC
      `);
      
      console.log(`Found ${events.length} events`);
      res.render('pages/events', {
          title: 'Events - Online Learning Platform',
          events: events
      });
  } catch (error) {
      console.error('Error fetching events:', error);
      next(error);
  }
});

app.get('/faq', (req, res) => {
  res.render('pages/faq', {
      title: 'FAQ - Online Learning Platform'
  });
});

pp.post('/contact', async (req, res, next) => {
  try {
      const { name, email, message } = req.body;
      
      // Validate input
      if (!name || !email || !message) {
          return res.status(400).json({ error: 'All fields are required' });
      }

      // Store in database
      await db.run(`
          INSERT INTO contact_submissions (name, email, message)
          VALUES (?, ?, ?)
      `, [name, email, message]);

      res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
      console.error('Error saving contact submission:', error);
      res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/test', (req, res) => {
  res.send('Test route works!');
});


app.listen(port, 'SpillStudies', () => {
  console.log(`Server running at http://SpillStudies:${3000}`);
});