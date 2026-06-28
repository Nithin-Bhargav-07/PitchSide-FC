interface Props {
  className?: string
}

export const Skeleton = ({ className = '' }: Props) => {
  return (
    <div className={`animate-pulse bg-bg-card rounded ${className}`} />
  )
}
