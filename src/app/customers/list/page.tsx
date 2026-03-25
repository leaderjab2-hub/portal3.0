'use client';

import React, { useState } from 'react';
import { Search, MoreVertical, Building2, Users, SearchIcon, Plus, UserPlus, Info, ExternalLink, ShieldAlert, Cpu, HardDrive } from 'lucide-react';
import Link from 'next/link';

import { tenants, users } from '@/lib/mockData';

const mockCustomers = {
  tenants: tenants.map(t => ({
    id: t.id,
    name: t.name,
    subtenants: t.subtenants,
    members: users.filter(u => u.tenantId === t.id && u.subtenantId !== null).map(u => ({
      ...u,
      subtenant: t.subtenants.find(s => s.id === u.subtenantId)?.name
    }))
  })),
  unassigned: users.filter(u => u.subtenantId === null).map(u => ({
    ...u,
    subtenant: null
  }))
};

function InviteModal({ isOpen, onClose, subtenants }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-[500px] rounded-[14px] shadow-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-gray-900 flex items-center gap-2"><UserPlus size={18} className="text-primary-600"/>구성원 초대</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">&times;</button>
        </div>
        <div className="p-6 flex flex-col gap-5">
           <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">소속 Subtenant <span className="text-red-500">*</span></label>
              <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary-500">
                <option value="">발령할 프로젝트 선택</option>
                {subtenants.map((s:any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
           </div>
           <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">이메일 주소 <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                 <input type="email" placeholder="example@company.com" className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary-500" />
                 <button className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition">초대 목록 추가</button>
              </div>
           </div>
           <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">초대할 역할 <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                 <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"><input type="radio" name="role" value="멤버" defaultChecked className="text-primary-600"/> 멤버 (일반)</label>
                 <label className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer"><input type="radio" name="role" value="PM" className="text-primary-600"/> PM (매니저)</label>
              </div>
           </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-5 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 bg-white hover:bg-gray-50">취소</button>
          <button onClick={onClose} className="px-6 py-2 bg-primary-600 rounded-lg text-sm font-bold text-white shadow hover:bg-primary-700">초대 이메일 발송</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLookupPage() {
  const [activeSelection, setActiveSelection] = useState<string>('tenant-lge');
  const [rightTab, setRightTab] = useState<'subtenant' | 'member'>('subtenant');
  const [isInviteModal, setIsInviteModal] = useState(false);
  const [subtenantFilter, setSubtenantFilter] = useState('');

  const isUnassigned = activeSelection === 'unassigned';
  const tenant = isUnassigned ? null : mockCustomers.tenants.find(t => t.id === activeSelection);
  
  // If Unassigned is clicked, lock tab to 'member'
  const currentTab = isUnassigned ? 'member' : rightTab;
  const displayMembers = isUnassigned ? mockCustomers.unassigned : 
    (tenant ? tenant.members.filter(m => !subtenantFilter || m.subtenant === subtenantFilter) : []);

  const handleSelectTenant = (id: string) => {
    setActiveSelection(id);
    setRightTab('subtenant');
    setSubtenantFilter('');
  };

  const handleDeleteMember = (member: any) => {
    if (member.isContractor) alert('계약자(Tenant 대표)는 삭제할 수 없습니다. 계약 관리를 확인해주세요.');
    else {
      if(confirm(`${member.name} 님을 구성원에서 삭제하시겠습니까?`)) {
        // Mock deletion action
      }
    }
  }

  return (
    <div className="flex gap-6 h-full text-gray-900 pb-8">
      <InviteModal isOpen={isInviteModal} onClose={() => setIsInviteModal(false)} subtenants={tenant?.subtenants || []} />

      {/* 좌측 패널 — 회사 (Tenant) 목록 */}
      <div className="w-[300px] bg-white border border-gray-200 rounded-[14px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden shrink-0">
         <div className="p-5 border-b border-gray-100 flex flex-col gap-4">
            <h2 className="text-[16px] font-bold text-gray-900 flex items-center justify-between">
              Tenant 목록
              <span className="text-gray-500 bg-gray-100 text-[11px] font-bold px-2 py-0.5 rounded-md">Total {mockCustomers.tenants.length}</span>
            </h2>
            <div className="relative">
              <input type="text" placeholder="회사 명 검색" className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-500 bg-gray-50 transition-colors" />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto flex flex-col">
            {mockCustomers.tenants.map(t => (
              <div 
                key={t.id} 
                onClick={() => handleSelectTenant(t.id)}
                className={`p-4 border-b border-gray-50 cursor-pointer flex justify-between items-center transition-all ${
                  activeSelection === t.id 
                  ? 'bg-primary-50/50 border-l-4 border-l-primary-500' 
                  : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                 <div className="flex flex-col gap-1">
                   <span className={`font-bold text-[14px] ${activeSelection === t.id ? 'text-primary-700' : 'text-gray-800'}`}>{t.name}</span>
                   <span className="text-[11px] font-semibold text-gray-400">구성원 {t.members.length}명</span>
                 </div>
              </div>
            ))}
         </div>
         <div 
            onClick={() => setActiveSelection('unassigned')}
            className={`p-4 border-t border-gray-200 cursor-pointer flex justify-between items-center transition-all ${
              isUnassigned ? 'bg-gray-800 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
            }`}
          >
             <div className="flex items-center gap-2 font-bold text-[14px]">
               <ShieldAlert size={16} className={isUnassigned ? 'text-amber-400' : 'text-gray-400'}/>
               소속 없음 미분류
             </div>
             <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${isUnassigned ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-500'}`}>{mockCustomers.unassigned.length}명</span>
         </div>
         {/* 계약 관리 이동 유도 배너 */}
         <div className="p-4 bg-blue-50/50 border-t border-blue-100">
            <div className="flex items-start gap-2">
               <Info size={16} className="text-blue-500 shrink-0 mt-0.5"/>
               <div className="text-[12px] text-blue-800 font-medium leading-relaxed">
                 Tenant 및 Subtenant(프로젝트) 신규 생성과 계약 정보 변경은 <Link href="/customers/contracts" className="font-bold underline underline-offset-2 hover:text-blue-600 inline-flex items-center gap-0.5">계약 관리 메뉴<ExternalLink size={10}/></Link>에서 진행해주세요.
               </div>
            </div>
         </div>
      </div>

      {/* 우측 패널 — 상세 */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[14px] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
         <div className="pt-6 px-6 border-b border-gray-200 bg-gray-50/30">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Building2 className="text-primary-500" size={28}/> 
              {isUnassigned ? '소속 없음 미분류 명단' : tenant?.name}
            </h1>
            <div className="flex gap-6">
              {!isUnassigned && (
                <button 
                  onClick={() => setRightTab('subtenant')}
                  className={`pb-3 border-b-2 font-bold text-[14px] px-1 transition-colors ${rightTab === 'subtenant' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  Subtenant (프로젝트) 관리
                </button>
              )}
              <button 
                onClick={() => !isUnassigned && setRightTab('member')}
                className={`pb-3 border-b-2 font-bold text-[14px] px-1 transition-colors ${currentTab === 'member' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                구성원 조회 및 관리
              </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {/* Subtenant 탭 렌더링 */}
            {!isUnassigned && rightTab === 'subtenant' && (
              <div className="p-6">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-[#FAFAFA] border-y border-gray-200">
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500">Subtenant 명</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500">상태</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500">프로젝트 ID</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500">포함 상품</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500">사용 기간</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 text-center">구성원 수</th>
                       <th className="px-5 py-3 text-[12px] font-extrabold text-gray-500 text-right">관리</th>
                     </tr>
                   </thead>
                   <tbody>
                     {tenant?.subtenants.length === 0 ? (
                       <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">등록된 Subtenant가 없습니다.</td></tr>
                     ) : (
                       tenant?.subtenants.map(sub => (
                         <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 font-bold text-gray-800 text-[14px]">{sub.name}</td>
                            <td className="px-5 py-4">
                               <span className={`px-2 py-0.5 text-[11px] font-bold rounded border 
                                 ${sub.status === '활성' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                 {sub.status}
                               </span>
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-gray-500 font-semibold">{sub.id}</td>
                            <td className="px-5 py-4 text-[12px] font-medium text-gray-600 flex items-center gap-1.5 pt-4.5">
                               {sub.products.includes('GPU 인프라') && <span className="bg-[#F8FAFC] border border-gray-200 p-1 rounded"><Cpu size={12} className="text-primary-500"/></span>}
                               {sub.products.includes('AI 스토리지') && <span className="bg-[#F8FAFC] border border-gray-200 p-1 rounded"><HardDrive size={12} className="text-amber-500"/></span>}
                               {sub.products.join(', ')}
                            </td>
                            <td className="px-5 py-4 text-[12px] font-medium text-gray-500">{sub.startDate}<br/>~ {sub.endDate}</td>
                            <td className="px-5 py-4 text-center font-bold text-gray-800">{sub.memberCount}명</td>
                            <td className="px-5 py-4 text-right">
                               <button 
                                 onClick={() => { setRightTab('member'); setSubtenantFilter(sub.name); }}
                                 className="text-[11px] font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-md transition-colors"
                               >
                                 구성원 이동
                               </button>
                            </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
              </div>
            )}

            {/* 구성원 탭 렌더링 */}
            {currentTab === 'member' && (
              <div className="p-6 flex flex-col h-full gap-5">
                 <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                       {!isUnassigned && (
                         <div className="relative">
                           <select 
                             value={subtenantFilter} 
                             onChange={e => setSubtenantFilter(e.target.value)}
                             className="w-[180px] border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-[13px] font-medium text-gray-700 bg-white appearance-none focus:outline-none focus:border-primary-500"
                           >
                              <option value="">전체 Subtenant</option>
                              {tenant?.subtenants.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                           </select>
                         </div>
                       )}
                       <div className="relative">
                         <input type="text" placeholder="이름/이메일 검색" className="w-[200px] border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-[13px] focus:outline-none focus:border-primary-500" />
                         <SearchIcon size={14} className="absolute left-3 top-2.5 text-gray-400" />
                       </div>
                    </div>
                    {!isUnassigned && (
                      <button onClick={() => setIsInviteModal(true)} className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm transition-colors cursor-pointer">
                        <UserPlus size={16}/> 구성원 초대 (생성)
                      </button>
                    )}
                 </div>

                 <div className="border border-gray-200 rounded-xl overflow-hidden flex-1">
                    <table className="w-full text-left">
                       <thead>
                         <tr className="bg-[#FAFAFA] border-b border-gray-200">
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500">이름</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500">이메일</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500">소속 Subtenant</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500">역할 권한</th>
                            <th className="px-5 py-3.5 text-[12px] font-extrabold text-gray-500">최근 접속일</th>
                            <th className="w-[60px]"></th>
                         </tr>
                       </thead>
                       <tbody>
                          {displayMembers.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">해당 조건의 구성원이 없습니다.</td></tr>
                          ) : (
                            displayMembers.map(m => (
                              <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                                 <td className="px-5 py-4">
                                   <div className="flex items-center gap-2">
                                     <span className="font-bold text-gray-900 text-[14px]">{m.name}</span>
                                     {m.isContractor && <span className="bg-primary-100 text-primary-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-primary-200">계약 대표자</span>}
                                   </div>
                                 </td>
                                 <td className="px-5 py-4 font-mono text-[13px] text-gray-600">{m.email}</td>
                                 <td className="px-5 py-4 text-[13px] font-semibold text-gray-700">{m.subtenant || <span className="text-gray-400">—</span>}</td>
                                 <td className="px-5 py-4">
                                   <select 
                                     defaultValue={m.role} 
                                     disabled={m.isContractor}
                                     className={`text-[12px] font-bold px-2 py-1 rounded border outline-none cursor-pointer
                                       ${m.role === 'pm' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'}
                                       ${m.isContractor ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}`}
                                   >
                                      <option value="pm">PM (매니저)</option>
                                      <option value="member">멤버 (일반)</option>
                                   </select>
                                 </td>
                                 <td className="px-5 py-4 font-mono text-[12px] text-gray-500">{m.lastLogin}</td>
                                 <td className="px-4 py-4 mt-2 h-full flex items-center">
                                   <button 
                                     onClick={() => handleDeleteMember(m)}
                                     disabled={m.isContractor}
                                     className={`p-1.5 rounded transition-colors ${m.isContractor ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                     title={m.isContractor ? '계약자는 삭제 불가' : '삭제'}
                                   >
                                     <MoreVertical size={16}/>
                                   </button>
                                 </td>
                              </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
