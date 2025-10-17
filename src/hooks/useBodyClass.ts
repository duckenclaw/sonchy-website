import { useEffect } from 'react';

/**
 * Custom hook to add a class to the document body element.
 * Automatically removes the class when the component unmounts.
 *
 * @param className - The CSS class name to add to the body element
 *
 * @example
 * ```tsx
 * const MyPage = () => {
 *   useBodyClass('my-page-background');
 *   return <div>Page content</div>;
 * };
 * ```
 */
export const useBodyClass = (className: string) => {
  useEffect(() => {
    const prevClasses = document.body.className;
    document.body.classList.add(className);

    return () => {
      document.body.className = prevClasses;
    };
  }, [className]);
};
