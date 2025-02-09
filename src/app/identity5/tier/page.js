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
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import "./tier.css"; // CSS 파일

// 고유 id 생성을 위한 간단한 counter 함수
let uniqueIdCounter = 0;
const generateUniqueId = () => {
  uniqueIdCounter++;
  return `copy-${uniqueIdCounter}`;
};

// public/identity5 폴더에 있는 캐릭터 이미지 목록 (원본 목록)
const availableCharacters = [
  { id: 'char1', src: '/identity5/survivor/01.jpg' },
  { id: 'char2', src: '/identity5/survivor/02.jpg' },
  { id: 'char3', src: '/identity5/survivor/03.jpg' },
  { id: 'char4', src: '/identity5/survivor/04.jpg' },
  // ...추가 캐릭터
];

/* 
  ─────────────────────────────────────────────────────────
    작은 컴포넌트들
  ─────────────────────────────────────────────────────────
*/

/**
 * [DraggableAvailable]
 * '캐릭터 목록'에서 표시되는 아이템 (드래그하면 copy)
 */
function DraggableAvailable({ char }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useDraggable({
    id: char.id,
    data: { from: 'available' },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className="drag-available"
      style={style}
      {...attributes}
      {...listeners}
    >
      <img src={char.src} alt={char.id} />
    </div>
  );
}

/**
 * [SortableItem]
 * 이미 테이블(행) 내에 들어있는 아이템
 */
function SortableItem({ id, src }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      className="drag-item"
      style={style}
      {...attributes}
      {...listeners}
    >
      <img src={src} alt={id} />
    </div>
  );
}

/**
 * [RowDroppable + RowDroppableContent]
 * 테이블의 각 행을 감싸는 SortableContext와 실제 DropZone 역할의 div
 */
function RowDroppable({ row }) {
  return (
    <SortableContext items={row.images.map((item) => item.id)}>
      <RowDroppableContent row={row} />
    </SortableContext>
  );
}

function RowDroppableContent({ row }) {
  const { setNodeRef } = useDroppable({ id: row.id });
  return (
    <div ref={setNodeRef} className="drop-zone">
      {row.images.map((item) => (
        <SortableItem key={item.id} id={item.id} src={item.src} />
      ))}
    </div>
  );
}

