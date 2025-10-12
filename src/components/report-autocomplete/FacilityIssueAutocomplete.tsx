import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type FacilityIssueAutocompleteProps = {
  options: readonly string[];
  emptyMessage: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export const FacilityIssueAutocomplete = ({
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
}: FacilityIssueAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value ?? "");

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // Allow user to press Enter to confirm their custom input
      if (event.key === "Enter" && input.value !== "") {
        event.preventDefault();
        onValueChange?.(input.value);
        setOpen(false);
        input.blur();
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    // Keep whatever the user typed
    if (inputValue) {
      onValueChange?.(inputValue);
    }
  }, [inputValue, onValueChange]);

  const handleSelectOption = useCallback(
    (selectedOption: string) => {
      setInputValue(selectedOption);
      onValueChange?.(selectedOption);

      // Close the dropdown after selection
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown} className="overflow-visible">
      <div
        className={cn(
          // Shadcn Input style
          "border-input bg-background ring-offset-background flex h-9 w-full rounded-md border py-2 text-sm shadow-xs transition-[color,box-shadow]",
          "placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "place-items-center disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1"
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full min-w-[300px] rounded-xl bg-white outline-none",
            isOpen ? "block" : "hidden",
          )}
        >
          <CommandList className="max-h-[300px] rounded-lg ring-1 ring-slate-200">
            {filteredOptions.length > 0 ? (
              <CommandGroup>
                {filteredOptions.map((option) => {
                  const isSelected = inputValue === option;
                  return (
                    <CommandItem
                      key={option}
                      value={option}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected ? "pl-8" : null,
                      )}
                    >
                      {isSelected ? <Check className="h-3 w-3" /> : null}
                      {option}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {filteredOptions.length === 0 && inputValue ? (
              <CommandPrimitive.Empty className="rounded-sm px-2 py-3 text-center text-sm select-none">
                Press Enter to use &quot;{inputValue}&quot;
              </CommandPrimitive.Empty>
            ) : null}
            {!inputValue ? (
              <CommandPrimitive.Empty className="rounded-sm px-2 py-3 text-center text-sm select-none">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
