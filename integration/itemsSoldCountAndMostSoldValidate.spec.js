
const json = '[{' +
    '"storeId": "WAL001",' +
    '"pinCode": 30234,' +
    '"receiptNumber": 1,' +
    '"items": [{' +
    '"itemId": "GROC001",' +
    '"itemPrice": 10,' +
    '"taxRate": 0.06,' +
    '"discount": 0.00' +
    '},' +
    '{' +
    '"itemId": "GROC001",' +
    '"itemPrice": 10,' +
    '"taxRate": 0.06,' +
    '"discount": 0.00' +
    '},' +
    '{' +
    '"itemId": "GROC002",' +
    '"itemPrice": 20,' +
    '"taxRate": 0.02,' +
    '"discount": 0.10' +
    '},' +
    '{' +
    '"itemId": "GROC002",' +
    '"itemPrice": 20,' +
    '"taxRate": 0.02,' +
    '"discount": 0.10' +
    '}' +
    '],' +
    '"itemsSold": 3,' +
    '"total": 39.60,' +
    '"timestamp": "2021-02-01 14:00:00 EST"' +
    '},' + '{' +
    '"storeId": "WAL001",' +
    '"pinCode": 30234,' +
    '"receiptNumber": 1,' +
    '"items": [{' +
    '"itemId": "GROC001",' +
    '"itemPrice": 10,' +
    '"taxRate": 0.06,' +
    '"discount": 0.00' +
    '},' +
    '{' +
    '"itemId": "GROC001",' +
    '"itemPrice": 10,' +
    '"taxRate": 0.06,' +
    '"discount": 0.00' +
    '},' +
    '{' +
    '"itemId": "GROC002",' +
    '"itemPrice": -20,' +
    '"taxRate": 0.02,' +
    '"discount": 0.10' +
    '}' +
    '],' +
    '"itemsSold": 3,' +
    '"total": 39.60,' +
    '"timestamp": "2021-02-02 14:00:00 EST"' +
    '},' +
    '{' +
    '"storeId": "WAL001",' +
    '"pinCode": 30234,' +
    '"receiptNumber": 21,' +
    '"items": [{' +
    '"itemId": "GROC001",' +
    '"itemPrice": 10,' +
    '"taxRate": 0.06,' +
    '"discount": 0.00' +
    '},' +
    '{' +
    '"itemId": "GROC001",' +
    '"itemPrice": 10,' +
    '"taxRate": 0.06,' +
    '"discount": 0.00' +
    '},' +
    '{' +
    '"itemId": "GROC002",' +
    '"itemPrice": 20,' +
    '"taxRate": 0.02,' +
    '"discount": 0.10' +
    '},' +
    '{' +
    '"itemId": "GROC002",' +
    '"itemPrice": -20,' +
    '"taxRate": 0.02,' +
    '"discount": 0.10' +
    '}' +
    '],' +
    '"itemsSold": 2,' +
    '"total": 21.2,' +
    '"timestamp": "2021-02-01 14:00:00 EST"' +
    '}]';

function mostSoldItem(receiptPayload) {
    const receiptObjects = JSON.parse(json);

    const itemsCountByItemid = new Map();
    for (let receiptObj of receiptObjects) {

        const itemsCountMap = new Map();

        const mostSoldItem = new Map();

        var itemsSold = receiptObj.itemsSold;

        for (let item of receiptObj.items) {
            console.log("item" + item.itemId);

            var itemPrice;
            if (item.itemPrice < 0) {
                itemPrice = item.itemPrice * -1;
            } else {
                itemPrice = item.itemPrice;
            }

            var key = item.itemId + "_" + itemPrice;
            if (itemsCountMap.has(key)) {
                if (item.itemPrice >= 0) {
                    var count = itemsCountMap.get(key) + 1;
                    itemsCountMap.set(key, count);
                } else {
                    var count = itemsCountMap.get(key) - 1;
                    itemsCountMap.set(key, count);
                }
            } else {
                if (item.itemPrice >= 0)
                    itemsCountMap.set(key, 1);
            }

        }


        for (let [key, value] of itemsCountMap) {
            console.log(key + " = " + value);
            const itemDetails = key.split("_");
            console.log("after splitting" + itemDetails[0]);
            var itemId = itemDetails[0];
            if (!itemsCountByItemid.has(itemId)) {
                itemsCountByItemid.set(itemId, value);
            } else {
                var count = itemsCountByItemid.get(itemId) + value;
                itemsCountByItemid.set(itemId, count);

            }
        }

    }
    var mostSoldItemId;
    var mostSoldItemCount = 0;

    for (let [key, value] of itemsCountByItemid) {
        console.log("key:value=" + key + ":" + value);
        if (value > mostSoldItemCount) {
            mostSoldItemCount = value;
            mostSoldItemId = key;
        }

        console.log("mostSolditemId" + mostSoldItemId);
        console.log("mostSoldItemcount" + mostSoldItemCount);
    }
    console.log("mostSolditemId is: " + mostSoldItemId)
    return mostSoldItemId;
}

console.log(mostSoldItem(json));
