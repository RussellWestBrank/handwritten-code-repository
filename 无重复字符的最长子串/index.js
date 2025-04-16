/** 
给定一个字符串 s ，请你找出其中不含有重复字符的 最长 子串 的长度。

 

示例 1:

输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
示例 2:

输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
示例 3:

输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
*/

/**
 * @param {string} s
 * @return {number}
 */
//错误版本：在遇到重复字符串时，未考虑如何重置窗口
// const lengthOfLongestSubstring = function(s) {
//     if(s === '') return 0;
//     const arr = s.split('')
//     let maxLen = 1
//     let len = 0
//     arr.reduce((pre,cur) => {
//          if(!pre.has(cur)) {
//             len++
//             maxLen = Math.max(maxLen, len)
//             pre.add(cur)
//         }else{
//             pre = new Set()
//             pre.add(cur)
//             len = 1
//         }
//         return pre
//     }, new Set())

//     return maxLen
// };

//经典滑动窗口
function lengthOfLongestSubstring(s) {
    const slibingWindowMap = new Map();  // 存储字符及其最后一次出现的索引
    let left = 0;               // 滑动窗口左边界
    let maxLength = 0;          // 记录最大长度

    for (let right = 0; right < s.length; right++) {
        const currentChar = s[right];
        // 若字符已存在且位于窗口内，则更新左指针到重复字符的下一位
        if (slibingWindowMap.has(currentChar) && slibingWindowMap.get(currentChar) >= left) {
            left = slibingWindowMap.get(currentChar) + 1;
        }
        // 更新字符的索引
        slibingWindowMap.set(currentChar, right);
        // 计算当前窗口长度并更新最大值
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

lengthOfLongestSubstring("dvdf")
