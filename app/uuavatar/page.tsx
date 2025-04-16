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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">UU Avatar Generator</h1>
        
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-md">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all overflow-hidden whitespace-nowrap"
              placeholder="输入名字生成头像"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRandom}
              className="cursor-pointer px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-md"
            >
              随机名字
            </button>
            <button
              onClick={handleDownload}
              className="cursor-pointer px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transform hover:scale-105 transition-all shadow-md"
            >
              下载头像
            </button>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: svgCode }}
            className="w-64 h-64 p-4 bg-white rounded-full shadow-lg border-2 border-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Uuavatar;