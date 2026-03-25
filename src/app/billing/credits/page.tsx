'use client';

import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, CheckCircle2, AlertTriangle, Building2, Server, FileText } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';

import { tenants, creditHistory } from '@/lib/mockData';

let globalGen = 0;
let globalDed = 0;

const mockCreditData = {
  summary: { currentBalance: 0, monthlyGenerated: 0, monthlyDeducted: 0 },
  tenants: tenants.map(t => {
    let tenantCurrentBalance = 0;
    const mappedSubtenants = t.subtenants.map(s => {
      const history = creditHistory.filter(c => c.subtenantId === s.id).map(c => ({
        type: c.type,
        source: c.source,
        datetime: c.datetime,
        duration: c.duration,
        node: c.node,
        generated: c.generated,
        deducted: c.deducted,
      }));
      const subGen = history.reduce((acc, h) => acc + (h.generated || 0), 0);
      const subDed = history.reduce((acc, h) => acc + (h.deducted || 0), 0);
      const subBalance = subGen + subDed; // deducted is negative
      
      tenantCurrentBalance += subBalance;
      globalGen += subGen;
      globalDed += subDed;

      return {
        name: s.name,
        currentBalance: subBalance,
        history
      };
    });

    return {
      name: t.name,
      currentBalance: tenantCurrentBalance,
      subtenants: mappedSubtenants,
    };
  })
};

mockCreditData.summary.currentBalance = globalGen + globalDed;
mockCreditData.summary.monthlyGenerated = globalGen; // assuming all mock data is this month
mockCreditData.summary.monthlyDeducted = globalDed;

