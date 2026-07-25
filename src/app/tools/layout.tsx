import ToolsLayoutClient from "./ToolsLayoutClient";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToolsLayoutClient>{children}</ToolsLayoutClient>;
}
