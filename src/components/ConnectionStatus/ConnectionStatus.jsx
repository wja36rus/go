export const ConnectionStatus = ({ isConnected, error, onReconnect }) => {
  return (
    <div className="connection-status">
      <div
        className={`status-indicator ${
          isConnected ? "connected" : "disconnected"
        }`}
      >
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>

      {error && <div className="error-message">Error: {error}</div>}

      {!isConnected && (
        <button onClick={onReconnect} className="reconnect-btn">
          Reconnect
        </button>
      )}
    </div>
  );
};
