import { useState, useEffect } from 'react';
import { medicinesAPI, doctorsAPI } from '../services/supabase';

export function useMedicines() {
  const [diseaseList, setDiseaseList] = useState([]);
  const [diseaseMedicines, setDiseaseMedicines] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      
      // Load danh sách bệnh
      const diseases = await medicinesAPI.getDiseaseList();
      
      // Load thuốc theo bệnh
      const medicinesByDisease = await medicinesAPI.getMedicinesByDisease();
      
      // Load danh sách bác sĩ
      const doctorsList = await doctorsAPI.getAll();
      
      setDiseaseList(diseases);
      setDiseaseMedicines(medicinesByDisease);
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading medicines:', error);
      // Nếu lỗi, để trống - không dùng fallback
      setDiseaseList([]);
      setDiseaseMedicines({});
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    diseaseList,
    diseaseMedicines,
    doctors,
    loading,
    reload: loadMedicines
  };
}
