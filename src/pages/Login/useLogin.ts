import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * 로그인(사용자 등록) 로직을 관리하는 커스텀 훅입니다.
 */
export const useLogin = () => {
  // 입력 필드 값 상태
  const [inputValue, setInputValue] = useState('');
  // 입력 필드 포커스 상태 (UI 스타일링용)
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
