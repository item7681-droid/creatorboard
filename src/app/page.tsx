import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="wrap">

      {/* ── 히어로 ── */}
      <section className="hero">
        <div>
          <p className="eyebrow">18문항으로 찾는 내 채널 주제</p>
          <h1>
            어떤 유튜브를 해야 할지 막막한가요?<br />
            당신의 콘텐츠 성향이 곧 가장 현실적인 시작점이 됩니다.
          </h1>
          <p className="lead">
            남들의 화려한 결과물과 비교하며 시작을 미루지 마세요.<br />
            크리에이터 보드가 당신의 성향을 분석해, 가장 지치지 않고 오래 할 수 있는<br /><strong>&lsquo;맞춤형 크리에이터 지도&rsquo;</strong>를 찾아드립니다.
          </p>
          <p className="lead" style={{ marginTop: 8 }}>
            당신이 바로 찍을 수 있고, 오래 할 수 있는 주제를 찾습니다.<br />
            콘텐츠 성향 진단으로 수익형 유튜브 주제를 좁히고, 뜨는 영상 3개를 조합해 제목·썸네일·구성안·7일 플랜까지 만듭니다.
          </p>
          <div className="hero-prereqs">
            <span className="prereq-chip">✓ 매일 최소 1시간 투자</span>
            <span className="prereq-chip">✓ 스마트폰 보유</span>
            <span className="prereq-chip">✓ PC 보유</span>
          </div>
        </div>
      </section>

      {/* ── 공감 ── */}
      <section className="intro-why">
        <div>
          <p className="eyebrow">열심히 하는데 왜 나만 돈을 못 벌까?</p>
          <h2 className="intro-headline">
            차이는 재능도, 운도 아닙니다.<br />수익 구조를 설계했느냐입니다.
          </h2>
          <div className="intro-body-stack">
            <p className="intro-body">
              치솟는 물가에 월급만으로는 부족합니다.<br />
              그래서 SNS를 키우거나 1인 사업을 시작하죠.
            </p>
            <p className="intro-body">
              그런데 다들 똑같이 열심히 하는데 결과는 두 부류로 나뉩니다.
            </p>
            <p className="intro-body">
              어떤 사람은 시간이 갈수록 <strong>돈이 쌓입니다.</strong><br />
              어떤 사람은 돈은 안 모이고 <strong>계속 바쁩니다.</strong>
            </p>
            <p className="intro-body">
              진짜 차이는 단 하나, <strong>수익 구조를 알고 설계했느냐</strong>입니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 솔루션 카드 ── */}
      <section className="intro-gain">
        <p className="eyebrow">CreatorBoard가 여기 있는 이유</p>
        <h2 className="intro-headline">
          첫 영상조차 못 올리고 있다면,<br />그건 의지의 문제가 아닙니다.
        </h2>
        <div className="intro-body-stack" style={{ maxWidth: 680 }}>
          <p className="intro-body">
            실행 순서가 없기 때문입니다.
          </p>
        </div>
        <div className="intro-gain-grid">
          <div className="intro-gain-card">
            <span>01</span>
            <strong>완벽주의 대신, 나만의 무기 찾기</strong>
            <p>남의 성공 공식을 억지로 따라 하지 마세요. 당신의 성향을 분석해, 가장 지치지 않고 오래 할 수 있는 맞춤 카테고리를 매칭합니다.</p>
          </div>
          <div className="intro-gain-card">
            <span>02</span>
            <strong>막막함 대신, 지금 당장 시작할 수 있는 가이드</strong>
            <p>첫 영상으로 무엇을 찍을지 고민하지 마세요. 성향에 맞춰 추천 키워드·소재·7일 플랜을 제안합니다.</p>
          </div>
          <div className="intro-gain-card">
            <span>03</span>
            <strong>부담감 대신, 가벼운 아이디어 보드</strong>
            <p>처음부터 완벽한 대본이 필요 없습니다. 매일 떠오르는 작은 아이디어와 영감을 보드에 가볍게 수집하고 기록하세요.</p>
          </div>
          <div className="intro-gain-card">
            <span>04</span>
            <strong>자산형 콘텐츠 구축</strong>
            <p>영상 하나하나가 자고 있을 때도 고객을 데려오는 영업사원이 됩니다.</p>
          </div>
        </div>
      </section>

      {/* ── 마음가짐 ── */}
      <section className="intro-manifesto">
        <p className="eyebrow">말만 하고 있는가, 행동을 하고 있는가?</p>
        <h2 className="intro-headline">
          유튜브, 인스타 해보고 싶다 말하는 사람은<br />크리에이터가 아닙니다.
        </h2>
        <div className="intro-body-stack">
          <p className="intro-body">
            완성도보다 완성이 먼저인 사람이 크리에이터입니다.
          </p>
          <p className="intro-body">
            뻔하고 재미없는 아이디어지만 직접 만들고 팔고 있는 사람이 사업가입니다.
          </p>
          <p className="intro-body">
            말만 해서 바뀌는 건 아무것도 없습니다.<br />
            변화를 원한다면, 다른 말이 아닌 <strong>다른 행동</strong>을 해야 합니다.
          </p>
        </div>
        <div className="intro-mindset-box">
          <p>
            처음 올린 영상은 못봐줄 수도 있습니다.
          </p>
          <p style={{ marginTop: 14 }}>
            그래도 올린 사람이 올리지 않은 사람보다 단 하나를 압니다.
          </p>
          <p style={{ marginTop: 14 }}>
            <strong>&ldquo;다음엔 뭘 고쳐야 할지를.&rdquo;</strong>
          </p>
        </div>
        <div className="actions" style={{ marginTop: 40, justifyContent: "center" }}>
          <Link className="btn btn-primary btn-large" href="/diagnosis">
            1분 만에 내 맞춤 채널 주제 알아보기 <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}
