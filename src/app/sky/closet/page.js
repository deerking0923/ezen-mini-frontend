'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';
import "./closet.css"; // CSS 파일

/* ===============================
   12개 카테고리 정의 (단일 배열)
=============================== */
const categories = [
  { id: 'cat1',  name: '카테고리1' },
  { id: 'cat2',  name: '카테고리2' },
  { id: 'cat3',  name: '카테고리3' },
  { id: 'cat4',  name: '카테고리4' },
  { id: 'cat5',  name: '카테고리5' },
  { id: 'cat6',  name: '카테고리6' },
  { id: 'cat7',  name: '카테고리7' },
  { id: 'cat8',  name: '카테고리8' },
  { id: 'cat9',  name: '카테고리9' },
  { id: 'cat10', name: '카테고리10' },
  { id: 'cat11', name: '카테고리11' },
  { id: 'cat12', name: '카테고리12' },
];

/* 
  각 카테고리에 대한 파츠 데이터 (예시)
  실제 데이터에 맞게 수정하시면 됩니다.
*/
const partData = {
  cat1: [
    { id: 'p1', src: '/identity5/survivor/01.jpg' },
    { id: 'p2', src: '/identity5/survivor/01.jpg' },
  ],
  cat2: [
    { id: 'p3', src: '/identity5/survivor/02.jpg' },
    { id: 'p4', src: '/identity5/survivor/02.jpg' },
  ],
  cat3: [
    { id: 'p5', src: '/identity5/survivor/03.jpg' },
    { id: 'p6', src: '/identity5/survivor/03.jpg' },
  ],
  cat4: [
    { id: 'p7', src: '/identity5/survivor/04.jpg' },
    { id: 'p8', src: '/identity5/survivor/04.jpg' },
  ],
  cat5:  [],
  cat6:  [],
  cat7:  [],
  cat8:  [],
  cat9:  [],
  cat10: [],
  cat11: [],
  cat12: [],
};

/* 고유 id 생성 함수 */
let uniqueIdCounter = 0;
function generateUniqueId() {
  uniqueIdCounter++;
  return `copy-${uniqueIdCounter}`;
}

/* ================================
   dnd-kit 관련 작은 컴포넌트들
================================ */

/* DraggablePart: 파츠 선택 영역에서 보이는 아이템 (클릭 시 미리보기) */
function DraggablePart({ part, onClick }) {
  return (
    <div className="draggable-part" onClick={() => onClick(part)}>
      <img src={part.src} alt={part.id} />
    </div>
  );
}

/* SortablePart: 테이블(드롭존)에 추가된 파츠 아이템 */
function SortablePart({ id, src, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sortable-part"
      {...attributes}
      {...listeners}
    >
      <img src={src} alt={id} onClick={onClick} />
    </div>
  );
}

