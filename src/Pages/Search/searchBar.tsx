import React, { useState, FocusEvent } from 'react';
import SearchIcon from '../../assets/images/icons8-search-50.png';
import DirectionIcon from '../../assets/images/icons8-direction-50.png';
import ClearIcon from '../../assets/images/icons8-clear-24.png';

interface SearchBarProps {
  isListening: boolean;
  onMicClick: () => void;
  micIcon: string;
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isListening, onMicClick, micIcon, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleDirections = () => {
    console.log('Get directions');
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch();
  };

  const handleDragStart = (event: React.DragEvent<HTMLImageElement>) => {
    event.preventDefault();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsFocused(false);
    }
  };

  const searchBarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '32px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    padding: '8px',
    width: '400px',
    zIndex: 9,
    border: '1px solid #dfe1e5',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    borderRadius: '32px',
    marginRight: '8px',
    color: '#374151',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    overflow: 'hidden',
    marginLeft: '8px',
  };

  const iconStyle: React.CSSProperties = {
    width: '25px',
    height: '25px',
  };

  const clearButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    width: '15px',
    height: '15px',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
      <div style={searchBarStyle}>
        <button onClick={handleDirections} style={buttonStyle} aria-label="Get directions">
          <img
            src={DirectionIcon}
            alt="Directions"
            style={iconStyle}
            draggable="false"
            onDragStart={handleDragStart}
          />
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search"
          style={inputStyle}
          aria-label="Search input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {(isFocused || searchTerm) && (
          <button onClick={handleClear} style={clearButtonStyle} aria-label="Clear" type="button">
            <img
              src={ClearIcon}
              alt="Clear"
              style={iconStyle}
              draggable="false"
              onDragStart={handleDragStart}
            />
          </button>
        )}
        <button onClick={onMicClick} style={buttonStyle} aria-label={isListening ? 'Stop listening' : 'Start listening'}>
          <img
            src={micIcon}
            alt={isListening ? 'Listening' : 'Not Listening'}
            style={iconStyle}
            draggable="false"
            onDragStart={handleDragStart}
          />
        </button>
        <button onClick={handleSearch} style={buttonStyle} aria-label="Search">
          <img
            src={SearchIcon}
            alt="Search"
            style={iconStyle}
            draggable="false"
            onDragStart={handleDragStart}
          />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
