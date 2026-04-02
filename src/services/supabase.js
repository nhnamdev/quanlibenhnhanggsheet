import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API functions
export const patientsAPI = {
  // Lấy tất cả bệnh nhân
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Lấy 1 bệnh nhân với lịch sử khám
  async getById(id) {
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (patientError) throw patientError;

    const { data: exams, error: examsError } = await supabase
      .from('examinations')
      .select(`
        *,
        examination_medicines (*)
      `)
      .eq('patientId', id)
      .order('examDate', { ascending: false });
    
    if (examsError) throw examsError;

    return {
      ...patient,
      examHistory: exams.map(exam => ({
        id: exam.id,
        date: exam.examDate,
        disease: exam.disease,
        symptoms: exam.symptoms,
        doctor: exam.doctor,
        notes: exam.notes,
        fee: exam.fee,
        medicines: exam.examination_medicines.map(m => ({
          name: m.medicineName,
          usage: m.usage,
          dose: m.dose,
          days: m.days
        }))
      }))
    };
  },

  // Thêm bệnh nhân mới
  async create(patient) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Cập nhật bệnh nhân
  async update(id, updates) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Xóa bệnh nhân
  async delete(id) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const examinationsAPI = {
  // Lấy tất cả lần khám
  async getAll() {
    const { data, error } = await supabase
      .from('examinations')
      .select(`
        *,
        patients (*),
        examination_medicines (*)
      `)
      .order('examDate', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Thêm lần khám mới
  async create(examination, medicines) {
    console.log('=== examinationsAPI.create START ===');
    console.log('Input examination:', examination);
    console.log('Input medicines:', medicines);
    
    // Chuẩn bị dữ liệu examination với tên cột đúng
    const examData = {
      id: examination.id,
      patientId: examination.patientId || examination.patient_id,
      examDate: examination.date || examination.examDate || new Date().toISOString().split('T')[0],
      disease: examination.disease,
      symptoms: examination.symptoms,
      doctor: examination.doctor,
      notes: examination.notes,
      fee: examination.fee || 0
    };

    console.log('Prepared examData:', examData);

    // Thêm lần khám
    console.log('Inserting examination...');
    const { data: exam, error: examError } = await supabase
      .from('examinations')
      .insert([examData])
      .select()
      .single();
    
    if (examError) {
      console.error('ERROR inserting examination:', examError);
      console.error('Error details:', {
        message: examError.message,
        details: examError.details,
        hint: examError.hint,
        code: examError.code
      });
      throw examError;
    }
    
    console.log('Examination inserted successfully:', exam);

    // Thêm thuốc
    if (medicines && medicines.length > 0) {
      console.log('Inserting medicines...');
      const medicinesData = medicines.map(m => ({
        examinationId: exam.id,
        medicineName: m.name,
        usage: m.usage || '',
        dose: m.dose,
        days: m.days
      }));

      console.log('Prepared medicinesData:', medicinesData);

      const { error: medError } = await supabase
        .from('examination_medicines')
        .insert(medicinesData);
      
      if (medError) {
        console.error('ERROR inserting medicines:', medError);
        console.error('Error details:', {
          message: medError.message,
          details: medError.details,
          hint: medError.hint,
          code: medError.code
        });
        throw medError;
      }
      
      console.log('Medicines inserted successfully');
    } else {
      console.log('No medicines to insert');
    }

    console.log('=== examinationsAPI.create END ===');
    return exam;
  }
};

export const medicinesAPI = {
  // Lấy tất cả thuốc
  async getAll() {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('disease', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Lấy thuốc theo bệnh
  async getByDisease(disease) {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('disease', disease);
    
    if (error) throw error;
    return data;
  },

  // Thêm thuốc mới
  async create(medicine) {
    const { data, error } = await supabase
      .from('medicines')
      .insert([medicine])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Cập nhật thuốc
  async update(id, medicine) {
    const { data, error } = await supabase
      .from('medicines')
      .update(medicine)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Xóa thuốc
  async delete(id) {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Lấy danh sách bệnh (unique)
  async getDiseaseList() {
    const { data, error } = await supabase
      .from('medicines')
      .select('disease')
      .order('disease', { ascending: true });
    
    if (error) throw error;
    
    // Lấy danh sách bệnh unique
    const uniqueDiseases = [...new Set(data.map(item => item.disease))];
    return uniqueDiseases;
  },

  // Lấy thuốc theo bệnh (format như DISEASE_MEDICINES)
  async getMedicinesByDisease() {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('disease', { ascending: true });
    
    if (error) throw error;
    
    // Group by disease
    const grouped = {};
    data.forEach(med => {
      if (!grouped[med.disease]) {
        grouped[med.disease] = [];
      }
      grouped[med.disease].push({
        name: med.name,
        usage: med.usage,
        dose: med.dose,
        days: med.days
      });
    });
    
    return grouped;
  }
};

export const doctorsAPI = {
  // Lấy tất cả bác sĩ đang hoạt động
  async getAll() {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('isActive', true)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data.map(d => d.name);
  },

  // Thêm bác sĩ mới
  async create(doctor) {
    const { data, error } = await supabase
      .from('doctors')
      .insert([{ name: doctor.name, specialty: doctor.specialty }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
