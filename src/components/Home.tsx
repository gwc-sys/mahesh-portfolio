import React, { useState, useEffect, useRef } from 'react';

const ModernAIPortfolio: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    // Dynamic content - would typically come from an API or CMS
    const [profile, setProfile] = useState({
        name: 'Alex Johnson',
        title: 'AI & Full Stack Developer',
        about: 'I build intelligent web applications and AI solutions that solve real-world problems. Passionate about machine learning, clean code, and creating exceptional user experiences.',
        email: 'alex@example.com',
        location: 'San Francisco, CA',
        stats: {
            projects: 25,
            experience: 5,
            clients: 18,
            awards: 3
        }
    });

    const projects = [
        {
            id: 1,
            title: "AI-Powered E-commerce Platform",
            description: "Built a recommendation engine that increased sales by 35% using machine learning algorithms.",
            technologies: ["React", "Node.js", "TensorFlow", "MongoDB"],
            image: "🛒",
            link: "#",
            category: "AI"
        },
        {
            id: 2,
            title: "Computer Vision Security System",
            description: "Developed a real-time object detection system for home security with 95% accuracy.",
            technologies: ["Python", "OpenCV", "YOLO", "Flask"],
            image: "👁️",
            link: "#",
            category: "Computer Vision"
        },
        {
            id: 3,
            title: "Blockchain Voting Application",
            description: "Created a secure, transparent voting system using blockchain technology.",
            technologies: ["Solidity", "Web3.js", "React", "Ethereum"],
            image: "🔗",
            link: "#",
            category: "Blockchain"
        },
        {
            id: 4,
            title: "Neural Network for Medical Diagnosis",
            description: "Trained a neural network to assist doctors in diagnosing diseases from medical images.",
            technologies: ["Python", "PyTorch", "TensorFlow", "FastAPI"],
            image: "🏥",
            link: "#",
            category: "Healthcare AI"
        }
    ];

    const skills = [
        { name: "React", level: 90, category: "Frontend" },
        { name: "Node.js", level: 85, category: "Backend" },
        { name: "Python", level: 95, category: "Language" },
        { name: "TensorFlow", level: 80, category: "AI/ML" },
        { name: "Next.js", level: 75, category: "Frontend" },
        { name: "MongoDB", level: 85, category: "Database" },
        { name: "AWS", level: 70, category: "DevOps" },
        { name: "Docker", level: 75, category: "DevOps" }
    ];

    const experiences = [
        {
            id: 1,
            role: "Senior AI Developer",
            company: "TechInnovate",
            period: "2020 - Present",
            description: "Led a team of developers in creating AI-powered solutions for enterprise clients. Implemented machine learning models that improved operational efficiency by 40%.",
            icon: "👨‍💻"
        },
        {
            id: 2,
            role: "Full Stack Developer",
            company: "WebSolutions Inc.",
            period: "2018 - 2020",
            description: "Developed and maintained web applications for various clients using React, Node.js, and MongoDB. Reduced page load times by 60% through performance optimization.",
            icon: "💻"
        },
        {
            id: 3,
            role: "Junior Developer",
            company: "StartUp Ventures",
            period: "2017 - 2018",
            description: "Built responsive websites and web applications using modern JavaScript frameworks. Collaborated with designers to implement pixel-perfect UIs.",
            icon: "🚀"
        }
    ];

    const [activeProject, setActiveProject] = useState(0);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        const loadTimer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        // Auto-rotate projects
        const projectRotator = setInterval(() => {
            setActiveProject(prev => (prev + 1) % projects.length);
        }, 5000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(loadTimer);
            clearInterval(projectRotator);
        };
    }, [projects.length]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

    const filteredProjects = activeCategory === 'All'
        ? projects
        : projects.filter(project => project.category === activeCategory);

    const categories = ['All', ...new Set(projects.map(project => project.category))];

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center z-50 w-screen h-screen">
                <div className="text-center">
                    <div className="w-24 h-24 border-4 border-white border-t-blue-400 border-r-transparent border-b-blue-400 border-l-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-white">Loading Portfolio</h2>
                    <p className="text-blue-200 mt-2">Preparing AI-powered experience...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-screen overflow-x-hidden transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800'}`}>
            {/* Navigation */}
            <nav className={`fixed w-full z-40 transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="container mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">Alex.dev</div>
                        <div className="hidden md:flex space-x-8">
                            <button onClick={() => scrollToSection('home')} className={`transition-colors ${activeSection === 'home' ? 'text-blue-500' : ''}`}>Home</button>
                            <button onClick={() => scrollToSection('about')} className={`transition-colors ${activeSection === 'about' ? 'text-blue-500' : ''}`}>About</button>
                            <button onClick={() => scrollToSection('skills')} className={`transition-colors ${activeSection === 'skills' ? 'text-blue-500' : ''}`}>Skills</button>
                            <button onClick={() => scrollToSection('projects')} className={`transition-colors ${activeSection === 'projects' ? 'text-blue-500' : ''}`}>Projects</button>
                            <button onClick={() => scrollToSection('experience')} className={`transition-colors ${activeSection === 'experience' ? 'text-blue-500' : ''}`}>Experience</button>
                            <button onClick={() => scrollToSection('contact')} className={`transition-colors ${activeSection === 'contact' ? 'text-blue-500' : ''}`}>Contact</button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Download CV
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section with CSS 3D Effects */}
            <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 w-screen relative overflow-hidden">
                {/* CSS 3D Background Elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full opacity-10 animate-float"></div>
                    <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-purple-500 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-yellow-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
                    <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-green-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>

                    {/* 3D Floating Shapes */}
                    <div className="absolute top-20 left-20 w-16 h-16 bg-blue-500 opacity-20 rounded-lg transform rotate-45 animate-float-3d"></div>
                    <div className="absolute top-40 right-40 w-12 h-12 bg-purple-600 opacity-20 rounded-full animate-float-3d" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute bottom-40 left-40 w-20 h-20 bg-yellow-500 opacity-20 transform rotate-12 animate-float-3d" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="w-full max-w-6xl mx-auto z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between w-full">
                        <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">{profile.name}</span>
                            </h1>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6">
                                {profile.title}
                            </h2>
                            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {profile.about}
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                                <button
                                    onClick={() => scrollToSection('projects')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                                >
                                    View My Work
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => scrollToSection('contact')}
                                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                                >
                                    Contact Me
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-center relative w-full">
                            <div className="relative">
                                <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <span className="text-6xl md:text-8xl">👨‍💻</span>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
                                <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 w-screen">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">About Me</h2>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="rounded-lg overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
                                <div className="h-80 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <span className="text-8xl">🧠</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <h3 className="text-2xl font-bold mb-6">Crafting Intelligent Digital Experiences</h3>
                            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                I'm a passionate developer with over {profile.stats.experience} years of experience specializing in AI integration
                                and full-stack development. My expertise lies in creating seamless, intelligent web applications
                                that leverage machine learning to deliver exceptional user experiences.
                            </p>
                            <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                When I'm not coding, you can find me contributing to open-source projects, writing technical blogs,
                                or exploring the latest advancements in artificial intelligence and web technologies.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transform transition-transform hover:scale-105`}>
                                    <div className="text-2xl font-bold text-blue-500">{profile.stats.projects}+</div>
                                    <div className="text-sm">Projects Completed</div>
                                </div>
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transform transition-transform hover:scale-105`}>
                                    <div className="text-2xl font-bold text-blue-500">{profile.stats.experience}+</div>
                                    <div className="text-sm">Years Experience</div>
                                </div>
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transform transition-transform hover:scale-105`}>
                                    <div className="text-2xl font-bold text-blue-500">{profile.stats.clients}+</div>
                                    <div className="text-sm">Happy Clients</div>
                                </div>
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transform transition-transform hover:scale-105`}>
                                    <div className="text-2xl font-bold text-blue-500">{profile.stats.awards}</div>
                                    <div className="text-sm">Awards</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className={`py-20 px-4 w-screen ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Technical Skills</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {skills.map((skill, index) => (
                            <div key={index} className="p-4 transform transition-transform hover:scale-105">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">{skill.name}</span>
                                    <span>{skill.level}%</span>
                                </div>
                                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                                        style={{ width: `${skill.level}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{skill.category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-20 px-4 w-screen">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Featured Projects</h2>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full transition-colors ${activeCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : darkMode
                                            ? 'bg-gray-700 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map(project => (
                            <div key={project.id} className={`rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative">
                                    <span className="text-6xl">{project.image}</span>
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                        {project.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <button className="text-blue-500 font-medium hover:text-blue-700 transition-colors">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className={`py-20 px-4 w-screen ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Work Experience</h2>
                    <div className="space-y-12">
                        {experiences.map(exp => (
                            <div key={exp.id} className="flex transform transition-transform hover:scale-105">
                                <div className="flex flex-col items-center mr-6">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                        {exp.icon}
                                    </div>
                                    {exp.id !== experiences.length && <div className="w-1 h-full bg-gray-300"></div>}
                                </div>
                                <div className="flex-1 pb-8">
                                    <h3 className="text-xl font-bold mb-2">{exp.role}</h3>
                                    <p className="text-blue-500 mb-2">{exp.company} • {exp.period}</p>
                                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {exp.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4 w-screen">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Get In Touch</h2>
                    <div className={`rounded-2xl p-8 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-6">Let's talk about your project</h3>
                                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    I'm currently available for freelance work and interesting project opportunities.
                                    Feel free to reach out if you want to collaborate on something exciting.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            📧
                                        </div>
                                        <div>
                                            <div className="font-medium">Email</div>
                                            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{profile.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            📍
                                        </div>
                                        <div>
                                            <div className="font-medium">Location</div>
                                            <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{profile.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {submitted ? (
                                    <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                                        Thank you for your message! I'll get back to you soon.
                                    </div>
                                ) : (
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        <div>
                                            <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Your name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Your email"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Your message"
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 px-4 w-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white`}>
                <div className="container mx-auto max-w-6xl text-center">
                    <div className="text-2xl font-bold mb-6">Alex.dev</div>
                    <div className="flex justify-center space-x-8 mb-8">
                        <button onClick={() => scrollToSection('home')} className="hover:text-blue-400 transition-colors">Home</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors">About</button>
                        <button onClick={() => scrollToSection('projects')} className="hover:text-blue-400 transition-colors">Projects</button>
                        <button onClick={() => scrollToSection('contact')} className="hover:text-blue-400 transition-colors">Contact</button>
                    </div>
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors">📱</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors">💼</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors">🐦</a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors">📷</a>
                    </div>
                    <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
                </div>
            </footer>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                
                @keyframes float-3d {
                    0% { transform: translateY(0px) rotate(0deg) scale(1); }
                    33% { transform: translateY(-20px) rotate(10deg) scale(1.05); }
                    66% { transform: translateY(10px) rotate(-5deg) scale(0.95); }
                    100% { transform: translateY(0px) rotate(0deg) scale(1); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-float-3d {
                    animation: float-3d 8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default ModernAIPortfolio;