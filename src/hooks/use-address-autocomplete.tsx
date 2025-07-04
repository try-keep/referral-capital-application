import { searchAddresses, GeoapifyFeature } from '@/lib/geoapify';
import { isDefined } from '@/utils';
import { useState, useCallback, useEffect, useRef } from 'react';

function canSearchAddress(address: string) {
  return isDefined(address) && address.length >= 3;
}

/**
 * Hook to search for addresses using Geoapify API
 * @returns addressSuggestions: array of address suggestions
 * @returns isSearching: boolean indicating if the address is being searched
 * @returns lookupAddress: function to lookup an address
 * @returns cleanupSuggestions: function to cleanup the address suggestions
 */
export function useAddressAutoComplete() {
  const [addressSuggestions, setAddressSuggestions] = useState<
    GeoapifyFeature[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (canSearchAddress(searchTerm)) {
      timeoutRef.current = setTimeout(async () => {
        try {
          setIsSearching(true);
          const suggestions = await searchAddresses(searchTerm);
          setAddressSuggestions(suggestions);
        } catch (error) {
          console.error('Address search error:', error);
          setAddressSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 500); // 500ms debounce delay
    } else {
      setAddressSuggestions([]);
    }

    // Cleanup function to clear timeout on unmount or when searchTerm changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm]);

  const lookupAddress = useCallback((address: string) => {
    setSearchTerm(address);
  }, []);

  const cleanupSuggestions = useCallback(() => {
    setAddressSuggestions([]);
    setSearchTerm('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    suggestions: addressSuggestions.map((suggestion) => suggestion.properties),
    isSearching,
    lookupAddress,
    cleanupSuggestions,
  };
}
