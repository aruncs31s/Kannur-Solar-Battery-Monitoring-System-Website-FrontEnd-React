import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { DeviceStateRecord } from '../hooks/useDeviceStateHistory';

export interface StateHistory3DProps {
  history: DeviceStateRecord[];
}

type RenderMode = 'pending' | 'webgl' | 'fallback';

const STATE_COLORS: Record<number, number> = {
  1: 0x5ecb8a,
  2: 0xef6b73,
  3: 0xf3c969,
  4: 0x8a94a6,
  5: 0x7cc6e8,
};

const STATE_HEX_COLORS: Record<number, string> = {
  1: '#5ecb8a',
  2: '#ef6b73',
  3: '#f3c969',
  4: '#8a94a6',
  5: '#7cc6e8',
};

const getStateY = (stateId: number): number => {
  switch (stateId) {
    case 1:
      return 1.5;
    case 2:
      return -1.3;
    case 3:
      return 2.4;
    case 4:
      return -2.3;
    case 5:
      return 0.3;
    default:
      return 0;
  }
};

const hasWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  const webgl2 = canvas.getContext('webgl2');
  const webgl = canvas.getContext('webgl');

  return !!(webgl2 || webgl);
};

const getFallbackColorClass = (stateId: number): string => {
  switch (stateId) {
    case 1:
      return 'bg-green-500';
    case 2:
      return 'bg-red-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-slate-500';
    case 5:
      return 'bg-sky-500';
    default:
      return 'bg-blue-400';
  }
};

const getStateLabel = (stateId: number): string => {
  switch (stateId) {
    case 1:
      return 'Active';
    case 2:
      return 'Inactive';
    case 3:
      return 'Maintenance';
    case 4:
      return 'Decommissioned';
    case 5:
      return 'Initialized';
    default:
      return 'Unknown';
  }
};

