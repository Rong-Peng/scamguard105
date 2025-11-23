import React, { useState, useRef } from 'react';
import { analyzeScamContent } from './services/geminiService';
import { AnalysisResult, RiskLevel } from './types';
import AnalysisChart from './components/AnalysisChart';
import FeatureCard from './components/FeatureCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      // Limit to 3 images for simplicity
      setSelectedFiles(prev => [...prev, ...filesArray].slice(0, 3));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const newFiles: File[] = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          newFiles.push(file);
        }
      }
    }

    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 3));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!inputText && selectedFiles.length === 0) {
      setError("请输入文字或上传图片进行分析");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeScamContent(inputText, selectedFiles);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "分析过程中发生错误，请稍后重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler for Quick Scenario Buttons
  const handleQuickTry = async (type: string) => {
    let mockInput = "";
    if (type === 'pig_butchering') mockInput = "测试杀猪盘案例";
    if (type === 'fake_cs') mockInput = "测试假客服案例";
    if (type === 'brushing') mockInput = "测试刷单兼职案例";

    setInputText(mockInput);
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeScamContent(mockInput, []);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'text-green-400';
      case RiskLevel.SUSPICIOUS: return 'text-yellow-400';
      case RiskLevel.DANGEROUS: return 'text-orange-500';
      case RiskLevel.CRITICAL: return 'text-red-500';
      default: return 'text-slate-200';
    }
  };

  const getRiskBg = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'bg-green-500/10 border-green-500/20';
      case RiskLevel.SUSPICIOUS: return 'bg-yellow-500/10 border-yellow-500/20';
      case RiskLevel.DANGEROUS: return 'bg-orange-500/10 border-orange-500/20';
      case RiskLevel.CRITICAL: return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  const getChineseRiskLevel = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return '安全';
      case RiskLevel.SUSPICIOUS: return '可疑';
      case RiskLevel.DANGEROUS: return '高风险';
      case RiskLevel.CRITICAL: return '极度危险';
      default: return '未知';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownloadPoster = async () => {
    const element = document.getElementById('poster-content');
    // @ts-ignore
    if (element && window.html2canvas) {
      setIsSaving(true);
      try {
        // @ts-ignore
        const canvas = await window.html2canvas(element, {
          backgroundColor: '#1a0f0f',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        
        canvas.toBlob(async (blob: Blob | null) => {
          if (!blob) {
            alert("生成图片失败");
            setIsSaving(false);
            return;
          }

          const fileName = `ScamGuard_Warning_${new Date().getTime()}.png`;
          const file = new File([blob], fileName, { type: 'image/png' });

          // Try Web Share API Level 2 (Mobile friendly for saving to gallery via share sheet)
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: 'ScamGuard 反诈预警海报',
                text: '检测到高危诈骗风险，请立即查看海报！',
              });
              setIsSaving(false);
              return;
            } catch (err) {
              console.log("Share cancelled or failed, falling back to download", err);
              // Fallback to download link below
            }
          }

          // Fallback for Desktop or unsupported browsers
          const link = document.createElement('a');
          link.download = fileName;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          setIsSaving(false);

        }, 'image/png');

      } catch (e) {
        console.error("Screenshot failed", e);
        alert("生成图片失败，请尝试手动截图");
        setIsSaving(false);
      }
    } else {
      alert("保存功能组件加载中，请稍后再试或直接截图。");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30 font-sans">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <i className="fa-solid fa-shield-cat text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              ScamGuard AI
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-400 hidden sm:block">
            智能反诈骗分析平台
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 md:space-y-12">
        
        {/* Hero / Intro */}
        {!result && (
          <div className="text-center space-y-4 py-6 md:py-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              识破谎言，<span className="text-blue-500">守护财产</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg px-2">
              遇到可疑的投资机会？陌生的"完美伴侣"？
              <br className="hidden md:block" />
              将聊天记录或主页截图发给我们，AI 为您即时分析潜在风险。
            </p>
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div 
              className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 md:p-6 shadow-xl transition-colors focus-within:border-blue-500/30"
              onPaste={handlePaste}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                聊天记录 / 骗子资料文本
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="在此粘贴您与对方的聊天记录..."
                className="w-full h-40 md:h-48 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none resize-none placeholder-slate-500 transition-all text-sm md:text-base"
              ></textarea>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  上传截图 (支持点击上传或 Ctrl+V 粘贴)
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl text-slate-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer"
                  >
                    <i className="fa-solid fa-image text-xl mb-1"></i>
                    <span className="text-xs">添加图片</span>
                  </button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="h-20 w-20 relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover rounded-xl border border-slate-700"
                      />
                      <button
                        onClick={() => removeFile(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`mt-6 w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                  isAnalyzing
                    ? 'bg-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    AI 正在深入分析...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-magnifying-glass-chart"></i>
                    开始安全检测
                  </>
                )}
              </button>
            </div>
            
            {/* Quick Actions / Preset Scenarios */}
            {!isAnalyzing && (
              <div className="space-y-3 animate-fade-in">
                 <p className="text-sm text-slate-400 font-medium">✨ 一键体验 AI 案例分析：</p>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleQuickTry('pig_butchering')}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-pink-500/50 rounded-xl transition-all group"
                    >
                       <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                          <i className="fa-solid fa-heart-crack text-pink-400 text-sm"></i>
                       </div>
                       <span className="text-sm font-medium text-slate-300 group-hover:text-white">杀猪盘案例</span>
                    </button>

                    <button 
                      onClick={() => handleQuickTry('fake_cs')}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all group"
                    >
                       <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                          <i className="fa-solid fa-headset text-blue-400 text-sm"></i>
                       </div>
                       <span className="text-sm font-medium text-slate-300 group-hover:text-white">假客服案例</span>
                    </button>

                    <button 
                      onClick={() => handleQuickTry('brushing')}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-yellow-500/50 rounded-xl transition-all group"
                    >
                       <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                          <i className="fa-solid fa-hand-holding-dollar text-yellow-400 text-sm"></i>
                       </div>
                       <span className="text-sm font-medium text-slate-300 group-hover:text-white">刷单兼职案例</span>
                    </button>
                 </div>
              </div>
            )}

            {/* Features (Only show when no result) */}
            {!result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <FeatureCard 
                  icon="fa-solid fa-user-secret" 
                  title="杀猪盘识别" 
                  description="精准识别各类情感诱导、高额回报投资陷阱，保护您的情感与钱袋子。" 
                />
                <FeatureCard 
                  icon="fa-solid fa-comments-dollar" 
                  title="模拟与演练" 
                  description="通过预设案例，AI 将为您演示真实诈骗剧本，提高您的防骗意识。" 
                />
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <div className="space-y-6 animate-fade-in pb-8">
                
                {/* Simulation Dialogue Card (If available) */}
                {result.generatedConversation && (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-600 p-4 md:p-5 shadow-lg">
                    <h4 className="flex items-center gap-2 text-blue-300 font-bold mb-3">
                      <i className="fa-solid fa-robot"></i> AI 模拟诈骗场景
                    </h4>
                    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700 font-mono text-xs md:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
                      {result.generatedConversation}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-right">
                      *以上内容由 AI 生成，仅用于反诈演示
                    </p>
                  </div>
                )}

                {/* Score Card */}
                <div className={`rounded-2xl border p-4 md:p-6 shadow-xl relative overflow-hidden ${getRiskBg(result.riskLevel)}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <i className="fa-solid fa-shield-virus text-8xl md:text-9xl"></i>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-full md:w-48 flex-shrink-0">
                      <AnalysisChart score={result.riskScore} level={result.riskLevel} />
                    </div>
                    <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                      <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-start gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-200">综合风险评估</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          result.riskLevel === RiskLevel.SAFE ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                          result.riskLevel === RiskLevel.SUSPICIOUS ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                          'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}>
                          {getChineseRiskLevel(result.riskLevel)}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-md mx-auto md:mx-0">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generate Poster Button - Main Action */}
                <div className="w-full">
                  <button 
                    onClick={() => setShowPoster(true)}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-900/40 flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] group border border-red-500/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <i className="fa-solid fa-file-image text-white text-sm"></i>
                    </div>
                    <span>一键生成【劝退亲友】警示海报 (长图)</span>
                    <i className="fa-solid fa-chevron-right opacity-50 text-sm"></i>
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    <i className="fa-solid fa-share-nodes mr-1"></i>
                    当受害者执迷不悟时，请将此海报截图发给TA
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4">
                   
                   {/* Deep Motive Analysis */}
                   <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 md:p-5">
                      <h4 className="flex items-center gap-2 text-indigo-400 font-bold mb-4">
                        <i className="fa-solid fa-bullseye"></i> 核心动机与预期后果
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/50">
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-2">
                            <i className="fa-solid fa-masks-theater"></i> 骗子真实动机
                          </p>
                          <p className="text-sm text-slate-200">{result.scammerMotive}</p>
                        </div>
                        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/50">
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-2">
                            <i className="fa-solid fa-link-slash"></i> 预期达成效果
                          </p>
                          <p className="text-sm text-slate-200">{result.expectedOutcome}</p>
                        </div>
                      </div>
                   </div>

                   {/* Red Flags */}
                   <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 md:p-5">
                      <h4 className="flex items-center gap-2 text-red-400 font-bold mb-3">
                        <i className="fa-solid fa-flag"></i> 危险信号 (Red Flags)
                      </h4>
                      <ul className="space-y-2">
                        {result.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <i className="fa-solid fa-xmark text-red-500 mt-1 flex-shrink-0"></i>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                   </div>

                   {/* Psychological Tactics */}
                   <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 md:p-5">
                      <h4 className="flex items-center gap-2 text-yellow-400 font-bold mb-3">
                        <i className="fa-solid fa-brain"></i> 心理博弈手段
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.psychologicalTactics.map((tactic, i) => (
                          <span key={i} className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-600">
                            {tactic}
                          </span>
                        ))}
                      </div>
                   </div>

                   {/* Military Advisor's Kit (Verification Strategies) */}
                   {result.verificationStrategies && result.verificationStrategies.length > 0 && (
                     <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl border border-indigo-500/40 p-4 md:p-5 shadow-lg shadow-indigo-900/20">
                        <h4 className="flex items-center gap-2 text-indigo-300 font-bold mb-4">
                          <i className="fa-solid fa-chess-knight"></i> 军师锦囊：反向验证话术
                        </h4>
                        <div className="space-y-4">
                          {result.verificationStrategies.map((strategy, idx) => (
                            <div key={idx} className="bg-slate-900/60 rounded-lg p-4 border border-slate-700/60">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-blue-400 text-sm flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-xs border border-blue-500/30">{idx + 1}</span>
                                  {strategy.type}
                                </h5>
                              </div>
                              <p className="text-xs text-slate-500 mb-2">{strategy.explanation}</p>
                              
                              <div 
                                className="bg-black/30 p-3 rounded border border-slate-700/50 mb-2 cursor-pointer hover:border-blue-500/50 hover:bg-black/40 transition-all group flex items-start gap-3"
                                onClick={() => copyToClipboard(strategy.reply)}
                                title="点击复制话术"
                              >
                                 <i className="fa-regular fa-copy text-slate-500 mt-1 group-hover:text-blue-400"></i>
                                 <p className="text-white font-mono text-sm leading-relaxed break-all">
                                   {strategy.reply}
                                 </p>
                              </div>
                              
                              <p className="text-xs text-slate-400">
                                <i className="fa-solid fa-eye text-slate-500 mr-1"></i>
                                <span className="text-slate-500">预期反应：</span> 
                                <span className="text-slate-300">{strategy.expectedReaction}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                     </div>
                   )}

                   {/* Static Scam Alert Display */}
                   {result.scamAlertMessage && (
                     <div className="mt-4 bg-[#1a0f0f] rounded-xl border border-red-600/50 p-5 md:p-6 text-center shadow-xl">
                       <div className="flex items-center justify-center gap-2 text-red-500 font-bold mb-3">
                          <i className="fa-solid fa-triangle-exclamation animate-pulse"></i>
                          <span>极度危险预警</span>
                       </div>
                       <p className="text-base text-slate-200 leading-relaxed whitespace-pre-wrap mb-4 border-l-4 border-red-600 pl-4 text-left bg-red-900/10 py-2">
                          {result.scamAlertMessage.split('\n').slice(0, 6).join('\n')}...
                       </p>
                       <button 
                        onClick={() => setShowPoster(true)}
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                       >
                         查看完整警示信息并生成海报 &rarr;
                       </button>
                     </div>
                   )}

                   {/* Advice */}
                   <div className="bg-blue-900/10 rounded-xl border border-blue-500/20 p-5 mt-4">
                      <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-3">
                        <i className="fa-solid fa-user-shield"></i> 专家建议
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {result.actionableAdvice}
                      </p>
                   </div>
                </div>

              </div>
            ) : (
              // Empty State Placeholder on Desktop
              <div className="hidden lg:flex h-full items-center justify-center bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
                <div className="text-center text-slate-500">
                  <i className="fa-solid fa-chart-line text-4xl mb-3 opacity-50"></i>
                  <p>分析结果将显示在这里</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Warning Poster Modal - Improved Layout */}
      {showPoster && result && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col h-full">
          
          {/* Fixed Header Actions */}
          <div className="flex-none flex justify-between items-center p-4 bg-slate-900/90 border-b border-slate-800 z-50">
             <h3 className="text-white font-bold text-lg flex items-center gap-2">
               <i className="fa-solid fa-circle-exclamation text-red-500"></i>
               劝退海报预览
             </h3>
             <div className="flex gap-3">
                <button 
                  onClick={handleDownloadPoster}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-lg"
                >
                  {isSaving ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> 保存中...</>
                  ) : (
                    <><i className="fa-solid fa-download"></i> 保存图片</>
                  )}
                </button>
                <button 
                  onClick={() => setShowPoster(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs md:text-sm px-4 py-2 rounded-full shadow-lg"
                >
                  关闭
                </button>
             </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-black/50 w-full">
             {/* Poster Content Wrapper 
                - Removed overflow-hidden to allow content to grow naturally
                - Removed fixed heights to prevent cutting off
             */}
             <div 
               id="poster-content"
               className="bg-[#1a0f0f] border-y-8 md:border-8 border-red-600 relative shadow-2xl flex flex-col md:rounded-2xl shrink-0 w-full max-w-[375px] md:max-w-[400px] h-fit" 
             >
               {/* Header */}
               <div className="bg-red-600 p-6 text-center relative shrink-0">
                 {/* Solid Red Background for Authority */}
                 <div className="relative z-10">
                   <div className="w-14 h-14 bg-black/30 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/20">
                       <i className="fa-solid fa-land-mine-on text-2xl text-white"></i>
                   </div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-1">
                     高危诈骗预警
                   </h2>
                   <p className="text-red-100 font-bold tracking-widest text-[10px] uppercase opacity-90">
                     ScamGuard AI 智能拦截系统
                   </p>
                 </div>
               </div>

               <div className="p-6 space-y-6 bg-[#1a0f0f]">
                 
                 {/* 1. Risk Score */}
                 <div className="text-center relative">
                     <div className="inline-block px-3 py-1 rounded border border-red-500/30 bg-red-900/20 text-red-500 font-mono text-[10px] tracking-widest mb-2 font-bold">
                       风险分析报告
                     </div>
                     <div className="flex items-center justify-center gap-1">
                       <span className="text-5xl font-black text-white">{result.riskScore}</span>
                       <span className="text-lg text-slate-500 font-medium self-end mb-2">/100</span>
                     </div>
                     <div className="text-2xl font-black text-red-500 tracking-[0.1em] mt-1">
                       {getChineseRiskLevel(result.riskLevel)}
                     </div>
                 </div>

                 <div className="h-px w-full bg-red-900 opacity-50"></div>

                 {/* 2. Rational Analysis */}
                 <div className="space-y-4">
                     <div>
                       <h3 className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                         <i className="fa-solid fa-brain"></i> AI 理智分析
                       </h3>
                       <p className="text-white text-base font-bold leading-relaxed">
                         "{result.scammerMotive}"
                       </p>
                     </div>

                     <div className="bg-red-500/5 border-l-4 border-red-500 pl-4 py-2">
                       <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-1">即将发生的后果</h4>
                       <p className="text-slate-200 text-xs leading-relaxed">
                         {result.expectedOutcome}
                       </p>
                     </div>
                 </div>

                 {/* 3. Key Red Flags - Fixed Visibility & Translation */}
                 {result.redFlags && result.redFlags.length > 0 && (
                   <div className="bg-red-900/20 rounded-xl p-5 border border-red-500/40">
                       <h3 className="text-white text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                         <i className="fa-solid fa-magnifying-glass text-red-500"></i> 关键疑点
                       </h3>
                       <ul className="space-y-3">
                         {result.redFlags.slice(0, 3).map((flag, i) => (
                           <li key={i} className="text-white text-sm flex items-start gap-2 font-bold">
                             <i className="fa-solid fa-xmark text-red-500 mt-1 shrink-0"></i>
                             <span className="leading-snug">{flag}</span>
                           </li>
                         ))}
                       </ul>
                   </div>
                 )}
                 
                 {/* 4. Action */}
                 <div className="bg-red-600 rounded-xl p-5 text-center shadow-lg border border-red-400">
                     <p className="text-red-100 font-bold text-[10px] uppercase tracking-widest mb-1">专家建议</p>
                     <p className="text-white font-black text-xl">
                       <i className="fa-solid fa-hand"></i> 立即停止转账！
                     </p>
                 </div>

               </div>

               {/* Footer */}
               <div className="bg-black p-4 text-center border-t border-slate-800 relative z-10 shrink-0">
                 <p className="text-slate-500 text-[10px] font-mono mb-1">ScamGuard AI 智能生成</p>
                 <p className="text-slate-600 text-[10px]">请立即截图保存并转发给当事人</p>
               </div>
             </div>
          </div>

        </div>
      )}

      <footer className="border-t border-slate-800 py-8 mt-12 bg-[#0f172a]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 ScamGuard AI. Powered by Google Gemini. 
            <br />
            <span className="text-xs opacity-70">免责声明：本工具仅供参考，不构成法律或财务建议。遇到紧急诈骗请立即报警。</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;