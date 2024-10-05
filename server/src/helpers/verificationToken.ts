export const generateVerificationToken = () => {
    const characters = Array.from(Array(10).keys())
    let token = "";
    for(let i = 0; i < 4; i++) {
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        token += randomCharacter;
    }
    return token;
};