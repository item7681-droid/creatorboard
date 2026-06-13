"use client";

import Link from "next/link";
import { ExternalLink, FileText, Film } from "lucide-react";

export default function EditPage() {
  return (
    <main className="wrap">

      {/* ── 헤더 ── */}
      <div className="section-head">
        <div>
          <p className="eyebrow">DAY 6 · 캡컷으로 편집하기</p>
          <h1 style={{ fontSize: 46 }}>나레이션을 먼저 넣고<br />스토리보드대로 편집하세요.</h1>
          <div className="lead lead-stack" style={{ maxWidth: "none" }}>
            <p>
              편집의 기준은 <strong>나레이션 흐름</strong>입니다.<br />
              나레이션 파일을 타임라인에 먼저 올린 뒤, 말에 맞는 영상 클립을 붙여나가세요.
            </p>
            <p>
              Google Docs에 정리한 스토리보드를 옆에 띄워두고 편집하면<br />
              어떤 장면을 언제 넣어야 할지 헷갈리지 않습니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 도구 링크 ── */}
      <section className="grid grid-2">
        <div className="panel panel-pad">
          <p className="eyebrow">편집 도구</p>
          <div className="tool-link-list">
            <a
              className="tool-link"
              href="https://www.capcut.com/ko-kr/"
              target="_blank"
              rel="noreferrer"
            >
              <Film size={20} />
              <span>캡컷(CapCut) 열기</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
            PC 버전을 사용하면 파일 관리가 쉽고 편집 속도가 빠릅니다.<br />
            아직 설치 전이라면 아래 설치 방법을 먼저 따라 하세요.
          </p>
        </div>

        <div className="panel panel-pad">
          <p className="eyebrow">스토리보드 보기</p>
          <div className="tool-link-list">
            <a
              className="tool-link"
              href="https://docs.google.com/"
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={20} />
              <span>Google Docs 열기</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
            DAY 4~5에서 정리한 스토리보드를 옆 화면에 띄워두세요.<br />
            장면 순서와 나레이션을 확인하면서 편집하면 훨씬 빠릅니다.
          </p>
        </div>
      </section>

      {/* ── 캡컷 PC 설치 방법 ── */}
      <section className="panel panel-pad plan-section">
        <p className="eyebrow">캡컷 PC 버전 설치 방법</p>
        <h2>처음이면 여기부터 하세요.</h2>
        <div className="day-list" style={{ marginTop: 20 }}>
          <div className="day-card today">
            <div className="day-card-head">
              <span className="num day-num">1</span>
            </div>
            <div>
              <h3>캡컷 사이트 접속</h3>
              <p className="muted">
                위 버튼을 눌러 캡컷 공식 사이트(capcut.com)로 이동합니다.<br />
                상단 메뉴에서 <strong>다운로드</strong>를 클릭하세요.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">2</span>
            </div>
            <div>
              <h3>PC 버전 다운로드</h3>
              <p className="muted">
                Windows 또는 Mac 버튼을 눌러 설치 파일을 다운로드합니다.<br />
                다운로드된 파일을 실행해 설치를 완료하세요.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">3</span>
            </div>
            <div>
              <h3>로그인 또는 건너뛰기</h3>
              <p className="muted">
                TikTok, Google, 이메일 중 하나로 로그인하거나 건너뛸 수 있습니다.<br />
                로그인하면 프로젝트가 클라우드에 자동 저장됩니다.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">4</span>
            </div>
            <div>
              <h3>새 프로젝트 만들기</h3>
              <p className="muted">
                실행 후 <strong>새 프로젝트</strong>를 클릭합니다.<br />
                해상도는 <strong>1920×1080 (16:9)</strong>으로 설정하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 편집 순서 ── */}
      <section className="panel panel-pad plan-section">
        <p className="eyebrow">편집 순서</p>
        <h2>나레이션을 기준으로 영상을 맞추세요.</h2>
        <div className="day-list" style={{ marginTop: 20 }}>
          <div className="day-card today">
            <div className="day-card-head">
              <span className="num day-num">1</span>
              <span className="day-status">가장 먼저</span>
            </div>
            <div>
              <h3>나레이션 파일 먼저 올리기</h3>
              <p className="muted">
                DAY 4에서 녹음한 나레이션 파일을 타임라인에 <strong>가장 먼저</strong> 올립니다.<br />
                나레이션이 편집의 기준점이 됩니다. 영상 클립은 나레이션 흐름에 맞춰 붙여나가세요.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">2</span>
            </div>
            <div>
              <h3>스토리보드 확인하며 클립 넣기</h3>
              <p className="muted">
                Google Docs의 스토리보드를 옆에 띄우고, 장면 순서대로 촬영한 클립을 가져옵니다.<br />
                나레이션 대사가 시작되는 타이밍에 맞춰 클립을 배치하세요.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">3</span>
            </div>
            <div>
              <h3>불필요한 침묵과 빈 화면 자르기</h3>
              <p className="muted">
                나레이션 사이 긴 침묵 구간을 잘라내세요.<br />
                영상 클립이 없는 빈 구간이 생기면 B-roll(사물, 화면 클로즈업)로 채웁니다.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">4</span>
            </div>
            <div>
              <h3>자막 넣기</h3>
              <p className="muted">
                DAY 4에서 Vrew로 만든 <strong>SRT 파일</strong>을 캡컷에 불러옵니다.<br />
                텍스트 → 자막 가져오기 → SRT 파일 선택하면 자막이 자동으로 배치됩니다.<br />
                또는 SRT 파일을 찾아 캡컷 화면으로 끌어다 놓으면 자동으로 업로드됩니다.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">5</span>
            </div>
            <div>
              <h3>배경음악 넣기</h3>
              <p className="muted">
                유튜브 스튜디오의 오디오 보관함에서 저작권 없는 음악을 무료로 다운로드할 수 있습니다.<br />
                1. <strong>유튜브 스튜디오</strong> 접속 → 왼쪽 메뉴 <strong>오디오 보관함</strong> 클릭<br />
                2. 상단 <strong>보관함 검색 또는 필터링</strong>을 클릭<br />
                3. <strong>분위기</strong> 또는 <strong>장르</strong>를 선택해 원하는 느낌으로 필터링<br />
                4. 마음에 드는 트랙 클릭 → <strong>▶ 재생</strong>으로 미리 듣기<br />
                5. <strong>추가된 날짜</strong> 항목에 마우스를 가져가면 나타나는 다운로드 버튼을 클릭<br />
                6. 다운로드한 음악 파일을 캡컷 타임라인으로 끌어다 놓고 볼륨을 조절하세요.
              </p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">6</span>
            </div>
            <div>
              <h3>내보내기 (4K)</h3>
              <p className="muted">
                편집이 끝나면 우측 상단 <strong>내보내기</strong>를 클릭합니다.<br />
                해상도 <strong>4K</strong>, 프레임레이트 <strong>30fps</strong>로 설정하세요.<br />
                저장 위치는 영상 파일과 썸네일 사진 파일이 담긴 폴더로 지정해서 한곳에서 관리하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="actions actions-end" style={{ marginBottom: 40 }}>
        <Link className="btn btn-secondary" href="/shooting">
          ← DAY 5로 돌아가기
        </Link>
        <Link className="btn btn-primary btn-large" href="/upload">
          DAY 7 업로드 문장 보기 →
        </Link>
      </div>

    </main>
  );
}
