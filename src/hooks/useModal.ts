import { useState } from "react";

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return {isModalOpen, setIsModalOpen};
};
