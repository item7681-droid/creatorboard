"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";

type ResultDetail = {
  id: string;
  finalTitle: string;
  finalThumbnailText: string;
  videoOutline: string[];
  sevenDayPlan: Array<{ day: number; title: string; task: string }>;
  memo: string | null;
};

export default function ResultDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<ResultDetail | null>(null);

  useEffect(() => {
    fetch(`/api/results/${params.id}`)
      .then((res) => {
        if (res.status === 401) router.replace("/signin");
        return res.json();
      })
      .then((data) => setResult(data.result ?? null));
  }, [params.id, router]);

  async function save(formData: FormData) {
    if (!result) return;
    const payload = {
      finalTitle: String(formData.get("finalTitle")),
      finalThumbnailText: String(formData.get("finalThumbnailText")),
      videoOutline: String(formData.get("videoOutline")).split("\n").filter(Boolean),
      sevenDayPlan: result.sevenDayPlan,
      memo: String(formData.get("memo"))
    };
    const response = await fetch(`/api/results/${result.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) router.push("/board");
  }

  async function remove() {
    if (!result) return;
    await fetch(`/api/results/${result.id}`, { method: "DELETE" });
    router.push("/board");
  }

  if (!result) {
    return <main className="wrap"><div className="panel panel-pad">결과를 불러오는 중입니다.</div></main>;
  }

  return (
    <main className="wrap">
      <section className="section-head">
        <div>
          <p className="eyebrow">저장 결과 수정</p>
          <h1 style={{ fontSize: 46 }}>첫 영상 계획을 다듬으세요.</h1>
        </div>
      </section>
      <form className="panel panel-pad grid" action={save}>
        <div className="field">
          <label>최종 제목</label>
          <input className="input" name="finalTitle" defaultValue={result.finalTitle} />
        </div>
        <div className="field">
          <label>최종 썸네일 문구</label>
          <input className="input" name="finalThumbnailText" defaultValue={result.finalThumbnailText} />
        </div>
        <div className="field">
          <label>2분 영상 구성안</label>
          <textarea className="textarea" name="videoOutline" defaultValue={result.videoOutline.join("\n")} />
        </div>
        <div className="field">
          <label>메모</label>
          <textarea className="textarea" name="memo" defaultValue={result.memo ?? ""} />
        </div>
        <section className="panel panel-pad">
          <h2>7일 실행 플랜</h2>
          <div className="plan" style={{ marginTop: 16 }}>
            {result.sevenDayPlan.map((day) => (
              <div className="plan-day" key={day.day}>
                <strong>Day {day.day}. {day.title}</strong>
                <p className="muted" style={{ marginTop: 8 }}>{day.task}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="toolbar">
          <button className="btn btn-primary" type="submit">
            <Save size={18} /> 저장
          </button>
          <button className="btn btn-secondary" type="button" onClick={remove}>
            <Trash2 size={18} /> 삭제
          </button>
        </div>
      </form>
    </main>
  );
}
