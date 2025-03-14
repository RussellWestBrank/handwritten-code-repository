//“空”值
// null
// undefined
// NaN
// 0
// ''
// false
// []
// {}
// Boolean: false、null、undefined、NaN、0、''
function isEmpty(value) {
    return !Boolean(value) ||
        (Array.isArray(value) && value.length === 0) ||
        (object.prototype.toString.call(value) === '[object Object]' && Object.keys(value).length === 0)
}