export default function Credits() {
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);
  const activeTenantName = mockCreditData.tenants[activeTenantIdx]?.name || 'LG그룹';

  return (
    <div className="flex h-[calc(100vh-112px)] min-h-0 gap-6 text-gray-900">
      <CompanyListPanel
        companies={mockCreditData.tenants.map(t => ({ id: t.name, name: t.name, subCount: t.subtenants.length }))}
        activeIndex={activeTenantIdx}
        onCompanyClick={setActiveTenantIdx}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-none flex flex-col gap-5 mb-5 shrink-0">
      {/* 2. KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* KPI 1: 현재 크레딧 잔액 */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">현재 크레딧 잔액</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-bold tracking-tight ${mockCreditData.summary.currentBalance > 0 ? 'text-emerald-600' : mockCreditData.summary.currentBalance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {mockCreditData.summary.currentBalance > 0 ? '+₩ ' : mockCreditData.summary.currentBalance < 0 ? '-₩ ' : '₩ '}
              {Math.abs(mockCreditData.summary.currentBalance).toLocaleString()}
            </span>
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-400">누적 발생액 + 누적 차감액</div>
        </div>

        {/* KPI 2: 이번 달 발생액 */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">이번 달 발생액</div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 mt-1">
            +₩ {mockCreditData.summary.monthlyGenerated.toLocaleString()}
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
              <AlertTriangle size={12} className="text-red-500"/>장애 발생
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
              <CheckCircle2 size={12} className="text-amber-500"/>PM 발생
            </span>
          </div>
        </div>

        {/* KPI 3: 이번 달 차감액 */}
        <div className="bg-white border border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">이번 달 차감액</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold tracking-tight text-red-600">-₩ {Math.abs(mockCreditData.summary.monthlyDeducted).toLocaleString()}</span>
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
              <FileText size={12} className="text-blue-500"/>빌링 차감
            </span>
          </div>
        </div>
      </div>

      {/* 4. Filters */}
      <div className="bg-white border border-gray-200 rounded-[10px] px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex gap-1 pl-1">
          <span className="text-[14px] font-bold text-gray-900">크레딧 필터 및 조회</span>
        </div>
        <div className="flex items-center gap-2 pr-1">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <Calendar size={14} className="text-gray-500" />
            <select className="bg-transparent text-[13px] font-medium text-gray-700 outline-none w-[110px] cursor-pointer">
               <option>전체 (누적)</option>
               <option>이번 달 (3월)</option>
               <option>지난 달 (2월)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <select className="bg-transparent text-[13px] font-medium text-gray-700 outline-none w-[110px] cursor-pointer">
               <option>전체 구분</option>
               <option>장애</option>
               <option>PM</option>
               <option>빌링 차감</option>
            </select>
          </div>
        </div>
      </div>
      </div>

      {/* 6. Table */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-gray-200">
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Subtenant</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider min-w-[70px] whitespace-nowrap">구분</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">출처</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">일시</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">소요 시간</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">노드</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">발생액</th>
                <th className="px-6 py-[14px] text-[12px] font-bold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">차감액</th>
              </tr>
            </thead>
            <tbody>
              {mockCreditData.tenants.filter(t => t.name === activeTenantName).map((tenant) => (
                <React.Fragment key={tenant.name}>
                  {tenant.subtenants.map(subtenant => (
                    <React.Fragment key={subtenant.name}>
                      {/* Subtenant Group Header 행 */}
                      <tr className="bg-[#FAFAFA] border-b border-gray-100">
                         <td colSpan={8} className="px-6 py-3 border-l-4 border-l-transparent">
                           <div className="ml-4 flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                              <Building2 size={14} className="text-gray-400"/>
                              {subtenant.name}
                              <span className="text-gray-300 mx-1">|</span>
                              <span className="text-gray-500 font-medium">{subtenant.history.length}건</span>
                              <span className="text-gray-300 mx-1">|</span>
                              <span className="text-gray-600 font-medium mr-1">잔액:</span>
                              <span className={`font-mono font-medium ${subtenant.currentBalance > 0 ? 'text-emerald-500' : subtenant.currentBalance < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                {subtenant.currentBalance > 0 ? '+₩ ' : subtenant.currentBalance < 0 ? '-₩ ' : '₩ '}
                                {Math.abs(subtenant.currentBalance).toLocaleString()}
                              </span>
                           </div>
                         </td>
                      </tr>

                      {/* History Data Rows */}
                      {subtenant.history.map((record, idx) => (
                        <tr key={idx} className="border-b border-gray-100 text-[13px] text-gray-800 hover:bg-gray-50/50 transition-colors group">
                           <td className="px-6 py-[14px]">
                              <div className="ml-10">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-white text-gray-700 text-[12px] font-semibold border border-gray-200 shadow-sm group-hover:border-gray-300 transition-colors">
                                  {subtenant.name}
                                </span>
                              </div>
                           </td>
                           <td className="px-6 py-[14px] whitespace-nowrap">
                              <span className={`inline-flex items-center justify-center whitespace-nowrap px-2 py-0.5 rounded-[5px] text-[11px] font-bold border 
                                ${record.type === '장애' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] min-w-[40px]' : 
                                  record.type === 'PM' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] min-w-[52px]' : 
                                  'bg-blue-50 text-blue-600 border-blue-200 min-w-[58px]'}`}>
                                {record.type}
                              </span>
                           </td>
                           <td className="px-6 py-[14px] text-gray-700 font-medium whitespace-nowrap">{record.source}</td>
                           <td className="px-6 py-[14px] font-mono text-gray-500 text-[12px] whitespace-nowrap">{record.datetime}</td>
                           <td className="px-6 py-[14px] text-gray-400 font-medium whitespace-nowrap">{record.duration || '—'}</td>
                           <td className="px-6 py-[14px] whitespace-nowrap">
                             {record.node ? (
                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F8FAFC] text-gray-600 border border-gray-200 text-[12px] font-medium whitespace-nowrap">
                                 <Server size={12} className="text-gray-400"/>
                                 {record.node}
                               </span>
                             ) : <span className="text-gray-300 ml-4">—</span>}
                           </td>
                           <td className="px-6 py-[14px] font-mono font-semibold text-emerald-600 text-[13px] text-right whitespace-nowrap">
                             {record.generated ? `+₩ ${record.generated.toLocaleString()}` : <span className="text-gray-300">—</span>}
                           </td>
                           <td className="px-6 py-[14px] font-mono font-semibold text-red-600 text-[13px] text-right whitespace-nowrap">
                             {record.deducted ? `-₩ ${Math.abs(record.deducted).toLocaleString()}` : <span className="text-gray-300">—</span>}
                           </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Tenant Total Row */}
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={8} className="px-6 py-[18px]">
                      <div className="flex items-center justify-end gap-6 text-[14px] font-bold">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">누적 발생액:</span>
                          <span className="font-mono text-emerald-600">+₩ {tenant.subtenants.reduce((acc, sub) => acc + sub.history.reduce((a, h) => a + (h.generated || 0), 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">누적 차감액:</span>
                          <span className="font-mono text-red-600">-₩ {Math.abs(tenant.subtenants.reduce((acc, sub) => acc + sub.history.reduce((a, h) => a + (h.deducted || 0), 0), 0)).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-gray-300 pl-6">
                          <span className="text-gray-900">최종 잔액:</span>
                          <span className={`font-mono text-[16px] font-bold ${tenant.currentBalance > 0 ? 'text-emerald-600' : tenant.currentBalance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {tenant.currentBalance > 0 ? '+₩ ' : tenant.currentBalance < 0 ? '-₩ ' : '₩ '}
                            {Math.abs(tenant.currentBalance).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </div>
    </div>
  );
}
