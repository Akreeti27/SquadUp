import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Calendar, BookOpen, Code, X, Star, MapPin, Building2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './contexts/AuthContext';
import AuthModal from './AuthModal';

const SquadUpPlatform = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();
  const [filter, setFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Indian Universities List
  const universities = [
    'IIT Delhi',
    'IIT Bombay',
    'IIT Madras',
    'IIT Kanpur',
    'IIT Kharagpur',
    'IIT Roorkee',
    'BITS Pilani',
    'NIT Trichy',
    'NIT Surathkal',
    'Delhi University',
    'Mumbai University',
    'Pune University',
    'Anna University',
    'VIT Vellore',
    'Manipal University',
    'SRM University',
    'Amity University',
    'Lovely Professional University',
    'Your University', // User's university
    'Other'
  ];

  // Indian Cities
  const cities = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Chandigarh',
    'Indore',
    'Kochi',
    'Guwahati',
    'Remote',
    'Other'
  ];

  // Opportunity Types
  const opportunityTypes = [
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'competition', label: 'Competition' },
    { value: 'internship', label: 'Internship' },
    { value: 'study', label: 'Study Group' },
    { value: 'project', label: 'Project' },
    { value: 'research', label: 'Research' },
    { value: 'workshop', label: 'Workshop' }
  ];

  // Sample Posts with Indian context
  const samplePosts = [
    {
      id: 1,
      title: "Need 2 developers for Smart India Hackathon",
      author: "Priya Sharma",
      authorEmail: "priya@example.com",
      type: "hackathon",
      category: "hackathon",
      university: "IIT Delhi",
      city: "Delhi",
      location: "Remote",
      openTo: "All India",
      skills: ["Python", "Machine Learning", "React"],
      date: "Jan 15-17, 2025",
      description: "Looking for passionate developers to build an AI-powered solution for agriculture. Team formation for SIH 2025.",
      spots: 2,
      applicants: 8
    },
    {
      id: 2,
      title: "Study group for GATE preparation",
      author: "Rahul Kumar",
      authorEmail: "rahul@example.com",
      type: "study",
      category: "study",
      university: "IIT Bombay",
      city: "Mumbai",
      location: "My Campus",
      openTo: "My University Only",
      skills: ["Mathematics", "Engineering", "Problem Solving"],
      date: "Starting Jan 2025",
      description: "Daily study sessions for GATE 2026. Looking for serious aspirants. Meeting at library 6-9pm.",
      spots: 5,
      applicants: 12
    },
    {
      id: 3,
      title: "Flipkart GRiD 5.0 - Need Team Members",
      author: "Anjali Verma",
      authorEmail: "anjali@example.com",
      type: "competition",
      category: "competition",
      university: "BITS Pilani",
      city: "Pilani",
      location: "Remote",
      openTo: "All India",
      skills: ["Full Stack", "UI/UX", "Product Design"],
      date: "Registration closes Dec 31",
      description: "Looking for creative minds to participate in Flipkart GRiD. Exciting opportunity with great prizes!",
      spots: 3,
      applicants: 15
    },
    {
      id: 4,
      title: "Google Summer of Code - Research Project",
      author: "Prof. Suresh Rao",
      authorEmail: "suresh@example.com",
      type: "research",
      category: "research",
      university: "IIT Madras",
      city: "Chennai",
      location: "Hybrid",
      openTo: "All India",
      skills: ["Deep Learning", "Python", "Research"],
      date: "Feb-May 2025",
      description: "Undergraduate research opportunity in Computer Vision. Prior ML experience preferred.",
      spots: 2,
      applicants: 25
    },
    {
      id: 5,
      title: "TCS CodeVita - Form Team",
      author: "Vikram Singh",
      authorEmail: "vikram@example.com",
      type: "competition",
      category: "competition",
      university: "NIT Trichy",
      city: "Trichy",
      location: "Remote",
      openTo: "All India",
      skills: ["Competitive Programming", "C++", "Algorithms"],
      date: "Dec 20-22, 2024",
      description: "Looking for strong coders for TCS CodeVita. Target: Top 100 nationwide.",
      spots: 1,
      applicants: 6
    },
    {
      id: 6,
      title: "Microsoft Internship - Referral Available",
      author: "Sneha Patel",
      authorEmail: "sneha@example.com",
      type: "internship",
      category: "internship",
      university: "VIT Vellore",
      city: "Vellore",
      location: "Bangalore",
      openTo: "All India",
      skills: ["Java", "Spring Boot", "Microservices"],
      date: "Summer 2025",
      description: "I have referral for Microsoft internship. Looking for final year students with strong coding skills.",
      spots: 3,
      applicants: 45
    }
  ];

  useEffect(() => {
    // Start with sample posts
    setPosts(samplePosts);
    
    // Try to fetch from Firestore
    if (!db) {
      console.warn('Firestore not initialized, using sample posts');
      return;
    }
    
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snap) => {
        if (snap.docs.length > 0) {
          const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPosts(fetched);
        }
      }, (err) => {
        console.warn('Firestore error, using sample posts:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore collection error, using sample posts:', err);
    }
  }, []);

  // Tabs for navigation
  const tabs = [
    { id: 'all', label: 'All Posts', icon: Users },
    { id: 'opportunities', label: 'Opportunities', icon: Star },
    { id: 'collaborators', label: 'Find Team', icon: Code },
    { id: 'allindia', label: 'All India', icon: MapPin },
    { id: 'mycampus', label: 'My Campus', icon: Building2 }
  ];

  // Category filters
  const categories = [
    { value: 'all', label: 'All Types' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'competition', label: 'Competitions' },
    { value: 'internship', label: 'Internships' },
    { value: 'study', label: 'Study Groups' },
    { value: 'research', label: 'Research' }
  ];

  // Location filters
  const locationFilters = [
    { value: 'all', label: 'All Locations' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'my-city', label: 'My City' }
  ];

  // Filter logic
  const filteredPosts = posts.filter(post => {
    // Tab filtering
    if (activeTab === 'mycampus' && post.openTo !== 'My University Only') {
      return false;
    }
    if (activeTab === 'allindia' && post.openTo === 'My University Only') {
      return false;
    }
    if (activeTab === 'opportunities' && !['hackathon', 'internship', 'competition'].includes(post.type)) {
      return false;
    }
    if (activeTab === 'collaborators' && !['hackathon', 'study', 'project'].includes(post.type)) {
      return false;
    }
    
    // Category filtering
    const matchesCategory = filter === 'all' || post.category === filter;
    
    // Location filtering
    if (locationFilter === 'remote' && post.location !== 'Remote') {
      return false;
    }
    if (locationFilter === 'hybrid' && post.location !== 'Hybrid') {
      return false;
    }
    
    // Search filtering
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchLower) ||
      post.description?.toLowerCase().includes(searchLower) ||
      post.university?.toLowerCase().includes(searchLower) ||
      post.city?.toLowerCase().includes(searchLower) ||
      post.skills?.some(skill => skill.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  // Create Post Modal Component
  const CreatePostModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      type: 'hackathon',
      university: '',
      city: '',
      location: 'My Campus',
      openTo: 'All India',
      skills: '',
      date: '',
      description: '',
      spots: 1
    });

    const handleSubmit = async () => {
      if (!formData.title || !formData.skills || !formData.date || !formData.description || !formData.university || !formData.city) {
        alert('Please fill in all fields');
        return;
      }
      if (!user) {
        alert('Please sign in to create a post');
        return;
      }
      if (!db) {
        alert('Database connection not available. Please try again later.');
        return;
      }
      try {
        await addDoc(collection(db, 'posts'), {
          ...formData,
          category: formData.type,
          skills: formData.skills.split(',').map(s => s.trim()),
          author: user.displayName || user.email,
          authorEmail: user.email,
          applicants: 0,
          createdAt: serverTimestamp()
        });
        setShowCreateModal(false);
        setFormData({ 
          title: '', 
          type: 'hackathon',
          university: '',
          city: '',
          location: 'My Campus',
          openTo: 'All India',
          skills: '', 
          date: '', 
          description: '', 
          spots: 1 
        });
      } catch (err) {
        console.error('Error creating post:', err);
        alert('Failed to create post');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-2xl w-full my-8">
          <div className="p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Create New Post</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Need 2 developers for Smart India Hackathon"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {opportunityTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Open To</label>
                  <select
                    value={formData.openTo}
                    onChange={(e) => setFormData({...formData, openTo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="My University Only">My University Only</option>
                    <option value="All India">All India</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                  <select
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select University</option>
                    {universities.map(uni => (
                      <option key={uni} value={uni}>{uni}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="My Campus">On Campus</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="City">City Location</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Python, React, Machine Learning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date/Timeline</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Jan 15-17, 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what you're looking for..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spots Available</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.spots}
                  onChange={(e) => setFormData({...formData, spots: parseInt(e.target.value) || 1})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Post Opportunity
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Post Card Component
  const PostCard = ({ post }) => {
    const categoryColors = {
      hackathon: 'bg-purple-100 text-purple-800',
      study: 'bg-green-100 text-green-800',
      competition: 'bg-orange-100 text-orange-800',
      research: 'bg-blue-100 text-blue-800',
      internship: 'bg-yellow-100 text-yellow-800',
      project: 'bg-pink-100 text-pink-800',
      workshop: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition mb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center gap-1">
                <Building2 size={12} />
                {post.university}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center gap-1">
                <MapPin size={12} />
                {post.city}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {post.location}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap uppercase tracking-wide ${categoryColors[post.category]}`}>
            {post.type}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">by {post.author}</p>
        
        <p className="text-gray-700 mb-4">{post.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.skills.map((skill, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} />
              {post.spots} spots
            </span>
          </div>
          <span className="text-indigo-700 font-semibold">{post.applicants} interested</span>
        </div>
        
        <button className="w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800 transition">
          I'm Interested
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-md flex items-center justify-center">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SquadUp</h1>
                <p className="text-sm text-white/80">Find your perfect campus collaborators</p>
              </div>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-white text-indigo-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2 shadow-sm"
                >
                  <Plus size={20} />
                  Create Post
                </button>
                <div className="text-sm text-white/90 text-right">
                  <div className="font-medium">{user.displayName || user.email}</div>
                  <button onClick={() => logout()} className="text-xs text-white/80 hover:underline">Sign out</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-indigo-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2 shadow-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[88px] z-30 mt-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium whitespace-nowrap flex items-center gap-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-700 text-white shadow'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, university, city, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-white rounded-full border border-transparent shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300"
            />
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  filter === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Location Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {locationFilters.map(loc => (
              <button
                key={loc.value}
                onClick={() => setLocationFilter(loc.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  locationFilter === loc.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'opportunity' : 'opportunities'}
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No opportunities found</p>
              <p className="text-sm mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setFilter('all');
                  setLocationFilter('all');
                  setSearchTerm('');
                  setActiveTab('all');
                }}
                className="text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && <CreatePostModal />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 py-8 mt-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p className="text-sm">🚀 Connecting students across India!</p>
          <p className="text-xs mt-2">Find teammates • Join events • Build together</p>
        </div>
      </div>
    </div>
  );
};

export default SquadUpPlatform;
