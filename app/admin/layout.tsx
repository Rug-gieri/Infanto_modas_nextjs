export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="theme-bubblegum min-h-screen">
      {children}
    </div>
  )
}
