import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const useLogin = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const setUserId = useAuthStore((state) => state.setUserId);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setUserId(inputValue.trim());
    navigate('/waiting');
  };

  const isValid = inputValue.trim().length > 0;

  return {
    inputValue,
    setInputValue,
    isFocused,
    setIsFocused,
    handleLogin,
    isValid
  };
};
