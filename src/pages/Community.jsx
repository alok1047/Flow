import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Flame, 
  Award, 
  Send, 
  Code, 
  Sparkles, 
  Heart, 
  Share2, 
  Medal, 
  Zap, 
  MessageCircle 
} from 'lucide-react';
import { useStore } from '../store/useStore';
import './Community.css';

// Initial Mock Community Feed Data
const initialPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "SC",
      role: "React Specialist",
      rank: "Gold III",
      isMentor: true
    },
    timestamp: "10 minutes ago",
    content: "Just finished implementing custom state transitions with AnimatePresence. If you are struggling with component unmounting animations in React, remember to assign unique keys to the direct children of AnimatePresence!",
    codeSnippet: "import { motion, AnimatePresence } from 'framer-motion';\n\n// Right way:\n<AnimatePresence>\n  {isVisible && (\n    <motion.div key=\"unique-card-id\">\n      Card Content\n    </motion.div>\n  )}\n</AnimatePresence>",
    likes: 24,
    replies: 5,
    hasLiked: false,
    tag: "React"
  },
  {
    id: 2,
    author: {
      name: "Marcus Aurelius",
      avatar: "MA",
      role: "JS Enthusiast",
      rank: "Silver I",
      isMentor: false
    },
    timestamp: "1 hour ago",
    content: "Whoa, loose coercion in JS still blows my mind! Check this out. Why does empty array loosely equal false, but empty array in a truthy check evaluates to true?",
    codeSnippet: "console.log([] == false); // true\n\nif ([]) {\n  console.log('This block actually runs!'); // Truthy!\n}",
    likes: 18,
    replies: 12,
    hasLiked: false,
    tag: "Type Coercion"
  },
  {
    id: 3,
    author: {
      name: "Emily Watson",
      avatar: "EW",
      role: "Backend Architect",
      rank: "Gold I",
      isMentor: true
    },
    timestamp: "4 hours ago",
    content: "A quick tip for Express database queries: always wrap async route handlers in try/catch blocks or use a higher-order wrapper to handle uncaught errors and prevent database connections from hanging.",
    codeSnippet: "const asyncHandler = fn => (req, res, next) => {\n  Promise.resolve(fn(req, res, next)).catch(next);\n};\n\napp.get('/api/users', asyncHandler(async (req, res) => {\n  const users = await User.find();\n  res.json(users);\n}));",
    likes: 35,
    replies: 8,
    hasLiked: true,
    tag: "Express"
  }
];

const featuredMentors = [
  { name: "Devin Booker", role: "V8 Engine Expert", avatar: "DB", xp: "15,420" },
  { name: "Aria Thorne", role: "System Architect", avatar: "AT", xp: "12,980" },
  { name: "Kenji Sato", role: "Algorithm Master", avatar: "KS", xp: "11,540" }
];

const weeklyLeaderboard = [
  { rank: 1, name: "Sarah Chen", avatar: "SC", xp: 1450, streak: 34, color: "#f6d365" },
  { rank: 2, name: "Emily Watson", avatar: "EW", xp: 1280, streak: 22, color: "#e2e8f0" },
  { rank: 3, name: "Alex Mercer", avatar: "AM", xp: 980, streak: 15, color: "#fda085" },
  { rank: 4, name: "Marcus Aurelius", avatar: "MA", xp: 870, streak: 12, color: "#94a3b8" },
  { rank: 5, name: "Chloe Fontaine", avatar: "CF", xp: 750, streak: 8, color: "#94a3b8" }
];

const recentAchievements = [
  { user: "Alex Mercer", badge: "10-Day Legend", icon: "Flame", time: "2m ago" },
  { user: "Devin Booker", badge: "Perfect Battle", icon: "Swords", time: "5m ago" },
  { user: "Chloe Fontaine", badge: "Closure Master", icon: "Award", time: "12m ago" }
];

const trendingChallenges = [
  { topic: "Type Coercion", activeCount: 45, level: "Medium" },
  { topic: "Async & Promises", activeCount: 38, level: "Hard" },
  { topic: "Scope & Closures", activeCount: 31, level: "Hard" }
];

