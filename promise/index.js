const promise1 = new Promise((resolve, reject) => {
    resolve('成功')
})

promise1.then((res) => {
    console.log(res)
})

const promise2 = new Promise((resolve, reject) => {
    reject('失败')
})

//返回一个新的 Promise。
// 这个新的 Promise 会在所有传入的 Promise 都成功完成时才完成，其结果是一个包含所有 Promise 结果的数组。
// 如果有任何一个 Promise 被拒绝，整个 Promise.all 就会立即被拒绝，并返回第一个被拒绝的错误
Promise.all([promise1, promise2]).then((res) => {
    console.log(res)
})

//无论结果是成功还是失败。它会在第一个解决的 Promise 上立即解决或拒绝。
Promise.race([promise1, promise2]).then((res) => {
    console.log(res)
})

//无论 Promise 是否成功或失败，都会在所有 Promise 都完成后返回一个包含每个 Promise 状态和结果的数组。
Promise.allSettled([promise1, promise2]).then((res) => {
    console.log(res)
})

//只要有一个 Promise 成功就立即返回成功的结果；如果所有 Promise 都失败，则返回一个 AggregateError，包含所有失败的原因。
Promise.any([promise1, promise2]).then((res) => {
    console.log(res)
})

class MyPromise {
    constructor(executor) {
      // 初始状态为pending
      this.state = 'pending';
      // 存储fulfilled的值或rejected的原因
      this.value = undefined;
      this.reason = undefined;
      // 存储成功/失败回调队列
      this.onFulfilledCallbacks = [];
      this.onRejectedCallbacks = [];
  
      // 定义resolve函数
      const resolve = (value) => {
        if (this.state !== 'pending') return;
        
        // 处理thenable对象或Promise
        const resolvePromise = (value) => {
          try {
            const then = value?.then;
            if (typeof then === 'function') {
              // 标记是否已调用防止多次调用
              let called = false;
              then.call(
                value,
                (y) => {
                  if (called) return;
                  called = true;
                  resolvePromise(y); // 递归解析
                },
                (r) => {
                  if (called) return;
                  called = true;
                  reject(r);
                }
              );
            } else {
              // 普通值，直接fulfill
              fulfill(value);
            }
          } catch (e) {
            reject(e);
          }
        };
  
        // 执行fulfill状态变更
        const fulfill = (value) => {
          this.state = 'fulfilled';
          this.value = value;
          // 异步执行所有成功回调
          this.onFulfilledCallbacks.forEach(fn => fn());
          this.onFulfilledCallbacks = [];
        };
  
        // 异步执行resolve以支持微任务
        setTimeout(() => resolvePromise(value), 0);
      };
  
      // 定义reject函数
      const reject = (reason) => {
        if (this.state !== 'pending') return;
        // 异步执行reject以保持执行顺序
        setTimeout(() => {
          this.state = 'rejected';
          this.reason = reason;
          // 执行所有失败回调
          this.onRejectedCallbacks.forEach(fn => fn());
          this.onRejectedCallbacks = [];
        }, 0);
      };
  
      try {
        // 立即执行executor
        executor(resolve, reject);
      } catch (e) {
        reject(e);
      }
    }
  
    then(onFulfilled, onRejected) {
      // 值穿透处理
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
      onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };
  
      // 创建新Promise用于链式调用
      const promise2 = new MyPromise((resolve, reject) => {
        // 封装处理函数
        const handleFulfilled = () => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        };
  
        const handleRejected = () => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        };
  
        // 根据当前状态执行相应处理
        if (this.state === 'fulfilled') {
          handleFulfilled();
        } else if (this.state === 'rejected') {
          handleRejected();
        } else {
          // pending状态时存储回调
          this.onFulfilledCallbacks.push(handleFulfilled);
          this.onRejectedCallbacks.push(handleRejected);
        }
      });
  
      return promise2;
    }
  
    // catch方法实现
    catch(onRejected) {
      return this.then(null, onRejected);
    }
  }
  
  // Promise解决过程（根据Promise/A+规范）
  // resolvePromise函数用于处理Promise的then方法返回的值
  function resolvePromise(promise2, x, resolve, reject) {
    // 循环引用检测
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected'));
    }
  
    let called = false; // 防止多次调用
  
    // 如果x是Promise，则采用其状态
    if (x instanceof MyPromise) {
      // 如果x是Promise，则采用其状态
      x.then(
        y => resolvePromise(promise2, y, resolve, reject),
        reject
      );
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        const then = x.then;
        if (typeof then === 'function') {
          // 处理thenable对象
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              resolvePromise(promise2, y, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          // 普通对象直接resolve
          resolve(x);
        }
      } catch (e) {
        if (!called) reject(e);
      }
    } else {
      // 基础类型值直接resolve
      resolve(x);
    }
  }

  function promiseRace(promises) {
    // 返回一个新的 Promise
    return new Promise((resolve, reject) => {
        // 遍历所有的 Promise
        promises.forEach(promise => {
            // 使用 Promise.resolve 确保即使传入的不是 Promise 的值也能被正确处理
            Promise.resolve(promise)
                .then(resolve) // 当任何一个 Promise 成功时，调用 resolve
                .catch(reject); // 当任何一个 Promise 拒绝时，调用 reject
        });
    });
}

function promiseAll(promises) {
    
    return new Promise((resove,reject) => {
        const results = []
        const resolveCount = 0

        //判断promises是否为数组
        if(!Array.isArray(promises)){
            reject(new TypeError('arguments must be an array'))
        }

        const len = promises.length

        if(len === 0){
            resove(results)
        }

        promises.forEach(promise => {
            Promise.resolve(promise).then(result => {
                results.push(result)
                resolveCount++

                if(resolveCount === leng) {
                    resove(results)
                }
            })
            .catch(error => {
                // 如果有任何一个 Promise 被拒绝，立即拒绝外部 Promise
                reject(error);
            });
        })
         

    })
}


