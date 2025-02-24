"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./modify.module.css";
import Link from "next/link";

export default function SoulModifyPage() {
  const { id } = useParams();
  const router = useRouter();

  // 텍스트 관련 상태
  const [formData, setFormData] = useState({
    seasonName: "",
    name: "",
    orderNum: 0,
    startDate: "",
    endDate: "",
    rerunCount: 0,
    keywords: "",
    creator: "",
    description: "",
  });

  // 파일 관련 상태 (새로 업로드할 파일)
  const [representativeImage, setRepresentativeImage] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
  const [gestureGifs, setGestureGifs] = useState([]); // 배열
  const [wearingShotImages, setWearingShotImages] = useState([]); // 배열

  // 기존 파일 미리보기용 상태
  const [repImagePreview, setRepImagePreview] = useState("");
  const [locImagePreview, setLocImagePreview] = useState("");
  const [gestureGifsPreview, setGestureGifsPreview] = useState([]);
  const [wearingShotImagesPreview, setWearingShotImagesPreview] = useState([]);

  // 노드 관련 상태
  const [centerNodes, setCenterNodes] = useState([]);
  const [leftSideNodes, setLeftSideNodes] = useState([]);
  // 수정: GET 응답에서 오른쪽 노드는 이제 rightSideNodes로 내려옴
  const [rightSideNodes, setRightSideNodes] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 폼 텍스트 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 단일 파일 입력 핸들러
  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    setter(file);
  };

  // 다중 파일 입력 핸들러
  const handleMultipleFilesChange = (e, setter) => {
    const files = Array.from(e.target.files);
    setter(files);
  };

  // ============ 노드 추가 / 업데이트 핸들러들 ============

  // 중앙 노드
  const addCenterNode = () => {
    setCenterNodes((prev) => [
      ...prev,
      { nodeOrder: "", photo: null, preview: "", currencyPrice: "" },
    ]);
  };
  const updateCenterNode = (index, key, value) => {
    setCenterNodes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  // 왼쪽 노드
  const addLeftSideNode = () => {
    setLeftSideNodes((prev) => [
      ...prev,
      { nodeOrder: "", photo: null, preview: "", currencyPrice: "" },
    ]);
  };
  const updateLeftSideNode = (index, key, value) => {
    setLeftSideNodes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  // 오른쪽 노드 (PUT 시에는 rightSideNodes로 전송)
  const addRightSideNode = () => {
    setRightSideNodes((prev) => [
      ...prev,
      { nodeOrder: "", photo: null, preview: "", currencyPrice: "" },
    ]);
  };
  const updateRightSideNode = (index, key, value) => {
    setRightSideNodes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  // ============ 파일 업로드 로직 ============

  async function uploadFile(file) {
    if (!file) return "";
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/proxy", {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    return json.url;
  }

  async function uploadFiles(files) {
    const urls = [];
    for (const file of files) {
      const url = await uploadFile(file);
      urls.push(url);
    }
    return urls;
  }

  async function uploadNodePhoto(node) {
    if (node.photo) {
      return await uploadFile(node.photo);
    }
    return "";
  }

  // ============ 기존 데이터 불러오기 (GET) ============
  useEffect(() => {
    async function fetchSoul() {
      try {
        const res = await fetch(`https://korea-sky-planner.com/api/v1/souls/${id}`);
        if (!res.ok) throw new Error("영혼 정보를 불러오는데 실패하였습니다.");

        const data = await res.json();
        const soul = data.data || data;

        setFormData({
          seasonName: soul.seasonName || "",
          name: soul.name || "",
          orderNum: soul.orderNum || 0,
          startDate: soul.startDate || "",
          endDate: soul.endDate || "",
          rerunCount: soul.rerunCount || 0,
          keywords: soul.keywords ? soul.keywords.join(", ") : "",
          creator: soul.creator || "",
          description: soul.description || "",
        });

        setRepImagePreview(soul.representativeImage || "");
        setLocImagePreview(soul.locationImage || "");
        setGestureGifsPreview(soul.gestureGifs || []);
        setWearingShotImagesPreview(soul.wearingShotImages || []);

        // GET 응답에서는 이제 오른쪽 노드의 필드명도 rightSideNodes로 내려온다고 가정
        setCenterNodes(
          soul.centerNodes?.map((node) => ({
            nodeOrder: node.nodeOrder,
            photo: null,
            preview: node.photo || "",
            currencyPrice: node.currencyPrice,
          })) || []
        );

        setLeftSideNodes(
          soul.leftSideNodes?.map((node) => ({
            nodeOrder: node.nodeOrder,
            photo: null,
            preview: node.photo || "",
            currencyPrice: node.currencyPrice,
          })) || []
        );

        setRightSideNodes(
          soul.rightSideNodes?.map((node) => ({
            nodeOrder: node.nodeOrder,
            photo: null,
            preview: node.photo || "",
            currencyPrice: node.currencyPrice,
          })) || []
        );
      } catch (err) {
        setError(err.message);
      }
    }
    fetchSoul();
  }, [id]);

  // ============ 수정(Submit) ============
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const representativeImageUrl = representativeImage
        ? await uploadFile(representativeImage)
        : repImagePreview;
      const locationImageUrl = locationImage
        ? await uploadFile(locationImage)
        : locImagePreview;
      const gestureGifsUrls =
        gestureGifs.length > 0
          ? await uploadFiles(gestureGifs)
          : gestureGifsPreview;
      const wearingShotImagesUrls =
        wearingShotImages.length > 0
          ? await uploadFiles(wearingShotImages)
          : wearingShotImagesPreview;

      const uploadedCenterNodes = await Promise.all(
        centerNodes.map(async (node) => {
          const photoUrl = await uploadNodePhoto(node);
          return {
            nodeOrder: Number(node.nodeOrder),
            photo: photoUrl || node.preview,
            currencyPrice: Number(node.currencyPrice),
          };
        })
      );
      const uploadedLeftSideNodes = await Promise.all(
        leftSideNodes.map(async (node) => {
          const photoUrl = await uploadNodePhoto(node);
          return {
            nodeOrder: Number(node.nodeOrder),
            photo: photoUrl || node.preview,
            currencyPrice: Number(node.currencyPrice),
          };
        })
      );
      const uploadedRightSideNodes = await Promise.all(
        rightSideNodes.map(async (node) => {
          const photoUrl = await uploadNodePhoto(node);
          return {
            nodeOrder: Number(node.nodeOrder),
            photo: photoUrl || node.preview,
            currencyPrice: Number(node.currencyPrice),
          };
        })
      );

      const payload = {
        seasonName: formData.seasonName,
        representativeImage: representativeImageUrl,
        name: formData.name,
        orderNum: Number(formData.orderNum),
        startDate: formData.startDate,
        endDate: formData.endDate,
        rerunCount: Number(formData.rerunCount),
        locationImage: locationImageUrl,
        gestureGifs: gestureGifsUrls,
        wearingShotImages: wearingShotImagesUrls,
        keywords: formData.keywords
          ? formData.keywords.split(",").map((s) => s.trim())
          : [],
        creator: formData.creator,
        description: formData.description,
        centerNodes: uploadedCenterNodes,
        leftSideNodes: uploadedLeftSideNodes,
        rightSideNodes: uploadedRightSideNodes,
      };

      const res = await fetch(`https://korea-sky-planner.com/api/v1/souls/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("영혼 수정에 실패하였습니다.");
      }

      await res.json();
      setSuccess("영혼이 성공적으로 수정되었습니다!");
      router.push("/sky/travelingSprits/generalVisits/list");
    } catch (err) {
      setError(err.message);
    }
  };

  // ============ JSX 렌더링 ============
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>영혼 노드 수정</h1>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* [1] 시즌 이름 */}
        <label className={styles.label}>
          시즌 이름:
          <input
            type="text"
            name="seasonName"
            value={formData.seasonName}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        {/* [2] 순서 */}
        <label className={styles.label}>
          순서:
          <input
            type="number"
            name="orderNum"
            value={formData.orderNum}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        {/* [3] 대표 이미지 */}
        <label className={styles.label}>
          대표 이미지:
          {repImagePreview && !representativeImage && (
            <div className={styles.preview}>
              <p>현재 이미지:</p>
              <img
                src={repImagePreview}
                alt="현재 대표 이미지"
                className={styles.previewImage}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setRepresentativeImage)}
            className={styles.input}
          />
        </label>

        {/* [4] 영혼 이름 */}
        <label className={styles.label}>
          이름:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        {/* [5] 날짜 */}
        <label className={styles.label}>
          시작 날짜:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          마감 날짜:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </label>

        {/* [6] 복각 횟수 */}
        <label className={styles.label}>
          복각 횟수:
          <input
            type="number"
            name="rerunCount"
            value={formData.rerunCount}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        {/* [7] 위치 이미지 */}
        <label className={styles.label}>
          위치 이미지:
          {locImagePreview && !locationImage && (
            <div className={styles.preview}>
              <p>현재 이미지:</p>
              <img
                src={locImagePreview}
                alt="현재 위치 이미지"
                className={styles.previewImage}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLocationImage)}
            className={styles.input}
          />
        </label>

        {/* [8] 제스처 GIF */}
        <label className={styles.label}>
          제스처 GIF (여러 파일 선택 가능):
          {gestureGifsPreview.length > 0 && gestureGifs.length === 0 && (
            <div className={styles.previewList}>
              <p>현재 GIFs:</p>
              {gestureGifsPreview.map((gif, idx) => (
                <img
                  key={idx}
                  src={gif}
                  alt={`현재 제스처 GIF ${idx + 1}`}
                  className={styles.previewSmallImage}
                />
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/gif"
            multiple
            onChange={(e) => handleMultipleFilesChange(e, setGestureGifs)}
            className={styles.input}
          />
        </label>

        {/* [9] 착용샷 이미지 */}
        <label className={styles.label}>
          착용샷 이미지 (여러 파일 선택 가능):
          {wearingShotImagesPreview.length > 0 && wearingShotImages.length === 0 && (
            <div className={styles.previewList}>
              <p>현재 착용샷:</p>
              {wearingShotImagesPreview.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`현재 착용샷 ${idx + 1}`}
                  className={styles.previewSmallImage}
                />
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleMultipleFilesChange(e, setWearingShotImages)}
            className={styles.input}
          />
        </label>

        {/* [10] 키워드 */}
        <label className={styles.label}>
          키워드 (쉼표로 구분):
          <input
            type="text"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <hr className={styles.hr} />

        {/* 중앙 노드 */}
        <h2 className={styles.nodeTitle}>중앙 노드</h2>
        {centerNodes.map((node, index) => (
          <div key={index} className={styles.nodeGroup}>
            <label className={styles.label}>
              순서:
              <input
                type="number"
                value={node.nodeOrder}
                onChange={(e) =>
                  updateCenterNode(index, "nodeOrder", e.target.value)
                }
                className={styles.input}
                required
              />
            </label>
            <label className={styles.label}>
              노드 사진:
              {node.preview && !node.photo && (
                <div className={styles.preview}>
                  <p>현재 사진:</p>
                  <img
                    src={node.preview}
                    alt={`현재 노드 사진 ${node.nodeOrder}`}
                    className={styles.previewSmallImage}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateCenterNode(index, "photo", e.target.files[0])
                }
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              재화 가격:
              <input
                type="number"
                value={node.currencyPrice}
                onChange={(e) =>
                  updateCenterNode(index, "currencyPrice", e.target.value)
                }
                className={styles.input}
                required
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addCenterNode}
          className={styles.smallButton}
        >
          중앙 노드 추가
        </button>

        <hr className={styles.hr} />

        {/* 왼쪽 사이드 노드 */}
        <h2 className={styles.nodeTitle}>왼쪽 사이드 노드</h2>
        {leftSideNodes.map((node, index) => (
          <div key={index} className={styles.nodeGroup}>
            <label className={styles.label}>
              순서:
              <input
                type="number"
                value={node.nodeOrder}
                onChange={(e) =>
                  updateLeftSideNode(index, "nodeOrder", e.target.value)
                }
                className={styles.input}
                required
              />
            </label>
            <label className={styles.label}>
              노드 사진:
              {node.preview && !node.photo && (
                <div className={styles.preview}>
                  <p>현재 사진:</p>
                  <img
                    src={node.preview}
                    alt={`현재 노드 사진 ${node.nodeOrder}`}
                    className={styles.previewSmallImage}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateLeftSideNode(index, "photo", e.target.files[0])
                }
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              재화 가격:
              <input
                type="number"
                value={node.currencyPrice}
                onChange={(e) =>
                  updateLeftSideNode(index, "currencyPrice", e.target.value)
                }
                className={styles.input}
                required
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addLeftSideNode}
          className={styles.smallButton}
        >
          왼쪽 사이드 노드 추가
        </button>

        <hr className={styles.hr} />

        {/* 오른쪽 사이드 노드 */}
        <h2 className={styles.nodeTitle}>오른쪽 사이드 노드</h2>
        {rightSideNodes.map((node, index) => (
          <div key={index} className={styles.nodeGroup}>
            <label className={styles.label}>
              순서:
              <input
                type="number"
                value={node.nodeOrder}
                onChange={(e) =>
                  updateRightSideNode(index, "nodeOrder", e.target.value)
                }
                className={styles.input}
                required
              />
            </label>
            <label className={styles.label}>
              노드 사진:
              {node.preview && !node.photo && (
                <div className={styles.preview}>
                  <p>현재 사진:</p>
                  <img
                    src={node.preview}
                    alt={`현재 노드 사진 ${node.nodeOrder}`}
                    className={styles.previewSmallImage}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateRightSideNode(index, "photo", e.target.files[0])
                }
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              재화 가격:
              <input
                type="number"
                value={node.currencyPrice}
                onChange={(e) =>
                  updateRightSideNode(index, "currencyPrice", e.target.value)
                }
                className={styles.input}
                required
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addRightSideNode}
          className={styles.smallButton}
        >
          오른쪽 사이드 노드 추가
        </button>

        <hr className={styles.hr} />

        {/* 제작자 / 설명 */}
        <label className={styles.label}>
          제작자 명:
          <input
            type="text"
            name="creator"
            value={formData.creator}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          설명:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        {/* 제출 버튼 */}
        <Link href={`/sky/travelingSprits/generalVisits/${id}`}>
  <button type="button" className={styles.button}>
    수정하기
  </button>
</Link>
      </form>
    </div>
  );
}
