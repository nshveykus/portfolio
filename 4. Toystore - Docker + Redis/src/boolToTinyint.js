
 //Принимает: true, false, 'true', 'false', 1, 0, '1', '0'.
//Возвращает: 1, 0 или null, если значение не распознано.

const boolToTinyint = (value) => {
    if (value === true  || value === 1 || value === '1' || value === 'true')  return 1;
    if (value === false || value === 0 || value === '0' || value === 'false') return 0;
    return null;
};

module.exports = { boolToTinyint };