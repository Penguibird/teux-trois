/**
 * 
 * @param {number} time Time from Date.now();
 * @returns The formated date id in YYYY-MM-DD "2011-4-12" 
 */
const getDateId = (time: number) => {
    const date = new Date(time)
    
    return `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`
}


const DAYINMILIS = 24 * 60 * 60 * 1000;
const DAYSOFTHEWEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const MONTHNAMES = ['January'] as const;

export {getDateId, DAYINMILIS, DAYSOFTHEWEEK, MONTHNAMES}