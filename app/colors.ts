// colors.ts
const colors = {
    light: {
        background: '#FFFFFF',
        text: '#000000',
        cardBackground: '#F5F5F5',
        primary: '#6200EE',
        secondary: '#03DAC6',
        danger: '#B00020',
        border: '#E0E0E0',
    },
    dark: {
        background: '#000000',
        text: '#FFFFFF',
        cardBackground: '#1F1F1F',
        primary: '#BB86FC',
        secondary: '#03DAC6',
        danger: '#CF6679',
        border: '#444444',
    },
};

export const getColors = (isDarkMode: boolean) => {
    return isDarkMode ? colors.dark : colors.light;
};

export default colors;
