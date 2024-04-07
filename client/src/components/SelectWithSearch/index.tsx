import React, { useEffect, useState } from "react";
import { useCombobox, useMultipleSelection } from "downshift";
import dfs from "./SelectWithSearch.module.scss";
import s from "./common.module.scss";

type Option = {
  text: string;
  value: string;
};

type DropdownWithFetch = {
  name: string;
  label: string;
  items: Option[];
  initialSelectedItems?: Option[];
  onChange: (args: any) => void;
  onSelect: (option: Option) => void;
  onRemove?: (item: Option) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showPills?: boolean;
  isLoading?: boolean;
  showSelectedValueWithoutPills?: boolean;
  selectOneItemOnly?: boolean;
};

let timeout: NodeJS.Timeout;
let searchTerm = "";

export const DropdownWithFetch = ({
  name,
  label,
  required,
  disabled,
  placeholder = "Type to search...",
  items,
  initialSelectedItems = [],
  onChange,
  onSelect,
  onRemove,
  showPills = true,
  isLoading,
  showSelectedValueWithoutPills = false,
  selectOneItemOnly = false,
}: DropdownWithFetch) => {
  const [selectedItems, setSelectedItems] = useState<Option[]>(initialSelectedItems);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleChange = ({ inputValue }: any) => {
    clearTimeout(timeout);
    searchTerm = inputValue;
    timeout = setTimeout(() => {
      onChange({ inputValue: searchTerm });
    }, 300);
  };

  const handleSelectionChange = (changes: any) => {
    const { selectedItem, type } = changes;
    if (
      type === useCombobox.stateChangeTypes.InputKeyDownEnter ||
      type === useCombobox.stateChangeTypes.ItemClick ||
      type === useCombobox.stateChangeTypes.InputBlur
    ) {
      if (selectedItem) {
        if (selectOneItemOnly && selectedItems.length > 0) {
          const removedItem = selectedItems[0];
          onRemove && onRemove(removedItem);
          setSelectedItems([selectedItem]);
        } else {
          setSelectedItems([...selectedItems, selectedItem]);
        }
        onSelect(selectedItem);
      }
    }
  };

  const setFieldValue = (items: Option[]) => {
    // Your logic to set field value
  };

  useEffect(() => {
    setFieldValue(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    if (initialSelectedItems.length > 0) {
      setFieldValue(initialSelectedItems);
    }
  }, []);

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
  } = useCombobox({
    defaultHighlightedIndex: 0,
    selectedItem: null,
    items,
    onInputValueChange: handleChange,
    onStateChange: handleSelectionChange,
  });

  return (
    <div
      className={`${dfs.container} ${disabled ? dfs.isDisabled : ""}`}
    >
      <div>
        <label className={s.label} {...getLabelProps()}>
          {label}
        </label>
        <input type="hidden" name={name} />
        <div className={dfs.inputContainer} {...getComboboxProps()}>
          <input
            className={dfs.input}
            {...getInputProps()}
            placeholder={placeholder}
            value={
              showSelectedValueWithoutPills ? selectedItems[0]?.text : null
            }
          />
          {isLoading && (
            <div className={dfs.loader}>Loading...</div>
          )}
        </div>
      </div>

      {showPills && selectedItems.length > 0 && (
        <div className={dfs.pills}>
          {selectedItems.map((selectedItem, index) => (
            <span
              key={`selected-item-${index}`}
              className={dfs.pill}
              onClick={() => {
                onRemove && onRemove(selectedItem);
                setSelectedItems(selectedItems.filter(item => item !== selectedItem));
              }}
            >
              {selectedItem.text}
              <span className={dfs.clearPill}>✕</span>
            </span>
          ))}
        </div>
      )}

      <ul {...getMenuProps()}>
        {isOpen && items.length > 0 && (
          <div className={s.dropdown}>
            {items.map((item, index) => (
              <li
                className={`${s.dropdownItem} ${
                  highlightedIndex === index ? `${s.isHighlighted} ${s.isActive}` : ""
                }`}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                {item.text}
              </li>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
};
