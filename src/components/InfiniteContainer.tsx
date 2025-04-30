import { HTMLAttributes, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import LoadingMessage from "./LoadingMessage";

interface InfiniteContainerProps extends HTMLAttributes<HTMLDivElement> {
  onViewCallback: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}
function InfiniteContainer({
  children,
  onViewCallback,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteContainerProps) {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      onViewCallback();
    }
  }, [inView]);
  return (
    <div className="flex w-full flex-col gap-6">
      {children}
      {hasNextPage && isFetchingNextPage && (
        <LoadingMessage message="Loading..." />
      )}
      <div ref={ref} className="h-4 w-full"></div>
    </div>
  );
}

export default InfiniteContainer;
