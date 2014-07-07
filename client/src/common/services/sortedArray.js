angular.module('services.sortedArray', [])
    .factory('CustomSortedArray', [
        function ( ) {

    var sortedArray = function(array, sortField, orderType, keyProperty){
        var index = 0;
        this.array = [];
        this.sortField = sortField;
        this.orderType = orderType;
        this.keyProperty = keyProperty;
        var length = array.length;
        while (index < length) this.insert(array[index++]);
    };

    sortedArray.orderType = {ASC:'asc', DESC:'desc'};

    sortedArray.prototype.compare = function (element1, element2) {
        if(element1[this.sortField] < element2[this.sortField]){
            return this.orderType == sortedArray.orderType.ASC ? -1 : 1;
        }
        else if (element1[this.sortField] > element2[this.sortField])  {
            return this.orderType == sortedArray.orderType.ASC ? 1 : -1;
        }
        else return 0;
    };

    sortedArray.prototype.insert = function (element) {
        var array = this.array;
        var index = array.length;
        array.push(element);

        while (index) {
            var i = index, j = --index;

            if (this.compare(array[i], array[j]) == -1 ) {
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        return this;
    };

    sortedArray.prototype.search = function (element) {
        var index =-1;
        for(var i = 0; i < this.array.length; i++){
            if(this.array[i][this.keyProperty]  == element[this.keyProperty]){
                index = i;
                break;
            }
        }
        return index;
    };

    sortedArray.prototype.remove = function (element) {
        var index = this.search(element);
        if (index >= 0) this.array.splice(index, 1);
        return this;
    };

    sortedArray.prototype.replaceById = function (newElement) {
        var index = this.search(newElement);
        if (index >= 0){
            var element = this.array[index];
            if(this.compare(newElement, element) == 0 ){ //same order - just replace elem
                this.array[index] = newElement;
            }else{ //different order - do reinsert
                this.remove(element);
                this.insert(newElement);
            }
            return true;
        }
        return false;
    };

    sortedArray.prototype.hasElements = function (element) {
        return this.array && this.array.length > 0;
    };

    sortedArray.prototype.filter = function(fun /*, thisArg */)
    {
        if (this === void 0 || this === null){
            //   throw new TypeError();
            return this.array ;
        }

        var t = Object(this.array);
        var len = t.length >>> 0;
        if (typeof fun !== "function"){
            //   throw new TypeError();
            return this.array ;
        }

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++)
        {
            if (i in t)
            {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };

    return sortedArray;
}]);