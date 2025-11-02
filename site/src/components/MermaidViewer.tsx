import { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface Diagram {
  name: string;
  path: string;
}

export default function MermaidViewer() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<string>('');
  const [diagramContent, setDiagramContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid with dark theme
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#6366f1',
        primaryTextColor: '#fff',
        primaryBorderColor: '#8b5cf6',
        lineColor: '#06b6d4',
        secondaryColor: '#8b5cf6',
        tertiaryColor: '#334155',
      },
    });

    // Load diagram list
    const baseUrl = import.meta.env.BASE_URL || '/AirwayAtlas';
    fetch(`${baseUrl}/diagrams/index.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('No diagrams found');
        }
        return response.json();
      })
      .then((data: Diagram[]) => {
        setDiagrams(data);
        if (data.length > 0) {
          // Check for hash in URL
          const hash = window.location.hash.slice(1);
          const initialDiagram = hash && data.find(d => d.name === hash) 
            ? hash 
            : (data[0]?.name || '');
          setSelectedDiagram(initialDiagram);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading diagrams:', err);
        setError('No Mermaid diagrams found. They will be available after the first CI deployment.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedDiagram || diagrams.length === 0) return;

    const diagram = diagrams.find((d) => d.name === selectedDiagram);
    if (!diagram) return;

    // Update URL hash
    window.location.hash = selectedDiagram;

    // Load diagram content
    const baseUrl = import.meta.env.BASE_URL || '/AirwayAtlas';
    fetch(`${baseUrl}${diagram.path}`)
      .then((response) => response.text())
      .then((content) => {
        setDiagramContent(content);
      })
      .catch((err) => {
        console.error('Error loading diagram content:', err);
        setError('Failed to load diagram content');
      });
  }, [selectedDiagram, diagrams]);

  useEffect(() => {
    if (!diagramContent || !mermaidRef.current) return;

    const renderDiagram = async () => {
      try {
        mermaidRef.current!.innerHTML = '';
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, diagramContent);
        mermaidRef.current!.innerHTML = svg;
      } catch (err) {
        console.error('Error rendering diagram:', err);
        setError('Failed to render diagram');
      }
    };

    renderDiagram();
  }, [diagramContent]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || diagrams.length === 0) {
    return (
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-bold">No Diagrams Available</h3>
          <div className="text-sm">
            {error || 'Mermaid diagrams will be available after the first CI deployment. Add .mmd files to the /mermaid directory or include Mermaid code blocks in your README.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagram Selector */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Select Diagram</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedDiagram}
              onChange={(e) => setSelectedDiagram(e.target.value)}
            >
              {diagrams.map((diagram) => (
                <option key={diagram.name} value={diagram.name}>
                  {diagram.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tab Navigation Alternative */}
          <div className="tabs tabs-boxed mt-4 overflow-x-auto flex-nowrap">
            {diagrams.map((diagram) => (
              <button
                key={diagram.name}
                className={`tab whitespace-nowrap ${
                  selectedDiagram === diagram.name ? 'tab-active' : ''
                }`}
                onClick={() => setSelectedDiagram(diagram.name)}
              >
                {diagram.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Diagram Display */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{selectedDiagram}</h2>
          <div className="divider"></div>
          <div
            ref={mermaidRef}
            className="overflow-x-auto flex justify-center items-center min-h-[400px] p-4"
          ></div>
        </div>
      </div>

      {/* Diagram Source */}
      {diagramContent && (
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title font-medium">View Source Code</div>
          <div className="collapse-content">
            <div className="mockup-code">
              <pre><code>{diagramContent}</code></pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
