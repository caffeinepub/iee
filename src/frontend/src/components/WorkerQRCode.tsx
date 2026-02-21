import { useEffect, useRef } from 'react';

interface WorkerQRCodeProps {
  workerId: string;
}

export default function WorkerQRCode({ workerId }: WorkerQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Use QRCode generation via CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
    script.async = true;
    script.onload = () => {
      if (canvasRef.current && (window as any).QRCode) {
        (window as any).QRCode.toCanvas(
          canvasRef.current,
          workerId,
          {
            width: 200,
            margin: 2,
            errorCorrectionLevel: 'H',
          },
          (error: any) => {
            if (error) console.error('QR Code generation error:', error);
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [workerId]);

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <canvas ref={canvasRef} />
      </div>
      <p className="mt-3 text-sm font-mono text-center">{workerId}</p>
    </div>
  );
}
