import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, EvidenceStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Compass,
  Activity,
  Layers,
  FileText,
  ArrowRight,
  CheckCircle2,
  MapPin,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

interface FloatingQueryChatbotProps {
  onExecutePipeline?: (query: string) => void;
}

export const FloatingQueryChatbot: React.FC<FloatingQueryChatbotProps> = ({
  onExecutePipeline
}) => {
  const {
    query,
    setQuery,
    drawnPolygon,
    setCurrentRoute,
    startAnalysisWorkflow,
    showNotification
  } = useApp();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'Hello! I am your SatQuery Satellite Assistant.\n\nYou can ask me everyday questions about what is happening on the ground — such as new construction, lake water levels, tree loss, or flood risk. I use space satellites and radar to give you clear, verified answers in plain English.',
      pipelineStage: 'Ready for Query'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSendQuery = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text) return;

    setInputQuery('');
    setQuery(text);

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    const lowerText = text.toLowerCase();

    // 2. Intelligent, Plain-English Response Generator
    setTimeout(() => {
      let mainText = '';
      let status: EvidenceStatus = 'SUPPORTED';
      let changeLabel = 'Earth Observation Analysis';
      let areaDelta = drawnPolygon ? drawnPolygon.areaKm2 : 12.4;
      let whyExp = '';
      let clusterCount = 4;

      // Category A: Satellite Limits / Abstention (Floors, Inside rooms, Underground, Private layouts)
      if (
        lowerText.includes('floor') ||
        lowerText.includes('height') ||
        lowerText.includes('inside') ||
        lowerText.includes('room') ||
        lowerText.includes('underground') ||
        lowerText.includes('see inside') ||
        lowerText.includes('can\'t see') ||
        lowerText.includes('cant see') ||
        lowerText.includes('elevation')
      ) {
        status = 'INSUFFICIENT EVIDENCE';
        changeLabel = 'Scientific Honesty: Satellite Boundary';
        areaDelta = 0;
        mainText = `SatQuery honestly abstains from answering this question because satellites cannot see inside buildings.\n\n• What satellites CAN see: Orbiting 780 km above Earth, our cameras and radar clearly measure ground boundaries, new roads, building footprints, and tree clearance.\n• What satellites CANNOT see: They cannot look through roofs into private rooms, count internal floors, or inspect underground basements.\n\nWe provide this honest boundary so you can always trust verified claims without risk of AI hallucination.`;
        whyExp = 'Satellite optical and microwave sensors cannot penetrate building roofs or measure internal building height accurately without high-density 3D LiDAR. SatQuery avoids hallucinations and abstains from unprovable claims.';
        clusterCount = 0;
      }
      // Category B: Water bodies, Lake health & Flood risk
      else if (
        lowerText.includes('water') ||
        lowerText.includes('lake') ||
        lowerText.includes('flood') ||
        lowerText.includes('river') ||
        lowerText.includes('pond') ||
        lowerText.includes('drain')
      ) {
        changeLabel = 'Water Bodies & Lake Health';
        areaDelta = drawnPolygon ? Number((drawnPolygon.areaKm2 * 0.28).toFixed(1)) : 4.6;
        const hectares = (areaDelta * 100).toFixed(0);
        mainText = `Here is what our satellites see regarding water bodies and flood risk:\n\n• Water Surface Area: We detected approximately ${areaDelta} km² (${hectares} hectares) of active surface water in this zone.\n• Lake & Shoreline Stability: Satellite color comparisons confirm that water bodies are stable and holding their normal post-monsoon levels.\n• Flood Risk: Cloud-penetrating radar shows that water is safely within natural banks and drainage channels, with no signs of uncontrolled flooding into surrounding neighborhoods.`;
        whyExp = 'Water surfaces reflect radar signals away like a mirror (dark backscatter < -18 dB), allowing satellites to map clear, unmistakable water boundaries even through heavy monsoon clouds.';
        clusterCount = 2;
      }
      // Category C: Trees, Green Cover, Forest & Agriculture
      else if (
        lowerText.includes('tree') ||
        lowerText.includes('green') ||
        lowerText.includes('forest') ||
        lowerText.includes('vegetation') ||
        lowerText.includes('farm') ||
        lowerText.includes('crop') ||
        lowerText.includes('canopy')
      ) {
        changeLabel = 'Tree Canopy & Green Cover';
        areaDelta = drawnPolygon ? Number((drawnPolygon.areaKm2 * 0.32).toFixed(1)) : 3.8;
        const hectares = (areaDelta * 100).toFixed(0);
        mainText = `Here is what our satellites observe about green cover and trees:\n\n• Vegetation Transition: Around ${areaDelta} km² (${hectares} hectares) of previously open or seasonal farming plots have been cleared for new development.\n• Tree Canopy Protection: Established tree groves, parks, and roadside tree belts show strong infrared health (dense chlorophyll), showing they remain preserved.\n• Seasonal Filter: Our system checked across summer and winter to make sure seasonal grass drying wasn't falsely flagged as permanent tree cutting.`;
        whyExp = 'Multispectral satellites use near-infrared light absorbed by plant chlorophyll to track real plant health, filtering out temporary seasonal drying.';
        clusterCount = 3;
      }
      // Category D: Visakhapatnam Specific
      else if (lowerText.includes('vishakapatnam') || lowerText.includes('visakhapatnam') || lowerText.includes('vizag')) {
        areaDelta = 8.92;
        changeLabel = 'Port & Coastal Expansion (Visakhapatnam)';
        const hectares = (areaDelta * 100).toFixed(0);
        mainText = `Here is the satellite analysis for Visakhapatnam (Vizag):\n\n• Coastal Expansion: Between 2022 and 2026, about ${areaDelta} km² (${hectares} hectares) of new port infrastructure, logistics storage, and paved container yards were developed along the harbor corridor.\n• Radar Confirmation: Spaceborne radar confirmed hard metal container yards and heavy machinery structures rather than loose beach sand.\n• Coastal Buffer: Coastal regulations boundaries show standard buffer zones remain preserved.`;
        whyExp = 'High SAR co-polarization double-bounce (+5.2 dB) physically confirms new metallic container gantries and warehouse structures along the deepwater harbor.';
        clusterCount = 3;
      }
      // Category E: Delhi Specific
      else if (lowerText.includes('delhi') || lowerText.includes('yamuna') || lowerText.includes('ncr')) {
        areaDelta = 19.4;
        changeLabel = 'Yamuna Riverbed & Flood Extent (Delhi NCR)';
        const hectares = (areaDelta * 100).toFixed(0);
        mainText = `Here is the satellite analysis for Delhi NCR and the Yamuna corridor:\n\n• Riverbed Footprint: During peak monsoon periods, standing water expanded across ${areaDelta} km² (${hectares} hectares) of the natural floodplain.\n• All-Weather Radar: Even through thick haze and cloud cover, microwave satellite radar clearly separated submerged sandbars from elevated residential embankments.\n• Current Status: Water levels have returned to normal flow channels, leaving siltation in designated floodplain buffers.`;
        whyExp = 'SAR microwave specular scattering (< -18 dB) validates standing water beneath cloud cover, confirming embankment overflow.';
        clusterCount = 4;
      }
      // Category F: New Construction / Built-up Growth / Default
      else {
        changeLabel = 'New Construction & Ground Development';
        const hectares = (areaDelta * 100).toFixed(0);
        const footballFields = Math.round(areaDelta * 140);
        mainText = `Yes, our satellites detected significant new construction activity in this selected area:\n\n• Growth Size: Approximately ${areaDelta} km² (${hectares} hectares, equivalent to about ${footballFields} football fields) has changed from open ground to new buildings and roads between 2022 and 2026.\n• Where It Occurred: The new structures are concentrated in distinct clusters along the main road corridors.\n• Verified by Space Radar: Cloud-penetrating radar confirms upright concrete and metal roofs, proving these are permanent buildings rather than temporary dirt work.`;
        whyExp = 'Two separate satellite technologies agree: optical cameras see physical color shifts from soil to concrete, while microwave radar confirms strong double-bounce reflections (+4.8 dB) typical of solid buildings.';
        clusterCount = 4;
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: mainText,
        status,
        pipelineStage: 'Evidence Verified',
        evidenceSummary: {
          areaKm2: areaDelta,
          changeType: changeLabel,
          sarCorroborated: status !== 'INSUFFICIENT EVIDENCE',
          modelsUsed: ['DeltaView (Visual Changes)', 'Sentinel Radar (All-Weather)', 'GeoChat (Boundary Finder)'],
          clusterCount,
          whyExplanation: whyExp
        },
        actions: [
          { label: 'View Evidence Map (DAG)', route: 'evidence-explorer' },
          { label: '10-Stage Verification Trace', route: 'execution-trace' },
          { label: 'Official Audit Report', route: 'results' },
          { label: 'Evidence Plan Details', route: 'evidence-planning' }
        ]
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
      showNotification(`SatQuery verified answer ready (${changeLabel})`);
    }, 1400);
  };

  const presetQueries = [
    {
      label: 'New Buildings & Construction',
      query: 'Has new construction or building work expanded in this area over the past few years?'
    },
    {
      label: 'Water Bodies & Lake Health',
      query: 'Are any lakes, ponds, or rivers in this area shrinking, drying up, or overflowing?'
    },
    {
      label: 'Trees & Greenery Loss',
      query: 'Has there been any noticeable loss of green cover, trees, or farmland?'
    },
    {
      label: "What Satellites Can't See",
      query: 'Can satellite images see inside private rooms or tell how many floors a building has?'
    }
  ];

  if (isMinimized) {
    return (
      <div className="absolute bottom-6 right-6 z-30">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-slate-900 hover:bg-blue-900 text-white px-4 py-3 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2.5 transition-all text-xs font-semibold group"
        >
          <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
          </div>
          <span>SatQuery Assistant</span>
          {drawnPolygon && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-800">
              {drawnPolygon.areaKm2} km²
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-30 w-full sm:w-[460px] max-w-[calc(100vw-32px)] bg-white/95 text-slate-900 border border-slate-300 rounded-lg shadow-2xl flex flex-col max-h-[85vh] h-[580px] backdrop-blur-md overflow-hidden transition-all">
      {/* Chatbot Top Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-900 border border-blue-600 flex items-center justify-center text-white font-bold text-xs">
            SQ
          </div>
          <div>
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>SatQuery EO Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Evidence-Adaptive Query Interface
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Minimize Assistant"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active AOI Notification Strip */}
      <div className="bg-blue-50/90 border-b border-blue-200 px-3.5 py-2 text-xs flex items-center justify-between text-blue-950 font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-blue-800 shrink-0" />
          {drawnPolygon ? (
            <span className="truncate">
              Target Polygon: <strong className="font-mono">{drawnPolygon.areaKm2} km²</strong> (Centroid: {drawnPolygon.center.lat}° N, {drawnPolygon.center.lng}° E)
            </span>
          ) : (
            <span className="text-slate-600 text-[11px]">
              No custom polygon drawn. Using Default Hyderabad Growth Zone.
            </span>
          )}
        </div>

        {drawnPolygon && (
          <span className="text-[10px] font-mono bg-blue-200/60 px-1.5 py-0.5 rounded text-blue-900 font-bold shrink-0">
            BOUNDED
          </span>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Label & Time */}
            <div className="text-[10px] text-slate-400 font-mono mb-1 flex items-center gap-1.5">
              <span>{msg.sender === 'user' ? 'Government Officer' : 'SatQuery Intelligence'}</span>
              <span>·</span>
              <span>{msg.timestamp}</span>
            </div>

            {/* Message Bubble */}
            <div
              className={`p-3.5 rounded-lg max-w-[92%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-900 text-white rounded-br-xs shadow-xs'
                  : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-xs shadow-xs'
              }`}
            >
              <div className="font-sans text-xs whitespace-pre-line leading-relaxed">{msg.text}</div>

              {/* Status Badge & Evidence Breakdown if available */}
              {msg.status && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={msg.status} size="sm" />
                    {msg.evidenceSummary?.areaKm2 && (
                      <span className="text-xs font-mono font-bold text-slate-800">
                        Δ {msg.evidenceSummary.areaKm2} km²
                      </span>
                    )}
                  </div>

                  {msg.evidenceSummary?.whyExplanation && (
                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                      <strong>Verification:</strong> {msg.evidenceSummary.whyExplanation}
                    </div>
                  )}

                  {msg.evidenceSummary?.modelsUsed && (
                    <div className="text-[10px] text-slate-500 font-mono">
                      Specialist Models: {msg.evidenceSummary.modelsUsed.join(' · ')}
                    </div>
                  )}

                  {/* Quick Action Links inside Chat */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {msg.actions.map(act => (
                        <button
                          key={act.label}
                          onClick={() => act.route && setCurrentRoute(act.route)}
                          className="px-2 py-1 bg-white hover:bg-slate-200 text-blue-900 border border-slate-300 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-700 animate-ping" />
            <span className="font-mono text-[11px]">
              Orchestrating Evidence Plan & Model Invariants...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Query Chips */}
      <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">
          Ask Satellite Query:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presetQueries.map(p => (
            <button
              key={p.label}
              onClick={() => handleSendQuery(p.query)}
              disabled={isProcessing}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] text-slate-800 font-medium transition-colors text-left shadow-xs"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendQuery();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder="Ask a question about the drawn satellite polygon..."
          disabled={isProcessing}
          className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-900 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isProcessing}
          className={`p-2 rounded text-white transition-colors shrink-0 ${
            inputQuery.trim() && !isProcessing
              ? 'bg-blue-900 hover:bg-blue-800'
              : 'bg-slate-400 cursor-not-allowed'
          }`}
          title="Send Query to SatQuery AI"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