/* 
  ─────────────────────────────────────────────────────────
    메인 Page 컴포넌트
  ─────────────────────────────────────────────────────────
*/
export default function Page() {
  // 클라이언트 전용 렌더링을 위해 마운트 상태를 관리합니다.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테이블의 행 상태
  const [rows, setRows] = useState([
    { id: 'row-1', text: '', images: [] },
  ]);

  // 드래그 중인 아이템 정보 (DragOverlay 표시용)
  const [activeId, setActiveId] = useState(null);
  const [overlaySrc, setOverlaySrc] = useState(null);

  // 텍스트 입력 핸들러
  const updateRowText = (rowId, text) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, text } : row))
    );
  };

  // 행 추가/삭제 핸들러
  const addRow = () => {
    if (rows.length < 10) {
      setRows((prev) => [
        ...prev,
        { id: `row-${prev.length + 1}`, text: '', images: [] },
      ]);
    }
  };
  const removeRow = () => {
    if (rows.length > 1) {
      setRows((prev) => prev.slice(0, -1));
    }
  };

  /* 
    ─────────────────────────────────────
      DnD 이벤트 핸들러
    ─────────────────────────────────────
  */

  // 드래그 시작
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    const foundAvail = availableCharacters.find((c) => c.id === active.id);
    if (foundAvail) {
      setOverlaySrc(foundAvail.src);
      return;
    }
    rows.forEach((row) => {
      row.images.forEach((item) => {
        if (item.id === active.id) {
          setOverlaySrc(item.src);
        }
      });
    });
  };

  // 드래그 종료
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverlaySrc(null);

    // droppable이 없는 경우 (테이블 밖으로 드롭) => 아이템 제거
    if (!over) {
      if (active.data.current?.from !== 'available') {
        setRows((prevRows) =>
          prevRows.map((row) => {
            const newImages = row.images.filter((img) => img.id !== active.id);
            return { ...row, images: newImages };
          })
        );
      }
      return;
    }

    // droppable이 존재하는 경우
    if (active.data.current?.from === 'available') {
      // available에서 온 경우, 테이블 행으로 복사
      const targetRowId = over.id; // 예: "row-1" 혹은 아이템 id
      const char = availableCharacters.find((c) => c.id === active.id);
      if (!char) return;
      const newChar = { ...char, id: generateUniqueId() };

      setRows((prev) =>
        prev.map((row) => {
          if (targetRowId === row.id) {
            return { ...row, images: [...row.images, newChar] };
          }
          const dropIndex = row.images.findIndex((img) => img.id === targetRowId);
          if (dropIndex >= 0) {
            const newImages = [...row.images];
            newImages.splice(dropIndex, 0, newChar);
            return { ...row, images: newImages };
          }
          return row;
        })
      );
    } else {
      // 테이블 내에서 이미 존재하는 아이템 이동/재배치
      let sourceRowId = null;
      let sourceIndex = null;
      rows.forEach((row) => {
        const idx = row.images.findIndex((img) => img.id === active.id);
        if (idx >= 0) {
          sourceRowId = row.id;
          sourceIndex = idx;
        }
      });
      if (!sourceRowId) return;
      const destinationRowId = over.id;

      setRows((prev) => {
        const sourceRowObj = prev.find((r) => r.id === sourceRowId);
        if (!sourceRowObj) return prev;
        const movedItem = sourceRowObj.images[sourceIndex];
        if (!movedItem) return prev;
        const sameRow =
          destinationRowId === sourceRowId ||
          sourceRowObj.images.some((img) => img.id === destinationRowId);
        if (sameRow) {
          return prev.map((row) => {
            if (row.id !== sourceRowId) return row;
            const newImages = [...row.images];
            newImages.splice(sourceIndex, 1);
            const targetIndex = newImages.findIndex((img) => img.id === destinationRowId);
            if (targetIndex === -1) {
              newImages.push(movedItem);
            } else {
              newImages.splice(targetIndex, 0, movedItem);
            }
            return { ...row, images: newImages };
          });
        } else {
          return prev.map((row) => {
            if (row.id === sourceRowId) {
              const newImages = [...row.images];
              newImages.splice(sourceIndex, 1);
              return { ...row, images: newImages };
            }
            if (row.id === destinationRowId) {
              const dropIndex = row.images.findIndex((img) => img.id === destinationRowId);
              if (dropIndex === -1) {
                return { ...row, images: [...row.images, movedItem] };
              } else {
                const newImages = [...row.images];
                newImages.splice(dropIndex, 0, movedItem);
                return { ...row, images: newImages };
              }
            }
            return row;
          });
        }
      });
    }
  };

  return mounted ? (
    <DndContext
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="container">
        {/* 행 추가/삭제 버튼 */}
        <div className="button-group">
          <button onClick={addRow}>+</button>
          <button onClick={removeRow}>–</button>
        </div>

        {/* 테이블 */}
        <table className="styled-table">
  <colgroup>
    <col style={{ width: '150px' }} />
    <col style={{ width: '850px' }} />
  </colgroup>
  <thead>
    <tr>
      <th colSpan="2">입력칸</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row) => (
      <tr key={row.id}>
        <td>
          <input
            type="text"
            placeholder="입력칸"
            value={row.text}
            onChange={(e) => updateRowText(row.id, e.target.value)}
          />
        </td>
        <td>
          {/* 행 droppable */}
          <RowDroppable row={row} />
        </td>
      </tr>
    ))}
  </tbody>
</table>


        {/* 캐릭터 목록 */}
        <div className="available-container">
          <h3>캐릭터 목록</h3>
          <div className="available-list">
            {availableCharacters.map((char) => (
              <DraggableAvailable key={char.id} char={char} />
            ))}
          </div>
        </div>
      </div>

      {/* 드래그 중 Overlay */}
      <DragOverlay>
        {activeId && overlaySrc ? (
          <div className="overlay-item">
            <img src={overlaySrc} alt="drag-overlay" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  ) : null;
}
