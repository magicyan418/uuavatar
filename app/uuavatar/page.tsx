"use client";

import multiavatar from "@multiavatar/multiavatar/esm";
import { useState, useMemo } from "react";

const Uuavatar = () => {
  const [name, setName] = useState("magicyan");
  const svgCode = useMemo(() => multiavatar(name), [name]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleRandom = async () => {
    try {
      const response = await fetch("https://api.oick.cn/api/uname");
      const randomName = await response.json();
      setName(randomName);
    } catch (error) {
      console.error('获取随机名字失败:', error);
    }
  };

  const handleDownload = () => {
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const scale = 10; // 提高分辨率倍数
      const canvas = document.createElement('canvas');
      // 设置 canvas 的实际尺寸（用于绘制）
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      // 设置 canvas 的显示尺寸（保持原始大小）
      canvas.style.width = `${img.width}px`;
      canvas.style.height = `${img.height}px`;
      
      const ctx = canvas.getContext('2d');
      // 设置高质量渲染
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      // 先缩放画布
      ctx?.scale(scale, scale);
      // 然后绘制图像
      ctx?.drawImage(img, 0, 0, img.width, img.height);
      
      const pngUrl = canvas.toDataURL('image/png', 1.0); // 使用最高质量
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${name || 'avatar'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex flex-col items-center justify-center p-4 sm:p-8 animate-gradient">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-center gradient-text mb-8">UU Avatar Generator</h1>
        
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-md relative">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all text-lg"
              placeholder="输入名字生成头像"
            />
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleRandom}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
            >
              随机名字
            </button>
            <button
              onClick={handleDownload}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-pink-500/25"
            >
              下载头像
            </button>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div
              dangerouslySetInnerHTML={{ __html: svgCode }}
              className="relative w-64 h-64 p-4 bg-white dark:bg-gray-800 rounded-full shadow-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uuavatar;