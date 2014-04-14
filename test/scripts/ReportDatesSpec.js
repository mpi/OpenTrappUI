describe('Report dates', function () {

    var timeProvider;
    var reportDates;

    beforeEach(module('openTrapp'));
    beforeEach(inject(function (_reportDates_, _timeProvider_) {
        reportDates = _reportDates_;
        timeProvider = _timeProvider_;
    }));

    it('returns 3 last months', function () {
        spyOn(timeProvider, 'getCurrentDate').andReturn(new Date("2014-02-01"));

        var reportMonths = reportDates.getMonths();

        expect(reportMonths).toEqual(['2014/02', '2014/01', '2013/12'])
    })

});
