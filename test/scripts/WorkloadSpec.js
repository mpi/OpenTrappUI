describe('Workload', function () {

    it("is created from string representation", function () {

        var workload = new Workload("15m");

        expect(workload).toBeDefined();
    });

    it("is created from number representation", function () {

        var workload = new Workload(15);

        expect(workload).toBeDefined();
    });

    describe("printing", function () {

        it("prints null workload as 0h", function () {

            expect(new Workload(0).print()).toEqual("0h");
        });

        it("prints minutes", function () {

            expect(new Workload(15).print()).toEqual("15m");
        });

        it("prints hours", function () {

            expect(new Workload(60).print()).toEqual("1h");
        });

        it("prints days", function () {

            expect(new Workload(8 * 60).print()).toEqual("1d");
        });

        it("prints minutes, hours and days", function () {

            expect(new Workload(8 * 60 + 60 + 1).print()).toEqual("1d 1h 1m");
            expect(new Workload(8 * 60 + 1).print()).toEqual("1d 1m");
            expect(new Workload(8 * 60 + 60).print()).toEqual("1d 1h");
            expect(new Workload(60 + 1).print()).toEqual("1h 1m");
        });

    });

    describe('parsing', function () {

        it("can handle minutes", function () {

            var workload = new Workload("10m");

            expect(workload.minutes).toEqual(10);
        });

        it("can handle hours", function () {

            var workload = new Workload("2h");

            expect(workload.minutes).toEqual(120);
        });

        it("can handle days", function () {

            var workload = new Workload("1d");

            expect(workload.minutes).toEqual(8 * 60);
        });

        it("can handle minutes, hours and days", function () {

            expect(new Workload("1d 1h 1m").minutes).toEqual(8 * 60 + 60 + 1);
            expect(new Workload("1d 1h").minutes).toEqual(8 * 60 + 60);
            expect(new Workload("1h 1m").minutes).toEqual(60 + 1);
            expect(new Workload("1d 1m").minutes).toEqual(8 * 60 + 1);
        });
    });

    describe('adding', function () {

        it("can handle minutes", function () {

            var a = new Workload("7h 31m");
            var b = new Workload("1h 30m");

            expect(a.add(b).print()).toEqual("1d 1h 1m");
        });
    });

});
