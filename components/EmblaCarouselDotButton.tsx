"use client"

import { useState,useEffect,useCallback } from "react";


function useDotButton(emblaApi: any) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
    const onDotButtonClick = useCallback(
      (index: number) => {
        if (!emblaApi) return;
        emblaApi.scrollTo(index);
      },
      [emblaApi]
    );
  
    const onInit = useCallback((emblaApi: any) => {
      setScrollSnaps(emblaApi.scrollSnapList());
    }, []);
  
    const onSelect = useCallback((emblaApi: any) => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);
  
    useEffect(() => {
      if (!emblaApi) return;
  
      onInit(emblaApi);
      onSelect(emblaApi);
      emblaApi.on('reInit', onInit);
      emblaApi.on('reInit', onSelect);
      emblaApi.on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);
  
    return {
      selectedIndex,
      scrollSnaps,
      onDotButtonClick,
    };
  }
  
  function DotButton(props: any) {
    const { children, ...restProps } = props;
    return (
      <button type="button" {...restProps}>
        {children}
      </button>
    );
  }

  export { DotButton, useDotButton };