const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.getformattedArray=(array) => {
    return array.map(element => [element])
   
}

exports.createLookupObject=(rowsData = [], targetKey, targetValue) => {

  const lookup = {}
  rowsData.forEach((datarow)=>{
    if(!datarow[targetKey]){
      console.error(`Missing key "${targetKey} in row:`, datarow)
      return
    }
    const normalKey = datarow[targetKey]
      lookup[normalKey] = datarow[targetValue]
  })

  // console.log(lookup)
  return lookup
}

