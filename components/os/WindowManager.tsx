'use client';

import React from 'react';
import { useOS } from './OSContext';
import { Window } from './Window';
import { ProjectsApp } from '../apps/ProjectsApp';
import { ResultsApp } from '../apps/ResultsApp';
import { SystemsApp } from '../apps/SystemsApp';
import { ProofApp } from '../apps/ProofApp';
import { JourneyApp } from '../apps/JourneyApp';
import { AchievementsApp } from '../apps/AchievementsApp';
import { SocialsApp } from '../apps/SocialsApp';
import { LearnApp } from '../apps/LearnApp';
import { AIVoiceAgentApp } from '../apps/AIVoiceAgentApp';
import { FounderNotepadApp } from '../apps/FounderNotepadApp';
import { WhiteboardApp } from '../apps/WhiteboardApp';
import { MithNetBrowserApp } from '../apps/MithNetBrowserApp';
import { ContactBookingApp } from '../apps/ContactBookingApp';
import { CaseFilesApp } from '../apps/CaseFilesApp';

export const WindowManager: React.FC = () => {
  const { openWindows } = useOS();

  const renderAppContent = (id: string) => {
    switch (id) {
      case 'projects':
        return <ProjectsApp />;
      case 'results':
        return <ResultsApp />;
      case 'systems':
        return <SystemsApp />;
      case 'proof':
        return <ProofApp />;
      case 'journey':
        return <JourneyApp />;
      case 'achievements':
        return <AchievementsApp />;
      case 'socials':
        return <SocialsApp />;
      case 'learn':
        return <LearnApp />;
      case 'aiagent':
        return <AIVoiceAgentApp />;
      case 'founder':
        return <FounderNotepadApp />;
      case 'whiteboard':
        return <WhiteboardApp />;
      case 'browser':
        return <MithNetBrowserApp />;
      case 'contact':
        return <ContactBookingApp />;
      case 'casefiles':
        return <CaseFilesApp />;
      default:
        return <ProjectsApp />;
    }
  };

  return (
    <>
      {openWindows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          isMaximized={win.isMaximized}
          isMinimized={win.isMinimized}
          zIndex={win.zIndex}
        >
          {renderAppContent(win.id)}
        </Window>
      ))}
    </>
  );
};
