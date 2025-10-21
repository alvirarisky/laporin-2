import React from 'react';

// Helper component untuk item quest
const QuestItem = ({ text, isCompleted }) => (
    <li className={`flex items-center transition-all duration-300 ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
        <span className={`mr-3 h-5 w-5 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'border-2 border-gray-400'}`}>
            {isCompleted && '✔'}
        </span>
        <span className={isCompleted ? 'line-through' : ''}>{text}</span>
    </li>
);

export default function QuestSidebar({ formData }) {
    // Logika untuk menentukan status quest berdasarkan formData yang diterima dari Create.jsx
    // Pastikan formData tidak null atau undefined sebelum mengakses propertinya
    const quests = [
        { text: 'Isi Judul & Identitas', completed: formData && formData.judul.trim() !== '' && formData.nama.trim() !== '' },
        { text: 'Lengkapi Detail Akademik', completed: formData && formData.prodi.trim() !== '' && formData.mata_kuliah.trim() !== '' },
        { text: 'Tentukan Detail Institusi', completed: formData && formData.instansi.trim() !== '' && formData.kota.trim() !== '' },
        { text: 'Upload Logo', completed: formData && formData.logo !== null },
    ];
    
    const completedQuests = quests.filter(q => q.completed).length;
    const progress = (completedQuests / quests.length) * 100;

    return (
        <div className="sticky top-24 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📜 Quest Laporan</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-600 mb-6">Selesaikan semua misi untuk melanjutkan ke tahap berikutnya!</p>

            <ul className="space-y-4">
                {quests.map((quest, index) => (
                     <QuestItem key={index} text={quest.text} isCompleted={quest.completed} />
                ))}
            </ul>

            <div className="mt-8 text-center">
                <img src="/images/chibi-default.png" alt="Chibi" className="mx-auto h-24" />
                <p className="text-sm text-gray-500 mt-2">Chibi menemanimu!</p>
            </div>
        </div>
    );
}