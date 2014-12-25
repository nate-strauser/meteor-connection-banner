// http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
checkObjHasKeys = function (obj, keys) {
	var result = true;
	keys.forEach(function (key) {
		if ('undefined' === typeof(obj)) {
			return false;
		}

		if (!obj.hasOwnProperty(key)) {
			result = false;
		}
		obj = obj[key];
	});
	return result;
};