'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

export default function WithdrawnList() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-white border text-left border-gray-200 rounded-[10px] p-4 flex items-center justify-between">
        <div className="text-[14px] font-semibold text-gray-900 border-r border-gray-200 pr-5">탈퇴 이력 <span className="text-gray-400 font-normal ml-2">Total 128</span></div>
        <div className="flex-1 px-5 flex items-center gap-3">
          <select className="h-[34px] w-[160px] border border-gray-200 rounded-[7px] text-[13px] px-3 focus:outline-none focus:border-primary-500 bg-white">
            <option>전체 회사</option>
            <option>LG전자</option>
          </select>
          <div className="relative">
            <input type="text" placeholder="이름 검색" className="w-[200px] h-[34px] border border-gray-200 rounded-[7px] text-[13px] px-3 pl-8 focus:outline-none focus:border-primary-500 bg-white" />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="h-[34px] w-[34px] flex items-center justify-center border border-gray-200 rounded-[7px] text-gray-600 hover:bg-[#F9FAFB]">
            <RotateCcw size={14} />
          </button>
          <button className="h-[34px] w-[80px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[13px] rounded-[7px] flex items-center justify-center">
            검색
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] overflow-x-auto flex flex-col">
        <table className="w-full text-left border-collapse flex-1 inline-table">
          <thead>
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">이름</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">이메일</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">소속 회사</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">탈퇴 일시</th>
              <th className="px-[14px] py-[10px] text-[11px] font-semibold text-gray-400 uppercase tracking-wide">탈퇴 사유</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: '오현규', email: 'hyunkyu.oh@lge.com', company: 'LG전자', date: '2026.03.18 14:02:11', reason: '퇴사로 인한 계정 삭제 요청' },
              { name: '장수연', email: 'sooyeon.jang@kakao.com', company: 'Kakao', date: '2026.03.14 09:21:40', reason: '프로젝트 종료 및 인력 교체' },
              { name: '이민수', email: 'mslee@upstage.ai', company: 'Upstage', date: '2026.03.10 11:45:00', reason: '개인정보 처리방침 변경 거부' },
              { name: '김정훈', email: 'jhkim123@naver.com', company: 'Naver', date: '2026.03.01 16:55:22', reason: '장기 미접속(1년 이상) 자동 탈퇴 처리' },
            ].map((row, i) => (
              <tr key={i} className="border-b border-[#F3F4F6] text-[13px] text-gray-900 hover:bg-[#F9FAFB]">
                <td className="px-[14px] py-[12px] font-semibold">{row.name}</td>
                <td className="px-[14px] py-[12px]">{row.email}</td>
                <td className="px-[14px] py-[12px]">{row.company}</td>
                <td className="px-[14px] py-[12px] font-mono text-[12px] text-gray-400">{row.date}</td>
                <td className="px-[14px] py-[12px] text-gray-600">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination mock */}
        <div className="h-[60px] border-t border-gray-100 flex justify-center items-center gap-1 bg-[#FAFAFA] shrink-0">
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-400">&lt;</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-primary-500 bg-primary-500 text-white font-semibold">1</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">2</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">3</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">4</button>
          <button className="w-[30px] h-[30px] rounded-[6px] border border-gray-200 bg-white text-gray-600 hover:bg-[#F9FAFB]">&gt;</button>
        </div>
      </div>
    </div>
  );
}
