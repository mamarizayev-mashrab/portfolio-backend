const mongoose = require('mongoose');
const Project = require('./models/Project');
const dotenv = require('dotenv');

dotenv.config();

const fixProject = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const project = await Project.findOne();
        if (project) {
            console.log('Updating project:', project.title.en);
            project.technologies = ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'];
            project.image = 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Valid image
            project.liveUrl = 'https://example.com';
            project.githubUrl = 'https://github.com/example/project';
            await project.save();
            console.log('Project updated successfully!');
        } else {
            console.log('No projects found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

fixProject();
