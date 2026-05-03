/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import UploadSamples from './components/UploadSamples';
import Generator from './components/Generator';
import { HandwritingStyle } from './services/aiService';

type View = 'hero' | 'upload' | 'generate' | 'dashboard' | 'my-notes';

export default function App() {
  const [view, setView] = useState<View>('hero');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [style, setStyle] = useState<HandwritingStyle | null>(null);

  const handleStart = () => setView('upload');
  
  const handleUploadComplete = (newStyle: HandwritingStyle) => {
    setStyle(newStyle);
    setView('generate');
    setActiveTab('generate');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'dashboard') setView('hero');
    else if (tab === 'generate') {
      if (style) setView('generate');
      else setView('upload');
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      {view === 'hero' && <Home onStart={handleStart} onLogin={() => {}} />}
      {view === 'upload' && <UploadSamples onComplete={handleUploadComplete} />}
      {view === 'generate' && style && <Generator style={style} />}
      
      {/* Placeholders for other tabs */}
      {activeTab === 'my-notes' && (
        <div className="py-20 text-center">
          <h2 className="text-4xl font-bold uppercase mb-4">Saved Notes</h2>
          <p className="text-[#666] italic">Cloud storage integration requires Firebase setup. Your local history will appear here soon.</p>
        </div>
      )}
    </Layout>
  );
}
