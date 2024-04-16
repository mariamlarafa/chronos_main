export const formatDateToCompare =(date) =>{
    const databaseDate = new Date(date);
    return databaseDate

}

// export const formattedDate =(date) =>{
// // Extract day, month, and year
// const convertedDate = formatDateToCompare(date)

// const day = convertedDate.getDate();

// const month = convertedDate.getMonth() + 1; // Note that getMonth() returns values from 0 to 11.
// const year = convertedDate.getFullYear();

// // Create the formatted date string
// const frmD = `${day}/${month}/${year}`;

// return frmD
// }
export const formattedDate = (date,double=false) => {

    const convertedDate = formatDateToCompare(date);

    const day = convertedDate.getDate();
    const month = convertedDate.getMonth() + 1; // getMonth() returns values from 0 to 11.
    const year = convertedDate.getFullYear();

    // Format the components into 'dd/mm/yyyy' format with double-digit day and month
    const formattedDay = double?day.toString().padStart(2, '0'):day.toString();
    const formattedMonth = double?month.toString().padStart(2, '0'):month.toString();
    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

    return formattedDate;
  }



  export const  containsOnlySpaces = (obj)=> {

    if (typeof obj === 'string'){

        return obj.trim().length === 0;
    }
    return false
  }


