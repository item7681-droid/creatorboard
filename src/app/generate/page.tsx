"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Wand2 } from "lucide-react";
import { cacheCompletedDay } from "@/lib/flow/progress";
import type { GeneratedPlan } from "@/lib/templates/profit";

export default function GeneratePage() {
  const router = useRouter();
  const [generated, setGenerated] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedThumb, setSelectedThumb] = useState("");
  const diagnosis = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("creatorboard_diagnosis");
    return raw ? JSON.parse(raw) : null;
  }, []);
  const selected = useMemo(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("creatorboard_selected_videos");
    return raw ? JSON.parse(raw) : [];
  }, []);

  useEffect(() => {
    if (!diagnosis || selected.length !== 3) {
      router.replace("/videos");
      return;
    }
    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationSessionId: diagnosis.generationSessionId,
        videoIds: selected,
        keyword: diagnosis.recommendedKeywords?.[0]
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.generated) throw new Error(data.message ?? "생성 실패");
        setGenerated(data.generated);
        localStorage.setItem("creatorboard_generated", JSON.stringify(data.generated));
        const firstTitle = data.generated.titleCandidates[0] ?? "";
        const firstThumb = data.generated.thumbnailCandidates[0] ?? "";
        setSelectedTitle(firstTitle);
        setSelectedThumb(firstThumb);
        localStorage.setItem("creatorboard_final_title", firstTitle);
        localStorage.setItem("creatorboard_final_thumbnail", firstThumb);
        cacheCompletedDay(2);
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [diagnosis, router, selected]);

  if (loading) {
    return (
      <main className="wrap">
        <div className="panel panel-pad">
          <Wand2 size={18} /> 수익형 템플릿으로 결과를 만드는 중입니다.
        </div>
      </main>
    );
  }

  const canConfirm = Boolean(selectedTitle && selectedThumb && generated);

  return (
    <main className="wrap">
      <section className="section-head">
        <div>
          <p className="eyebrow">문구 확정</p>
          <h1 style={{ fontSize: 46 }}>제목과 썸네일 문구를<br />하나씩 고르세요.</h1>
          <p className="lead" style={{ maxWidth: "none" }}>
            선택한 영상 3개의 제목과 썸네일 문구를 조합했습니다.<br />
            여기서 고른 문구로 다음 단계에서 썸네일과 2분 영상 구성안을 만듭니다.
          </p>
        </div>
      </section>
      <section className="selection-guide panel panel-pad">
        <div>
          <p className="eyebrow">선택 기준</p>
          <h2>바로 이해되고, 썸네일에 짧게 들어갈 문구를 고르세요.</h2>
          <p className="muted">제목은 검색과 클릭을, 썸네일 문구는 첫눈에 보이는 약속을 담당합니다.</p>
          <div className="tip-box">
            <h3>제목 디벨롭이 가장 중요한 이유</h3>
            <p>
              조회수를 결정하는 변수 중 썸네일과 제목의 비중이 가장 높습니다. 그중 제목은 가장 적은 시간과 노력으로
              클릭률을 높일 수 있는 치트키라서 먼저 디벨롭하는 방법을 배워야 합니다.
            </p>
            <p>제목은 공백 포함 35자 이내로 짧고 강하게 작성하세요. 메모장 글자수 확인을 권장합니다.</p>
          </div>
        </div>
        <div className="selection-count ready">
          <Check size={18} />
          <strong>1+1</strong>
          <span>각 1개 선택</span>
        </div>
      </section>
      <div className="grid grid-2">
        <CandidatePanel
          eyebrow="제목 5개"
          title="제목 후보"
          items={generated?.titleCandidates ?? []}
          storageKey="creatorboard_final_title"
          onSelect={setSelectedTitle}
        />
        <CandidatePanel
          eyebrow="썸네일 문구 5개"
          title="썸네일 문구 후보"
          items={generated?.thumbnailCandidates ?? []}
          storageKey="creatorboard_final_thumbnail"
          onSelect={setSelectedThumb}
        />
      </div>
      <div className="actions actions-center">
        <button
          className="btn btn-primary btn-large"
          disabled={!canConfirm}
          onClick={() => router.push("/thumbnail")}
        >
          <Check size={18} />{" "}
          {canConfirm
            ? "문구 확정"
            : "제목과 썸네일 문구를 각각 선택하세요"}
        </button>
      </div>
      <p className="next-step-note">다음 화면에서 선택한 제목과 썸네일 문구로 썸네일과 사진 구성안을 정리합니다.</p>
    </main>
  );
}

function CandidatePanel({
  eyebrow,
  title,
  items,
  storageKey,
  onSelect
}: {
  eyebrow: string;
  title: string;
  items: string[];
  storageKey: string;
  onSelect: (value: string) => void;
}) {
  const [active, setActive] = useState(items[0] ?? "");

  useEffect(() => {
    if (items[0]) setActive(items[0]);
  }, [items]);

  function select(item: string) {
    setActive(item);
    localStorage.setItem(storageKey, item);
    onSelect(item);
  }

  return (
    <section className="panel panel-pad">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="choice-list choice-list-polished" style={{ marginTop: 16 }}>
        {items.map((item, index) => (
          <button
            className={`choice ${active === item ? "active" : ""}`}
            key={item}
            onClick={() => select(item)}
          >
            <span className="choice-index">{index + 1}</span>
            <span>{item}</span>
            {active === item ? <Check size={18} /> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
