"use client";
import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export default function PhotoLightbox({ images, initialIndex = 0, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(initialIndex);

  return (
    <Lightbox
      mainSrc={images[photoIndex]}
      nextSrc={images[(photoIndex + 1) % images.length]}
      prevSrc={images[(photoIndex + images.length - 1) % images.length]}
      onCloseRequest={onClose}
      onMovePrevRequest={() =>
        setPhotoIndex((photoIndex + images.length - 1) % images.length)
      }
      onMoveNextRequest={() =>
        setPhotoIndex((photoIndex + 1) % images.length)
      }
      imageCaption={`사진 ${photoIndex + 1} / ${images.length}`}
    />
  );
}
