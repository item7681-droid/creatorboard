"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main className="wrap">
      <section className="panel panel-pad" style={{ maxWidth: 520, margin: "70px auto" }}>
        <p className="eyebrow">저장하려면 로그인</p>
        <h1 style={{ fontSize: 42 }}>결과 저장을 위해 Google 로그인이 필요합니다.</h1>
        <p className="lead">진단과 생성은 무료로 진행되고, 저장/수정/내 보드에서만 계정을 사용합니다.</p>
        {error ? (
          <div className="notice" style={{ marginTop: 18 }}>
            Google 로그인 설정을 확인해야 합니다. OAuth 클라이언트, 리디렉션 URI, 환경변수 설정이 맞는지 점검해주세요.
          </div>
        ) : null}
        <div className="actions">
          <button className="btn btn-primary" onClick={() => signIn("google", { callbackUrl: "/board" })}>
            <LogIn size={18} /> Google로 계속
          </button>
        </div>
      </section>
    </main>
  );
}
