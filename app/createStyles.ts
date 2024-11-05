import { StyleSheet } from 'react-native';

const createStyles = (colors: { background: string; text: string }) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: colors.background,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 20,
        },
        loadingText: {
            color: colors.text,
            textAlign: 'center',
            marginTop: 20,
        },
    });

export default createStyles;