/* DropZoneCategory: 테이블 내 드롭존 (각 카테고리별 칸) */
function DropZoneCategory({ categoryId, items, onItemsChange, onTablePartClick }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const oldIndex = items.findIndex(item => item.id === active.id);
    const newIndex = items.findIndex(item => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const updated = Array.from(items);
    updated.splice(newIndex, 0, updated.splice(oldIndex, 1)[0]);
    onItemsChange(updated);
  };

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(item => item.id)}>
        <div className="drop-zone">
          {items.map(item => (
            <SortablePart
              key={item.id}
              id={item.id}
              src={item.src}
              onClick={() => onTablePartClick(categoryId, item)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ================================
   메인 Page 컴포넌트
================================ */
export default function Page() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // 테이블(드롭존)에 추가된 파츠 상태 (카테고리별)
  const [tableParts, setTableParts] = useState(() => {
    const init = {};
    categories.forEach(cat => { init[cat.id] = []; });
    return init;
  });

  // 파츠 선택 영역에서 보이는 파츠 목록 (초기값: partData)
  const [availableParts, setAvailableParts] = useState(() => {
    const init = {};
    categories.forEach(cat => {
      init[cat.id] = partData[cat.id] ? [...partData[cat.id]] : [];
    });
    return init;
  });

  // 미리보기 패널에서 현재 선택된 파츠 + 카테고리
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 사용자가 선택한 카테고리 (왼쪽 패널에서 클릭 시)
  const [selectedPartsCategory, setSelectedPartsCategory] = useState(categories[0].id);

  /* === 테이블 렌더링 (2열×6행) === */
  function renderTable() {
    // 2개씩 chunk
    const rows = [];
    for (let i = 0; i < categories.length; i += 2) {
      rows.push(categories.slice(i, i + 2));
    }
    return (
      <table className="styled-table" id="capture-table">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map(cat => (
                <td key={cat.id} className="cat-cell">
                  <div className="cat-name">{cat.name}</div>
                  <DropZoneCategory
                    categoryId={cat.id}
                    items={tableParts[cat.id]}
                    onItemsChange={newItems =>
                      setTableParts(prev => ({ ...prev, [cat.id]: newItems }))
                    }
                    onTablePartClick={handleTablePartClick}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  /* === 이벤트 핸들러들 === */

  // 테이블 내 파츠 클릭 -> 미리보기 (fromTable = true)
  function handleTablePartClick(categoryId, part) {
    const detailSrc = `/sky/closet/detail/${part.originalId || part.id}.jpg`;
    setSelectedPart({ ...part, fromTable: true, detail: detailSrc });
    setSelectedCategory(categoryId);
  }

  // 왼쪽 카테고리 목록에서 파츠 클릭 -> 미리보기 (fromTable = false)
  function handlePartClick(categoryId, part) {
    const detailSrc = `/sky/closet/detail/${part.id}.jpg`;
    setSelectedPart({ ...part, fromTable: false, detail: detailSrc });
    setSelectedCategory(categoryId);
  }

  // "+" 버튼 -> 파츠 테이블에 추가
  function handleAddPart() {
    if (!selectedPart || !selectedCategory) return;
    const newPart = {
      ...selectedPart,
      id: generateUniqueId(),
      originalId: selectedPart.id, // 원본 아이디
      src: selectedPart.src,
    };
    // 테이블 상태 업데이트
    setTableParts(prev => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], newPart],
    }));
    // 선택 영역에서 제거
    setAvailableParts(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].filter(p => p.id !== selectedPart.id),
    }));
    setSelectedPart(null);
    setSelectedCategory(null);
  }

  // "-" 버튼 -> 파츠 테이블에서 제거 + 선택 영역 복원
  function handleRemovePart() {
    if (!selectedPart || !selectedCategory || !selectedPart.fromTable) return;
    setTableParts(prev => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].filter(item => item.id !== selectedPart.id),
    }));
    const originalId = selectedPart.originalId || selectedPart.id;
    // partData에서 찾아볼 수도 있지만 여기서는 바로 복원
    const originalPart = { id: originalId, src: selectedPart.src };
    setAvailableParts(prev => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], originalPart],
    }));
    setSelectedPart(null);
    setSelectedCategory(null);
  }

  // "모두 추가" 버튼 (현재 선택된 카테고리 모든 파츠를 테이블로 이동)
  function handleAddAllParts() {
    if (!selectedPartsCategory) return;
    const partsToAdd = availableParts[selectedPartsCategory].map(part => ({
      ...part,
      id: generateUniqueId(),
      originalId: part.id,
    }));
    setTableParts(prev => ({
      ...prev,
      [selectedPartsCategory]: [...prev[selectedPartsCategory], ...partsToAdd],
    }));
    setAvailableParts(prev => ({
      ...prev,
      [selectedPartsCategory]: [],
    }));
  }

  // 다운로드 버튼 -> html2canvas로 테이블 캡쳐
  function handleDownload() {
    const tableElement = document.querySelector('.table-panel'); // or '#capture-table'
    if (!tableElement) return;
    html2canvas(tableElement, {
      scale: 3,
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'table.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => console.error('html2canvas error:', err));
  }

  if (!mounted) return null;

  return (
    <div className="page-container">
      {/* 왼쪽: 카테고리 + 미리보기 + 파츠 목록 */}
      <div className="left-panel">
        {/* 카테고리 선택 영역 */}
        <div className="category-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-item ${
                selectedPartsCategory === cat.id ? 'active' : ''
              }`}
              onClick={() => setSelectedPartsCategory(cat.id)}
            >
              {cat.name}
            </div>
          ))}
        </div>

        {/* 미리보기 영역 */}
        <div className="preview-area">
          {selectedPart ? (
            <div className="preview-panel">
              <img className="preview-image" src={selectedPart.detail} alt={selectedPart.id} />
              {selectedPart.fromTable ? (
                <button onClick={handleRemovePart}>-</button>
              ) : (
                <button onClick={handleAddPart}>+</button>
              )}
            </div>
          ) : (
            <div className="preview-placeholder">파츠를 선택하세요</div>
          )}
        </div>

        {/* 파츠 목록 */}
        <div className="parts-list-area">
          <div className="add-all-button">
            <button onClick={handleAddAllParts}>모두 추가</button>
          </div>
          <div className="parts-list-container">
            {availableParts[selectedPartsCategory].map(part => (
              <DraggablePart
                key={part.id}
                part={part}
                onClick={() => handlePartClick(selectedPartsCategory, part)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 오른쪽: 테이블(2열×6행) + 다운로드 버튼 */}
      <div className="right-panel">
        <div className="table-panel">{renderTable()}</div>
        <div className="download-button">
          <button onClick={handleDownload}>Download Table</button>
        </div>
      </div>

      <DragOverlay>
        {/* 드래그 중에 표시할 Overlay 필요시 구현 */}
      </DragOverlay>
    </div>
  );
}
