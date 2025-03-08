class JWTExpiryHelper {

    static TIME_UNITS = {
        s: { name: 'secondes', ms: 1000 },
        m: { name: 'minutes', ms: 1000 * 60 },
        h: { name: 'heures', ms: 1000 * 60 * 60 },
        d: { name: 'jours', ms: 1000 * 60 * 60 * 24 },
        w: { name: 'semaines', ms: 1000 * 60 * 60 * 24 * 7 },
        y: { name: 'années', ms: 1000 * 60 * 60 * 24 * 365 }
    };

    /**
     * Converts a JWT period to an expiration date
     * @param { string } period - Period in JWT format
     * @param { Date } [ startDate=new Date() ] - Start date (optional)
     * @returns { Object } Object containing expiration information
     */
    static calculateExpiry(period, startDate = new Date()) {

        if (typeof period !== 'string' || !period) {
            throw new Error('La période doit être une chaîne de caractères non vide');
        }

        const match = period.match(/^(\d+)([smhdwy])$/);
        if (!match) {
            throw new Error('Invalid period format. Valid example: 7d, 24h, 30m');
        }

        const [, value, unit] = match;
        const amount = parseInt(value, 10);

        if (!this.TIME_UNITS[unit]) {
            throw new Error(`Invalid time unit: ${unit}`);
        }

        const milliseconds = amount * this.TIME_UNITS[unit].ms;
        const expiryDate = new Date(startDate.getTime() + milliseconds);

        return {
            expiryDate,
            startDate,
            duration: {
                value: amount,
                unit: unit,
                unitName: this.TIME_UNITS[unit].name,
                milliseconds
            },
            formatted: {
                iso: expiryDate.toISOString(),
                local: expiryDate.toLocaleString(),
                relative: this.getRelativeTime(milliseconds)
            }
        };
    }

    /**
     * Convert a duration in milliseconds to relative text
     * @param { number } ms - Duration in milliseconds
     * @returns { string } Descriptive text of the duration
     */
    static getRelativeTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} jour(s)`;
        if (hours > 0) return `${hours} heure(s)`;
        if (minutes > 0) return `${minutes} minute(s)`;
        return `${seconds} seconde(s)`;
    }

    /**
     * Checks if an expiration date is valid
     * @param { Date } expiryDate - Expiration date to be checked
     * @returns { boolean } True if the date has not expired
     */
    static isValid(expiryDate) {
        return expiryDate > new Date();
    }
}
