import { createContext, useContext } from "react";

import {
  TouchableOpacity,
  Text,
  TextProps,
  TouchableOpacityProps,
  View,
  ActivityIndicator,
} from "react-native";
import clsx from "clsx";

type Variants = "primary" | "secondary";

type ButtonProps = TouchableOpacityProps & {
  variant?: Variants;
  isLoading?: boolean;
};

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
  variant = "primary",
  isLoading,
  children,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity disabled={isLoading} activeOpacity={0.7} {...rest}>
      <View
        className={clsx(
          "w-full h-11 flex-row items-center justify-center rounded-lg gap-2",
          {
            "bg-lime-300 ": variant === "primary",
            "bg-zinc-800": variant === "secondary",
          }
        )}
      >
        <ThemeContext.Provider value={{ variant }}>
          {isLoading ? (
            <ActivityIndicator className="text-lime-950" />
          ) : (
            children
          )}
        </ThemeContext.Provider>
      </View>
    </TouchableOpacity>
  );
}

function Title({ children }: TextProps) {
  const { variant } = useContext(ThemeContext);
  return (
    <Text
      className={clsx("text-base font-semibold", {
        "text-lime-950": variant === "primary",
        "text-zinc-200": variant === "secondary",
      })}
    >
      {children}
    </Text>
  );
}

Button.Title = Title;

export { Button };