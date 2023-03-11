const ExpressError = require("./expressError");

function extractNums(queryStr) {
    if (!queryStr['nums']) {
        throw new ExpressError('nums are required', 400);
    }
    const unparsedNums = queryStr['nums'];
    const nums = [];
    for (const unparsedNum of unparsedNums) {
        const num = parseInt(unparsedNum);
        if (!num) {
            throw new ExpressError('Not a number', 400);
        }
        nums.push(num);
    }
    return nums;
}

function mean(nums) {
    Math.mean(nums);
}