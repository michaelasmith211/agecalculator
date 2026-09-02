import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const alt = 'Age Calculator – Fast, Accurate & Free Online Tool';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #dbeafe 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: '#ffffff',
            padding: '12px 28px',
            borderRadius: '9999px',
            border: '2px solid #bfdbfe',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            marginBottom: '24px'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            📅
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
            agecalculators.dev
          </span>
        </div>

        <h1
          style={{
            fontSize: '60px',
            fontWeight: '900',
            color: '#0f172a',
            margin: '0 0 16px 0',
            textAlign: 'center',
            letterSpacing: '-0.03em'
          }}
        >
          Age Calculator
        </h1>

        <p
          style={{
            fontSize: '28px',
            fontWeight: '500',
            color: '#475569',
            margin: '0 0 32px 0',
            textAlign: 'center',
            maxWidth: '900px'
          }}
        >
          Calculate your exact age in years, months, and days with calendar precision.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px'
          }}
        >
          <div
            style={{
              background: '#2563eb',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '14px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            100% Calendar Accurate
          </div>
          <div
            style={{
              background: '#ffffff',
              color: '#047857',
              border: '2px solid #a7f3d0',
              padding: '14px 28px',
              borderRadius: '14px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            100% Private Client-Side
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
