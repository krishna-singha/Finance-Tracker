export const formartAmount = (amount) => {
    if(amount >= 10000000) {
        return `${(amount / 10000000).toFixed(2)} Cr`;
    }
    else if(amount >= 100000) {
        return `${(amount / 100000).toFixed(2)} L`;
    }
    else if(amount >= 1000) {
        return `${(amount / 1000).toFixed(2)} K`;
    }
    else {
        return `${amount.toFixed(2)}`;
    }
}