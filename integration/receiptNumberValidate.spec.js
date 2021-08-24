import {assert} from 'chai';

describe('Receipt Validation Tests', function () {

    const availableFixtures = [
        {
            name: "receipt",
            context: "1",
        },
    ];

    //getting json values
    availableFixtures.forEach(aFixture => {
        describe(aFixture.context, () => {
            beforeEach(function () {
                cy.fixture(aFixture.name).as("receipt");
            });

            describe('receiptNumberValidate' + aFixture.name, function () {

                it("Validates if the receiptNumber is unique within a day ", () => {

                    cy.fixture('receipt').then(receipt => {
                        let receiptObjectList = new Set();

                        receipt.forEach(data => {

                            let key = data.receiptNumber + "_" + data.timestamp;

                            if (!receiptObjectList.has(key)) {

                                receiptObjectList.add(key);

                            } else {
                                var errorMessage = "Duplicate receipt found. Receipt number: " + data.receiptNumber + " for " + data.timestamp;
                                assert.fail(errorMessage);

                            }

                        })
                    });
                })

                it("Validates if all receipts have same storeId", () => {

                    cy.fixture('receipt').then(receipt => {
                        let storeId;

                        receipt.forEach(data => {

                            if (typeof storeId === 'undefined' || storeId === null) {
                                storeId = data.storeId;
                            } else if (storeId !== data.storeId) {
                                var errorMessage = "Receipt with different storeId found. Receipt Number: " + data.receiptNumber + " for " + data.timestamp
                                    + " not having the same storeId as others storeId:" + storeId;
                                assert.fail(errorMessage);
                            }


                        })
                    });
                })

                it("Validates if all receipts have same pincode", () => {

                    cy.fixture('receipt').then(receipt => {
                        let pinCode;

                        receipt.forEach(data => {

                            if (typeof pinCode === 'undefined' || pinCode === null) {
                                pinCode = data.pinCode;
                            } else if (pinCode !== data.pinCode) {
                                var errorMessage = "Receipt with different pincode found. Receipt Number: " + data.receiptNumber + " for " + data.timestamp
                                    + " not having the same pincode as others pincode: " + pinCode;

                                assert.fail(errorMessage);
                            }


                        })
                    });
                })
            })

        })
    })

})
