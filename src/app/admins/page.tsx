'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Plus, MoreVertical, X } from 'lucide-react';

function CreateAdminModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (data: any) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('관리자');

  if (!isOpen) return null;

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const emailError = email.length > 0 && !isValidEmail(email) ? '유효한 이메일 형식이 아닙니다.' : '';
  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && isValidEmail(email) && role.length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    
    // YYYY.MM.DD HH:mm:ss Format for Mock
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    onConfirm({
      name,
      email,
      role,
      roleBg: role === '관리자' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#F5F3FF] text-[#7C3AED]',
      date: dateStr,
    });
    
    setName('');
    setEmail('');
    setRole('관리자');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[12px] p-8 w-full max-w-[560px] shadow-2xl relative">
        <h2 className="text-[20px] font-bold text-gray-900 mb-6">관리자 계정 생성</h2>
        
        <div className="flex flex-col gap-5">
           <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">이름 <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름을 입력하세요" className="w-full border border-gray-200 rounded-[8px] p-3 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all" />
           </div>
           <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">이메일 <span className="text-red-500">*</span></label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@skt.com" className={`w-full border rounded-[8px] p-3 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${emailError ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'}`} />
              {emailError && <p className="text-red-500 text-[11px] mt-1.5 font-bold">{emailError}</p>}
           </div>
           <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">권한 <span className="text-red-500">*</span></label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-gray-200 rounded-[8px] p-3 text-[13px] text-gray-900 font-medium focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white transition-all cursor-pointer">
                 <option value="관리자">관리자</option>
                 <option value="인프라 관리자">인프라 관리자</option>
              </select>
           </div>
        </div>

        <div className="mt-8 flex justify-end gap-2.5">
           <button onClick={onClose} className="px-5 py-2.5 rounded-[8px] text-[13px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors outline-none">취소</button>
           <button onClick={handleSubmit} disabled={!isFormValid} className={`px-6 py-2.5 rounded-[8px] text-[13px] font-bold transition-all outline-none ${isFormValid ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-500/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default function Admins() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins, setAdmins] = useState([
    { name: '김솔솔', email: 'solsol.kim@skt.com', role: '인프라 관리자', roleBg: 'bg-[#F5F3FF] text-[#7C3AED]', date: '2026.01.10 09:00:00' },
    { name: '이태현', email: 'thlee.dev@skt.com', role: '관리자', roleBg: 'bg-[#EFF6FF] text-[#2563EB]', date: '2026.01.12 14:30:22' },
    { name: '최윤진', email: 'yoonjin.choi@skt.com', role: '관리자', roleBg: 'bg-[#EFF6FF] text-[#2563EB]', date: '2026.01.15 10:15:40' },
    { name: '박태민', email: 'tm.park@skt.com', role: '인프라 관리자', roleBg: 'bg-[#F5F3FF] text-[#7C3AED]', date: '2026.02.01 16:40:12' },
  ]);

  const handleCreateAdmin = (newAdmin: any) => {
    setAdmins([...admins, newAdmin]);
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <CreateAdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleCreateAdmin} />

      <div className="bg-white border text-left border-gray-200 rounded-[10px] p-4 flex items-center justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
        <div className="text-[14px] font-semibold text-gray-900 border-r border-gray-200 pr-5">플랫폼 관리자 <span className="text-gray-400 font-normal ml-2">Total {admins.length}</span></div>
        <div className="flex-1 px-5 flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="관리자 명 검색" className="w-[200px] h-[34px] border border-gray-200 rounded-[7px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white" />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="h-[34px] w-[34px] flex items-center justify-center border border-gray-200 rounded-[7px] text-gray-600 hover:bg-[#F9FAFB]">
            <RotateCcw size={14} />
          </button>
          <button className="h-[34px] w-[80px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center justify-center transition-colors">
            검색
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="h-[34px] px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center gap-1.5 shadow-sm transition-colors outline-none">
            <Plus size={14} /> <span>생성</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full">
        <table className="w-full text-left border-collapse flex-1 inline-table">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">관리자 명</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">이메일</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">권한</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">등록 일시</th>
              <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide w-10"></th>
            </tr>
          </thead>
          <tbody>
            {admins.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 text-[13px] text-gray-800 hover:bg-gray-50/50 transition-colors h-[48px]">
                <td className="px-[20px] font-bold text-gray-900 text-[13px]">{row.name}</td>
                <td className="px-[20px] font-medium text-gray-600 text-[13px]">{row.email}</td>
                <td className="px-[20px]">
                  <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-bold ${row.roleBg}`}>{row.role}</span>
                </td>
                <td className="px-[20px] font-mono text-[12px] text-gray-500">{row.date}</td>
                <td className="px-[20px] text-gray-400 hover:text-gray-900 cursor-pointer"><MoreVertical size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination mock */}
        <div className="h-[60px] border-t border-gray-100 flex justify-center items-center gap-1.5 bg-[#FAFAFA] shrink-0">
          <button className="w-[32px] h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-400 font-bold hover:bg-gray-50">&lt;</button>
          <button className="w-[32px] h-[32px] rounded-[6px] border border-primary-500 bg-primary-500 text-white font-bold">1</button>
          <button className="w-[32px] h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold">&gt;</button>
        </div>
      </div>
    </div>
  );
}
