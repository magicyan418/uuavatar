"use client";

import multiavatar from "@multiavatar/multiavatar/esm";
import { useMemo, useState } from "react";

const Uuavatar = () => {
  const [name, setName] = useState("magicyan");
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const previewName = name.trim() || "magicyan";
  const svgCode = useMemo(() => multiavatar(previewName), [previewName]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.slice(0, 32));
    setError("");
    setNotice("");
  };

  const handleRandom = async () => {
    setIsRandomizing(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/random-name", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || typeof payload.name !== "string") {
        throw new Error(payload.message || "随机名字生成失败");
      }

      setName(payload.name.slice(0, 32));
      if (payload.fallback) {
        setNotice("随机名字接口暂时不可用，先用一个本地名字吧");
      }
    } catch (requestError) {
      console.error("获取随机名字失败:", requestError);
      setError("暂时拿不到随机名字，再试一次吧");
    } finally {
      setIsRandomizing(false);
    }
  };

  const handleDownload = () => {
    const svgBlob = new Blob([svgCode], { type: "image/svg+xml" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const scale = 10;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const context = canvas.getContext("2d");
      context?.scale(scale, scale);
      context?.drawImage(img, 0, 0, img.width, img.height);

      const pngUrl = canvas.toDataURL("image/png", 1);
      const link = document.createElement("a");
      const safeName = previewName.replace(/[\\/:*?"<>|]/g, "").trim();
      link.href = pngUrl;
      link.download = `${safeName || "avatar"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(svgUrl);
    };

    img.onerror = () => URL.revokeObjectURL(svgUrl);
    img.src = svgUrl;
  };

  return (
    <main className="app-shell">
      <div className="ambient-shape ambient-shape--top" aria-hidden="true" />
      <div className="ambient-shape ambient-shape--bottom" aria-hidden="true" />

      <section className="studio-card">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              U
            </span>
            <span className="brand-name">
              UU AVATAR <small>STUDIO</small>
            </span>
          </div>
          <div className="topbar-note">
            <span className="status-dot" aria-hidden="true" />
            简单、好玩、随时生成
          </div>
        </header>

        <div className="studio-grid">
          <section className="intro-copy">
            <p className="eyebrow">个性化头像工作室</p>
            <h1>
              让名字，
              <br />
              <span>长成一个头像。</span>
            </h1>
            <p className="intro-description">
              输入一个名字，马上生成一个独一无二的 UU Avatar。换个名字，
              角色也会跟着变。
            </p>

            <div className="mini-illustration" aria-hidden="true">
              <span className="doodle-sun" />
              <span className="doodle-cloud doodle-cloud--one" />
              <span className="doodle-cloud doodle-cloud--two" />
              <span className="doodle-star doodle-star--one">✦</span>
              <span className="doodle-star doodle-star--two">✦</span>
              <span className="doodle-line" />
            </div>
          </section>

          <section className="generator-panel" aria-label="头像生成器">
            <div className="panel-heading">
              <div>
                <p className="field-label">你的名字</p>
                <p className="field-help">名字会即时生成专属形象</p>
              </div>
              <span className="live-pill">LIVE</span>
            </div>

            <label className="input-wrap">
              <span className="input-icon" aria-hidden="true">
                ✦
              </span>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="输入名字生成头像"
                aria-label="输入名字生成头像"
              />
              <span className="input-count" aria-hidden="true">
                {name.length}/32
              </span>
            </label>

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            {notice && <p className="notice-message">{notice}</p>}

            <div className="action-row">
              <button
                type="button"
                onClick={handleRandom}
                disabled={isRandomizing}
                className="button button--secondary"
              >
                <span aria-hidden="true">{isRandomizing ? "…" : "✣"}</span>
                {isRandomizing ? "正在想一个" : "随机名字"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="button button--primary"
              >
                <span aria-hidden="true">↓</span>
                下载头像
              </button>
            </div>
          </section>
        </div>

        <section className="preview-section" aria-label="头像预览">
          <div className="preview-info">
            <p className="preview-kicker">AVATAR PREVIEW</p>
            <h2>这就是你的新头像</h2>
            <p>
              每个名字都有自己的样子。试着输入一个昵称，看看它会变成什么。
            </p>
            <div className="preview-tip">
              <span aria-hidden="true">↗</span>
              输入时实时更新
            </div>
          </div>

          <div className="avatar-stage">
            <span className="stage-scribble stage-scribble--left" aria-hidden="true">
              ✦
            </span>
            <span className="stage-scribble stage-scribble--right" aria-hidden="true">
              ○
            </span>
            <span className="stage-leaf stage-leaf--one" aria-hidden="true" />
            <span className="stage-leaf stage-leaf--two" aria-hidden="true" />
            <div
              dangerouslySetInnerHTML={{ __html: svgCode }}
              className="avatar-frame"
            />
            <div className="avatar-caption">
              <span className="caption-dot" aria-hidden="true" />
              <strong>{previewName}</strong>
              <span>UU avatar</span>
            </div>
          </div>
        </section>

        <footer className="studio-footer">
          <span>由名字开始，做一个有趣的自己。</span>
          <span className="footer-decoration" aria-hidden="true">
            ✿
          </span>
        </footer>
      </section>
    </main>
  );
};

export default Uuavatar;
