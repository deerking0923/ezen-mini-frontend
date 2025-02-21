// MenuOverlay.jsx
import { createPortal } from "react-dom";

export default function MenuOverlay({ children, style }) {
  return createPortal(
    <div className="menu-overlay" style={style}>
      {children}
    </div>,
    document.body
  );
}
