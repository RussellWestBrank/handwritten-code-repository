//手写防抖函数
function debounce(fn, delay) {
    let timer = null;
    return function (...arguments) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            //thi指向由debounce返回函数被调用时的上下文决定
            fn.apply(this, arguments);
        }, delay);
    };
}
//举例如何使用
let obj = {
    name: 'object',
    logName: function() {        
        console.log(this.name);
    }
};

const debouncedLogName = debounce(obj.logName, 500);

// 假设我们像这样调用 debouncedLogName：
debouncedLogName();
//undefined

// 绑定logName方法的this指向obj，并且生成去抖动后的函数
const debouncedLogName1 = debounce(obj.logName.bind(obj), 500);

// 这时，即使直接调用 debouncedLogName，this 仍然指向 obj
debouncedLogName1();  // 在延时500毫秒后会输出 "object"

/**
 * @param {Function} fn 需要防抖的函数
 * @param {Object} option
 * @param {Number} option.wait 等待时间
 * @param {Boolean} option.leading 是否立即执行
 * @param {Boolean} option.trailing 是否在等待时间结束后再执行
 * @param {Number} option.maxWait 最大等待时间
 * @returns {Function}
 * */
function debounce(fn, option) {
    const { wait = 0, leading = false, trailing = true, maxWait } = option

    let timer = null
    let lastCallTime = 0

    function debounced (...arguments) {
        const time = Date.now()

        const remainingTime = maxWait ? Math.min(maxWait- (time - lastCallTime), wait) : wait

        if(leading && !timer) {
            fn.apply(this, arguments)
        }

        if(timer) {
            clearTimeout(timer)
        }

        if(trailing) {
            timer = setTimeout(() => {
                lastCallTime = Date.now()
                fn.apply(this, arguments)
            }, remainingTime)
        }
    }

    debounced.cancel = () => {
        if(timer) {
            clearTimeout(timer)
            timer = null
        }
    }

    return debounced
}
