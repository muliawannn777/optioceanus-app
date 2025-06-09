// ThemeContext.jsx
import { createContext, useState, useContext} from "react";

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
});

export const useTheme = () => {
    return useContext(ThemeContext);
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light' ));
    };

    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
