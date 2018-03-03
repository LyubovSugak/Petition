var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

var {promisify} = require('util')
client.on('error', function(err) {
    console.log(err);
});

const get = function(key) {
	return new Promise(function(resolve, reject) {
		client.get(key, function(err, data) {
			if (err) {
				reject err;
			} else {
				resolve data;
			}
		});
	});
};

client.on('error', function(err) {

})
const setex = promisify(client.setex.bind(client))//work version

client.setex('city - key', 60, 'berlin - value')
	.then(data => {
	    // if (err) {
	    //     return console.log(err);
	    // }
	    // console.log('the "city" key was successfully set');

	    client.get('city', function(err, data) {
	        if (err) {
	            return console.log(err);
	        }
	        console.log('The value of the "city" key is ' + data);
	    })
	});
// W w