export const StateHistory3D = ({ history }: StateHistory3DProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>('pending');

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => a.timestamp - b.timestamp).slice(-80);
  }, [history]);

  const summary = useMemo(() => {
    const total = sortedHistory.length;
    const activeCount = sortedHistory.filter((item) => item.state === 1).length;
    const inactiveCount = sortedHistory.filter((item) => item.state === 2).length;
    const activeRatio = total > 0 ? Math.round((activeCount / total) * 100) : 0;
    const latest = total > 0 ? sortedHistory[total - 1] : null;

    return {
      total,
      activeCount,
      inactiveCount,
      activeRatio,
      latest,
    };
  }, [sortedHistory]);

  useEffect(() => {
    if (!mountRef.current || sortedHistory.length === 0) {
      return;
    }

    if (!hasWebGLSupport()) {
      setRenderMode('fallback');
      return;
    }

    const mountElement = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch (err) {
      console.warn('StateHistory3D: WebGL renderer unavailable, falling back to 2D view.', err);
      setRenderMode('fallback');
      return;
    }

    setRenderMode('webgl');
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountElement.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 5.5, 18);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
    directionalLight.position.set(7, 10, 6);
    scene.add(directionalLight);

    const timelineGroup = new THREE.Group();
    scene.add(timelineGroup);

    const spacing = 0.8;
    const centerOffset = ((sortedHistory.length - 1) * spacing) / 2;

    const points: THREE.Vector3[] = [];

    sortedHistory.forEach((entry, idx) => {
      const x = idx * spacing - centerOffset;
      const y = getStateY(entry.state);
      const z = Math.sin(idx * 0.35) * 0.35;

      const sphereGeometry = new THREE.SphereGeometry(0.23, 18, 18);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: STATE_COLORS[entry.state] || 0x93b4d0,
        metalness: 0.2,
        roughness: 0.35,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(x, y, z);
      timelineGroup.add(sphere);

      const stemGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -3.3, z),
        new THREE.Vector3(x, y, z),
      ]);
      const stemMaterial = new THREE.LineBasicMaterial({ color: 0x344054 });
      timelineGroup.add(new THREE.Line(stemGeometry, stemMaterial));

      points.push(new THREE.Vector3(x, y, z));
    });

    if (points.length > 1) {
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const pathMaterial = new THREE.LineBasicMaterial({ color: 0x7cc6e8 });
      timelineGroup.add(new THREE.Line(pathGeometry, pathMaterial));
    }

    const grid = new THREE.GridHelper(80, 40, 0x2f3e56, 0x1f2a3b);
    grid.position.y = -3.3;
    scene.add(grid);

    const resize = () => {
      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();

    let frame = 0;
    const renderFrame = () => {
      frame = requestAnimationFrame(renderFrame);
      timelineGroup.rotation.y += 0.0022;
      renderer.render(scene, camera);
    };

    renderFrame();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      if (renderer.domElement.parentNode === mountElement) {
        mountElement.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [sortedHistory]);

  if (sortedHistory.length === 0) {
    return null;
  }

  if (renderMode === 'fallback') {
    const chartWidth = Math.max(760, sortedHistory.length * 22);
    const chartHeight = 220;
    const topPad = 20;
    const bottomPad = 38;
    const usableHeight = chartHeight - topPad - bottomPad;
    const minY = -2.5;
    const maxY = 2.6;
    const usableWidth = chartWidth - 50;

    const points = sortedHistory
      .map((entry, index) => {
        const x = 24 + (index / Math.max(sortedHistory.length - 1, 1)) * usableWidth;
        const normalizedY = (getStateY(entry.state) - minY) / (maxY - minY);
        const y = topPad + (1 - normalizedY) * usableHeight;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="rounded-xl border border-border-primary bg-surface-primary p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">State Timeline</h2>
          <p className="text-xs text-text-secondary">2D fallback mode</p>
        </div>

        <p className="mb-4 text-xs text-text-secondary">
          WebGL is not available in this environment, so a simplified timeline is shown instead.
        </p>

        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
            <p className="text-text-secondary">Transitions</p>
            <p className="text-text-primary font-bold text-sm">{summary.total}</p>
          </div>
          <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
            <p className="text-text-secondary">Active %</p>
            <p className="text-green-500 font-bold text-sm">{summary.activeRatio}%</p>
          </div>
          <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
            <p className="text-text-secondary">Inactive</p>
            <p className="text-red-500 font-bold text-sm">{summary.inactiveCount}</p>
          </div>
          <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
            <p className="text-text-secondary">Latest State</p>
            <p className="text-text-primary font-bold text-sm">{summary.latest?.stateName || '-'}</p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
          {[1, 2, 3, 4, 5].map((stateId) => (
            <span key={stateId} className="inline-flex items-center gap-1 rounded-full border border-border-secondary bg-surface-secondary px-2 py-1 text-text-secondary">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATE_HEX_COLORS[stateId] }}
              />
              {getStateLabel(stateId)}
            </span>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-border-secondary bg-surface-secondary px-2 py-3">
          <div className="min-w-[760px]">
            <svg width={chartWidth} height={chartHeight} role="img" aria-label="Device state timeline chart">
              <line x1="20" y1={chartHeight - bottomPad} x2={chartWidth - 16} y2={chartHeight - bottomPad} stroke="#4b5563" strokeWidth="1" />
              <line x1="20" y1={topPad} x2="20" y2={chartHeight - bottomPad} stroke="#4b5563" strokeWidth="1" />

              {points && (
                <polyline
                  fill="none"
                  stroke="#7cc6e8"
                  strokeWidth="2"
                  points={points}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              )}

              {sortedHistory.map((entry, index) => {
                const x = 24 + (index / Math.max(sortedHistory.length - 1, 1)) * usableWidth;
                const normalizedY = (getStateY(entry.state) - minY) / (maxY - minY);
                const y = topPad + (1 - normalizedY) * usableHeight;

                return (
                  <g key={`fallback-${index}-${entry.timestamp}`}>
                    <line x1={x} y1={chartHeight - bottomPad} x2={x} y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={x} cy={y} r="5" fill={STATE_HEX_COLORS[entry.state] || '#93b4d0'}>
                      <title>{`${entry.stateName} at ${new Date(entry.timestamp * 1000).toLocaleString()}`}</title>
                    </circle>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-primary bg-surface-primary p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">3D State Timeline</h2>
        <p className="text-xs text-text-secondary">Active: green, Inactive: red, Maintenance: yellow</p>
      </div>

      <div className="mb-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
          <p className="text-text-secondary">Transitions</p>
          <p className="text-text-primary font-bold text-sm">{summary.total}</p>
        </div>
        <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
          <p className="text-text-secondary">Active %</p>
          <p className="text-green-500 font-bold text-sm">{summary.activeRatio}%</p>
        </div>
        <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
          <p className="text-text-secondary">Inactive</p>
          <p className="text-red-500 font-bold text-sm">{summary.inactiveCount}</p>
        </div>
        <div className="rounded-md border border-border-secondary bg-surface-secondary px-3 py-2">
          <p className="text-text-secondary">Latest State</p>
          <p className="text-text-primary font-bold text-sm">{summary.latest?.stateName || '-'}</p>
        </div>
      </div>

      <div ref={mountRef} className="h-80 w-full overflow-hidden rounded-lg border border-border-secondary" />

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        {[1, 2, 3, 4, 5].map((stateId) => (
          <span key={stateId} className="inline-flex items-center gap-1 rounded-full border border-border-secondary bg-surface-secondary px-2 py-1 text-text-secondary">
            <span
              className={`h-2.5 w-2.5 rounded-full ${getFallbackColorClass(stateId)}`}
              style={{ backgroundColor: STATE_HEX_COLORS[stateId] }}
            />
            {getStateLabel(stateId)}
          </span>
        ))}
      </div>
    </div>
  );
};
