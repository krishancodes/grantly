import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Explore } from './pages/Explore';
import { ScholarshipDetail } from './pages/ScholarshipDetail';
import { Applications } from './pages/Applications';
import { Saved } from './pages/Saved';
import { Assistant } from './pages/Assistant';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/scholarship/:id" element={<ScholarshipDetail />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
