
import React, { useRef, useState } from 'react';
import { 
  User, 
  Shield, 
  Database, 
  Trash2, 
  Settings as SettingsIcon, 
  Upload, 
  Globe, 
  Moon, 
  EyeOff, 
  Lock, 
  FileJson,
  Layout,
  ChevronRight
} from 'lucide-react';
import { UserProfile, EngineSettings, UserPreferences } from '../lib/types';

interface SettingsPageProps {
  userProfile: UserProfile;
  userPreferences: UserPreferences;
  engineSettings: EngineSettings;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onUpdateEngine: (updates: Partial<EngineSettings>) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (data: any) => void;
}

type SettingsTab = 'profile' | 'preferences' | 'privacy';

const AVATAR_COLORS = ['#37352f', '#e03131', '#2f9e44', '#1971c2', '#f08c00', '#9c36b5', '#0b7285'];

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  userProfile, 
  userPreferences,
  engineSettings, 
  onUpdateProfile, 
  onUpdatePreferences,
  onUpdateEngine, 
  onReset, 
  onExport,
  onImport
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImport(data);
        alert('Data imported successfully.');
      } catch (err) {
        alert('Invalid file format. Please upload a valid oneself backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <User size={12} /> Profile Intent
              </h3>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div 
                    className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold shadow-xl flex-shrink-0"
                    style={{ backgroundColor: userProfile.avatarColor }}
                  >
                    {userProfile.name.charAt(0)}
                  </div>
                  <div className="space-y-3 w-full sm:w-auto text-center sm:text-left">
                    <label className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 tracking-wider block">Avatar Color</label>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                      {AVATAR_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => onUpdateProfile({ avatarColor: color })}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            userProfile.avatarColor === color ? 'border-zinc-900 dark:border-zinc-100 scale-110 shadow-md' : 'border-transparent hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 px-1">Your Name</label>
                    <input 
                      type="text" 
                      value={userProfile.name}
                      onChange={(e) => onUpdateProfile({ name: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 outline-none transition-all focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                      placeholder="E.g. Human Being"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 px-1">Daily Tagline</label>
                    <input 
                      type="text" 
                      value={userProfile.tagline}
                      onChange={(e) => onUpdateProfile({ tagline: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 outline-none transition-all focus:border-zinc-900 dark:focus:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                      placeholder="A gentle reminder"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <SettingsIcon size={12} /> Balance Engine
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'energyGuardian', title: 'Energy Guardian', desc: 'Warns after multiple high-intensity days.', active: engineSettings.energyGuardian },
                  { id: 'restEncourager', title: 'Rest Encourager', desc: 'Suggests rest when life gets heavy.', active: engineSettings.restEncourager }
                ].map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer group shadow-sm"
                    onClick={() => onUpdateEngine({ [item.id]: !item.active } as any)}
                  >
                    <div className="pr-4">
                      <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{item.title}</h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${item.active ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                      <div className={`w-4 h-4 rounded-full transition-transform ${item.active ? 'bg-white dark:bg-zinc-900 translate-x-6' : 'bg-white dark:bg-zinc-600 translate-x-0'}`} />
                    </div>
                  </div>
                ))}

                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/20 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 tracking-widest">Intensity Limit</label>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">{engineSettings.highIntensityLimit} days</span>
                  </div>
                  <input 
                    type="range" min="1" max="7" 
                    value={engineSettings.highIntensityLimit}
                    onChange={(e) => onUpdateEngine({ highIntensityLimit: parseInt(e.target.value) })}
                    className="w-full accent-zinc-900 dark:accent-zinc-100 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </section>
          </div>
        );
      
      case 'preferences':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <Globe size={12} /> Localization
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 px-1">Language</label>
                  <select 
                    value={userPreferences.language}
                    onChange={(e) => onUpdatePreferences({ language: e.target.value as any })}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none appearance-none font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="en">English (Calm)</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 px-1">Week Start</label>
                  <select 
                    value={userPreferences.weekStart}
                    onChange={(e) => onUpdatePreferences({ weekStart: e.target.value as any })}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none appearance-none font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="monday">Monday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <Layout size={12} /> Interface
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'dashboardShowHeatmap', title: 'Energy Graph', desc: 'Show the heatmap on dashboard.', active: userPreferences.dashboardShowHeatmap },
                  { id: 'dashboardShowReflection', title: 'Daily Reflections', desc: 'Show insight cards on dashboard.', active: userPreferences.dashboardShowReflection }
                ].map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer group shadow-sm"
                    onClick={() => onUpdatePreferences({ [item.id]: !item.active } as any)}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{item.title}</h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors flex-shrink-0 ${item.active ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                      <div className={`w-4 h-4 rounded-full transition-transform ${item.active ? 'bg-white dark:bg-zinc-900 translate-x-6' : 'bg-white dark:bg-zinc-600 translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <section className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <Shield size={12} /> Philosophy
              </h3>
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900 flex gap-5">
                <Lock className="text-emerald-500 shrink-0" size={24} strokeWidth={1.5} />
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Your Rhythm is Private</h4>
                  <p className="text-xs text-emerald-800/70 dark:text-emerald-500 leading-relaxed font-medium">
                    "oneself" is local-first. Your data lives in your browser, not our servers. No trackers, no eyes on your life balance.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                <FileJson size={12} /> Data Operations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={onExport}
                  className="p-8 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] hover:border-zinc-900 dark:hover:border-zinc-100 transition-all group flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-xl"
                >
                  <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:bg-zinc-900 dark:group-hover:bg-zinc-100 group-hover:text-white dark:group-hover:text-zinc-900 group-hover:rotate-6 transition-all">
                    <Database size={24} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Export All</h5>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-600 mt-1">Download backup file</p>
                  </div>
                </button>
                
                <button 
                  onClick={handleImportClick}
                  className="p-8 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] hover:border-emerald-500 dark:hover:border-emerald-400 transition-all group flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-xl"
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                  <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-400 group-hover:text-white group-hover:text-zinc-900 group-hover:-rotate-6 transition-all">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Import Data</h5>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-600 mt-1">Restore from backup</p>
                  </div>
                </button>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-rose-400 dark:text-rose-600 border-b border-rose-100 dark:border-rose-900 pb-2 flex items-center gap-2">
                <Trash2 size={12} /> Danger Zone
              </h3>
              <button 
                onClick={onReset}
                className="w-full p-8 bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900 rounded-[2.5rem] hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:border-rose-300 dark:hover:border-rose-800 transition-all group flex items-center gap-6 px-10"
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-rose-400 dark:text-rose-600 group-hover:scale-110 group-hover:bg-rose-500 dark:group-hover:bg-rose-400 group-hover:text-white transition-all shadow-sm">
                  <Trash2 size={20} />
                </div>
                <div className="text-left">
                  <h5 className="text-sm font-bold text-rose-600 dark:text-rose-400">Factory Reset</h5>
                  <p className="text-[11px] text-rose-500/70 dark:text-rose-700 mt-1">Delete all logs permanently.</p>
                </div>
              </button>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-8 space-y-12 pb-32 transition-colors">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold serif text-zinc-900 dark:text-zinc-100 mb-2">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-500 italic serif text-lg leading-relaxed">Adjust your rhythm and digital space.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 lg:w-48 shrink-0 no-scrollbar">
          {[
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'preferences', icon: SettingsIcon, label: 'Preferences' },
            { id: 'privacy', icon: Shield, label: 'Privacy' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap lg:w-full
                ${activeTab === tab.id 
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xl translate-x-1' 
                  : 'text-zinc-400 dark:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-600 dark:hover:text-zinc-400'}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto hidden lg:block opacity-40" />}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          {renderTabContent()}

          <div className="pt-24 flex flex-col items-center gap-3 opacity-20 dark:opacity-10 grayscale hover:opacity-40 transition-opacity">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-100 rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 text-xl font-bold shadow-lg">O</div>
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] block text-zinc-900 dark:text-zinc-100">oneself v1.0.4</span>
              <span className="text-[10px] mt-1.5 block italic serif text-zinc-800 dark:text-zinc-600">Your balance is yours alone.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
