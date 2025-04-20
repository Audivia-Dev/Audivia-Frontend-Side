import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 130,
        height: 180,
        resizeMode: 'contain',
    },
    brandTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 10,
        color: COLORS.dark,
    },
    form: {
        width: '100%',
        backgroundColor: COLORS.light,
        padding: 20,
        borderRadius: 20,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.dark,
    },
    
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.8,
        borderColor: COLORS.grey,
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 10,
        color: COLORS.grey,
    },
    input: {
        flex: 1,
        height: 45,
    },
    eyeIcon: {
        marginLeft: 10,
        color: COLORS.grey,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    remember: {
        fontSize: 14,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    forgot: {
        fontSize: 14,
        color: COLORS.tertiary,
    },
    loginButton: {
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        overflow: 'hidden', 
    },
    loginButtonText: {
        color: COLORS.light,
        fontWeight: 'bold',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.grey,
    },
    orText: {
        marginHorizontal: 10,
        color: COLORS.grey,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: COLORS.grey,
        borderRadius: 25,
        padding: 10,
        marginBottom: 10,
    },
    socialIcon: {
        marginRight: 10,
    },
    socialText: {
        fontWeight: '500',
    },
    signupWrapper: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signupText: {
        color: COLORS.tertiary,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 5,
        alignItems: 'center',
    },
});

export default styles;
