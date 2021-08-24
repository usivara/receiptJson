import _ from 'lodash';
import {assert} from 'chai';
import 'chai/register-should';

// Receipt Validate Fields
describe('Receipt Validation Tests', function () {

    const availableFixtures = [
        {
            name: "receipt1",
            context: "1",
        },

        {
            name: "receipt2",
            context: "2",
        },

        {
            name: "receipt3",
            context: "3",
        },
        {
            name: "receiptInvalid",
            context: "4",
        },
    ];

    //getting json values
    availableFixtures.forEach(aFixture => {
        describe(aFixture.context, () => {
            beforeEach(function () {
                cy.fixture(aFixture.name).as("receiptDetails");
            });

            it("ValidateStoreId" + aFixture.name, function () {

                //validate storeId -- assumed a single storeId exists: WAL001
                //storeId is alphanumeric of size 6: first 3 capital letters, last 3 digits
                var storeId = this.receiptDetails.storeId;

                assert.notEqual(null, storeId, "storeId should exist");

                let storeIdstr = storeId.substring(0, 3);
                let storeIdNum = storeId.substring(3, 6);
                let isUpperCase = storeIdstr.toUpperCase();

                expect(storeId.length).to.equal(6);
                expect(storeIdstr == isUpperCase).to.be.true;
                expect(storeIdNum).to.match(/^[0-9]/)
                expect(storeIdNum).to.match(/^[0-9]/);
                assert.equal(storeId, "WAL001");


            })

            it("ValidatePincode" + aFixture.name, function () {

                //validate pinCode -- assumed a single pinCode exists for the store/state: 30234
                //pinCode is 5 digit number
                var pinCode = this.receiptDetails.pinCode;
                let storePincode = pinCode.toString()
                let strlen = storePincode.length;

                assert.notEqual(null, pinCode, "pinCode should exist");
                expect(strlen).to.equal(5) && expect(storePincode).to.match(/^[0-9]/)
                assert.equal(pinCode, 30234);


            })


            it("ValidateReceiptNumber" + aFixture.name, function () {

                //validate pinCode -- assumed a single pinCode exists for the store/state: 30234
                //pinCode is 5 digit number
                var receiptNumber = this.receiptDetails.receiptNumber;

                assert.notEqual(null, receiptNumber, "receiptNumber should exist");
                expect(Number.isInteger(receiptNumber)).to.equal(true);


            })

            it("ValidateItems" + aFixture.name, function () {

                for (var i = 0; i < this.receiptDetails.items.length; i++) {
                    
                    var item = this.receiptDetails.items[i];

                    var itemId = item.itemId;
                    var itemPrice = item.itemPrice;
                    var taxRate = item.taxRate;
                    var discount = item.discount;

                    assert.notEqual(null, item, "items array should exist");
                    assert.notEqual(null, itemId, "itemId should exist");
                    assert.notEqual(null, itemPrice, "itemPrice should exist");
                    assert.notEqual(null, taxRate, "taxRate should exist");
                    assert.notEqual(null, discount, "discount should exist");

                    expect(_.isString(itemId)).equal(true);
                    expect(itemPrice).to.match(/^[+-]?\d+(\.\d+)?$/);
                    expect(taxRate).to.match(/^[+-]?\d+(\.\d+)?$/);
                    expect((taxRate > 0.0 && item.taxRate <= 1.0)).to.match;
                    expect(discount).to.match(/^[+-]?\d+(\.\d+)?$/);
                    expect((discount > 0.0 && item.discount <= 1.0)).to.match;

                }

            })

            it("ValidateItemSold" + aFixture.name, function () {

                var itemsSold = this.receiptDetails.itemsSold;
                assert.notEqual(null, itemsSold, "itemSold should exist");
                expect(itemsSold).to.match(/^[0-9]/);
            })


            it("ValidateTotal" + aFixture.name, function () {

                var total = this.receiptDetails.total;
                assert.notEqual(null, total, "total should exist");
                expect((Number.isInteger(total))).to.equal(false);

            })

            it("ValidateTimestamp" + aFixture.name, function () {
                //validate timestamp
                //Should be between 10am and 7pm ET, (validated equivalent UTChours)
                var timestamp = this.receiptDetails.timestamp
                assert.notEqual(null, timestamp, "timestamp should exist");
                var timestampUTC = new Date(timestamp);
                console.log(timestampUTC.getUTCHours());
               if ((timestampUTC.getUTCHours() < 14)|| (timestampUTC.getUTCHours() >23))
                assert.fail("not in the range");
            })
            it("Validates the total amount of each receipt" + aFixture.name, function () {

                var itemsTotal = 0;
                var total = this.receiptDetails.total.toFixed(2);
                for (var i = 0; i < this.receiptDetails.items.length; i++) {

                    var item = this.receiptDetails.items[i];
                    // itemsTotal = itemsTotal + (item.total + (item.total * item.taxRate) - (item.total * item.discount));
                    itemsTotal = itemsTotal + (item.itemPrice + (item.itemPrice * item.taxRate) - (item.itemPrice * item.discount));

                }
                itemsTotal = itemsTotal.toFixed(2);
                console.log(itemsTotal);
                assert.equal(itemsTotal, total);
            })


            it("Validates the count of items sold of each receipt" + aFixture.name, function () {

                var itemSold = this.receiptDetails.itemsSold;
                var itemSoldCount = 0;
                const itemsCountMap = new Map();
                for (var i = 0; i < this.receiptDetails.items.length; i++) {
                    var item = this.receiptDetails.items[i];

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
                var actualItemCount = 0;
                for (let count of itemsCountMap.values())
                    actualItemCount = actualItemCount + count;
                assert.equal(actualItemCount, itemSold);
            })
        })

    })

})