export default function Community() {
  const { xp, streak } = useStore();
  const [posts, setPosts] = useState(initialPosts);
  const [newPostText, setNewPostText] = useState("");
  const [newPostCode, setNewPostCode] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: posts.length + 1,
      author: {
        name: "You (User)",
        avatar: "U",
        role: "FLOW Explorer",
        rank: xp > 1500 ? "Gold I" : "Bronze II",
        isMentor: false
      },
      timestamp: "Just now",
      content: newPostText,
      codeSnippet: newPostCode.trim() ? newPostCode : null,
      likes: 0,
      replies: 0,
      hasLiked: false,
      tag: "General"
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setNewPostCode("");
  };

  const handleLikePost = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked
          };
        }
        return post;
      })
    );
  };

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(p => p.tag === activeCategory);

  return (
    <motion.div 
      className="community-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="community-header">
        <motion.div 
          className="community-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Users size={14} />
          Community Hub
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          The <span className="gradient-text-moon">FLOW Sanctuary</span>
        </motion.h1>
        <motion.p
          className="community-subheader"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Share your breakthroughs, review complex scenarios, and grow with coding peers.
        </motion.p>
      </div>

      <div className="community-layout">
        {/* ================= LEFT COLUMN: FEED & POSTS ================= */}
        <div className="community-main">
          {/* Create Post Box */}
          <div className="create-post-box glass">
            <div className="create-post-header">
              <span className="create-post-title">SHARE YOUR BREAKTHROUGH</span>
              <Sparkles size={14} className="sparkle-icon" />
            </div>
            <form onSubmit={handleCreatePost}>
              <textarea
                placeholder="Share your coding progress or ask a question..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                required
              />
              <div className="code-input-wrapper">
                <Code size={16} className="code-input-icon" />
                <textarea
                  placeholder="Optional: Paste helper code snippet here..."
                  className="code-input-textarea"
                  value={newPostCode}
                  onChange={(e) => setNewPostCode(e.target.value)}
                />
              </div>
              <div className="create-post-actions">
                <span className="post-tips">💡 Tip: Adding code helps other learners debug!</span>
                <button type="submit" className="arena-primary-btn post-submit-btn">
                  Post Feed <Send size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Feed Filter Categories */}
          <div className="feed-filters">
            {["All", "React", "Type Coercion", "Express", "General"].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feed List */}
          <div className="community-feed">
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div 
                  key={post.id}
                  className="feed-card glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="feed-card-header">
                    <div className="author-avatar-badge" style={{ borderColor: post.author.isMentor ? 'var(--accent-gold)' : 'var(--glass-border)' }}>
                      {post.author.avatar}
                    </div>
                    <div className="author-info">
                      <div className="author-name-row">
                        <span className="author-name">{post.author.name}</span>
                        {post.author.isMentor && <span className="mentor-badge">MENTOR</span>}
                      </div>
                      <span className="author-role">{post.author.role} • {post.author.rank}</span>
                    </div>
                    <span className="post-timestamp">{post.timestamp}</span>
                  </div>

                  <div className="feed-card-body">
                    <p className="post-content-text">{post.content}</p>
                    {post.codeSnippet && (
                      <div className="post-code-block">
                        <div className="code-header-bar">
                          <span className="terminal-dots"><span/><span/><span/></span>
                          <span className="code-lang">javascript</span>
                        </div>
                        <pre><code>{post.codeSnippet}</code></pre>
                      </div>
                    )}
                  </div>

                  <div className="feed-card-actions">
                    <span className="post-category-tag">{post.tag}</span>
                    <div className="action-buttons">
                      <button 
                        className={`action-btn ${post.hasLiked ? 'liked' : ''}`} 
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart size={14} className={post.hasLiked ? 'fill-heart' : ''} /> 
                        <span>{post.likes}</span>
                      </button>
                      <button className="action-btn">
                        <MessageCircle size={14} /> 
                        <span>{post.replies}</span>
                      </button>
                      <button className="action-btn">
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR METRICS ================= */}
        <div className="community-sidebar">
          {/* User Streak Card */}
          <div className="sidebar-card streak-card glass">
            <div className="streak-title">STREAK SHOWCASE</div>
            <div className="streak-stats-row">
              <div className="streak-flame-wrapper">
                <Flame size={48} className="sidebar-streak-flame" />
                <span className="streak-days-count">{streak}</span>
              </div>
              <div className="streak-info-text">
                <span className="streak-caption">Days Streak!</span>
                <span className="streak-desc">Keep studying daily to hold the flame.</span>
              </div>
            </div>
          </div>

          {/* Weekly Leaderboard */}
          <div className="sidebar-card glass">
            <div className="sidebar-card-title">WEEKLY XP LEADERBOARD</div>
            <div className="leaderboard-list">
              {weeklyLeaderboard.map((user, idx) => (
                <div key={idx} className="leaderboard-item">
                  <div className="leaderboard-rank-col">
                    {user.rank <= 3 ? (
                      <Medal size={16} color={user.color} />
                    ) : (
                      <span className="rank-num">{user.rank}</span>
                    )}
                  </div>
                  <div className="leaderboard-avatar">{user.avatar}</div>
                  <div className="leaderboard-name-col">
                    <span className="leaderboard-name">{user.name}</span>
                    <span className="leaderboard-streak"><Flame size={10} style={{ color: 'orange', display: 'inline' }} /> {user.streak}d</span>
                  </div>
                  <span className="leaderboard-xp">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Learners */}
          <div className="sidebar-card glass">
            <div className="sidebar-card-title">FEATURED LEARNERS</div>
            <div className="featured-mentors-list">
              {featuredMentors.map((mentor, idx) => (
                <div key={idx} className="featured-mentor-item">
                  <div className="mentor-avatar">{mentor.avatar}</div>
                  <div className="mentor-details">
                    <span className="mentor-name">{mentor.name}</span>
                    <span className="mentor-specialty">{mentor.role}</span>
                  </div>
                  <div className="mentor-xp">
                    <Zap size={10} className="zap-icon" />
                    {mentor.xp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="sidebar-card glass">
            <div className="sidebar-card-title">RECENT ACHIEVEMENTS</div>
            <div className="achievements-mini-list">
              {recentAchievements.map((ach, idx) => (
                <div key={idx} className="achievements-mini-item">
                  <div className="ach-avatar">
                    <Award size={14} className="ach-avatar-badge" />
                  </div>
                  <div className="ach-text-col">
                    <span><strong>{ach.user}</strong> unlocked <em>{ach.badge}</em></span>
                    <span className="ach-time">{ach.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Challenges */}
          <div className="sidebar-card glass">
            <div className="sidebar-card-title">TRENDING CHALLENGES</div>
            <div className="trending-challenges-list">
              {trendingChallenges.map((tc, idx) => (
                <div key={idx} className="trending-challenge-item">
                  <span className="tc-topic">{tc.topic}</span>
                  <span className="tc-count">{tc.activeCount} active</span>
                  <span className={`tc-level ${tc.level.toLowerCase()}`}>{tc.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
