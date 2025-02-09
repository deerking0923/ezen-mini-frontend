'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import "./closet.css"; // CSS 파일

// 고유 id 생성을 위한 간단한 counter 함수
let uniqueIdCounter = 0;
const generateUniqueId = () => {
  uniqueIdCounter++;
  return `copy-${uniqueIdCounter}`;
};

// 4개 카테고리 정의 (이름은 임의로 지정)
const categories = [
  { id: 'cat1', name: '감사시즌' },
  { id: 'cat2', name: '빛추시즌' },
  { id: 'cat3', name: '마법시즌' },
  { id: 'cat4', name: '리듬시즌' },
];

// 각 카테고리별로 사용 가능한 파츠 데이터 (이미지 경로는 예시)
// 이 src는 아이콘 이미지로 사용됩니다.
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
};

/* ======================================================
   dnd-kit 관련 작은 컴포넌트들
====================================================== */

/**
 * DraggablePart  
 * - 하단 파츠 선택 영역에 보여지는 파츠 아이템 (클릭하면 미리보기 업데이트)
 */
function DraggablePart({ part, onClick }) {
  return (
    <div className="draggable-part" onClick={() => onClick(part)}>
      <img src={part.src} alt={part.id} />
    </div>
  );
}

/**
 * SortablePart  
 * - 테이블 내 드롭 존에 추가된 파츠 아이템  
 *   삭제 버튼(onDelete)을 통해 개별 파츠를 삭제할 수 있음.
 */
function SortablePart({ id, src, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
    position: 'relative',
  };
  return (
    <div ref={setNodeRef} style={style} className="sortable-part" {...attributes} {...listeners}>
      <img src={src} alt={id} />
      <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(id); }}>X</button>
    </div>
  );
}

/**
 * DropZoneCategory  
 * - 각 카테고리별 테이블 구역(드롭 존) 컴포넌트  
 *   같은 구역 내에서만 재배치가 가능하며, 드롭 영역 밖으로 내보내면 해당 아이템은 제거됩니다.
 *   삭제 버튼 클릭 시 onDelete 콜백을 호출합니다.
 */
