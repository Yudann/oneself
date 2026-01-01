
'use client';

import React from 'react';
import { useStore } from '@/lib/store-provider';
import { SettingsPage as SettingsComponent } from '@/components/SettingsPage';

export default function SettingsPage() {
  const { state, updateUserProfile, updateUserPreferences, updateEngineSettings, importData } = useStore();

  const handleReset = () => {
    if (confirm('Clear all data permanently?')) {
      localStorage.removeItem('oneself_v1_state');
      window.location.reload();
    }
  };

  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `oneself_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <SettingsComponent 
      userProfile={state.userProfile} 
      userPreferences={state.userPreferences} 
      engineSettings={state.engineSettings} 
      onUpdateProfile={updateUserProfile} 
      onUpdatePreferences={updateUserPreferences} 
      onUpdateEngine={updateEngineSettings} 
      onReset={handleReset} 
      onExport={handleExportAll} 
      onImport={importData} 
    />
  );
}
