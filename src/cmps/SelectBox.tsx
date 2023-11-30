import { useState } from "react";

type Props = {
  list: string[];
  selected: string;
  handleChange: (selected: string) => void;
};
export const SelectBox = ({ list, selected, handleChange }: Props) => {
  return (
    <div className="select-box-main-container">
      <select
        name="categories-select"
        value={selected}
        onChange={({ target }) => handleChange(target.value)}
      >
        {list.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};