function DropZoneCategory({ categoryId, items, onItemsChange, onRemovePart }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) {
      const removedPart = items.find((item) => item.id === active.id);
      onItemsChange(items.filter((item) => item.id !== active.id));
      if (removedPart && removedPart.originalId) {
        const originalPart = partData[categoryId].find((p) => p.id === removedPart.originalId);
        if (originalPart) {
          onRemovePart(originalPart, categoryId);
        }
      }
      return;
    }
    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const updated = Array.from(items);
    updated.splice(newIndex, 0, updated.splice(oldIndex, 1)[0]);
    onItemsChange(updated);
  };

  // 삭제 버튼 핸들러: 파츠를 테이블에서 제거하고 복원 콜백 호출
  const handleDelete = (partId) => {
    const removedPart = items.find(item => item.id === partId);
    onItemsChange(items.filter(item => item.id !== partId));
    if (removedPart && removedPart.originalId) {
      const originalPart = partData[categoryId].find(p => p.id === removedPart.originalId);
      if (originalPart) {
        onRemovePart(originalPart, categoryId);
      }
    }
  };

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)}>
        <div className="drop-zone">
          {items.map((item) => (
            <SortablePart key={item.id} id={item.id} src={item.src} onDelete={() => handleDelete(item.id)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/* ======================================================
   메인 Page 컴포넌트
====================================================== */

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [tableParts, setTableParts] = useState({
    cat1: [],
    cat2: [],
    cat3: [],
    cat4: [],
  });
  // availableParts 상태: 파츠 선택 영역에서 보여질 파츠 (초기값은 partData의 복사본)
  const [availableParts, setAvailableParts] = useState({
    cat1: [...partData.cat1],
    cat2: [...partData.cat2],
    cat3: [...partData.cat3],
    cat4: [...partData.cat4],
  });
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [overlaySrc, setOverlaySrc] = useState(null);
  // 하단 파츠 선택 영역에서 현재 선택된 카테고리 (기본은 첫 번째)
  const [selectedPartsCategory, setSelectedPartsCategory] = useState(categories[0].id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = mounted ? (
    <div className="page-container">
      {/* 테이블 영역 (상단) */}
      <div className="table-panel">
        <table className="styled-table">
          <tbody>
            <tr>
              <td className="cat-name">{categories[0].name}</td>
              <td className="cat-drop">
                <DropZoneCategory
                  categoryId={categories[0].id}
                  items={tableParts.cat1}
                  onItemsChange={(newItems) =>
                    setTableParts((prev) => ({ ...prev, cat1: newItems }))
                  }
                  onRemovePart={(removedPart, catId) => {
                    setAvailableParts((prev) => ({
                      ...prev,
                      [catId]: [...prev[catId], removedPart],
                    }));
                  }}
                />
              </td>
              <td className="cat-name">{categories[1].name}</td>
              <td className="cat-drop">
                <DropZoneCategory
                  categoryId={categories[1].id}
                  items={tableParts.cat2}
                  onItemsChange={(newItems) =>
                    setTableParts((prev) => ({ ...prev, cat2: newItems }))
                  }
                  onRemovePart={(removedPart, catId) => {
                    setAvailableParts((prev) => ({
                      ...prev,
                      [catId]: [...prev[catId], removedPart],
                    }));
                  }}
                />
              </td>
            </tr>
            <tr>
              <td className="cat-name">{categories[2].name}</td>
              <td className="cat-drop">
                <DropZoneCategory
                  categoryId={categories[2].id}
                  items={tableParts.cat3}
                  onItemsChange={(newItems) =>
                    setTableParts((prev) => ({ ...prev, cat3: newItems }))
                  }
                  onRemovePart={(removedPart, catId) => {
                    setAvailableParts((prev) => ({
                      ...prev,
                      [catId]: [...prev[catId], removedPart],
                    }));
                  }}
                />
              </td>
              <td className="cat-name">{categories[3].name}</td>
              <td className="cat-drop">
                <DropZoneCategory
                  categoryId={categories[3].id}
                  items={tableParts.cat4}
                  onItemsChange={(newItems) =>
                    setTableParts((prev) => ({ ...prev, cat4: newItems }))
                  }
                  onRemovePart={(removedPart, catId) => {
                    setAvailableParts((prev) => ({
                      ...prev,
                      [catId]: [...prev[catId], removedPart],
                    }));
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 하단 파츠 선택 영역 */}
      <div className="parts-selection-container">
        {/* 좌측: 미리보기 영역 */}
        <div className="parts-preview-column">
          {selectedPart ? (
            <div className="preview-panel">
              <img className="preview-image" src={selectedPart.detail} alt={selectedPart.id} />
              <button onClick={handleAddPart}>+</button>
            </div>
          ) : (
            <div className="preview-placeholder">파츠를 선택하세요</div>
          )}
        </div>
        {/* 우측: 카테고리 선택 및 파츠 목록 영역 */}
        <div className="parts-selection-column">
          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`category-item ${selectedPartsCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedPartsCategory(cat.id)}
              >
                {cat.name}
              </div>
            ))}
          </div>
          <div className="add-all-button">
            <button onClick={handleAddAllParts}>모두 추가</button>
          </div>
          <div className="parts-list-container">
            {availableParts[selectedPartsCategory].map((part) => (
              <DraggablePart
                key={part.id}
                part={part}
                onClick={() => handlePartClick(selectedPartsCategory, part)}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && overlaySrc ? (
          <div className="overlay-item">
            <img src={overlaySrc} alt="drag-overlay" />
          </div>
        ) : null}
      </DragOverlay>
    </div>
  ) : null;

  // 이벤트 핸들러들

  // 파츠 클릭 시, 미리보기 상세 이미지는 /sky/closet/detail 폴더의 이미지를 사용하고,
  // 동시에 아이콘 이미지(원본 partData의 src)와 상세 이미지(detail)를 모두 저장합니다.
  function handlePartClick(categoryId, part) {
    const detailSrc = `/sky/closet/detail/${part.id}.jpg`;
    setSelectedPart({ ...part, icon: part.src, detail: detailSrc });
    setSelectedCategory(categoryId);
  }

  // 미리보기 패널의 "+" 버튼 클릭 시, 선택된 파츠를 테이블에 추가하고, availableParts에서 제거합니다.
  function handleAddPart() {
    if (selectedPart && selectedCategory) {
      const newPart = { ...selectedPart, id: generateUniqueId(), originalId: selectedPart.id, src: selectedPart.icon };
      setTableParts((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], newPart],
      }));
      // 해당 카테고리에서 선택된 파츠 제거
      setAvailableParts((prev) => ({
        ...prev,
        [selectedCategory]: prev[selectedCategory].filter((p) => p.id !== selectedPart.id),
      }));
      setSelectedPart(null);
      setSelectedCategory(null);
    }
  }

  // "모두 추가" 버튼 클릭 시, 선택된 카테고리의 모든 파츠를 테이블에 추가하고, availableParts에서 모두 제거합니다.
  function handleAddAllParts() {
    if (selectedPartsCategory) {
      const partsToAdd = availableParts[selectedPartsCategory].map((part) => ({
        ...part,
        id: generateUniqueId(),
        originalId: part.id,
        src: part.src,
      }));
      setTableParts((prev) => ({
        ...prev,
        [selectedPartsCategory]: [...prev[selectedPartsCategory], ...partsToAdd],
      }));
      setAvailableParts((prev) => ({
        ...prev,
        [selectedPartsCategory]: [],
      }));
    }
  }

  return content;
}
