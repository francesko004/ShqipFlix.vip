export const passwordSchema = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
};

export function validatePassword(password: string): { isValid: boolean; error?: string } {
    if (password.length < passwordSchema.minLength) {
        return { isValid: false, error: `Password must be at least ${passwordSchema.minLength} characters long.` };
    }
    if (passwordSchema.requireUppercase && !/[A-Z]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one uppercase letter." };
    }
    if (passwordSchema.requireLowercase && !/[a-z]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one lowercase letter." };
    }
    if (passwordSchema.requireNumber && !/[0-9]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one number." };
    }
    if (passwordSchema.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one special character." };
    }

    // Basic common password check (blacklist)
    const blacklist = ["password123", "qwerty123456", "shqipflix2026", "123456789012"];
    if (blacklist.includes(password.toLowerCase())) {
        return { isValid: false, error: "This password is too common. Please choose a more secure one." };
    }

    return { isValid: true };
}
