import React, { useState, useEffect } from 'react';
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

import { patientsAPI, examinationsAPI } from './services/supabase';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [examTargetPatient, setExamTargetPatient] = useState(null);

  // Load patients từ Supabase
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsAPI.getAll();
      
      // Load exam history cho mỗi bệnh nhân
      const patientsWithHistory = await Promise.all(
        data.map(async (p) => {
          const fullPatient = await patientsAPI.getById(p.id);
          return fullPatient;
        })
      );
      
      setPatients(patientsWithHistory);
    } catch (error) {
      console.error('Error loading patients:', error);
      alert('Lỗi khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = () => setShowAddPatient(true);

  const handleSavePatient = async (patient, firstExam) => {
    try {
      // Tạo bệnh nhân
      await patientsAPI.create(patient);
      
      // Nếu có lần khám đầu tiên, tạo luôn
      if (firstExam) {
        const { medicines, ...examData } = firstExam;
        const examToSave = {
          id: examData.id,
          patientId: patient.id,
          date: examData.date,
          disease: examData.disease,
          symptoms: examData.symptoms,
          doctor: examData.doctor,
          notes: examData.notes,
          fee: examData.fee
        };
        await examinationsAPI.create(examToSave, medicines);
      }
      
      await loadPatients(); // Reload data
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Lỗi khi lưu bệnh nhân: ' + error.message);
    }
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

  const handleSaveExam = async (patientId, exam) => {
    try {
      console.log('Saving exam:', { patientId, exam });
      
      const { medicines, ...examData } = exam;
      
      // Chuẩn bị dữ liệu examination
      const examToSave = {
        id: examData.id,
        patientId: patientId,
        date: examData.date,
        disease: examData.disease,
        symptoms: examData.symptoms,
        doctor: examData.doctor,
        notes: examData.notes,
        fee: examData.fee
      };
      
      console.log('Exam to save:', examToSave);
      console.log('Medicines:', medicines);
      
      await examinationsAPI.create(examToSave, medicines);
      await loadPatients(); // Reload data
      
      console.log('Exam saved successfully');
    } catch (error) {
      console.error('Error saving exam:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      alert('Lỗi khi lưu phiếu khám: ' + error.message);
    }
  };

  // Find patient by id (for detail modal after mutations)
  const getPatient = (id) => patients.find(p => p.id === id) || selectedPatient;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 18, color: 'var(--text-secondary)' }}>
        <div>⏳ Đang tải dữ liệu...</div>
      </div>
    );
  }

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
