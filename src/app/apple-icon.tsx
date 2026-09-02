import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = {
  width: 180,
  height: 180
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
          borderRadius: '40px',
          padding: '24px'
        }}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Top red header bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '34px',
              background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)'
            }}
          />

          {/* Central Blue Clock Dial */}
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ffffff'
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
