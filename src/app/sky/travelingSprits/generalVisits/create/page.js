"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./create.css";

export default function SoulCreatePage() {
  // 텍스트 관련 상태
  const [formData, setFormData] = useState({
    seasonName: "",
    name: "",
    orderNum: 0, // 추가: 순서 필드
    startDate: "",
    endDate: "",
    rerunCount: 0,
    keywords: "",
    creator: "",
    description: "",
  });

  // 파일 관련 상태
  const [representativeImage, setRepresentativeImage] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
  const [gestureGifs, setGestureGifs] = useState([]); // 배열 (여러 파일)
  const [wearingShotImages, setWearingShotImages] = useState([]); // 배열

  // 노드 관련 상태
  const [centerNodes, setCenterNodes] = useState([]);
  const [leftSideNodes, setLeftSideNodes] = useState([]);
  const [rightSideNodes, setRightSideNodes] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // 텍스트 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 파일 입력 핸들러 (단일 파일)
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file);
  };

  // 파일 입력 핸들러 (다중 파일)
  const handleMultipleFilesChange = (e, setter) => {
    const files = Array.from(e.target.files);
    setter(files);
  };

  // 노드 추가 및 업데이트 핸들러들
  const addCenterNode = () => {
    setCenterNodes((prev) => [
      ...prev,
      { nodeOrder: "", photo: null, currencyPrice: "" },
    ]);
  };

  const updateCenterNode = (index, key, value) => {
    setCenterNodes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addLeftSideNode = () => {
    setLeftSideNodes((prev) => [
      ...prev,
      { nodeOrder: "", photo: null, currencyPrice: "" },
    ]);
  };

  const updateLeftSideNode = (index, key, value) => {
    setLeftSideNodes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addRightSideNode = () => {
    setRightSideNodes((prev) => [
      ...prev,
      { nodeOrder: "", photo: null, currencyPrice: "" },
    ]);
  };

  const updateRightSideNode = (index, key, value) => {
    setRightSideNodes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  // 파일 업로드 함수 (단일 파일)
  async function uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("https://korea-sky-planner.com/api/v1/upload", {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    return json.url; // 업로드된 파일 URL 반환
  }

// 다중 파일 업로드 함수
async function uploadFiles(files) {
  const urls = [];
  for (const file of files) {
    const url = await uploadFile(file);
    urls.push(url);
  }
  return urls;
}



  // 각 노드의 사진 업로드 처리
  async function uploadNodePhoto(node) {
    if (node.photo) {
      return await uploadFile(node.photo);
    }
    return "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 파일 업로드 (영혼 관련)
      const representativeImageUrl = representativeImage
        ? await uploadFile(representativeImage)
        : "";
      const locationImageUrl = locationImage
        ? await uploadFile(locationImage)
        : "";
      const gestureGifsUrls =
        gestureGifs.length > 0 ? await uploadFiles(gestureGifs) : [];
      const wearingShotImagesUrls =
        wearingShotImages.length > 0
          ? await uploadFiles(wearingShotImages)
          : [];

      // 노드 관련 업로드
      const uploadedCenterNodes = await Promise.all(
        centerNodes.map(async (node) => {
          const photoUrl = await uploadNodePhoto(node);
          return {
            nodeOrder: Number(node.nodeOrder),
            photo: photoUrl,
            currencyPrice: Number(node.currencyPrice),
          };
        })
      );
      const uploadedLeftSideNodes = await Promise.all(
        leftSideNodes.map(async (node) => {
          const photoUrl = await uploadNodePhoto(node);
          return {
            nodeOrder: Number(node.nodeOrder),
            photo: photoUrl,
            currencyPrice: Number(node.currencyPrice),
          };
        })
      );
      const uploadedRightSideNodes = await Promise.all(
        rightSideNodes.map(async (node) => {
          const photoUrl = await uploadNodePhoto(node);
          return {
            nodeOrder: Number(node.nodeOrder),
            photo: photoUrl,
            currencyPrice: Number(node.currencyPrice),
          };
        })
      );

      // 최종 payload 구성
      const payload = {
        ...formData,
        rerunCount: Number(formData.rerunCount),
        representativeImage: representativeImageUrl,
        locationImage: locationImageUrl,
        gestureGifs: gestureGifsUrls,
        wearingShotImages: wearingShotImagesUrls,
        keywords: formData.keywords
          ? formData.keywords.split(",").map((s) => s.trim())
          : [],
        centerNodes: uploadedCenterNodes,
        leftSideNodes: uploadedLeftSideNodes,
        rightSideNodes: uploadedRightSideNodes,
      };

      const res = await fetch("https://korea-sky-planner.com/api/v1/souls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("영혼 생성에 실패하였습니다.");
      }

      await res.json();
      setSuccess("영혼이 성공적으로 생성되었습니다!");
      router.push("/sky/travelingSprits/generalVisits/list");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="title">영혼 노드 생성</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="form">
        {/* 영혼 정보 입력 */}
        <label className="label">
          시즌 이름:
          <input
            type="text"
            name="seasonName"
            value={formData.seasonName}
            onChange={handleChange}
            className="input"
            required
          />
        </label>
        <label className="label">
          순서:
          <input
            type="number"
            name="orderNum"
            value={formData.orderNum}
            onChange={handleChange}
            className="input"
            required
          />
        </label>

        <label className="label">
          대표 이미지:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setRepresentativeImage)}
            className="input"
          />
        </label>
        <label className="label">
          이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
            required
          />
        </label>
        <label className="label">
          시작 날짜:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="input"
            required
          />
        </label>
        <label className="label">
          마감 날짜:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="input"
            required
          />
        </label>
        <label className="label">
          복각 횟수:
          <input
            type="number"
            name="rerunCount"
            value={formData.rerunCount}
            onChange={handleChange}
            className="input"
          />
        </label>
        <label className="label">
          위치 이미지:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLocationImage)}
            className="input"
          />
        </label>
        <label className="label">
          제스처 GIF (여러 파일 선택 가능):
          <input
            type="file"
            accept="image/gif"
            multiple
            onChange={(e) => handleMultipleFilesChange(e, setGestureGifs)}
            className="input"
          />
        </label>
        <label className="label">
          착용샷 이미지 (여러 파일 선택 가능):
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFilesChange(e, setWearingShotImages)}
            className="input"
          />
        </label>
        <label className="label">
          키워드 (쉼표로 구분):
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className="input"
          />
        </label>

        <hr />

        {/* 중앙 노드 */}
        <h2>중앙 노드</h2>
        {centerNodes.map((node, index) => (
          <div key={index} className="nodeGroup">
            <label className="label">
              순서:
              <input
                type="number"
                value={node.nodeOrder}
                onChange={(e) =>
                  updateCenterNode(index, "nodeOrder", e.target.value)
                }
                className="input"
                required
              />
            </label>
            <label className="label">
              노드 사진:
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateCenterNode(index, "photo", e.target.files[0])
                }
                className="input"
              />
            </label>
            <label className="label">
              재화 가격:
              <input
                type="number"
                value={node.currencyPrice}
                onChange={(e) =>
                  updateCenterNode(index, "currencyPrice", e.target.value)
                }
                className="input"
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addCenterNode} className="smallButton">
          중앙 노드 추가
        </button>

        <hr />

        {/* 왼쪽 사이드 노드 */}
        <h2>왼쪽 사이드 노드</h2>
        {leftSideNodes.map((node, index) => (
          <div key={index} className="nodeGroup">
            <label className="label">
              순서:
              <input
                type="number"
                value={node.nodeOrder}
                onChange={(e) =>
                  updateLeftSideNode(index, "nodeOrder", e.target.value)
                }
                className="input"
                required
              />
            </label>
            <label className="label">
              노드 사진:
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateLeftSideNode(index, "photo", e.target.files[0])
                }
                className="input"
              />
            </label>
            <label className="label">
              재화 가격:
              <input
                type="number"
                value={node.currencyPrice}
                onChange={(e) =>
                  updateLeftSideNode(index, "currencyPrice", e.target.value)
                }
                className="input"
                required
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addLeftSideNode} className="smallButton">
          왼쪽 사이드 노드 추가
        </button>

        <hr />

        {/* 오른쪽 사이드 노드 */}
        <h2>오른쪽 사이드 노드</h2>
        {rightSideNodes.map((node, index) => (
          <div key={index} className="nodeGroup">
            <label className="label">
              순서:
              <input
                type="number"
                value={node.nodeOrder}
                onChange={(e) =>
                  updateRightSideNode(index, "nodeOrder", e.target.value)
                }
                className="input"
                required
              />
            </label>
            <label className="label">
              노드 사진:
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateRightSideNode(index, "photo", e.target.files[0])
                }
                className="input"
              />
            </label>
            <label className="label">
              재화 가격:
              <input
                type="number"
                value={node.currencyPrice}
                onChange={(e) =>
                  updateRightSideNode(index, "currencyPrice", e.target.value)
                }
                className="input"
                required
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addRightSideNode}
          className="smallButton"
        >
          오른쪽 사이드 노드 추가
        </button>
        <label className="label">
          제작자 명:
          <input
            type="text"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            className="input"
          />
        </label>
        <label className="label">
          설명:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input"
          />
        </label>

        <hr />

        <button type="submit" className="button">
          생성하기
        </button>
      </form>
    </div>
  );
}
