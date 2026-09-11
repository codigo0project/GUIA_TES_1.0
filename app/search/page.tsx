import CommandPalette from "./components/CommandPalette";

const sheet: React.CSSProperties = {
  padding: 28,
  maxWidth: 720,
  margin: "0 auto",
};

/**
 * Placeholder search frontend. Opens the command palette with Cmd+K.
 */
export default function SearchPage() {
  return (
    <main style={sheet}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Búsqueda</h1>
      <p style={{ color: "#9ca3af", marginBottom: 24 }}>
        Pulsa <kbd>Cmd</kbd>+<kbd>K</kbd> (o <kbd>Ctrl</kbd>+<kbd>K</kbd>) para
        abrir la paleta de comandos.
      </p>
      <CommandPalette />
    </main>
  );
}
