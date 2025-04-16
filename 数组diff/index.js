/**
 * 输入：
 * const arr1 = [1, 2, 3, 4, 5];
 * const arr2 = [2, 4, 6];
 * 输出：
 * [1, 3, 5, 6]
 */
function diff(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    return [
        ...arr1.filter(item => !set2.has(item)),
        ...arr2.filter(item => !set1.has(item))
    ]
}

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [2, 4];
diff(arr1, arr2)
