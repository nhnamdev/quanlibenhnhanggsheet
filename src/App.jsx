import React, { useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import AddPatientModal from './components/AddPatientModal';
import AddExamModal from './components/AddExamModal';
import PatientDetailModal from './components/PatientDetailModal';

import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import ExaminationPage from './pages/ExaminationPage';
import MedicinesPage from './pages/MedicinesPage';
import HistoryPage from './pages/HistoryPage';

import { INITIAL_PATIENTS } from './data/mockData';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [patients, setPatients] = useState(INITIAL_PATIENTS);

  // Modal states
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examTargetPatient, setExamTargetPatient] = useState(null);

  const handleAddPatient = () => setShowAddPatient(true);

  const handleSavePatient = (patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowDetail(true);
  };

  const handleOpenAddExam = (patient) => {
    setExamTargetPatient(patient);
    setShowDetail(false);
    setShowAddExam(true);
  };

  const handleSaveExam = (patientId, exam) => {
    setPatients(prev => prev.map(p =>
      p.id === patientId
        ? { ...p, examHistory: [...p.examHistory, exam] }
        : p
    ));
  };

  // Find patient by id (for detail modal after mutations)
  const getPatient = (id) => patients.find(p => p.id === id) || selectedPatient;

  return (
    <div className="layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="main-content">
        <Topbar activePage={activePage} />

        <div className="page-content">
          {activePage === 'dashboard' && (
            <DashboardPage
              patients={patients}
              onNavigate={setActivePage}
              onAddPatient={handleAddPatient}
            />
          )}
          {activePage === 'patients' && (
            <PatientsPage
              patients={patients}
              onViewPatient={handleViewPatient}
              onAddPatient={handleAddPatient}
              onAddExam={handleOpenAddExam}
            />
          )}
          {activePage === 'examination' && (
            <ExaminationPage
              patients={patients}
              onSaveExam={handleSaveExam}
              onAddPatient={handleAddPatient}
            />
          )}
          {activePage === 'medicines' && <MedicinesPage />}
          {activePage === 'history' && (
            <HistoryPage
              patients={patients}
              onViewPatient={handleViewPatient}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddPatient && (
        <AddPatientModal
          onClose={() => setShowAddPatient(false)}
          onSave={handleSavePatient}
        />
      )}

      {showAddExam && examTargetPatient && (
        <AddExamModal
          patient={getPatient(examTargetPatient.id)}
          onClose={() => { setShowAddExam(false); setExamTargetPatient(null); }}
          onSave={handleSaveExam}
        />
      )}

      {showDetail && selectedPatient && (
        <PatientDetailModal
          patient={getPatient(selectedPatient.id)}
          onClose={() => { setShowDetail(false); setSelectedPatient(null); }}
          onAddExam={handleOpenAddExam}
        />
      )}
    </div>
  );
}
