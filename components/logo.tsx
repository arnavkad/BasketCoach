export function SmartShotLogo({
  className = "h-8 w-8",
}: {
  className?: string
}) {
  return (
    <div className={`rounded-full bg-orange-500 flex items-center justify-center ${className}`}>
      {/* You can add a small initial or another simple element here if desired */}
    </div>
  )
}
