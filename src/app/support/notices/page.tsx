'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Pencil, Settings, MoreVertical, X, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Paperclip, UploadCloud } from 'lucide-react';

function CreateNoticeModal({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (data: any) => void }) {
  const [type, setType] = useState('일반');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const isFormValid = type && title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const typeColorMap: Record<string, string> = {
      '점검': 'bg-[#FFFBEB] text-[#D97706]',
      '업데이트': 'bg-primary-50 text-primary-600',
      '일반': 'bg-[#F3F4F6] text-gray-600',
    };

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}.${pad(now.getMonth()+1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    onConfirm({
      type,
      typeColor: typeColorMap[type] || typeColorMap['일반'],
      title,
      author: '플랫폼 관리자',
      date: dateStr,
    });
    
    setType('일반');
    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-[12px] p-8 w-full max-w-[700px] shadow-2xl relative max-h-[90vh] flex flex-col">
        <h2 className="text-[20px] font-bold text-gray-900 mb-6 shrink-0">공지사항 작성</h2>
        
        <div className="flex flex-col gap-5 overflow-y-auto pr-2 pb-2">
           <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-1.5">유형 <span className="text-red-500">*</span></label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-gray-200 rounded-[8px] p-3 text-[13px] text-gray-900 font-medium focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white cursor-pointer">
                 <option value="일반">일반</option>
                 <option value="점검">점검</option>
                 <option value="업데이트">업데이트</option>
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
              <div className="border border-gray-200 rounded-[8px] overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                <div className="flex items-center gap-1.5 bg-[#FAFAFA] px-3 py-2 border-b border-gray-200">
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Bold size={14}/></button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Italic size={14}/></button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Underline size={14}/></button>
                  <div className="w-[1px] h-[14px] bg-gray-300 mx-1"></div>
                  <button className="p-1 text-[12px] font-bold hover:bg-gray-200 rounded text-gray-600">H1</button>
                  <button className="p-1 text-[12px] font-bold hover:bg-gray-200 rounded text-gray-600">H2</button>
                  <button className="p-1 text-[12px] font-bold hover:bg-gray-200 rounded text-gray-600">H3</button>
                  <div className="w-[1px] h-[14px] bg-gray-300 mx-1"></div>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><AlignLeft size={14}/></button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><AlignCenter size={14}/></button>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><AlignRight size={14}/></button>
                  <div className="w-[1px] h-[14px] bg-gray-300 mx-1"></div>
                  <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><List size={14}/></button>
                </div>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="공지 내용을 입력하세요" className="w-full p-4 h-[200px] bg-white text-[13px] text-gray-800 focus:outline-none resize-none" />
              </div>
           </div>

           <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className="block text-[13px] font-bold text-gray-700">파일 첨부 <span className="text-gray-400 font-normal">(선택)</span></label>
                <span className="text-[11px] font-medium text-gray-400">최대 5장, 10MB 이하</span>
              </div>
              <div className="border border-dashed border-gray-300 bg-gray-50 rounded-[8px] flex flex-col items-center justify-center p-6 hover:bg-gray-100 cursor-pointer transition-colors">
                <UploadCloud size={24} className="text-gray-400 mb-2"/>
                <span className="text-[12px] font-bold text-gray-600">클릭하거나 파일을 이곳에 드래그하세요</span>
                <span className="text-[11px] text-gray-400 mt-1">png, jpg, pdf, txt, csv, xlsx, pptx 형식 지원</span>
              </div>
           </div>
        </div>

        <div className="mt-8 flex justify-end gap-2.5 shrink-0">
           <button onClick={onClose} className="px-5 py-2.5 rounded-[8px] text-[13px] font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors outline-none">취소</button>
           <button onClick={handleSubmit} disabled={!isFormValid} className={`px-6 py-2.5 rounded-[8px] text-[13px] font-bold transition-all outline-none ${isFormValid ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-500/20' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default function Notices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [notices, setNotices] = useState([
    { type: '점검', typeColor: 'bg-[#FFFBEB] text-[#D97706]', title: '[공지] GPU 클러스터 A구역 정기 점검 안내 (03/25)', author: '박태민 관리자', date: '2026.03.18 10:00:00' },
    { type: '업데이트', typeColor: 'bg-primary-50 text-primary-600', title: '운영 포털 3.0 신규 기능 업데이트 배포 완료', author: '시스템', date: '2026.03.15 00:00:00' },
    { type: '일반', typeColor: 'bg-[#F3F4F6] text-gray-600', title: '청구서 발행 및 결제 방식 변경 사전 안내', author: '김솔솔 관리자', date: '2026.03.10 16:30:22' },
    { type: '점검', typeColor: 'bg-[#FFFBEB] text-[#D97706]', title: '[공지] 내부 네트워크 스위치 교체에 따른 순단 안내 (종료)', author: '최윤진 관리자', date: '2026.03.01 09:00:00' },
  ]);

  const handleCreateNotice = (newNotice: any) => {
    setNotices([newNotice, ...notices]);
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <CreateNoticeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleCreateNotice} />

      {selectedNotice ? (
        <div className="bg-white border border-gray-200 rounded-[10px] p-8 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex-1 overflow-y-auto">
          <button onClick={() => setSelectedNotice(null)} className="mb-6 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 outline-none">
            &larr; 목록으로 돌아가기
          </button>
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-2.5 py-1 rounded-[6px] text-[12px] font-bold ${selectedNotice.typeColor}`}>{selectedNotice.type}</span>
            <h2 className="text-[24px] font-extrabold text-gray-900">{selectedNotice.title}</h2>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-gray-500 font-medium pb-6 border-b border-gray-200 mb-6">
            <span>등록 일시: <span className="font-mono">{selectedNotice.date}</span></span>
            <div className="w-[1px] h-[12px] bg-gray-300"></div>
            <span>작성자: {selectedNotice.author}</span>
          </div>
          <div className="min-h-[300px] text-[14px] text-gray-800 bg-[#FAFAFA] p-6 rounded-[8px] border border-gray-100 whitespace-pre-wrap">
            상세 내용을 입력해주세요
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border text-left border-gray-200 rounded-[10px] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] gap-4 md:gap-0">
            <div className="text-[14px] font-semibold text-gray-900 md:border-r md:border-gray-200 pr-0 md:pr-5 border-b md:border-b-0 pb-3 md:pb-0">공지사항 <span className="text-gray-400 font-normal ml-2">Total {42 + (notices.length - 4)}</span></div>
            <div className="flex-1 px-0 md:px-5 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
              <select className="h-[38px] md:h-[34px] flex-1 md:flex-none md:w-[140px] border border-gray-200 rounded-[7px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white cursor-pointer">
                <option>전체 유형</option>
                <option>일반</option>
                <option>점검</option>
                <option>업데이트</option>
              </select>
              <div className="relative flex-1 md:flex-none">
                <input type="text" placeholder="제목 검색" className="w-full md:w-[200px] h-[38px] md:h-[34px] border border-gray-200 rounded-[7px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white" />
                <Search size={14} className="absolute left-3 top-2.5 md:top-2.5 text-gray-400" />
              </div>
              <button className="h-[38px] md:h-[34px] w-[38px] md:w-[34px] flex items-center justify-center border border-gray-200 rounded-[7px] text-gray-600 hover:bg-[#F9FAFB]">
                <RotateCcw size={14} />
              </button>
              <button className="h-[38px] md:h-[34px] flex-1 md:flex-none md:w-[80px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center justify-center transition-colors">
                검색
              </button>
            </div>
            <div className="flex gap-2 items-center justify-end border-t md:border-t-0 pt-3 md:pt-0">
              <button className="w-[34px] h-[34px] hidden md:flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-[7px] hover:bg-[#F9FAFB] transition-colors">
                <Settings size={18} />
              </button>
              <button onClick={() => setIsModalOpen(true)} className="h-[38px] md:h-[34px] px-6 md:px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center gap-1.5 shadow-sm transition-colors outline-none">
                <Pencil size={14} /> <span>작성</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-[10px] overflow-hidden flex flex-col shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] h-full">
            <table className="w-full text-left border-collapse flex-1 inline-table">
              <thead className="hidden md:table-header-group">
                <tr className="bg-[#FAFAFA] border-b border-gray-200">
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">유형</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">제목</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">작성자</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide">등록 일시</th>
                  <th className="px-[20px] py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wide w-10"></th>
                </tr>
              </thead>
              <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
                {notices.map((row, i) => (
                  <tr key={i} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none transition-colors group relative">
                    <td className="px-0 py-1 md:px-[20px]">
                      <span className={`px-2 py-0.5 rounded-[4px] text-[10px] md:text-[11px] font-bold ${row.typeColor}`}>{row.type}</span>
                    </td>
                    <td className="px-0 py-1 md:px-[20px] font-bold text-gray-900 text-[16px] md:text-[13px] hover:text-primary-600 cursor-pointer mb-4 md:mb-0" onClick={() => setSelectedNotice(row)}>{row.title}</td>
                    <td className="px-0 py-1 md:px-[20px] font-medium text-gray-500 md:text-gray-600 text-[12px] md:text-[13px] border-t border-gray-50 pt-3 md:border-0 md:pt-0 mt-2 md:mt-0 flex md:table-cell justify-between items-center">
                       <div className="flex items-center gap-2">
                         <span className="md:hidden text-[10px] text-gray-400 font-normal">작성자</span>
                         {row.author}
                       </div>
                       <div className="md:hidden font-mono text-[11px] text-gray-400">{row.date}</div>
                    </td>
                    <td className="hidden md:table-cell px-[20px] font-mono text-[12px] text-gray-500">{row.date}</td>
                    <td className="absolute top-5 right-5 md:static px-0 md:px-[20px] text-gray-400 hover:text-gray-900 cursor-pointer"><MoreVertical size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination mock */}
            <div className="h-[70px] md:h-[60px] border-t border-gray-100 flex justify-center items-center gap-1.5 bg-[#FAFAFA] shrink-0">
              <button className="w-[36px] md:w-[32px] h-[36px] md:h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-400 font-bold hover:bg-gray-50">&lt;</button>
              <button className="w-[36px] md:w-[32px] h-[36px] md:h-[32px] rounded-[6px] border border-primary-500 bg-primary-500 text-white font-bold shadow-sm">1</button>
              <button className="w-[36px] md:w-[32px] h-[36px] md:h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold">2</button>
              <button className="w-[36px] md:w-[32px] h-[36px] md:h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold">3</button>
              <button className="w-[36px] md:w-[32px] h-[36px] md:h-[32px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-bold">&gt;</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
