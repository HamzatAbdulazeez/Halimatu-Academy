import { FaHistory, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const CurrentSubscriptionCard = ({
  isSubscribed,
  planLabel,
  nextBilling,
  paymentMethod,
  autoRenew,
  isTogglingRenew,
  onToggleAutoRenew,
  onCancelClick,
  onShowHistory,
}) => {
  if (!isSubscribed) {
    return (
      <div style={{
        background: 'var(--color-background-primary, #fff)',
        border: '0.5px solid rgba(0,0,0,0.1)',
        borderRadius: 14,
        padding: '1.5rem 1.25rem',        // reduced horizontal padding on mobile
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20,
            marginBottom: '0.75rem',
            background: 'rgba(0,0,0,0.05)',
            color: 'var(--color-text-secondary)',
            border: '0.5px solid rgba(0,0,0,0.1)',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#888780', display: 'inline-block' }} />
            No active plan
          </span>
          <p style={{ fontSize: 24, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Unlock full access
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Choose a plan below to start your Islamic learning journey
          </p>
        </div>

        <button 
          onClick={onShowHistory} 
          style={{
            fontSize: 13, 
            fontWeight: 500, 
            padding: '10px 18px', 
            borderRadius: 8,
            border: '0.5px solid rgba(0,0,0,0.15)',
            background: 'var(--color-background-primary, #fff)',
            color: 'var(--color-text-primary)', 
            cursor: 'pointer',
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <FaHistory size={13} /> View history
        </button>
      </div>
    );
  }

  // Subscribed state
  return (
    <div style={{
      background: '#185FA5',
      border: 'none',
      borderRadius: 14,
      padding: '1.5rem 1.25rem',        // better mobile padding
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1.25rem',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        {/* Status pill */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20,
          marginBottom: '0.75rem',
          background: 'rgba(255,255,255,0.18)',
          color: '#fff',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#5DCAA5',
            display: 'inline-block', animation: 'pulse 2s infinite',
          }} />
          Active subscription
        </span>

        {/* Plan name */}
        <p style={{ 
          fontSize: 26, 
          fontWeight: 500, 
          color: '#fff', 
          marginBottom: '1.25rem',
          lineHeight: 1.2 
        }}>
          {planLabel}
        </p>

        {/* Meta row */}
        <div style={{ 
          display: 'flex', 
          gap: '1.75rem', 
          flexWrap: 'wrap',
          rowGap: '1.25rem'
        }}>
          {nextBilling && (
            <div>
              <span style={{ 
                fontSize: 11, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                color: 'rgba(255,255,255,0.55)', 
                display: 'block', 
                marginBottom: 3 
              }}>
                Next billing
              </span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{nextBilling}</span>
            </div>
          )}

          {paymentMethod && (
            <div>
              <span style={{ 
                fontSize: 11, 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                color: 'rgba(255,255,255,0.55)', 
                display: 'block', 
                marginBottom: 3 
              }}>
                Payment
              </span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{paymentMethod}</span>
            </div>
          )}

          <div>
            <span style={{ 
              fontSize: 11, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              color: 'rgba(255,255,255,0.55)', 
              display: 'block', 
              marginBottom: 3 
            }}>
              Auto-renew
            </span>
            <button
              onClick={onToggleAutoRenew}
              disabled={isTogglingRenew}
              style={{
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                color: '#fff', 
                fontSize: 13, 
                fontWeight: 500, 
                padding: 0,
                opacity: isTogglingRenew ? 0.6 : 1,
              }}
            >
              {autoRenew
                ? <FaToggleOn size={22} style={{ color: '#5DCAA5' }} />
                : <FaToggleOff size={22} style={{ color: 'rgba(255,255,255,0.5)' }} />}
              {autoRenew ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </div>

      {/* Actions Column */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 10, 
        alignItems: 'flex-end',
        flexShrink: 0,
        minWidth: 140,           // prevents buttons from shrinking too much
      }}>
        <button 
          onClick={onShowHistory} 
          style={{
            fontSize: 13, 
            fontWeight: 500, 
            padding: '10px 18px', 
            borderRadius: 8,
            background: 'rgba(255,255,255,0.12)', 
            border: '0.5px solid rgba(255,255,255,0.25)',
            color: '#fff', 
            cursor: 'pointer',
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <FaHistory size={13} /> View history
        </button>

        <button 
          onClick={onCancelClick} 
          style={{
            fontSize: 13, 
            fontWeight: 500, 
            padding: '10px 18px', 
            borderRadius: 8,
            background: 'transparent', 
            border: '0.5px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.85)', 
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Cancel plan
        </button>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
};

export default CurrentSubscriptionCard;