export const normalizeString = (input: string) => {

 const word =  input
  .toLowerCase() 
  // .normalize("NFD") 
  // .replace(/[\u0300-\u036f]/g, "") 
  // .replace(/[^a-z0-9\s]/g, "");
  return word
}