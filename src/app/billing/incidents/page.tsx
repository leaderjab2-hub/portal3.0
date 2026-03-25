'use client';

import React, { useState } from 'react';
import { Calendar, AlertTriangle, Building2, Server, Plus, X, Settings } from 'lucide-react';
import CompanyListPanel from '@/components/CompanyListPanel';

import { tenants, incidents, gpuNodes } from '@/lib/mockData';

let gTotalIncidentCount = 0;
let gTotalPmCount = 0;
let gTotalCredit = 0;

const mockData = {
  summary: { totalCount: 0, incidentCount: 0, pmCount: 0, totalCredit: 0, newThisMonth: 0 },
  tenants: tenants.map(t => {
    let tenantTotalCredit = 0;

    const mappedSubtenants = t.subtenants.map(s => {
      const records = incidents.filter(inc => 
        inc.affectedSubtenants.some(aff => aff.subtenantId === s.id)
      ).map(inc => {
        const aff = inc.affectedSubtenants.find(a => a.subtenantId === s.id);
        const gpuCount = aff ? aff.gpuCount : 0;
        
        let subCredit: number | null = null;
        if (inc.creditAmount) {
          subCredit = Math.round(inc.creditAmount * (gpuCount / inc.affectedSubtenants.reduce((sum, a) => sum + a.gpuCount, 0)));
        }

        if (inc.type === '장애') gTotalIncidentCount++;
        else gTotalPmCount++;
        if (subCredit) {
          tenantTotalCredit += subCredit;
          gTotalCredit += subCredit;
        }

        return {
          type: inc.type,
          start: inc.startDatetime,
          end: inc.endDatetime,
          duration: inc.duration,
          node: inc.node,
          instance: inc.instance,
          companies: inc.affectedSubtenants.length > 1 ? `${s.name} 외 ${inc.affectedSubtenants.length - 1}` : s.name,
          gpu: gpuCount,
          credit: subCredit,
          user: inc.registeredBy
        };
      });

      return { name: s.name, records };
    });

    return {
      name: t.name,
      totalCredit: tenantTotalCredit,
      subtenants: mappedSubtenants
    };
  })
};

mockData.summary.totalCount = gTotalIncidentCount + gTotalPmCount;
mockData.summary.incidentCount = gTotalIncidentCount;
mockData.summary.pmCount = gTotalPmCount;
mockData.summary.totalCredit = gTotalCredit;
mockData.summary.newThisMonth = incidents.length;

function IncidentModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [startD, setStartD] = useState('');
  const [endD, setEndD] = useState('');
  const [nodeType, setNodeType] = useState('GPU');
  const [instanceId, setInstanceId] = useState('');

  let durationStr = '자동 계산 결과 표시';
  let isError = false;
  if (startD && endD) {
    const sTime = new Date(startD).getTime();
    const eTime = new Date(endD).getTime();
    if (eTime < sTime) {
      durationStr = '복구 시간이 발생 시간보다 이전입니다';
      isError = true;
    } else {
      const diffMs = eTime - sTime;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      durationStr = `${hours}h ${mins}m`;
    }
  }

  const allocatedInstances = gpuNodes.filter(n => n.tenantId);
  const selectedNode = allocatedInstances.find(n => n.name === instanceId);
  
  let mappedCompany = '';
  if (selectedNode?.subtenantId) {
    for (const t of tenants) {
      for (const s of t.subtenants) {
        if (s.id === selectedNode.subtenantId) {
          mappedCompany = s.name; // e.g. "LG전자"
        }
      }
    }
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><AlertTriangle className="text-red-500" size={20}/>장애 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <section>
            <h3 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-red-500 pl-2">장애 기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-500 mb-1">발생 시간 <span className="text-red-500">*</span></label><input type="datetime-local" value={startD} onChange={e => setStartD(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">복구 시간 <span className="text-red-500">*</span></label><input type="datetime-local" value={endD} onChange={e => setEndD(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm" /></div>
            </div>
            <div className="mt-3"><label className="block text-xs text-gray-500 mb-1">소요 시간</label><input type="text" readOnly value={durationStr} className={`w-full bg-gray-50 border rounded p-2 text-sm ${isError ? 'text-red-500 font-bold border-red-200 bg-red-50' : 'text-gray-500 border-gray-200'}`}/></div>
          </section>
          <section>
            <h3 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-red-500 pl-2">영향 범위</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs text-gray-500 mb-1">발생 노드 <span className="text-red-500">*</span></label>
                 <select value={nodeType} onChange={e => {setNodeType(e.target.value); setInstanceId('');}} className="w-full border border-gray-200 rounded p-2 text-sm">
                    <option value="GPU">GPU</option>
                    <option value="CPU">CPU</option>
                    <option value="Storage">Storage</option>
                    <option value="NW">NW</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs text-gray-500 mb-1">인스턴스 명</label>
                 <select value={instanceId} onChange={e => setInstanceId(e.target.value)} disabled={nodeType !== 'GPU'} className="w-full border border-gray-200 rounded p-2 text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400">
                    <option value="">{nodeType === 'GPU' ? '인스턴스 선택' : '해당 없음'}</option>
                    {nodeType === 'GPU' && allocatedInstances.map(n => (
                      <option key={n.name} value={n.name}>{n.name}</option>
                    ))}
                 </select>
              </div>
            </div>
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
               <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-700">고객사별 GPU 수량</span><button className="text-xs text-primary-600 font-semibold">+ 추가 고객사</button></div>
               <div className="flex gap-2 items-center">
                  <input type="text" readOnly value={mappedCompany ? `${mappedCompany} (자동매핑)` : '인스턴스를 선택해주세요'} className={`flex-1 border bg-white rounded p-1.5 text-xs font-semibold ${mappedCompany ? 'border-primary-200 text-primary-700 bg-primary-50' : 'border-gray-200 text-gray-400'}`}/>
                  <input type="number" placeholder="직접입력" className="w-20 border border-gray-200 rounded p-1.5 text-xs"/>
               </div>
            </div>
          </section>
          <section>
            <h3 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-red-500 pl-2">크레딧 산출</h3>
            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 flex justify-between items-center">
               <span className="text-sm text-emerald-800 font-medium">크레딧 산출액 (예상)</span>
               <span className="font-mono text-lg font-bold text-emerald-600">+₩ 14,500</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">* 고객에게 적립되는 크레딧 (예상)</p>
          </section>
          <section>
            <h3 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-red-500 pl-2">부가 정보</h3>
            <textarea placeholder="장애 복구 방법 기록" className="w-full border border-gray-200 rounded p-2 text-sm h-20 mb-3"></textarea>
            <textarea placeholder="메모 (선택)" className="w-full border border-gray-200 rounded p-2 text-sm h-16"></textarea>
          </section>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 outline-none">취소</button>
          <button className="px-5 py-2 rounded text-sm font-medium bg-red-600 hover:bg-red-700 text-white outline-none">등록</button>
        </div>
      </div>
    </div>
  );
}

function PMModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [pmType, setPmType] = useState('정기');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Settings className={pmType === '긴급' ? 'text-amber-500' : 'text-blue-500'} size={20}/>PM 등록</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <section>
            <h3 className={`text-sm font-bold text-gray-800 mb-3 border-l-4 ${pmType === '긴급' ? 'border-amber-500' : 'border-blue-500'} pl-2`}>PM 기본 정보</h3>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">PM 구분 <span className="text-red-500">*</span></label>
              <select value={pmType} onChange={e => setPmType(e.target.value)} className="w-full border border-gray-200 rounded p-2 text-sm font-semibold">
                <option value="정기">정기 PM</option>
                <option value="긴급">긴급 PM</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-gray-500 mb-1">PM 시작 <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full border border-gray-200 rounded p-2 text-sm" /></div>
              <div><label className="block text-xs text-gray-500 mb-1">PM 종료 <span className="text-red-500">*</span></label><input type="datetime-local" className="w-full border border-gray-200 rounded p-2 text-sm" /></div>
            </div>
          </section>
          
          <section>
            <h3 className={`text-sm font-bold text-gray-800 mb-3 border-l-4 ${pmType === '긴급' ? 'border-amber-500' : 'border-blue-500'} pl-2`}>영향 범위</h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div><label className="block text-xs text-gray-500 mb-1">대상 노드 <span className="text-red-500">*</span></label><select className="w-full border border-gray-200 rounded p-2 text-sm"><option>Storage</option><option>Network</option></select></div>
              <div><label className="block text-xs text-gray-500 mb-1">인스턴스 명</label><input type="text" placeholder="예: STOR-01" className="w-full border border-gray-200 rounded p-2 text-sm" /></div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3">
               <div className="flex justify-between items-center"><span className="text-xs font-bold text-gray-700">고객사별 GPU 수량</span><button className="text-xs text-primary-600 font-semibold">+ 추가 고객사</button></div>
               <div className="flex gap-2 items-center"><input type="text" readOnly value="전체 고객사" className="flex-1 border bg-white border-gray-200 rounded p-1.5 text-xs"/><input type="number" defaultValue={8} className="w-20 border border-gray-200 rounded p-1.5 text-xs"/></div>
            </div>
          </section>

          {pmType === '긴급' && (
            <section>
              <h3 className="text-sm font-bold text-gray-800 mb-3 border-l-4 border-amber-500 pl-2">크레딧 산출 (긴급 PM)</h3>
              <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 flex justify-between items-center">
                 <span className="text-sm text-emerald-800 font-medium">크레딧 산출액 (예상)</span>
                 <span className="font-mono text-lg font-bold text-emerald-600">+₩ 8,000</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-2">* 고객에게 적립되는 크레딧 (예상)</p>
            </section>
          )}

          <section>
            <h3 className={`text-sm font-bold text-gray-800 mb-3 border-l-4 ${pmType === '긴급' ? 'border-amber-500' : 'border-blue-500'} pl-2`}>작업 내용</h3>
            <textarea placeholder="PM 작업 내용 상세 기록" className="w-full border border-gray-200 rounded p-2 text-sm h-20 mb-3"></textarea>
            <textarea placeholder="메모 (선택)" className="w-full border border-gray-200 rounded p-2 text-sm h-16"></textarea>
          </section>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">취소</button>
          <button className={`px-5 py-2 rounded text-sm font-medium text-white ${pmType === '긴급' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>등록</button>
        </div>
      </div>
    </div>
  );
}

export default function IncidentRegistration() {
  const [activeTenantIdx, setActiveTenantIdx] = useState(0);
  const activeTenantName = mockData.tenants[activeTenantIdx]?.name || 'LG그룹';
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [isPmOpen, setIsPmOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex md:flex-row h-auto md:h-[calc(100vh-112px)] min-h-0 gap-6 text-gray-900">
      <IncidentModal isOpen={isIncidentOpen} onClose={() => setIsIncidentOpen(false)} />
      <PMModal isOpen={isPmOpen} onClose={() => setIsPmOpen(false)} />

      <CompanyListPanel
        companies={mockData.tenants.map(t => ({ id: t.name, name: t.name, subCount: t.subtenants.length }))}
        activeIndex={activeTenantIdx}
        onCompanyClick={setActiveTenantIdx}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-none flex flex-col gap-5 mb-5 shrink-0">
      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">전체 등록 건수</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold tracking-tight text-gray-900">{mockData.summary.totalCount}</span><span className="text-gray-500 text-sm">건</span>
          </div>
          <div className="mt-4 text-[12px] font-medium text-gray-500 flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100"><AlertTriangle size={12} className="text-red-500"/>장애 {mockData.summary.incidentCount}건</span>
            <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100"><Settings size={12} className="text-blue-500"/>PM {mockData.summary.pmCount}건</span>
          </div>
        </div>
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">총 크레딧 산출액</div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 mt-1">+₩ {Math.abs(mockData.summary.totalCredit).toLocaleString()}</div>
          <div className="mt-4 text-[12px] font-medium text-gray-400">선택 기간 기준</div>
        </div>
        <div className="bg-white border text-left border-gray-200 rounded-[10px] p-5 flex flex-col justify-between shadow-sm">
          <div className="text-[14px] font-semibold text-gray-600 mb-2">이번 달 신규 등록</div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 mt-1">{mockData.summary.newThisMonth} <span className="text-gray-500 text-sm font-medium">건</span></div>
          <div className="mt-4 text-[12px] font-medium text-gray-400">이번 달 기준</div>
        </div>
      </div>

      {/* 3, 4. Header Tools */}
      <div className="bg-white border border-gray-200 rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4">
        {/* 상단: 타이틀 */}
        <div className="flex items-center justify-between md:border-r md:border-gray-200 md:pr-5">
           <div className="text-[14px] font-bold text-gray-900 flex items-center gap-2">
             조회 필터 및 등록
           </div>
        </div>

        {/* 중간: 필터 섹션 */}
        <div className="flex-1 md:px-5 flex flex-col sm:flex-row items-stretch md:items-center gap-3">
          <div className="grid grid-cols-2 lg:flex gap-2 flex-1">
            <div className="flex items-center gap-2 border border-gray-200 rounded-[8px] px-3 h-[36px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <Calendar size={14} className="text-gray-500 shrink-0"/>
              <select className="bg-transparent text-[13px] font-bold text-gray-700 outline-none w-full cursor-pointer"><option>최근 3개월</option></select>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-[8px] px-3 h-[36px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <select className="bg-transparent text-[13px] font-bold text-gray-700 outline-none w-full cursor-pointer"><option>전체 구분</option><option>장애</option><option>긴급 PM</option><option>정기 PM</option></select>
            </div>
          </div>
        </div>

        {/* 하단/우측: 액션 버튼 */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 md:pt-0 border-t border-gray-50 md:border-none">
          <button onClick={() => setIsIncidentOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] bg-red-50 text-red-700 hover:bg-red-100 text-[13px] font-bold border border-red-200 shadow-sm transition-all active:scale-[0.98]">
            <AlertTriangle size={14}/><Plus size={14}/> <span>장애 등록</span>
          </button>
          <button onClick={() => setIsPmOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-[8px] bg-blue-50 text-blue-700 hover:bg-blue-100 text-[13px] font-bold border border-blue-200 shadow-sm transition-all active:scale-[0.98]">
            <Settings size={14}/><Plus size={14}/> <span>PM 등록</span>
          </button>
        </div>
      </div>
      </div>

      {/* 5. Table */}
      <div className="flex-1 bg-white border border-gray-200 rounded-[10px] overflow-hidden shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] flex flex-col text-left min-h-0">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left border-collapse table-auto">
          <thead className="hidden md:table-header-group">
            <tr className="bg-[#FAFAFA] border-b border-gray-200">
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase min-w-[70px] whitespace-nowrap">구분</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">발생/시작 일시</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">복구/종료 일시</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">소요 시간</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">발생 노드/인스턴스</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">고객사</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase text-center whitespace-nowrap">GPU</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase text-right whitespace-nowrap">크레딧 산출액</th>
              <th className="px-5 py-[14px] text-[12px] font-bold text-gray-500 uppercase whitespace-nowrap">등록자</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 p-4 md:table-row-group md:p-0">
            {mockData.tenants.filter(t => t.name === activeTenantName).map(tenant => (
              <React.Fragment key={tenant.name}>
                {tenant.subtenants.map(sub => (
                   <React.Fragment key={sub.name}>
                     {/* Subtenant Header */}
                     <tr className="flex flex-col md:table-row bg-[#F8FAFC] md:bg-[#FAFAFA] border-b border-gray-100 rounded-t-xl overflow-hidden">
                        <td colSpan={9} className="px-4 py-3 md:px-7 md:py-3 border-l-4 border-primary-500 md:border-l-transparent">
                          <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                            <Building2 size={14} className="text-primary-500 md:text-gray-400"/>
                            <span className="text-[14px] md:text-[13px]">{sub.name}</span>
                            <span className="text-gray-300 mx-1">|</span>
                            <span className="text-gray-500 font-medium">{sub.records.length}건</span>
                          </div>
                        </td>
                     </tr>

                     {sub.records.map((r, i) => (
                       <tr key={i} className="flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm bg-white md:table-row md:border-0 md:border-b md:border-gray-100 md:rounded-none md:p-0 md:shadow-none hover:bg-gray-50/50 transition-colors group">
                          <td className="px-0 py-1 md:px-5 md:py-3 order-1 md:order-none">
                            <span className={`inline-flex items-center justify-center whitespace-nowrap px-2 py-0.5 md:py-1 rounded-[5px] text-[10px] md:text-[11px] font-bold border ${r.type === '장애' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] min-w-[40px]' : r.type === '긴급PM' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] min-w-[52px]' : 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] min-w-[52px]'}`}>{r.type}</span>
                            <div className="md:hidden mt-3 border-b border-gray-50 pb-2 mb-3">
                               <div className="flex items-center gap-1.5 text-[15px] font-bold text-gray-900"><AlertTriangle size={16} className="text-red-500"/> {r.node} ({r.instance})</div>
                            </div>
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-mono text-gray-600 text-[12px] order-3 md:order-none">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">발생/시작 일시</span>
                            {r.start}
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-mono text-gray-600 text-[12px] order-4 md:order-none">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">복구/종료 일시</span>
                            {r.end}
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-bold text-gray-800 md:font-medium md:text-gray-700 order-2 md:order-none mb-2 md:mb-0">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">소요 시간</span>
                            {r.duration}
                          </td>
                          <td className="hidden md:table-cell px-5 py-3 md:whitespace-nowrap"><div className="flex items-center gap-1.5 px-2 py-1 bg-[#F8FAFC] border border-gray-200 rounded text-[12px] font-medium text-gray-600 inline-flex"><Server size={12}/>{r.node} ({r.instance})</div></td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-medium text-gray-600 order-5 md:order-none">
                            <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">해당 고객사</span>
                            {r.companies}
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-mono text-gray-600 text-[13px] md:text-center order-6 md:order-none">
                             <span className="md:hidden text-[10px] text-gray-400 font-normal block mb-0.5">영향 GPU</span>
                             {r.gpu} HP
                          </td>
                          <td className="px-0 py-2 md:px-5 md:py-3 font-mono font-bold text-[16px] md:text-[13px] md:text-right border-t border-gray-50 mt-3 md:border-0 md:mt-0 order-7 md:order-none">
                            <div className="flex md:block justify-between items-center">
                              <span className="md:hidden text-[10px] text-emerald-600 font-bold uppercase">크레딧 산출액 (+)</span>
                              {r.credit ? <span className="text-emerald-600">+₩ {Math.abs(r.credit).toLocaleString()}</span> : <span className="text-gray-300 md:inline hidden">—</span>}
                            </div>
                          </td>
                          <td className="px-0 py-1 md:px-5 md:py-3 font-medium text-gray-400 text-[11px] md:text-[13px] md:text-gray-500 order-8 md:order-none mt-2 md:mt-0">
                            <span className="md:hidden text-[10px] text-gray-300 font-normal mr-1">등록자</span>
                            {r.user}
                          </td>
                       </tr>
                     ))}
                   </React.Fragment>
                ))}
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
