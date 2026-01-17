import { useState, useRef, useCallback } from 'react';

/**
 * useDrag - Hook for drag/swipe interactions
 * Works with both mouse (desktop) and touch (mobile)
 */
export function useDrag({
  onDragStart,
  onDrag,
  onDragEnd,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50, // Minimum distance for swipe
} = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const handleStart = useCallback((clientX, clientY) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    currentPos.current = { x: clientX, y: clientY };
    setDragOffset({ x: 0, y: 0 });
    onDragStart?.({ x: clientX, y: clientY });
  }, [onDragStart]);

  const handleMove = useCallback((clientX, clientY) => {
    if (!isDragging) return;

    currentPos.current = { x: clientX, y: clientY };
    const offset = {
      x: clientX - startPos.current.x,
      y: clientY - startPos.current.y,
    };
    setDragOffset(offset);
    onDrag?.(offset);
  }, [isDragging, onDrag]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;

    const offset = {
      x: currentPos.current.x - startPos.current.x,
      y: currentPos.current.y - startPos.current.y,
    };

    // Detect swipe direction
    const absX = Math.abs(offset.x);
    const absY = Math.abs(offset.y);

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // Horizontal swipe
        if (offset.x > threshold) {
          onSwipeRight?.(offset);
        } else if (offset.x < -threshold) {
          onSwipeLeft?.(offset);
        }
      } else {
        // Vertical swipe
        if (offset.y > threshold) {
          onSwipeDown?.(offset);
        } else if (offset.y < -threshold) {
          onSwipeUp?.(offset);
        }
      }
    }

    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    onDragEnd?.(offset);
  }, [isDragging, threshold, onDragEnd, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Mouse events
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const onMouseMove = useCallback((e) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const onMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const onMouseLeave = useCallback(() => {
    if (isDragging) handleEnd();
  }, [isDragging, handleEnd]);

  // Touch events
  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const onTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const onTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  return {
    isDragging,
    dragOffset,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
