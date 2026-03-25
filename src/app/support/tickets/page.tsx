'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Calendar, Settings, MoreVertical, Plus, UploadCloud } from 'lucide-react';

function CreateTicketModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (data: any) => void }) {
  const [type, setType] = useState('기술지원');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const isFormValid = type && title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const typeToStatusColor: Record<string, string> = {
      '장애접수': 'bg-[#FFFBEB] text-[#D97706]',
      '기술지원': 'bg-primary-50 text-primary-600',
      '일반안내': 'bg-[#ECFDF5] text-[#059669]'
    };

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    // For ticket list mock matching date format: "YYYY-MM-DD HH:mm:ss"
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    onConfirm({
      type,
      id: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      title,
      comments: 0,
      status: '대기 중',
      user: '김사원 (LG전자)',
      date: dateStr,
      statusColor: 'bg-[#FFFBEB] text-[#D97706]' // 대기 중 기본 컬러
    });
    
    setType('기술지원');
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[12px] p-8 w-full max-w-[600px] shadow-2xl relative max-h-[90vh] flex flex-col">
        <h2 className="text-[20px] font-bold text-gray-900 mb-6 shrink-0">티켓 등록</h2>
        
        <div className="flex flex-col gap-5 overflow-y-auto pr-2 pb-2">
           <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">유형 <span className="text-red-500">*</span></label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-200 rounded-[8px] p-3 text-[13px] text-gray-900 font-medium focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white cursor-pointer">
                 <option value="기술지원">기술지원</option>
                 <option value="장애접수">장애접수</option>
                 <option value="일반안내">일반안내</option>
              </select>
           </div>
           
           <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-[13px] font-bold text-gray-700">제목 <span className="text-red-500">*</span></label>
                <span className="text-[11px] font-medium text-gray-400">{title.length}/50</span>
              </div>
              <input type="text" value={title} onChange={e => setTitle(e.target.value.substring(0, 50))} placeholder="제목을 입력하세요" className="w-full border border-gray-200 rounded-[8px] p-3 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
           </div>

           <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">내용 <span className="text-red-500">*</span></label>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="문의 또는 지원이 필요한 상세 내용을 입력하세요" className="w-full border border-gray-200 rounded-[8px] p-4 text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 h-[150px] resize-none" />
           </div>

           <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-[13px] font-bold text-gray-700">파일 첨부 <span className="text-gray-400 font-normal">(선택)</span></label>
                <span className="text-[11px] font-medium text-gray-400">최대 3장, 10MB 이하</span>
              </div>
              <div className="border border-dashed border-gray-300 bg-gray-50 rounded-[8px] flex flex-col items-center justify-center p-6 hover:bg-gray-100 cursor-pointer transition-colors">
                <UploadCloud size={24} className="text-gray-400 mb-2"/>
                <span className="text-[12px] font-bold text-gray-600">클릭하거나 파일을 이곳에 드래그하세요</span>
                <span className="text-[11px] text-gray-400 mt-1">에러 화면 캡처, 로그 텍스트 등</span>
              </div>
           </div>
        </div>

        <div className="mt-8 flex justify-end gap-2.5 shrink-0">
           <button onClick={onClose} className="px-5 py-2.5 rounded-[8px] text-[13px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors outline-none">취소</button>
           <button onClick={handleSubmit} disabled={!isFormValid} className={`px-6 py-2.5 rounded-[8px] text-[13px] font-bold transition-all outline-none ${isFormValid ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-500/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>등록</button>
        </div>
      </div>
    </div>
  );
}

export default function Tickets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState([
    { type: '장애접수', id: 'TKT-00142', title: 'H100 인스턴스 접속 불가 현상', comments: 0, status: '대기 중', user: '김사원 (LG전자)', date: '2026-03-19 14:22:01', statusColor: 'bg-[#FFFBEB] text-[#D97706]' },
    { type: '기술지원', id: 'TKT-00141', title: 'PyTorch 노드 환경 설정 문의', comments: 3, status: '처리 중', user: '이대리 (Upstage)', date: '2026-03-19 10:15:44', statusColor: 'bg-primary-50 text-primary-600' },
    { type: '일반안내', id: 'TKT-00139', title: '월간 크레딧 청구서 재발급 요청', comments: 1, status: '완료', user: '최과장 (Kakao)', date: '2026-03-18 16:40:22', statusColor: 'bg-[#ECFDF5] text-[#059669]' },
    { type: '일반안내', id: 'TKT-00138', title: '서브테넌트 추가 권한 문의', comments: 5, status: '완료', user: '신팀장 (Naver)', date: '2026-03-17 11:30:10', statusColor: 'bg-[#ECFDF5] text-[#059669]' },
  ]);

  const handleCreateTicket = (newTicket: any) => {
    setTickets([newTicket, ...tickets]);
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleCreateTicket} />

      {selectedTicket ? (
        <div className="bg-white border border-gray-200 rounded-[10px] p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex-1 overflow-y-auto">
          <button onClick={() => setSelectedTicket(null)} className="mb-6 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 outline-none">
            &larr; 목록으로 돌아가기
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-[6px] text-[12px] font-bold bg-gray-100 text-gray-600`}>{selectedTicket.type}</span>
              <h2 className="text-[24px] font-extrabold text-gray-900">{selectedTicket.title}</h2>
            </div>
            <span className={`px-3 py-1.5 rounded-[6px] text-[13px] font-bold ${selectedTicket.statusColor}`}>{selectedTicket.status}</span>
          </div>
          
          <div className="flex items-center gap-4 text-[13px] text-gray-500 font-medium pb-6 border-b border-gray-200 mb-6">
            <span>티켓 ID: <span className="font-mono text-gray-900 font-bold">{selectedTicket.id}</span></span>
            <div className="w-[1px] h-[12px] bg-gray-300"></div>
            <span>작성자: <span className="text-gray-900">{selectedTicket.user}</span></span>
            <div className="w-[1px] h-[12px] bg-gray-300"></div>
            <span>등록 일시: <span className="font-mono">{selectedTicket.date}</span></span>
          </div>
          
          <div className="min-h-[250px] text-[14px] text-gray-800 bg-[#FAFAFA] p-6 rounded-[8px] border border-gray-100 mb-8 whitespace-pre-wrap">
            상세 내용을 입력해주세요
          </div>

          <div className="border-t border-gray-200 pt-8">
             <h3 className="text-[14px] font-bold text-gray-900 mb-4">댓글 ({selectedTicket.comments})</h3>
             <textarea placeholder="답변이나 관련된 메모를 입력하세요..." className="w-full border border-gray-200 rounded-[8px] p-4 text-[13px] text-gray-900 h-[100px] resize-none focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 mb-3"></textarea>
             <div className="flex justify-end"><button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm shadow-primary-500/20 outline-none">등록</button></div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border text-left border-gray-200 rounded-[10px] p-[16px_20px] flex justify-between items-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
              <div>
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">대기 중</h3>
                <p className="text-[12px] font-medium text-gray-400 mt-1">접수 후 미할당 티켓</p>
              </div>
              <div className="text-[32px] font-extrabold font-mono text-amber-500">8</div>
            </div>
            <div className="bg-white border text-left border-gray-200 rounded-[10px] p-[16px_20px] flex justify-between items-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
              <div>
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">처리 중</h3>
                <p className="text-[12px] font-medium text-gray-400 mt-1">담당자 할당 후 진행 중</p>
              </div>
              <div className="text-[32px] font-extrabold font-mono text-primary-600">3</div>
            </div>
            <div className="bg-white border text-left border-gray-200 rounded-[10px] p-[16px_20px] flex justify-between items-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
              <div>
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">완료</h3>
                <p className="text-[12px] font-medium text-gray-400 mt-1">최근 7일 기준 완료</p>
              </div>
              <div className="text-[32px] font-extrabold font-mono text-emerald-600">45</div>
            </div>
          </div>

          <div className="bg-white border text-left border-gray-200 rounded-[10px] p-4 flex items-center justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] font-semibold text-gray-900 border-r border-gray-200 pr-5">티켓 목록 <span className="text-gray-400 font-normal ml-2">Total {56 + (tickets.length - 4)}</span></div>
            <div className="flex-1 px-5 flex items-center gap-3">
              <select className="h-[34px] w-[140px] border border-gray-200 rounded-[7px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white">
                <option>전체 유형</option>
                <option>기술 지원</option>
                <option>장애 접수</option>
                <option>일반 문의</option>
              </select>
              <select className="h-[34px] w-[140px] border border-gray-200 rounded-[7px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white">
                <option>전체 상태</option>
                <option>대기 중</option>
                <option>처리 중</option>
                <option>완료</option>
              </select>
              <div className="flex items-center gap-2 border border-gray-200 rounded-[7px] px-3 h-[34px] bg-white w-[200px]">
                <Calendar size={14} className="text-gray-400" />
                <span className="text-[12px] font-mono text-gray-600">2026.03.12 - 2026.03.19</span>
              </div>
              <div className="relative">
                <input type="text" placeholder="제목 검색" className="w-[180px] h-[34px] border border-gray-200 rounded-[7px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white" />
                <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <button className="h-[34px] w-[34px] flex items-center justify-center border border-gray-200 rounded-[7px] text-gray-600 hover:bg-[#F9FAFB]">
                <RotateCcw size={14} />
              </button>
              <button className="h-[34px] w-[60px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center justify-center transition-colors">
                검색
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <button className="w-[34px] h-[34px] flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-[7px] hover:bg-[#F9FAFB] transition-colors">
                <Settings size={18} />
              </button>
              <button onClick={() => setIsModalOpen(true)} className="h-[34px] px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center gap-1.5 shadow-sm transition-colors outline-none">
                <Plus size={14} /> <span>티켓 등록</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full">
            <table className="w-full text-left border-collapse flex-1 inline-table">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-200">
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">유형</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">티켓 ID</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">제목</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">상태</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">작성자</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">등록 일시</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide w-10"></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 text-[13px] text-gray-800 hover:bg-gray-50/50 transition-colors h-[48px]">
                    <td className="px-[20px] font-bold text-gray-900">{row.type}</td>
                    <td className="px-[20px] font-mono text-gray-500 text-[12px]">{row.id}</td>
                    <td className="px-[20px] font-bold text-gray-900 hover:text-primary-600 cursor-pointer" onClick={() => setSelectedTicket(row)}>
                      {row.title}
                      {row.comments > 0 && <span className="ml-2 text-primary-500 text-[12px] font-bold">[{row.comments}]</span>}
                    </td>
                    <td className="px-[20px]">
                      <select className={`h-[28px] border-none text-[11px] font-bold rounded-[5px] pl-2 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 ${row.statusColor}`} defaultValue={row.status}>
                         <option value="대기 중" className="text-gray-900 bg-white">대기 중</option>
                         <option value="처리 중" className="text-gray-900 bg-white">처리 중</option>
                         <option value="완료" className="text-gray-900 bg-white">완료</option>
                      </select>
                    </td>
                    <td className="px-[20px] font-medium text-gray-600 border-none">{row.user}</td>
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
              <button className="w-[32px] h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold">2</button>
              <button className="w-[32px] h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold">&gt;</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
