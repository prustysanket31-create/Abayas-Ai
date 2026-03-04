import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, 
  Code, 
  Trophy, 
  LayoutDashboard, 
  Send, 
  User as UserIcon, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  Terminal,
  Sparkles,
  Flame,
  Crown,
  Share2,
  Menu,
  X,
  LogOut,
  ArrowRight,
  Mail,
  Lock,
  MessageSquare,
  FileText,
  Trash2
} from 'lucide-react';
import { geminiService } from './services/geminiService';
import { User, Challenge, LeaderboardEntry, ChatMessage, Note, Quiz } from './types';

// Components
const Login = ({ onLogin }: { onLogin: (email: string, name: string) => void }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onLogin(email, name);
    }
  };

  return (
    <div className="mobile-container flex items-center justify-center p-8 bg-slate-950 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative z-10 space-y-10"
      >
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl mx-auto shadow-2xl shadow-indigo-500/40"
          >
            A
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter">Abayas AI</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">The Future of Learning</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <UserIcon size={20} />
              </div>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl pl-12 pr-6 py-5 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Mail size={20} />
              </div>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-3xl pl-12 pr-6 py-5 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-slate-950 py-5 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
          >
            Start Learning
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
          By continuing, you agree to our <br/>
          <span className="text-white">Terms of Service</span> & <span className="text-white">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab, user }: { activeTab: string, setActiveTab: (tab: string) => void, user: User | null }) => (
  <nav className={user?.is_premium ? 'floating-nav-dark' : 'floating-nav'}>
    <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'dashboard' ? (user?.is_premium ? 'text-amber-400 scale-110' : 'text-indigo-600 scale-110') : 'text-slate-400 hover:text-slate-600'}`}>
      <LayoutDashboard size={22} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
      <span className="text-[9px] font-bold uppercase tracking-tighter">Home</span>
    </button>
    <button onClick={() => setActiveTab('tutor')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'tutor' ? (user?.is_premium ? 'text-amber-400 scale-110' : 'text-indigo-600 scale-110') : 'text-slate-400 hover:text-slate-600'}`}>
      <MessageSquare size={22} strokeWidth={activeTab === 'tutor' ? 2.5 : 2} />
      <span className="text-[9px] font-bold uppercase tracking-tighter">Tutor</span>
    </button>
    <button onClick={() => setActiveTab('coding')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'coding' ? (user?.is_premium ? 'text-amber-400 scale-110' : 'text-indigo-600 scale-110') : 'text-slate-400 hover:text-slate-600'}`}>
      <Code size={22} strokeWidth={activeTab === 'coding' ? 2.5 : 2} />
      <span className="text-[9px] font-bold uppercase tracking-tighter">Code</span>
    </button>
    <button onClick={() => setActiveTab('notes')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'notes' ? (user?.is_premium ? 'text-amber-400 scale-110' : 'text-indigo-600 scale-110') : 'text-slate-400 hover:text-slate-600'}`}>
      <FileText size={22} strokeWidth={activeTab === 'notes' ? 2.5 : 2} />
      <span className="text-[9px] font-bold uppercase tracking-tighter">Notes</span>
    </button>
    <button onClick={() => setActiveTab('strategy')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'strategy' ? (user?.is_premium ? 'text-amber-400 scale-110' : 'text-indigo-600 scale-110') : 'text-slate-400 hover:text-slate-600'}`}>
      <Sparkles size={22} strokeWidth={activeTab === 'strategy' ? 2.5 : 2} />
      <span className="text-[9px] font-bold uppercase tracking-tighter">Pro</span>
    </button>
  </nav>
);

const Header = ({ user, onLogout }: { user: User | null, onLogout: () => void }) => {
  const getLevelProgress = (xp: number) => {
    if (xp >= 4000) return 100;
    if (xp >= 2000) return ((xp - 2000) / 2000) * 100;
    if (xp >= 1000) return ((xp - 1000) / 1000) * 100;
    if (xp >= 500) return ((xp - 500) / 500) * 100;
    return (xp / 500) * 100;
  };

  return (
    <header className={`px-6 py-4 flex justify-between items-center sticky top-0 z-40 transition-all duration-500 ${user?.is_premium ? 'bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 text-white' : 'bg-white/80 backdrop-blur-lg border-b border-slate-100 text-slate-900'}`}>
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ${user?.is_premium ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}
        >
          A
        </motion.div>
        <div>
          <h1 className={`font-black text-lg tracking-tight leading-none ${user?.is_premium ? 'premium-text-gradient' : 'text-slate-900'}`}>Abayas AI</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mentor</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level {user?.level}</p>
          <div className={`h-1 w-16 rounded-full mt-1 ${user?.is_premium ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className={`h-full rounded-full ${user?.is_premium ? 'bg-amber-400' : 'bg-indigo-600'}`} style={{ width: `${getLevelProgress(user?.xp || 0)}%` }} />
          </div>
        </div>
        <button 
          onClick={onLogout}
          className={`p-2.5 rounded-xl transition-all ${user?.is_premium ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

const Dashboard = ({ user, challenges, onStartChallenge, onUpgrade }: { user: User | null, challenges: Challenge[], onStartChallenge: (challenge: Challenge) => void, onUpgrade: () => void }) => {
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const getLevelInfo = (xp: number) => {
    if (xp >= 4000) return { current: 5, next: 4000, progress: 100, label: 'Max Level' };
    if (xp >= 2000) return { current: 4, next: 4000, progress: ((xp - 2000) / 2000) * 100, label: 'Next: 4000 XP' };
    if (xp >= 1000) return { current: 3, next: 2000, progress: ((xp - 1000) / 1000) * 100, label: 'Next: 2000 XP' };
    if (xp >= 500) return { current: 2, next: 1000, progress: ((xp - 500) / 500) * 100, label: 'Next: 1000 XP' };
    return { current: 1, next: 500, progress: (xp / 500) * 100, label: 'Next: 500 XP' };
  };

  const levelInfo = getLevelInfo(user?.xp || 0);

  const generatePlan = async () => {
    setLoadingPlan(true);
    try {
      const plan = await geminiService.generateStudyPlan("JEE Preparation & Python Basics");
      setStudyPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className={`p-6 space-y-8 pb-32 transition-colors ${user?.is_premium ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Welcome Card */}
      <section className={`rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl ${user?.is_premium ? 'bg-slate-900 border border-slate-800' : 'bg-indigo-600'}`}>
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-black mb-2 tracking-tight">Namaste, {user?.name}!</h2>
            <p className={`text-sm font-bold mb-6 uppercase tracking-widest ${user?.is_premium ? 'text-amber-400' : 'text-indigo-200'}`}>Level {user?.level} • {user?.xp} XP</p>
          </motion.div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
              <span>Progress</span>
              <span>{levelInfo.label}</span>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 ${user?.is_premium ? 'bg-slate-800' : 'bg-indigo-900/30'}`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${user?.is_premium ? 'premium-gradient' : 'bg-white'}`}
              />
            </div>
          </div>
        </div>
        <Sparkles className={`absolute -top-4 -right-4 opacity-10 ${user?.is_premium ? 'text-amber-400' : 'text-white'}`} size={160} />
      </section>

      {/* Quick Stats Bento Grid */}
      <div className="bento-grid">
        <div className={`p-5 rounded-[2rem] border flex flex-col justify-between h-32 shadow-sm ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user?.is_premium ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
            <Flame size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Streak</p>
            <p className={`text-xl font-black ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>{user?.streak} Days</p>
          </div>
        </div>
        <div className={`p-5 rounded-[2rem] border flex flex-col justify-between h-32 shadow-sm ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user?.is_premium ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
            <Zap size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank</p>
            <p className={`text-xl font-black ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>#12</p>
          </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <section>
        <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <h3 className={`font-black text-xl tracking-tight ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>Daily Quests</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete to earn XP</p>
          </div>
          <button className={`text-[10px] font-black uppercase tracking-widest ${user?.is_premium ? 'text-amber-400' : 'text-indigo-600'}`}>View All</button>
        </div>
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={challenge.id} 
              className={`p-5 rounded-[2rem] border flex items-center justify-between shadow-sm transition-all ${user?.is_premium ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100 hover:border-slate-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  challenge.type === 'quiz' ? 'bg-blue-500/10 text-blue-500' : 
                  challenge.type === 'coding' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'
                }`}>
                  {challenge.type === 'quiz' ? <BookOpen size={24} /> : challenge.type === 'coding' ? <Code size={24} /> : <Zap size={24} />}
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${user?.is_premium ? 'text-slate-200' : 'text-slate-800'}`}>{challenge.title}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{challenge.xp_reward} XP • {challenge.type}</p>
                </div>
              </div>
              <button 
                onClick={() => onStartChallenge(challenge)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${user?.is_premium ? 'bg-slate-800 text-slate-400 hover:text-amber-400' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}
              >
                <ArrowRight size={20} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Study Plan */}
      <section className={`rounded-[2.5rem] border p-8 shadow-xl relative overflow-hidden ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`font-black text-xl tracking-tight flex items-center gap-2 ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles size={22} className={user?.is_premium ? 'text-amber-400' : 'text-indigo-600'} />
              AI Study Plan
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personalized for you</p>
          </div>
          {!studyPlan && (
            <button 
              onClick={generatePlan}
              disabled={loadingPlan}
              className={`px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg ${user?.is_premium ? 'bg-amber-400 text-slate-900 shadow-amber-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
            >
              {loadingPlan ? 'Thinking...' : 'Generate'}
            </button>
          )}
        </div>
        
        {studyPlan ? (
          <div className="space-y-6">
            <div className={`${user?.is_premium ? 'bg-slate-800/50' : 'bg-indigo-50/50'} p-5 rounded-2xl border ${user?.is_premium ? 'border-slate-800' : 'border-indigo-100/50'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${user?.is_premium ? 'text-amber-400' : 'text-indigo-700'}`}>Current Focus</p>
              <p className={`text-sm font-bold leading-relaxed ${user?.is_premium ? 'text-slate-200' : 'text-slate-800'}`}>{studyPlan.goal}</p>
            </div>
            <div className="space-y-4">
              {studyPlan.dailyTasks.map((task: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 group">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${user?.is_premium ? 'border-slate-800 group-hover:border-amber-400' : 'border-slate-200 group-hover:border-indigo-600'}`}>
                    <div className="w-2 h-2 rounded-full bg-current opacity-0 group-hover:opacity-100" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${user?.is_premium ? 'text-slate-300' : 'text-slate-700'}`}>{task.task}</p>
                    <div className="flex gap-3 mt-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${user?.is_premium ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-500'}`}>{task.duration}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>{task.priority}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${user?.is_premium ? 'bg-slate-800 text-slate-600' : 'bg-slate-50 text-slate-300'}`}>
              <Sparkles size={32} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active plan</p>
            <p className="text-[10px] text-slate-400 mt-1">Let AI organize your study schedule</p>
          </div>
        )}
      </section>

      {/* Premium Banner */}
      {!user?.is_premium && (
        <motion.section 
          whileHover={{ scale: 1.02 }}
          className="premium-gradient rounded-[2.5rem] p-8 text-slate-900 flex items-center justify-between shadow-2xl shadow-amber-500/20"
        >
          <div>
            <h3 className="font-black text-2xl tracking-tight flex items-center gap-2">
              <Crown size={24} />
              Abayas Pro
            </h3>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Unlimited AI Access</p>
          </div>
          <button onClick={onUpgrade} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            Upgrade
          </button>
        </motion.section>
      )}
    </div>
  );
};

const StrategyView = ({ user, onUpgrade }: { user: User | null, onUpgrade: () => void }) => {
  const handlePayment = () => {
    const upiId = "7sanket@fam";
    const amount = "99";
    const name = "Abayas AI Premium";
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
    
    window.location.href = upiUrl;

    setTimeout(() => {
      if (confirm("Did you complete the payment of ₹99? Click OK to activate Pro features!")) {
        onUpgrade();
      }
    }, 2000);
  };

  return (
    <div className={`p-6 space-y-8 pb-32 transition-colors ${user?.is_premium ? 'bg-slate-950 text-white' : 'bg-slate-50'}`}>
      <section className={`rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl ${user?.is_premium ? 'premium-gradient' : 'bg-indigo-600'}`}>
        <div className="relative z-10">
          <h2 className={`text-3xl font-black mb-2 tracking-tight ${user?.is_premium ? 'text-slate-900' : 'text-white'}`}>Startup Strategy</h2>
          <p className={`text-[10px] font-black uppercase tracking-widest ${user?.is_premium ? 'text-slate-800' : 'text-indigo-100'}`}>By Sanket Studio • Founder: Sanket Prusty</p>
        </div>
        <Crown className={`absolute -top-4 -right-4 opacity-10 ${user?.is_premium ? 'text-slate-900' : 'text-white'}`} size={160} />
      </section>

      <section className="space-y-6">
        <div className="px-2">
          <h3 className={`font-black text-xl tracking-tight flex items-center gap-2 ${user?.is_premium ? 'text-amber-400' : 'text-slate-900'}`}>
            <Crown size={22} />
            Monetization
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flexible plans for every student</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className={`${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-6 rounded-[2rem] border shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-black text-sm text-indigo-600 uppercase tracking-widest">Free Plan</h4>
              <span className="text-xs font-bold text-slate-400 tracking-tighter">₹0/mo</span>
            </div>
            <ul className="text-xs font-bold text-slate-500 space-y-3">
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> 20 AI queries/hour</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> Basic coding help</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-indigo-500" /> Daily challenges</li>
            </ul>
          </div>
          <div className={`p-6 rounded-[2rem] border shadow-xl relative overflow-hidden ${user?.is_premium ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
            <div className="flex justify-between items-start mb-4">
              <h4 className={`font-black text-sm uppercase tracking-widest ${user?.is_premium ? 'text-amber-400' : 'text-indigo-600'}`}>Pro Plan</h4>
              <span className={`text-xs font-black tracking-tighter ${user?.is_premium ? 'text-amber-400' : 'text-indigo-600'}`}>₹99/mo</span>
            </div>
            <ul className={`text-xs font-bold space-y-3 ${user?.is_premium ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-500" /> Unlimited AI Tutor</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-500" /> Premium Dark Theme</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-amber-500" /> Priority Support</li>
            </ul>
          </div>
        </div>
        
        {!user?.is_premium && (
          <button 
            onClick={handlePayment}
            className="w-full premium-gradient text-slate-900 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Zap size={20} fill="currentColor" />
            Upgrade to Pro
          </button>
        )}
      </section>

      <section className="space-y-6">
        <div className="px-2">
          <h3 className={`font-black text-xl tracking-tight flex items-center gap-2 ${user?.is_premium ? 'text-amber-400' : 'text-slate-900'}`}>
            <Share2 size={22} />
            Growth Strategy
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scaling to 1M+ students</p>
        </div>
        
        <div className={`${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-8 rounded-[2.5rem] space-y-8 shadow-sm`}>
          <div>
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Deployment</h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Leveraging Vercel's edge network for global low-latency. CI/CD pipelines ensure rapid feature deployment and stability.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Viral Loop</h4>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Gamified referral system: Invite 3 friends to unlock Pro features for 24 hours. Creating a self-sustaining growth engine.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const TutorChat = ({ user, onAddXp }: { user: User | null, onAddXp: (xp: number) => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !user) return;
    
    setUsageError(null);
    setLoading(true);

    try {
      const usageRes = await fetch('/api/user/check-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      }).then(r => r.json());

      if (!usageRes.allowed) {
        setUsageError(`Limit reached! 20 questions/hour. Upgrade for unlimited!`);
        setLoading(false);
        return;
      }

      const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');

      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] as [{ text: string }] }));
      const response = await geminiService.getTutorResponse(input, history);
      const modelMsg: ChatMessage = { role: 'model', text: response || "I'm sorry, I couldn't process that.", timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
      
      // Award XP for question
      onAddXp(100);
    } catch (e) {
      console.error(e);
      setUsageError("AI is currently busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-120px)] transition-colors ${user?.is_premium ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 space-y-8"
          >
            <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl ${user?.is_premium ? 'bg-slate-900 text-amber-400 shadow-amber-500/10' : 'bg-white text-indigo-600 shadow-indigo-500/10'}`}>
              <Sparkles size={56} />
            </div>
            <div className="space-y-3">
              <h3 className={`font-black text-3xl tracking-tight ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>Abayas AI Tutor</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] max-w-[280px] mx-auto leading-relaxed">
                Your elite mentor for academic excellence
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {['Explain Quantum Physics', 'Solve x² + 5x + 6 = 0', 'Python Loops'].map((hint) => (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={hint}
                  onClick={() => {
                    setInput(hint);
                    setTimeout(() => {
                      const sendBtn = document.getElementById('chat-send-btn');
                      sendBtn?.click();
                    }, 10);
                  }}
                  className={`text-[10px] font-black uppercase tracking-widest px-5 py-3 rounded-2xl border transition-all ${user?.is_premium ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-amber-400 hover:text-amber-400' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 shadow-sm'}`}
                >
                  {hint}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[90%] p-6 rounded-[2rem] text-sm leading-relaxed shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : `${user?.is_premium ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border border-slate-100 text-slate-800'} rounded-tl-none`
              }`}>
                {msg.role === 'model' ? (
                  <div className={`prose prose-sm max-w-none ${user?.is_premium ? 'prose-invert prose-headings:text-amber-400' : 'prose-slate prose-headings:text-indigo-600'} prose-code:bg-slate-800 prose-code:text-amber-400 prose-code:p-1 prose-code:rounded prose-pre:bg-slate-950 prose-pre:text-emerald-400 prose-pre:rounded-2xl`}>
                    <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
                  </div>
                ) : (
                  <p className="font-bold">{msg.text}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {usageError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
            {usageError}
          </motion.div>
        )}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className={`${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border p-5 rounded-[2rem] rounded-tl-none shadow-xl flex items-center gap-3`}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Thinking</span>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className={`p-6 border-t transition-colors ${user?.is_premium ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'}`}>
        <div className="relative flex items-center gap-3">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Abayas AI..."
            className={`flex-1 border rounded-[2rem] px-8 py-5 text-sm font-bold outline-none transition-all pr-16 ${user?.is_premium ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10' : 'bg-slate-50 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}`}
          />
          <button 
            id="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute right-2 w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-50 ${user?.is_premium ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'}`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const CodingAssistant = ({ user, onAddXp }: { user: User | null, onAddXp: (xp: number) => void }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);

  const handleDebug = async () => {
    if (!code.trim() || loading || !user) return;
    
    setUsageError(null);
    setLoading(true);

    try {
      const usageRes = await fetch('/api/user/check-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      }).then(r => r.json());

      if (!usageRes.allowed) {
        setUsageError(`Limit reached! 20 questions/hour. Upgrade for unlimited!`);
        setLoading(false);
        return;
      }

      const res = await geminiService.getCodingHelp(code, language, query || "Debug and explain this code.");
      setResponse(res || "");
      
      // Award XP for question
      onAddXp(100);
    } catch (e) {
      console.error(e);
      setUsageError("AI is currently busy. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 space-y-8 pb-32 transition-colors ${user?.is_premium ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex justify-between items-end px-2">
        <div>
          <h3 className={`font-black text-2xl tracking-tight ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>Code Mentor</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Debug & Optimize your code</p>
        </div>
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`text-[10px] font-black uppercase tracking-widest border-none rounded-xl px-4 py-2 outline-none shadow-sm ${user?.is_premium ? 'bg-slate-900 text-amber-400' : 'bg-white text-indigo-600'}`}
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="html">HTML</option>
          <option value="sql">SQL</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Code</label>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className={`w-full h-64 font-mono text-xs p-6 rounded-[2rem] outline-none focus:ring-4 transition-all shadow-xl ${user?.is_premium ? 'bg-slate-900 text-emerald-400 border-slate-800 focus:ring-amber-500/10' : 'bg-slate-900 text-emerald-400 focus:ring-indigo-500/10'}`}
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">What's the issue?</label>
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Why am I getting an IndentationError?"
          className={`w-full border rounded-[2rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 transition-all shadow-lg ${user?.is_premium ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500/10' : 'bg-white border-slate-100 focus:border-indigo-500 focus:ring-indigo-500/10'}`}
        />
      </div>

      {usageError && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
          {usageError}
        </div>
      )}

      <button 
        onClick={handleDebug}
        disabled={loading}
        className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-2xl ${user?.is_premium ? 'bg-amber-400 text-slate-900 shadow-amber-500/20' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
      >
        {loading ? (
          <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Zap size={20} fill="currentColor" />
            Analyze & Debug
          </>
        )}
      </button>

      {response && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-[2.5rem] shadow-2xl space-y-4 border ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user?.is_premium ? 'bg-amber-400 text-slate-900' : 'bg-indigo-600 text-white'}`}>
              <Sparkles size={16} />
            </div>
            <h4 className={`font-black text-sm uppercase tracking-widest ${user?.is_premium ? 'text-amber-400' : 'text-slate-900'}`}>AI Analysis</h4>
          </div>
          <div className={`text-sm leading-relaxed font-medium ${user?.is_premium ? 'text-slate-300' : 'text-slate-600'}`}>
            <Markdown remarkPlugins={[remarkGfm]}>{response}</Markdown>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Leaderboard = ({ entries, user }: { entries: LeaderboardEntry[], user: User | null }) => (
  <div className={`p-6 space-y-8 pb-32 transition-colors ${user?.is_premium ? 'bg-slate-950' : 'bg-slate-50'}`}>
    <div className="text-center py-8">
      <div className="relative inline-block">
        <motion.div 
          initial={{ scale: 0.8, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          className={`w-24 h-24 rounded-[2rem] flex items-center justify-center border-4 ${user?.is_premium ? 'bg-amber-900/20 text-amber-400 border-amber-900/40' : 'bg-amber-100 text-amber-600 border-amber-200'}`}
        >
          <Trophy size={48} />
        </motion.div>
        <div className={`absolute -bottom-3 -right-3 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-4 border-white ${user?.is_premium ? 'bg-amber-400 text-slate-900' : 'bg-indigo-600 text-white'}`}>
          #1
        </div>
      </div>
      <h3 className={`mt-6 font-black text-2xl tracking-tight ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>Global Ranks</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Top students this week</p>
    </div>

    <div className={`rounded-[2.5rem] border overflow-hidden shadow-xl max-h-[400px] overflow-y-auto custom-scrollbar ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
      {entries.map((entry, idx) => (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          key={idx} 
          className={`flex items-center justify-between p-5 ${idx < entries.length - 1 ? (user?.is_premium ? 'border-b border-slate-800' : 'border-b border-slate-50') : ''} ${idx === 0 ? (user?.is_premium ? 'bg-amber-400/5' : 'bg-amber-50/30') : ''}`}
        >
          <div className="flex items-center gap-5">
            <span className={`w-6 text-center font-black text-sm ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-orange-400' : 'text-slate-300'}`}>
              {idx + 1}
            </span>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${user?.is_premium ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
              {entry.name[0].toUpperCase()}
            </div>
            <div>
              <h4 className={`font-bold text-sm ${user?.is_premium ? 'text-slate-200' : 'text-slate-800'}`}>{entry.name}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Level {entry.level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-black text-sm ${user?.is_premium ? 'text-amber-400' : 'text-indigo-600'}`}>{entry.xp} XP</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Master</p>
          </div>
        </motion.div>
      ))}
    </div>

    <button 
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: 'Abayas AI',
            text: 'Join me on Abayas AI - Your personal AI Mentor!',
            url: window.location.href
          }).catch(console.error);
        } else {
          alert("Sharing link copied to clipboard!");
          navigator.clipboard.writeText(window.location.href);
        }
      }}
      className={`w-full py-5 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest rounded-[2rem] transition-all active:scale-95 ${user?.is_premium ? 'bg-slate-900 text-amber-400 shadow-2xl shadow-amber-500/10' : 'bg-indigo-50 text-indigo-600 shadow-xl shadow-indigo-500/10'}`}
    >
      <Share2 size={20} />
      Invite Friends
    </button>
  </div>
);

const QuizView = ({ user, challenge, onComplete, onCancel }: { user: User | null, challenge: Challenge, onComplete: (xp: number) => void, onCancel: () => void }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await geminiService.generateQuiz(challenge.title);
        setQuiz(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [challenge]);

  const handleNext = () => {
    if (selectedOption === quiz?.questions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
    
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating your quiz...</p>
      </div>
    );
  }

  if (finished) {
    const finalScore = selectedOption === quiz?.questions[currentQuestion].correctAnswer ? score + 1 : score;
    const earnedXp = Math.round((finalScore / (quiz?.questions.length || 5)) * challenge.xp_reward);
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-6"
      >
        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl ${user?.is_premium ? 'bg-slate-900 text-amber-400' : 'bg-indigo-600 text-white'}`}>
          <Trophy size={48} />
        </div>
        <div className="space-y-2">
          <h3 className={`text-3xl font-black ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>Quiz Complete!</h3>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">You scored {finalScore}/{quiz?.questions.length}</p>
        </div>
        <div className={`p-6 rounded-3xl border ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} inline-block`}>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP Earned</p>
          <p className={`text-4xl font-black ${user?.is_premium ? 'text-amber-400' : 'text-indigo-600'}`}>+{earnedXp}</p>
        </div>
        <div className="pt-6">
          <button 
            onClick={() => onComplete(earnedXp)}
            className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl ${user?.is_premium ? 'bg-amber-400 text-slate-900' : 'bg-indigo-600 text-white'}`}
          >
            Claim Rewards
          </button>
        </div>
      </motion.div>
    );
  }

  const q = quiz?.questions[currentQuestion];

  return (
    <div className="space-y-8 py-4">
      <div className="flex justify-between items-center px-2">
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question</p>
          <p className={`text-sm font-black ${user?.is_premium ? 'text-white' : 'text-slate-900'}`}>{currentQuestion + 1} of {quiz?.questions.length}</p>
        </div>
      </div>

      <div className={`p-8 rounded-[2.5rem] border shadow-xl ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h3 className={`text-lg font-bold leading-relaxed mb-8 ${user?.is_premium ? 'text-slate-200' : 'text-slate-800'}`}>{q?.question}</h3>
        
        <div className="space-y-3">
          {q?.options.map((opt, idx) => (
            <button 
              key={idx}
              disabled={showExplanation}
              onClick={() => setSelectedOption(idx)}
              className={`w-full p-5 rounded-2xl border text-left text-sm font-bold transition-all ${
                selectedOption === idx 
                  ? (user?.is_premium ? 'bg-amber-400/10 border-amber-400 text-amber-400' : 'bg-indigo-50 border-indigo-600 text-indigo-600')
                  : (user?.is_premium ? 'bg-slate-800/50 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200')
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedOption === idx ? (user?.is_premium ? 'bg-amber-400 text-slate-900' : 'bg-indigo-600 text-white') : (user?.is_premium ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500')}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedOption !== null && !showExplanation && (
        <button 
          onClick={() => setShowExplanation(true)}
          className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl ${user?.is_premium ? 'bg-amber-400 text-slate-900' : 'bg-indigo-600 text-white'}`}
        >
          Check Answer
        </button>
      )}

      {showExplanation && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className={`p-6 rounded-3xl border ${selectedOption === q?.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedOption === q?.correctAnswer ? <CheckCircle2 size={20} /> : <X size={20} />}
              <p className="text-xs font-black uppercase tracking-widest">{selectedOption === q?.correctAnswer ? 'Correct!' : 'Incorrect'}</p>
            </div>
            <p className="text-sm font-medium leading-relaxed">{q?.explanation}</p>
          </div>
          <button 
            onClick={handleNext}
            className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl ${user?.is_premium ? 'bg-slate-900 text-white border border-slate-800' : 'bg-slate-900 text-white'}`}
          >
            {currentQuestion < (quiz?.questions.length || 0) - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

const NotesView = ({ user }: { user: User | null }) => {
  const [studyMaterial, setStudyMaterial] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [usageError, setUsageError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/notes/${user.email}`).then(r => r.json());
      setSavedNotes(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerate = async () => {
    if (!studyMaterial.trim() || loading || !user) return;
    
    setUsageError(null);
    setLoading(true);

    try {
      const usageRes = await fetch('/api/user/check-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      }).then(r => r.json());

      if (!usageRes.allowed) {
        setUsageError(`Limit reached! 20 questions/hour. Upgrade for unlimited!`);
        setLoading(false);
        return;
      }

      const notes = await geminiService.generateNotes(studyMaterial);
      setGeneratedNotes(notes || "");
      const firstLine = notes?.split('\n')[0].replace(/[#*]/g, '').trim() || "New Note";
      setTitle(firstLine.substring(0, 30));
    } catch (e) {
      console.error(e);
      setUsageError("AI is currently busy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedNotes || !user || !title) return;
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, title, content: generatedNotes })
      });
      setGeneratedNotes('');
      setStudyMaterial('');
      setTitle('');
      fetchNotes();
      alert("Note saved successfully!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
      if (viewingNote?.id === id) setViewingNote(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`p-4 space-y-6 pb-24 transition-colors ${user?.is_premium ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-bold flex items-center gap-2 ${user?.is_premium ? 'text-white' : 'text-slate-800'}`}>
          <FileText size={18} className={user?.is_premium ? 'text-amber-400' : 'text-indigo-600'} />
          AI Study Notes
        </h3>
        {viewingNote && (
          <button 
            onClick={() => setViewingNote(null)}
            className="text-xs font-medium text-indigo-600"
          >
            Back to List
          </button>
        )}
      </div>

      {viewingNote ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-2xl shadow-sm space-y-4 border ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
        >
          <div className="flex justify-between items-start">
            <h4 className={`font-bold text-lg ${user?.is_premium ? 'text-amber-400' : 'text-slate-800'}`}>{viewingNote.title}</h4>
            <button onClick={() => handleDelete(viewingNote.id)} className="text-red-400 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
          <div className={`prose prose-sm max-w-none ${user?.is_premium ? 'prose-invert' : 'prose-slate'}`}>
            <Markdown remarkPlugins={[remarkGfm]}>{viewingNote.content}</Markdown>
          </div>
        </motion.div>
      ) : (
        <>
          <section className={`rounded-2xl border p-5 shadow-sm space-y-4 ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Study Material</label>
              <textarea 
                value={studyMaterial}
                onChange={(e) => setStudyMaterial(e.target.value)}
                placeholder="Paste text from your textbook, article, or lecture notes here..."
                className={`w-full h-32 text-sm p-4 rounded-xl outline-none focus:ring-2 ${user?.is_premium ? 'bg-slate-800 text-slate-200 border-slate-700 focus:ring-amber-500' : 'bg-slate-50 text-slate-800 border-slate-100 focus:ring-indigo-500'}`}
              />
            </div>

            {usageError && (
              <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-600 text-xs text-center">
                {usageError}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading || !studyMaterial.trim()}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg ${user?.is_premium ? 'bg-amber-500 text-slate-900 hover:bg-amber-600 shadow-amber-900/20' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Notes
                </>
              )}
            </button>

            {generatedNotes && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 border-t border-slate-100"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note Title</label>
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2 text-sm outline-none ${user?.is_premium ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}
                  />
                </div>
                <div className={`p-4 rounded-xl border ${user?.is_premium ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`prose prose-xs max-w-none ${user?.is_premium ? 'prose-invert' : 'prose-slate'}`}>
                    <Markdown remarkPlugins={[remarkGfm]}>{generatedNotes}</Markdown>
                  </div>
                </div>
                <button 
                  onClick={handleSave}
                  className={`w-full py-3 rounded-xl font-bold text-sm ${user?.is_premium ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'}`}
                >
                  Save Note
                </button>
              </motion.div>
            )}
          </section>

          <section className="space-y-3">
            <h4 className={`font-bold text-sm ${user?.is_premium ? 'text-white' : 'text-slate-800'}`}>Saved Notes</h4>
            {savedNotes.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <FileText size={48} className="mx-auto mb-2" />
                <p className="text-xs">No saved notes yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {savedNotes.map((note) => (
                  <div 
                    key={note.id}
                    className={`p-4 rounded-xl border flex items-center justify-between shadow-sm cursor-pointer hover:scale-[1.02] transition-transform ${user?.is_premium ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                    onClick={() => setViewingNote(note)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${user?.is_premium ? 'bg-slate-800 text-amber-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-sm ${user?.is_premium ? 'text-slate-200' : 'text-slate-800'}`}>{note.title}</h4>
                        <p className="text-[10px] text-slate-500">{new Date(note.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('abayas_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchData();

    // Hourly auto-refresh mechanism
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing data...");
      fetchData();
    }, 3600000); // 3600000ms = 1 hour

    return () => clearInterval(refreshInterval);
  }, []);

  const fetchData = async () => {
    try {
      const [challengesRes, leaderboardRes] = await Promise.all([
        fetch('/api/challenges').then(r => r.json()),
        fetch('/api/leaderboard').then(r => r.json())
      ]);
      setChallenges(challengesRes);
      setLeaderboard(leaderboardRes);

      // Also refresh user data if logged in to keep XP/Level/Premium in sync
      const savedUser = localStorage.getItem('abayas_user');
      if (savedUser) {
        const { email } = JSON.parse(savedUser);
        const userRes = await fetch(`/api/user/${email}`).then(r => r.json());
        const updatedUser = { ...userRes, isLoggedIn: true };
        setUser(updatedUser);
        localStorage.setItem('abayas_user', JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error("Failed to refresh data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, name: string) => {
    setLoading(true);
    try {
      const userRes = await fetch(`/api/user/${email}`).then(r => r.json());
      const loggedInUser = { ...userRes, name, isLoggedIn: true };
      setUser(loggedInUser);
      localStorage.setItem('abayas_user', JSON.stringify(loggedInUser));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('abayas_user');
  };

  const handleCompleteChallenge = async (xp: number) => {
    if (!user) return;
    try {
      const updatedUser = await fetch('/api/user/add-xp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, xp })
      }).then(r => r.json());
      const newUser = { ...updatedUser, isLoggedIn: true };
      
      if (newUser.level === 5 && user.level < 5) {
        alert("🎉 Level 5 Reached! You've unlocked 2 days of PRO for FREE!");
      }

      setUser(newUser);
      localStorage.setItem('abayas_user', JSON.stringify(newUser));
      // Refresh leaderboard
      const leaderboardRes = await fetch('/api/leaderboard').then(r => r.json());
      setLeaderboard(leaderboardRes);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartChallenge = (challenge: Challenge) => {
    if (challenge.type === 'quiz') {
      setActiveChallenge(challenge);
    } else if (challenge.type === 'coding') {
      setActiveTab('coding');
    } else if (challenge.type === 'study') {
      setActiveTab('notes');
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    try {
      const updatedUser = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      }).then(r => r.json());
      const newUser = { ...updatedUser, isLoggedIn: true };
      setUser(newUser);
      localStorage.setItem('abayas_user', JSON.stringify(newUser));
      alert("Congratulations! You are now a Pro member. Enjoy unlimited AI access and Premium Theme!");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl animate-pulse mx-auto">A</div>
          <h2 className="font-bold text-slate-800">Abayas AI</h2>
          <p className="text-xs text-slate-400">Loading your classroom...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`mobile-container transition-colors ${user?.is_premium ? 'bg-slate-950' : 'bg-white'}`}>
      <Header user={user} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeChallenge ? (
            <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6">
              <QuizView 
                user={user} 
                challenge={activeChallenge} 
                onCancel={() => setActiveChallenge(null)}
                onComplete={(xp) => {
                  handleCompleteChallenge(xp);
                  setActiveChallenge(null);
                }}
              />
            </motion.div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Dashboard user={user} challenges={challenges} onStartChallenge={handleStartChallenge} onUpgrade={() => setActiveTab('strategy')} />
                </motion.div>
              )}
              {activeTab === 'tutor' && (
                <motion.div key="tutor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <TutorChat user={user} onAddXp={handleCompleteChallenge} />
                </motion.div>
              )}
              {activeTab === 'coding' && (
                <motion.div key="coding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CodingAssistant user={user} onAddXp={handleCompleteChallenge} />
                </motion.div>
              )}
              {activeTab === 'leaderboard' && (
                <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Leaderboard entries={leaderboard} user={user} />
                </motion.div>
              )}
              {activeTab === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <NotesView user={user} />
                </motion.div>
              )}
              {activeTab === 'strategy' && (
                <motion.div key="strategy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <StrategyView user={user} onUpgrade={handleUpgrade} />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
    </div>
  );
}
