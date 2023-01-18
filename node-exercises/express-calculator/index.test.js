const app = require('./index');

const test_num_str = '1,2,3,4,5,6,6,7,8,9,10,11'
describe('testing mean', function(){
    test('testing success', function(){
        const resp = app.get(`/mean?nums=${test_num_str}`);
        console.log(resp.data);
    })
})

