import { useAddressAutoComplete } from '@/hooks/use-address-autocomplete';
import { ChangeEvent, useState } from 'react';

export type AddressSuggestion = {
  formatted: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
};

type AdressAutocompleteInputProps = Partial<
  Pick<HTMLInputElement, 'required' | 'placeholder' | 'className'>
> & {};

type AddressAutoCompleteProps = AdressAutocompleteInputProps & {
  address: string;
  onSuggestionSelected: (address: AddressSuggestion) => void;
  onAddressChange: (addressLine1: string) => void;
  country?: 'CA';
};

/**
 * Address Autocomplete Input Component
 * Allows the user to search for an address and select from a list of suggestions
 * @param address: string - the address to search for
 * @param onSuggestionSelected:  callback function to handle the selected address
 * @param onAddressChange: callback function to handle the address change
 * @param props: AddressAutocompleteInputProps - the props for the input component
 * @returns
 */
export function AddressAutocompleteInput({
  address,
  onSuggestionSelected,
  onAddressChange,
  ...props
}: AddressAutoCompleteProps) {
  const { suggestions, isSearching, lookupAddress, cleanupSuggestions } =
    useAddressAutoComplete({ country: props.country });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);

  const onAddressSelected = (selectedAddress: AddressSuggestion) => {
    setAddressSelected(true);
    onSuggestionSelected(selectedAddress);
    setShowSuggestions(false);
    cleanupSuggestions();
  };

  const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setAddressSelected(false);
    const address = e.target.value;
    onAddressChange(address);
    if (address.length <= 3) {
      setShowSuggestions(false);
      cleanupSuggestions();
      return;
    }
    await lookupAddress(address);
    setShowSuggestions(true);
  };

  return (
    <>
      <div className="relative">
        <input
          type="text"
          id={'addressAutocompleteInput'}
          required={props.required}
          value={address}
          onChange={handleAddressChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={props.placeholder}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${props.className}`}
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {!addressSelected && showSuggestions && suggestions.length > 0 && (
        <div className=" no-scrollbar absolute max-w-200 z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-44 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onAddressSelected(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {suggestion.formatted}
              </div>
              {suggestion.country && (
                <div className="text-sm text-gray-500 mt-1">
                  {suggestion.country}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
