exports.wordCount = (strings)=>{
   const words = strings.split(" ").filter(words=> words !=="");
   return words.length
}