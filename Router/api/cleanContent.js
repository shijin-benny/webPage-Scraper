exports.cleanContent = (data)=>{
    const alphabet = data.replace(/[^A-Za-z']+/g, " ").trim()
    const lowerCase = alphabet.toLowerCase();
    return lowerCase
}