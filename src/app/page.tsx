import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="wrap">

      {/* ── 마음가짐 ── */}
      <section className="intro-manifesto">
        <p className="eyebrow">말만 하고 있는가, 행동을 하고 있는가?</p>
        <h2 className="intro-headline">
          유튜브, 인스타 해보고 싶다 말하는 사람은<br />크리에이터가 아닙니다.
        </h2>
        <div className="intro-body-stack">
          <p className="intro-body">
            누구도 거들떠보지 않을 것 같은 허접한 콘텐츠라도 직접 만드는 사람이 크리에이터입니다.
          </p>
          <p className="intro-body">
            뻔하고 재미없는 아이디어지만 직접 만들고 팔고 있는 사람이 사업가입니다.
          </p>
          <p className="intro-body">
            말만 해서 바뀌는 건 아무것도 없습니다.<br />
            변화를 원한다면, 다른 말이 아닌 <strong>다른 행동</strong>을 해야 합니다.
          </p>
        </div>
      </section>

      {/* ── 왜 CreatorBoard인가 ── */}
      <section className="intro-why">
        <div className="intro-why-grid">
          <div>
            <p className="eyebrow">열심히 하는데 왜 나만 돈이 안 모일까?</p>
            <h2 className="intro-headline">
              차이는 재능도, 운도 아닙니다.<br />수익 구조를 설계했느냐입니다.
            </h2>
            <div className="intro-body-stack">
              <p className="intro-body">
                치솟는 물가에 월급만으로는 턱없이 부족합니다.<br />
                그래서 많은 분들이 SNS를 키우거나 1인 사업을 시작합니다.
              </p>
              <p className="intro-body">
                그런데 이상한 점이 있습니다.<br />
                다들 똑같이 잠을 줄여가며 열심히 하는데, 결과는 두 부류로 극명하게 나뉩니다.
              </p>
              <p className="intro-body">
                어떤 사람은 시간이 갈수록 <strong>돈이 쌓입니다.</strong><br />
                어떤 사람은 돈은 안 모이고 <strong>계속 바쁩니다.</strong>
              </p>
              <p className="intro-body">
                차이는 재능이 아닙니다. 운도 아닙니다.<br />
                진짜 차이는 단 하나, <strong>수익 구조를 알고 설계했느냐</strong>입니다.
              </p>
            </div>
          </div>
          <div className="intro-stat-stack">
            <div className="intro-stat-card">
              <span className="intro-stat-label">고객 획득 비용 (CAC)</span>
              <strong>고객 한 명을 데려오는 데 드는 비용</strong>
              <p>유튜브는 잘 만든 영상 하나가 몇 달 뒤에도 계속 일합니다. 제대로 설계하면 CAC를 거의 0에 가깝게 낮출 수 있습니다.</p>
            </div>
            <div className="intro-stat-card">
              <span className="intro-stat-label">고객 생애 가치 (LTV)</span>
              <strong>그 고객이 내 사업에 쓰는 총금액</strong>
              <p>조회수 수익(평균 3원/회)만 보면 금방 지칩니다. 진짜 질문은 "이 콘텐츠가 내 상품 구매로 이어지는가?"입니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 무엇을 얻는가 ── */}
      <section className="intro-gain">
        <p className="eyebrow">CreatorBoard가 여기 있는 이유</p>
        <h2 className="intro-headline">
          첫 영상조차 못 올리고 있다면,<br />그건 의지의 문제가 아닙니다.
        </h2>
        <div className="intro-body-stack" style={{ maxWidth: 680 }}>
          <p className="intro-body">
            실행 순서가 없기 때문입니다.
          </p>
          <p className="intro-body">
            CreatorBoard는 첫 영상 1개를 <strong>7일 안에 완성</strong>하게 만드는 유튜브 시작 보드입니다.<br />
            처음부터 완벽한 영상은 필요 없습니다. 일단 작게 올리는 <strong>습관을 만드는 것</strong>이 먼저입니다.
          </p>
        </div>
        <div className="intro-gain-grid">
          <div className="intro-gain-card">
            <span>01</span>
            <strong>수익 구조 이해</strong>
            <p>조회수가 아닌 고객 획득 비용 기준으로 유튜브를 설계합니다.</p>
          </div>
          <div className="intro-gain-card">
            <span>02</span>
            <strong>7일 첫 영상 완성</strong>
            <p>주제 진단부터 제목·썸네일·구성안까지, 막혀 있던 첫 걸음을 같이 뗍니다.</p>
          </div>
          <div className="intro-gain-card">
            <span>03</span>
            <strong>업로드 습관 형성</strong>
            <p>한 편, 한 편 올리다 보면 자연스럽게 고민이 생기고, 그 고민이 배움이 됩니다.</p>
          </div>
          <div className="intro-gain-card">
            <span>04</span>
            <strong>자산형 콘텐츠 구축</strong>
            <p>영상 하나하나가 자고 있을 때도 고객을 데려오는 영업사원이 됩니다.</p>
          </div>
        </div>
        <div className="intro-mindset-box">
          <p>
            성공한 사람들은 <strong>과정을 후회</strong>합니다.<br />
            &ldquo;그때 좀 더 잘했으면 어땠을까?&rdquo;
          </p>
          <p style={{ marginTop: 14 }}>
            실패한 사람들은 <strong>시작 자체를 후회</strong>합니다.<br />
            &ldquo;애초에 시작하지 않았으면 좋았을 텐데.&rdquo;
          </p>
          <p style={{ marginTop: 14 }}>
            후회가 찾아오면 피하지 마세요. 철저히 복기하세요.<br />
            과정을 제대로 복기하는 순간, 후회는 실패가 아니라 <strong>성장</strong>이 됩니다.
          </p>
        </div>
      </section>

      {/* ── 기존 히어로 CTA ── */}
      <section className="hero">
        <div>
          <p className="eyebrow">첫 영상 완성 MVP</p>
          <h1>당신이 바로 찍을 수 있고,<br />오래 할 수 있는 주제를<br />찾습니다.</h1>
          <p className="lead" style={{ maxWidth: "none" }}>
            진단으로 수익형 유튜브 주제를 좁히고,<br />
            뜨는 영상 3개를 조합해 제목·썸네일·구성안·7일 플랜까지 만듭니다.
          </p>
          <div className="actions">
            <Link className="btn btn-primary btn-large" href="/diagnosis">
              진단 시작 <ArrowRight size={18} />
            </Link>
            <Link className="btn btn-secondary" href="/board">저장 결과 보기</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
